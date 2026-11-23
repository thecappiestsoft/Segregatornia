/**
 * Segregatornia – Dostęp do danych w bieżącym języku + stałe gry: pola planszy, punktacja, kolory graczy.
 */
/* ================= DOSTĘP DO DANYCH WG JĘZYKA ================= */
function C(id){ const c=CARDS[id]; if(!EN()) return c; const e=CARDS_EN[id];
  return {...c,name:e[0],desc:e[1],why:e[2],q:c.q?[e[3][0],e[3][1],e[3][2],c.q[3]]:null,mat:e[4]||null}; }
const poolQ = i => EN() ? [...POOL_EN[i], POOL[i][3]] : POOL[i];
const lifeC = i => EN() ? LIFE_EN[i] : LIFE[i];
const metalD = k => (EN()?METALS_EN:METALS)[k];
const matNote = k => (EN()?MAT_NOTE_EN:MAT_NOTE)[k];
const bn = k => EN() ? BINS_EN[k][0] : BINS[k].n;
const bsub = k => EN() ? BINS_EN[k][1] : BINS[k].s;
const polyN = i => (EN()?POLY_EN:POLY_PL)[i];
const pn = i => S.players[i].name;

const FIELDS = ['start','w','w','life','w','q','w','control','w','haz','w','jam','w','life','w','q','w','express','w','haz','w','control','w','life','w','q','jam','w'];
const FSYM = {start:'▶',w:'›',life:'♻︎',q:'?',control:'✓',haz:'⚠︎',jam:'−3',express:'+2'};
const COLORS = ['#E4572E','#1F8FD1','#8E5BD8','#14A37F','#E0479E','#B8941C'];
const PTS = {binOk:2,binBad:-2,binBadJr:-1,mat:1,poly:1,metal:1,harm:1,bonus:1,pool:2,life:1,loop:1,master:3};
const SAVE_KEY = 'segregatornia-v2';
