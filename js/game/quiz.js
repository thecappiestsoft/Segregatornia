/**
 * Segregatornia – Definicje pytań w turze: materiał, polimer, metal, szkodliwość, bonus, pula.
 */
/* ================= DEFINICJE PYTAŃ ================= */
function quizDef(key){
  const t=S.turn, c = t.card!=null?C(t.card):null;
  if(key==='material'){
    return {prompt:tr('matQ',c.name), hint:tr('matHint'), codes:true,
      opts:[...POLY_ABBR.map((_,i)=>String(i+1)),tr('noCode')], correct: c.code? c.code-1 : 7, pts:PTS.mat,
      expl: c.code ? tr('matExpl',c.code) : (c.mat || matNote(c.bin))};
  }
  if(key==='polymer'){
    return {prompt:tr('polyQ',c.code), hint:tr('polyHint'), opts:POLY_ABBR.map((a,i)=>`${a} · ${polyN(i)}`), correct:c.code-1, pts:PTS.poly,
      expl:tr('polyExpl',c.code,POLY_ABBR[c.code-1],polyN(c.code-1))};
  }
  if(key==='metal'){
    return {prompt:tr('metalQ'), hint:tr('metalHint'), noShuffle:true,
      opts:['Hg','Pb','Cd'].map(s=>`${s} · ${metalD(s).n}`), correct:['Hg','Pb','Cd'].indexOf(c.metal), pts:PTS.metal,
      expl:tr('metalExpl',c.name,metalD(c.metal).n,c.metal)};
  }
  if(key==='harm'){
    const m=metalD(c.metal);
    return {prompt:tr('harmQ',m.n,c.metal), hint:tr('harmHint'), opts:[m.t,...m.m], correct:0, pts:PTS.harm, expl:m.t};
  }
  if(key==='bonus'){
    const q = t.bq.src==='card' ? c.q : poolQ(t.bq.i);
    return {prompt:q[0], hint:tr('bonusHint',PTS.bonus), opts:q[1], correct:0, pts:PTS.bonus, expl:q[2]};
  }
  if(key==='pool'){
    const q=poolQ(t.pq);
    return {prompt:q[0], hint:tr('poolHint',PTS.pool), opts:q[1], correct:0, pts:PTS.pool, expl:q[2]};
  }
}
