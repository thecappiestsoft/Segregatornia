/**
 * Segregatornia – Logika gry: nowa gra, rzut kostką, ruch, rozpatrzenie pola, kontrola, odpowiedzi, koniec tury i gry.
 */
/* ================= LOGIKA GRY ================= */
function newGame(){
  S = {screen:'game', mode:setup.mode, hazard:setup.hazard, rounds:setup.rounds, round:1, cur:0,
    players: Array.from({length:setup.n},(_,i)=>({name:(setup.names[i]||'').trim()||tr('team',i+1),color:COLORS[i],score:0,pos:0,life:[],
      st:{ok:0,bad:0,mat:0,matN:0,q:0,qN:0,haz:0,hazN:0},wrong:[]})),
    deck: shuffle(CARDS.map(c=>c.id)), lifeDeck: shuffle(LIFE.map((_,i)=>i)), poolUsed:[],
    bins: Object.fromEntries(BIN_ORDER.map(k=>[k,[]])), phase:'idle', die:1, log:[['start',0]], turn:null, final:null};
  save(); render();
}
const P = ()=>S.players[S.cur];
const inBins = ()=>BIN_ORDER.flatMap(k=>S.bins[k].map(e=>e.c));
const HAZ_BINS = ['A','N','E','L'];

function drawCard(hazOnly){
  if(!S.deck.length){ const used=new Set(inBins()); S.deck=shuffle(CARDS.map(c=>c.id).filter(id=>!used.has(id))); log(['reshuffle']); }
  let idx = 0;
  if(hazOnly){ const f=S.deck.findIndex(id=>HAZ_BINS.includes(CARDS[id].bin)||CARDS[id].metal); if(f>=0) idx=f; }
  return S.deck.splice(idx,1)[0];
}
function pickPool(){
  const lvl = S.mode==='jr'?[1]:[1,2];
  let cand = POOL.map((_,i)=>i).filter(i=>lvl.includes(POOL[i][3]) && !S.poolUsed.includes(i));
  if(!cand.length){ S.poolUsed=[]; cand = POOL.map((_,i)=>i).filter(i=>lvl.includes(POOL[i][3])); }
  const i = cand[Math.floor(Math.random()*cand.length)]; S.poolUsed.push(i); return i;
}

async function roll(){
  if(busy || S.phase!=='idle') return;
  busy = true; S.phase='moving';
  const rb=$('#b-roll'); if(rb) rb.disabled=true;
  const die = $('#die'); if(die) die.classList.add('rolling');
  for(let k=0;k<8;k++){ S.die = 1+Math.floor(Math.random()*6); drawDie(); await wait(60); }
  const v = 1+Math.floor(Math.random()*6); S.die=v; drawDie();
  setMsg(tr('rolled', P().name, v));
  await wait(300);
  await moveBy(v);
  busy = false;
  resolve();
}
async function moveBy(n){
  const p = P(); const step = n>0?1:-1;
  for(let k=0;k<Math.abs(n);k++){
    p.pos = (p.pos+step+28)%28;
    if(step>0 && p.pos===0){ p.score+=PTS.loop; log(['loop',S.cur,PTS.loop]); toast(tr('loopToast',PTS.loop)); renderScores(); }
    renderPawns(); await wait(190);
  }
}
async function resolve(){
  const p = P(); const type = FIELDS[p.pos];
  const t = {type, steps:[], si:0, ans:{}, ord:{}, gain:0};
  if(type==='w'||type==='start'||type==='haz'){
    t.card = drawCard(type==='haz'); t.haz = type==='haz';
    const c = CARDS[t.card];
    t.steps.push('bin');
    if(S.mode==='std'){ t.steps.push('material'); if(c.code) t.steps.push('polymer'); }
    if(S.hazard && c.metal) t.steps.push('metal','harm');
    if(c.q && (S.mode==='std' || c.q[3]===1)) t.bq = {src:'card'}; else t.bq = {src:'pool', i:pickPool()};
    t.steps.push('bonus','summary');
    log(['draw',S.cur,t.card]);
  } else if(type==='q'){
    t.pq = pickPool(); t.steps=['pool','summary']; log(['q',S.cur]);
  } else if(type==='life'){
    if(!S.lifeDeck.length) S.lifeDeck = shuffle(LIFE.map((_,i)=>i));
    t.life = S.lifeDeck.shift(); p.life.push(t.life); p.score+=PTS.life; t.gain+=PTS.life;
    t.steps=['life','summary']; log(['life',S.cur,t.life,PTS.life]);
  } else if(type==='control'){
    t.ctl = runControl(); t.steps=['control','summary'];
    t.gain += t.ctl.filter(r=>r.p===S.cur).reduce((s,r)=>s+r.pts,0);
    log(['control',S.cur,t.ctl.length]);
  } else if(type==='jam'){
    S.phase='moving'; busy=true; setMsg(tr('jamMsg'));
    await wait(450); await moveBy(-3); busy=false;
    t.steps=['event','summary']; log(['jam',S.cur]);
  } else if(type==='express'){
    S.phase='moving'; busy=true; setMsg(tr('expressMsg')); toast(tr('expressToast'));
    log(['express',S.cur]); await wait(450); await moveBy(2); busy=false;
    return resolve();
  }
  S.turn = t; S.phase='turn'; save(); render();
}
function runControl(){
  const res = [];
  BIN_ORDER.forEach(k=>{
    S.bins[k].forEach(e=>{
      const c = CARDS[e.c]; const ok = c.bin===k;
      const pts = ok?PTS.binOk:(S.mode==='jr'?PTS.binBadJr:PTS.binBad);
      const pl = S.players[e.p]; pl.score+=pts;
      if(ok) pl.st.ok++; else { pl.st.bad++; if(!pl.wrong.includes(e.c)) pl.wrong.push(e.c); }
      res.push({c:e.c,p:e.p,b:k,ok,pts});
    });
    S.bins[k]=[];
  });
  return res;
}
function answer(key, idx){
  const t=S.turn; if(t.ans[key]!==undefined) return;
  const d = quizDef(key); t.ans[key]=idx;
  const ok = idx===d.correct; const p=P();
  if(ok){ p.score+=d.pts; t.gain+=d.pts; }
  if(key==='material'||key==='polymer'){ p.st.matN++; if(ok) p.st.mat++; }
  else if(key==='metal'||key==='harm'){ p.st.hazN++; if(ok) p.st.haz++; }
  else { p.st.qN++; if(ok) p.st.q++; }
  save(); renderScores(); renderPanel();
  const nb = $('#b-next'); if(nb) nb.focus();
}
function nextStep(){ S.turn.si++; save(); renderPanel(); const f=$('#step-focus'); if(f) f.focus(); }
function chooseBin(k){
  const t=S.turn; if(!t||t.steps[t.si]!=='bin'||t.bin) return;
  t.bin=k; S.bins[k].push({c:t.card,p:S.cur});
  log(['bin',S.cur,t.card,k]);
  t.si++; save(); render();
}
function endTurn(){
  S.turn=null; S.cur++;
  if(S.cur>=S.players.length){ S.cur=0; S.round++; }
  if(S.round>S.rounds){ finish(); return; }
  S.phase='idle'; log(['turn',S.cur]); save(); render();
  window.scrollTo({top:0,behavior:RM?'auto':'smooth'});
}
function finish(){
  const ctl = runControl();
  const max = Math.max(...S.players.map(p=>p.life.length));
  const masters = max>0 ? S.players.map((p,i)=>p.life.length===max?i:-1).filter(i=>i>=0) : [];
  masters.forEach(i=>S.players[i].score+=PTS.master);
  S.final = {ctl, masters}; S.screen='end'; clearSave(); render(); window.scrollTo(0,0);
}
