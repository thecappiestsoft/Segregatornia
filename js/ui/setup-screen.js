/**
 * Segregatornia – Ekran startowy (konfiguracja nowej gry).
 */
/* ================= EKRAN STARTOWY ================= */
function renderSetup(){
  const saved = loadSaved();
  const mins = Math.round(setup.rounds*setup.n*0.85);
  const belt = shuffle(CARDS).slice(0,16).map(c=>c.icon).join('');
  $('#app').innerHTML = `
  ${topBar(`<button class="btn" id="b-rules">${tr('rules')}</button>`)}
  <section class="hero">
    <div class="hero-in"><h1>Segregatornia</h1><p>${tr('heroP')}</p></div>
    <div class="belt-strip" aria-hidden="true"><div class="belt-track">${belt}${belt}</div></div>
    <div class="hero-foot stripes"></div>
  </section>
  <div class="setup">
    <section class="box">
      <h2>${tr('newShift')}</h2>
      <span class="lbl">${tr('lblPlayers')}</span>
      <div class="seg" id="seg-n">${[2,3,4,5,6].map(n=>`<button aria-pressed="${n===setup.n}" data-n="${n}">${n}</button>`).join('')}</div>
      <span class="lbl">${tr('lblNames')}</span>
      <div class="names">${Array.from({length:setup.n},(_,i)=>`<label class="name-row"><span class="dot" style="background:${COLORS[i]}"></span><input id="nm${i}" maxlength="18" value="${esc(setup.names[i]||'')}" placeholder="${esc(tr('team',i+1))}" aria-label="${esc(tr('playerAria',i+1))}"></label>`).join('')}</div>
      <span class="lbl">${tr('lblLevel')}</span>
      <div class="seg" id="seg-mode">
        <button data-m="std" aria-pressed="${setup.mode==='std'}">${tr('modeStd')}</button>
        <button data-m="jr" aria-pressed="${setup.mode==='jr'}">${tr('modeJr')}</button></div>
      <p class="est">${setup.mode==='std'?tr('modeStdD'):tr('modeJrD')}</p>
      <span class="lbl">${tr('lblLength')}</span>
      <div class="seg" id="seg-r">${[5,8,10,12].map(r=>`<button data-r="${r}" aria-pressed="${r===setup.rounds}">${tr('roundsN',r)}</button>`).join('')}</div>
      <p class="est">${tr('est',mins,setup.n,setup.rounds)}</p>
      <span class="lbl">${tr('lblVariants')}</span>
      <label class="check"><input type="checkbox" id="haz" ${setup.hazard?'checked':''}><span><b>${tr('hazTitle')}</b><small>${tr('hazDesc')}</small></span></label>
      <div class="start-row"><button class="btn-main" id="b-start">${tr('startBtn')}</button>
      ${saved?`<button class="btn" id="b-resume">${tr('resume',saved.round,saved.rounds)}</button>`:''}</div>
    </section>
    <section class="box how">
      <h2>${tr('howTitle')}</h2>
      <ol>${tr('how',PTS.binOk,PTS.binBad).map(l=>`<li>${l}</li>`).join('')}</ol>
      <span class="lbl" style="margin-top:18px">${tr('codesLbl')}</span>
      <div class="codes-strip">${POLY_ABBR.map((p,i)=>`<span class="code-pill">${tri(i+1,30)}${p}</span>`).join('')}</div>
    </section>
  </div>`;
  $('#seg-n').onclick = e=>{ const b=e.target.closest('button'); if(!b) return; syncNames(); setup.n=+b.dataset.n; renderSetup(); };
  $('#seg-mode').onclick = e=>{ const b=e.target.closest('button'); if(!b) return; syncNames(); setup.mode=b.dataset.m; if(setup.mode==='jr') setup.hazard=false; renderSetup(); };
  $('#seg-r').onclick = e=>{ const b=e.target.closest('button'); if(!b) return; syncNames(); setup.rounds=+b.dataset.r; renderSetup(); };
  $('#haz').onchange = e=>{ setup.hazard=e.target.checked; };
  $('#b-rules').onclick = showRules;
  $('#b-start').onclick = ()=>{ syncNames(); newGame(); };
  if(saved) $('#b-resume').onclick = ()=>{ S=saved; if(S.phase==='moving'){S.phase='idle';S.turn=null;} render(); };
}
