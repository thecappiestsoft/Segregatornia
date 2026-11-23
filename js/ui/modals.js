/**
 * Segregatornia – Okna modalne: zasady gry i potwierdzenie wyjścia.
 */
/* ================= OKNA ================= */
function modal(html){
  const r=$('#modal-root'); r.innerHTML = `<div class="ov" id="ov"><div class="modal" role="dialog" aria-modal="true">${html}<div class="next-row"><button class="btn-main" id="m-close">${tr('close')}</button></div></div></div>`;
  const close=()=>{ r.innerHTML=''; };
  $('#m-close').onclick=close; $('#ov').onclick=e=>{ if(e.target.id==='ov') close(); };
  document.addEventListener('keydown', function k(e){ if(e.key==='Escape'){ close(); document.removeEventListener('keydown',k);} });
  $('#m-close').focus();
}
function showRules(){
  const sw = (cls,s) => `<span class="sw cell t-${cls}" style="container-type:normal">${s}</span>`;
  const F = tr('rulesFields',PTS);
  modal(`<h2>${tr('rulesH')}</h2>
  <p>${tr('rulesIntro')}</p>
  <h3>${tr('rulesTurnH')}</h3>
  <ul>${tr('rulesTurn').map(l=>`<li>${l}</li>`).join('')}</ul>
  <h3>${tr('rulesFieldsH')}</h3>
  <div class="legend">${['start','w','control','haz','life','q','jam','express'].map(f=>`<div class="lg">${sw(f,FSYM[f])}${F[f]}</div>`).join('')}</div>
  <h3>${tr('rulesPtsH')}</h3>
  <ul>${tr('rulesPts',PTS).map(l=>`<li>${l}</li>`).join('')}</ul>
  <h3>${tr('rulesBinsH')}</h3>
  <p style="display:flex;flex-wrap:wrap;gap:6px">${BIN_ORDER.map(binChip).join('')}</p>
  <p class="est">${tr('rulesNote')}</p>`);
}
function confirmQuit(){
  const r=$('#modal-root'); r.innerHTML = `<div class="ov"><div class="modal" role="dialog" aria-modal="true" style="max-width:440px"><h2>${tr('quitH')}</h2><p>${tr('quitP')}</p><div class="start-row" style="justify-content:flex-end"><button class="btn" id="q-no">${tr('quitNo')}</button><button class="btn-main" id="q-yes">${tr('quitYes')}</button></div></div></div>`;
  $('#q-no').onclick=()=>r.innerHTML=''; $('#q-yes').onclick=()=>{ r.innerHTML=''; clearSave(); S=null; renderSetup(); };
  $('#q-no').focus();
}
