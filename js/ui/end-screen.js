/**
 * Segregatornia – Ekran końcowy: podium, tabela wyników, powtórka błędów, ściąga kodów.
 */
/* ================= KONIEC GRY ================= */
function renderEnd(){
  const order = S.players.map((p,i)=>({...p,i})).sort((a,b)=>b.score-a.score);
  const pod = [order[1],order[0],order[2]].filter(Boolean);
  const h = {0:120,1:90,2:66};
  const wrong = [...new Set(S.players.flatMap(p=>p.wrong))].slice(0,14);
  const tie = order[1] && order[1].score===order[0].score;
  $('#app').innerHTML = `
  ${topBar(`<button class="btn" id="b-rules">${tr('rulesShort')}</button>`)}
  <section class="hero"><div class="hero-in"><h1>${tr('endTitle')}</h1><p>${tr('endWin',esc(order[0].name),order[0].score,tie)}</p></div><div class="hero-foot stripes"></div></section>
  <div class="podium">${pod.map(p=>{const place=order.indexOf(p);return `<div class="pod"><span class="dot" style="background:${p.color};width:22px;height:22px"></span><div class="pn">${esc(p.name)}</div><div class="mono" style="font-weight:600">${p.score} ${tr('pts')}</div><div class="blk" style="height:${h[place]}px">${place+1}</div></div>`}).join('')}</div>
  <section class="box"><h2>${tr('results')}</h2><div class="tbl-wrap"><table>
    <thead><tr><th>${tr('thPlayer')}</th><th>${tr('thPts')}</th><th>${tr('thSorted')}</th><th>${tr('thCodes')}</th><th>${tr('thQ')}</th>${S.hazard?`<th>${tr('thHaz')}</th>`:''}<th>${tr('thLife')}</th></tr></thead>
    <tbody>${order.map(p=>`<tr><td>${pChip(p.i)}${S.final.masters.includes(p.i)?` <small>· ${tr('master',PTS.master)}</small>`:''}</td><td class="num"><b>${p.score}</b></td><td class="num">${p.st.ok} / ${p.st.ok+p.st.bad}</td><td class="num">${p.st.mat} / ${p.st.matN}</td><td class="num">${p.st.q} / ${p.st.qN}</td>${S.hazard?`<td class="num">${p.st.haz} / ${p.st.hazN}</td>`:''}<td class="num">${p.life.length}</td></tr>`).join('')}</tbody></table></div>
    <div class="start-row"><button class="btn-main" id="b-again">${tr('again')}</button><button class="btn" id="b-new">${tr('change')}</button></div></section>
  <div class="end-grid">
    <section class="box"><h2>${tr('review')}</h2>${wrong.length?`<div class="ctl" style="max-height:none">${wrong.map(id=>{const c=C(id);return `<div class="ctl-row"><span class="e" aria-hidden="true">${c.icon}</span><div class="t"><b>${esc(c.name)}</b><small>${tr('rightBin')}: ${binChip(c.bin)}${c.code?` · ${tr('code')} ${c.code} ${POLY_ABBR[c.code-1]}`:''}</small><p>${esc(c.why)}</p></div><span></span></div>`}).join('')}</div>`:`<p>${tr('perfect')}</p>`}</section>
    <section class="box"><h2>${tr('cheat')}</h2><div class="tbl-wrap"><table><thead><tr><th>${tr('thCode')}</th><th>${tr('thAbbr')}</th><th>${tr('thPoly')}</th></tr></thead><tbody>
      ${POLY_ABBR.map((p,i)=>`<tr><td>${tri(i+1,32)}</td><td class="num"><b>${p}</b></td><td>${polyN(i)}</td></tr>`).join('')}</tbody></table></div>
      <p class="est">${tr('otherMarks')}</p></section>
  </div>
  <section class="box" style="margin-top:18px"><details><summary style="cursor:pointer;font-weight:600">${tr('finalDetails')}</summary><div style="margin-top:12px">${controlHTML(S.final.ctl,tr('finalCtl'),tr('finalSub'))}</div></details></section>`;
  $('#b-rules').onclick = showRules;
  $('#b-again').onclick = ()=>{ setup.n=S.players.length; setup.names=[...S.players.map(p=>p.name),...setup.names.slice(S.players.length)]; setup.mode=S.mode; setup.hazard=S.hazard; setup.rounds=S.rounds; newGame(); window.scrollTo(0,0); };
  $('#b-new').onclick = ()=>{ S=null; renderSetup(); window.scrollTo(0,0); };
}
