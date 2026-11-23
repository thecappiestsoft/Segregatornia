/**
 * Segregatornia – Narzędzia pomocnicze, globalny stan gry (S, setup, busy), zapis/odczyt stanu.
 */
/* ================= NARZĘDZIA ================= */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle = a => { a=[...a]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = ms => new Promise(r=>setTimeout(r, RM ? Math.min(ms,40) : ms));
const binChip = k => `<span class="bchip" style="--bc:${BINS[k].c};--tc:${BINS[k].t}">${esc(bn(k))}</span>`;
const pChip = i => `<span class="pchip"><span class="dot" style="background:${S.players[i].color}"></span>${esc(S.players[i].name)}</span>`;
const sgn = n => (n>0?'+':'')+n;
const tri = (n,size=44) => `<svg class="tri" viewBox="0 0 44 40" width="${size}" height="${size*40/44}" aria-hidden="true"><path d="M22 3 L41 36 L3 36 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-dasharray="26 5"/><text x="22" y="30" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-weight="600" font-size="15" fill="currentColor">${n}</text></svg>`;
const logText = e => { if(typeof e==='string') return e; try{ return tr('log_'+e[0], ...e.slice(1)); }catch(err){ return ''; } };

let S = null;
let setup = {n:4,names:['','','','','',''],mode:'std',hazard:true,rounds:8};
let busy = false;

function save(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){} }
function loadSaved(){ try{ const d=JSON.parse(localStorage.getItem(SAVE_KEY)||'null'); return d&&d.screen==='game'?d:null; }catch(e){ return null; } }
function clearSave(){ try{ localStorage.removeItem(SAVE_KEY); }catch(e){} }
function toast(t){ const d=document.createElement('div'); d.className='toast'; d.textContent=t; document.body.appendChild(d); setTimeout(()=>d.remove(), RM?1800:2400); }
function log(e){ S.log.unshift(e); S.log = S.log.slice(0,30); }
