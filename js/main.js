/**
 * Segregatornia – Punkt startowy aplikacji. Ładowany jako ostatni.
 */
/* ================= START ================= */
function start(data){
  if(data && data.LANG) LANG = data.LANG;
  if(data && data.S && data.S.screen){ S=data.S; if(S.phase==='moving'){S.phase='idle';S.turn=null;} }
  if(data && data.setup) setup=data.setup;
  busy=false; render();
}
try{ matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{ if(!THEME) document.querySelectorAll('[data-theme-set]').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.themeSet===effTheme()))); }); }catch(e){}
start({});
