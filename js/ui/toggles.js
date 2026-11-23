/**
 * Segregatornia – Przełączniki języka i motywu, pasek górny.
 */
/* ================= JĘZYK: PRZEŁĄCZNIK ================= */
function langToggle(){
  return `<div class="lang" role="group" aria-label="Język / Language">${['pl','en'].map(l=>`<button type="button" data-lang="${l}" aria-pressed="${LANG===l}" lang="${l}" title="${l==='pl'?'Polski':'English'}">${l.toUpperCase()}</button>`).join('')}</div>`;
}
function themeToggle(){
  const cur = effTheme();
  const sun = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></g></svg>';
  const moon = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="currentColor"/></svg>';
  return `<div class="lang theme" role="group" aria-label="${tr('themeLabel')}"><button type="button" data-theme-set="light" aria-pressed="${cur==='light'}" title="${tr('themeLight')}" aria-label="${tr('themeLight')}">${sun}</button><button type="button" data-theme-set="dark" aria-pressed="${cur==='dark'}" title="${tr('themeDark')}" aria-label="${tr('themeDark')}">${moon}</button></div>`;
}
function setTheme(t){
  THEME = t; try{ localStorage.setItem(THEME_KEY, t); }catch(e){}
  applyTheme();
  document.querySelectorAll('[data-theme-set]').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.themeSet===t)));
}
document.addEventListener('click', e=>{ const b=e.target.closest('[data-theme-set]'); if(b) setTheme(b.dataset.themeSet); });
function syncNames(){ for(let i=0;i<setup.n;i++){ const el=document.getElementById('nm'+i); if(el) setup.names[i]=el.value; } }
function setLang(l){
  if(l===LANG) return;
  syncNames();
  LANG = l; try{ localStorage.setItem(LANG_KEY, l); }catch(e){}
  document.documentElement.lang = l;
  if(S && S.screen!=='setup') render(); else renderSetup();
}
document.addEventListener('click', e=>{ const b=e.target.closest('[data-lang]'); if(b) setLang(b.dataset.lang); });
function topBar(btns){
  return `<div class="top"><div class="logo"><span class="tag stripes"></span>Segregatornia</div>
    <div class="top-actions">${themeToggle()}${langToggle()}${btns}</div></div>`;
}
