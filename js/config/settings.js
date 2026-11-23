/**
 * Segregatornia – Ustawienia języka i motywu (odczyt z localStorage, zastosowanie motywu).
 */
/* ================= JĘZYK / LANGUAGE ================= */
const LANG_KEY = 'segregatornia-lang';
let LANG = 'pl';
try{ const l = localStorage.getItem(LANG_KEY); if(l==='en'||l==='pl') LANG = l; }catch(e){}
const EN = () => LANG==='en';
const THEME_KEY = 'segregatornia-theme';
let THEME = null;
try{ const t = localStorage.getItem(THEME_KEY); if(t==='light'||t==='dark') THEME = t; }catch(e){}
const sysDark = () => matchMedia('(prefers-color-scheme: dark)').matches;
const effTheme = () => THEME || (document.documentElement.dataset.theme==='dark'||document.documentElement.dataset.theme==='light' ? document.documentElement.dataset.theme : (sysDark()?'dark':'light'));
function applyTheme(){ if(THEME) document.documentElement.dataset.theme = THEME; }
applyTheme();
