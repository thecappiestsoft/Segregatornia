/**
 * Segregatornia – Renderowanie ekranu gry: plansza, kostka, pionki, panel, pojemniki, quizy, kontrola.
 */
/* ================= RENDEROWANIE GRY ================= */
function render(){
  document.documentElement.lang = LANG;
  if(!S || S.screen==='setup'){ renderSetup(); return; }
  if(S.screen==='end'){ renderEnd(); return; }
  $('#app').innerHTML = `
  ${topBar(`<button class="btn" id="b-rules">${tr('rulesShort')}</button><button class="btn" id="b-quit">${tr('newGame')}</button>`)}
  <div class="scores" id="scores"></div>
  <div class="layout">
    <div class="board-wrap"><div class="board" id="board"></div></div>
    <div class="panel">
      <section class="station" id="station"></section>
      <section class="station">
        <div class="bins-head"><h3>${tr('binsTitle')}</h3><span class="log" id="pending"></span></div>
        <div class="bins" id="bins"></div>
      </section>
      <details class="log station"><summary>${tr('logTitle')}</summary><ol id="logl"></ol></details>
    </div>
  </div>`;
  $('#b-rules').onclick = showRules;
  $('#b-quit').onclick = confirmQuit;
  renderScores(); renderBoard(); renderPanel();
}
function renderScores(){
  const el=$('#scores'); if(!el) return;
  el.innerHTML = S.players.map((p,i)=>{
    const pend = BIN_ORDER.reduce((s,k)=>s+S.bins[k].filter(e=>e.p===i).length,0);
    return `<div class="chip ${i===S.cur?'cur':''}"><span class="dot" style="background:${p.color}"></span>
      <div style="min-width:0"><div class="nm">${esc(p.name)}</div><div class="meta">${tr('chipMeta',p.life.length,pend)}</div></div>
      <span class="sc">${p.score}</span></div>`; }).join('');
}
function cellRC(i){ if(i<=7) return [0,i]; if(i<=14) return [i-7,7]; if(i<=21) return [7,7-(i-14)]; return [7-(i-21),0]; }
function renderBoard(){
  const b=$('#board'); if(!b) return;
  const rot = i => i<7?0:i<14?90:i<21?180:270;
  const FL = tr('fields');
  b.innerHTML = FIELDS.map((f,i)=>{ const [r,c]=cellRC(i);
    const sym = f==='w' ? `<span style="display:inline-block;transform:rotate(${rot(i)}deg)">›</span>` : FSYM[f];
    return `<div class="cell t-${f}" id="cell${i}" style="grid-area:${r+1}/${c+1}" title="${FL[f]}"><span class="ix">${i}</span><span class="sym">${sym}</span>${f!=='w'?`<span class="fl">${FL[f]}</span>`:''}<div class="pawns"></div></div>`; }).join('') +
    `<div class="center"><div class="round">${tr('round',S.round,S.rounds)}</div>
      <div class="now"><span class="dot" style="background:${P().color};width:16px;height:16px"></span><span class="n">${esc(P().name)}</span></div>
      <div class="die" id="die" aria-label="${tr('die')}: ${S.die}"></div>
      <button class="btn-main" id="b-roll" ${S.phase!=='idle'?'disabled':''}>${tr('rollBtn')}</button>
      <div class="msg" id="msg">${esc(logText(S.log[0]||''))}</div></div>`;
  drawDie(); renderPawns();
  $('#b-roll').onclick = roll;
}
function drawDie(){ const d=$('#die'); if(!d) return; const on={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]}[S.die];
  d.innerHTML = Array.from({length:9},(_,i)=>`<i class="${on.includes(i)?'on':''}"></i>`).join(''); d.setAttribute('aria-label',tr('die')+': '+S.die); }
function setMsg(t){ const m=$('#msg'); if(m) m.textContent=t; }
function renderPawns(){
  document.querySelectorAll('.cell').forEach(c=>{c.classList.remove('hl'); c.querySelector('.pawns').innerHTML='';});
  S.players.forEach((p,i)=>{ const c=$('#cell'+p.pos); if(!c) return;
    c.querySelector('.pawns').insertAdjacentHTML('beforeend',`<span class="pawn ${i===S.cur?'me':''}" style="background:${p.color}" title="${esc(p.name)}"></span>`);
    if(i===S.cur) c.classList.add('hl'); });
}
function renderBins(pick){
  const el=$('#bins'); if(!el) return;
  const just = S.turn && S.turn.bin;
  el.className = 'bins'+(pick?' pick':'');
  el.innerHTML = BIN_ORDER.map(k=>{ const b=BINS[k];
    return `<button class="bin ${just===k?'just':''}" data-k="${k}" ${pick?'':'disabled'} style="--bc:${b.c};--tc:${b.t}" aria-label="${esc(tr('binAria',bn(k),S.bins[k].length))}">
      <span class="lid"></span><span class="body"><span class="bn">${esc(bn(k))}</span><span class="bs">${esc(bsub(k))}</span></span>
      <span class="cnt">${S.bins[k].length}</span></button>`; }).join('');
  el.onclick = pick ? (e=>{ const b=e.target.closest('.bin'); if(b) chooseBin(b.dataset.k); }) : null;
  const total = inBins().length; const pd=$('#pending'); if(pd) pd.textContent = total? tr('pending',total) : tr('empty');
}
function cardHTML(c, haz){
  return `<div class="card ${haz?'haz':''}"><div class="art" aria-hidden="true">${c.icon}</div><div style="min-width:0"><div class="kind">${haz?tr('hazCard'):tr('wasteCard')} · ${tr('no')} ${c.id+1}</div><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p></div></div>`;
}
function renderPanel(){
  const st=$('#station'); if(!st) return;
  const lg=$('#logl'); if(lg) lg.innerHTML = S.log.map(l=>`<li>${esc(logText(l))}</li>`).join('');
  renderScores();
  if(S.phase!=='turn'){
    st.innerHTML = `<div class="card empty"><div class="art" aria-hidden="true">${S.phase==='moving'?'⏳':'🎲'}</div><div><div class="kind">${tr('station')}</div><h3>${S.phase==='moving'?tr('moving'):tr('waiting')}</h3><p>${S.phase==='moving'?tr('movingTxt'):esc(tr('idleTxt',P().name))}</p></div></div>`;
    renderBins(false); return;
  }
  const t=S.turn, step=t.steps[t.si];
  let top = '';
  if(t.card!=null) top = cardHTML(C(t.card), t.haz || (S.hazard && CARDS[t.card].metal));
  let body = '';
  if(step==='bin'){
    body = `<div class="step"><h4 tabindex="-1" id="step-focus">${tr('binQ')}</h4><p class="hint">${tr('binHint',S.mode==='jr'?PTS.binBadJr:PTS.binBad)}</p></div>`;
  } else if(['material','polymer','metal','harm','bonus','pool'].includes(step)){
    body = quizHTML(step);
  } else if(step==='life'){
    const L=lifeC(t.life);
    top = `<div class="card life"><div class="art" aria-hidden="true">♻︎</div><div><div class="kind">${tr('lifeKind')}</div><h3>${esc(L[0])}</h3><p>${esc(L[1])}</p></div></div>`;
    body = `<div class="fb ok"><b>${tr('lifeFbH',PTS.life)}</b>${tr('lifeFb',PTS.master)}</div>${nextBtn()}`;
  } else if(step==='event'){
    body = `<div class="big-banner"><h4>${tr('jamH')}</h4><p>${tr('jamB')}</p></div>${nextBtn()}`;
  } else if(step==='control'){
    body = controlHTML(t.ctl, tr('ctlTitle'), tr('ctlSub')) + nextBtn();
  } else if(step==='summary'){
    const nxt = (S.cur+1>=S.players.length && S.round>=S.rounds) ? null : S.players[(S.cur+1)%S.players.length];
    body = `<div class="step"><h4 tabindex="-1" id="step-focus">${esc(tr('turnEnd',P().name))}</h4>
      <p class="hint">${t.bin?esc(tr('waitsIn',bn(t.bin))):''}</p>
      <div class="gain mono" style="color:${t.gain>=0?'var(--good)':'var(--bad)'}">${sgn(t.gain)} ${tr('pts')}</div>
      <div class="next-row"><button class="btn-main" id="b-end">${nxt?esc(tr('passTo',nxt.name)):tr('finalCtl')}</button></div></div>`;
  }
  st.innerHTML = top + body;
  renderBins(step==='bin');
  const nb=$('#b-next'); if(nb) nb.onclick = nextStep;
  const eb=$('#b-end'); if(eb) eb.onclick = endTurn;
  st.querySelectorAll('[data-ans]').forEach(b=>b.onclick=()=>answer(step, +b.dataset.ans));
}
function nextBtn(){ return `<div class="next-row"><button class="btn-main" id="b-next">${tr('next')}</button></div>`; }
function quizHTML(key){
  const t=S.turn, d=quizDef(key);
  if(!t.ord[key]) { t.ord[key] = (d.codes||d.noShuffle) ? d.opts.map((_,i)=>i) : shuffle(d.opts.map((_,i)=>i)); save(); }
  const a=t.ans[key], done=a!==undefined;
  const letters='ABCDEFGH';
  const btns = t.ord[key].map((oi,pos)=>{
    const cls = done ? (oi===d.correct?'ok':(oi===a?'no':'')) : '';
    if(d.codes){
      const wide = oi===7;
      return `<button class="opt ${cls} ${wide?'wide':''}" data-ans="${oi}" ${done?'disabled':''} aria-label="${wide?esc(d.opts[oi]):oi+1}">${wide?'✕ '+esc(d.opts[oi]):tri(oi+1)}</button>`;
    }
    return `<button class="opt ${cls}" data-ans="${oi}" ${done?'disabled':''}><span class="lt">${letters[pos]}</span><span>${esc(d.opts[oi])}</span></button>`;
  }).join('');
  const ok = a===d.correct;
  return `<div class="step"><h4 tabindex="-1" id="step-focus">${esc(d.prompt)}</h4><p class="hint">${esc(d.hint)}</p>
    <div class="opts ${d.codes?'codes':''}">${btns}</div>
    ${done?`<div class="fb ${ok?'ok':'no'}"><b>${ok?tr('good',d.pts):tr('bad')}</b>${esc(d.expl)}</div>${nextBtn()}`:''}</div>`;
}
function controlHTML(ctl, title, sub){
  if(!ctl.length) return `<div class="big-banner"><h4>${title}</h4><p>${tr('ctlEmpty')}</p></div>`;
  const sums = S.players.map((p,i)=>ctl.filter(r=>r.p===i).reduce((s,r)=>s+r.pts,0));
  const okN = ctl.filter(r=>r.ok).length;
  const rows = [...ctl].sort((a,b)=>a.ok-b.ok).map(r=>{ const c=C(r.c);
    return `<div class="ctl-row ${r.ok?'':'no'}"><span class="e" aria-hidden="true">${c.icon}</span>
      <div class="t"><b>${esc(c.name)}</b><small>${pChip(r.p)} → ${binChip(r.b)} ${r.ok?'':` · ${tr('correctly')}: ${binChip(c.bin)}`}</small>${r.ok?'':`<p>${esc(c.why)}</p>`}</div>
      <span class="p ${r.pts>0?'plus':'minus'}">${sgn(r.pts)}</span></div>`; }).join('');
  return `<div class="big-banner"><h4>${title}</h4><p>${sub} ${tr('ctlOk',okN,ctl.length)}</p></div>
    <div style="display:flex;flex-wrap:wrap;gap:6px 14px">${S.players.map((p,i)=>ctl.some(r=>r.p===i)?`<span>${pChip(i)} <b class="mono">${sgn(sums[i])}</b></span>`:'').join('')}</div>
    <div class="ctl">${rows}</div>`;
}
