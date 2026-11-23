/**
 * Segregatornia – Pojemniki, kody tworzyw (1–7), metale ciężkie, notatki o materiałach.
 */
/* ================= DANE PL ================= */
const BINS = {
  P:{n:'Papier',s:'niebieski pojemnik',c:'var(--b-P)',t:'var(--on-color)'},
  S:{n:'Szkło',s:'zielony pojemnik',c:'var(--b-S)',t:'var(--on-color)'},
  M:{n:'Metale i tworzywa',s:'żółty pojemnik',c:'var(--b-M)',t:'#16201B'},
  B:{n:'Bio',s:'brązowy pojemnik',c:'var(--b-B)',t:'var(--on-color)'},
  Z:{n:'Zmieszane',s:'czarny/grafitowy',c:'var(--b-Z)',t:'var(--on-color)'},
  E:{n:'Elektroodpady',s:'PSZOK lub sklep RTV',c:'var(--b-E)',t:'var(--on-color)'},
  A:{n:'Baterie',s:'i akumulatory',c:'var(--b-A)',t:'var(--on-color)'},
  L:{n:'Leki',s:'pojemnik w aptece',c:'var(--b-L)',t:'#16201B'},
  N:{n:'Niebezpieczne',s:'PSZOK',c:'var(--b-N)',t:'var(--on-color)'}
};
const BINS_EN = {P:['Paper','blue bin'],S:['Glass','green bin'],M:['Metals & plastics','yellow bin'],B:['Bio','brown bin'],Z:['Mixed waste','black/grey bin'],
  E:['E-waste','PSZOK or electronics shop'],A:['Batteries','and accumulators'],L:['Medicines','pharmacy bin'],N:['Hazardous','PSZOK collection point']};
const BIN_ORDER = ['P','S','M','B','Z','E','A','L','N'];
const POLY_ABBR = ['PET','HDPE','PVC','LDPE','PP','PS','O'];
const POLY_PL = ['politereftalan etylenu','polietylen dużej gęstości','polichlorek winylu','polietylen małej gęstości','polipropylen','polistyren','inne – np. poliwęglan, PLA, laminaty'];
const POLY_EN = ['polyethylene terephthalate','high-density polyethylene','polyvinyl chloride','low-density polyethylene','polypropylene','polystyrene','other – e.g. polycarbonate, PLA, laminates'];
const METALS = {
  Hg:{n:'rtęć',t:'Pary rtęci uszkadzają układ nerwowy i nerki, a w wodzie rtęć tworzy związki, które gromadzą się w rybach.',m:['Rtęć szkodzi tylko roślinom, ludziom nic nie robi.','Rtęć w glebie w kilka dni rozkłada się na wodę.']},
  Pb:{n:'ołów',t:'Ołów uszkadza układ nerwowy (u dzieci obniża zdolność uczenia się) i zaburza tworzenie krwi.',m:['Ołów jest potrzebnym składnikiem codziennej diety.','Ołów odparowuje z gleby w ciągu kilku dni.']},
  Cd:{n:'kadm',t:'Kadm gromadzi się w organizmie, uszkadza nerki i kości i może wywoływać nowotwory.',m:['Kadm jest bezpieczny, bo dodaje się go do witamin.','Kadm szkodzi tylko metalowym rurom.']}
};
const METALS_EN = {
  Hg:{n:'mercury',t:'Mercury vapour damages the nervous system and kidneys, and in water mercury forms compounds that build up in fish.',m:['Mercury only harms plants and does nothing to people.','Mercury in soil breaks down into water within a few days.']},
  Pb:{n:'lead',t:'Lead damages the nervous system (in children it lowers the ability to learn) and disrupts blood formation.',m:['Lead is a necessary part of the everyday diet.','Lead evaporates from soil within a few days.']},
  Cd:{n:'cadmium',t:'Cadmium builds up in the body, damages the kidneys and bones and can cause cancer.',m:['Cadmium is safe because it is added to vitamins.','Cadmium only harms metal pipes.']}
};
const MAT_NOTE = {P:'To papier – oznaczenia 20–22 PAP, nie tworzywo.',S:'To szkło – oznaczenia 70–72 GL, nie tworzywo.',M:'To metal – oznaczenia 40 FE (stal) lub 41 ALU (aluminium).',B:'To odpad organiczny – nie ma kodu tworzywa.',Z:'Ten odpad nie ma kodu recyklingu tworzyw.',E:'To sprzęt elektryczny – mieszanka wielu materiałów, bez kodu tworzywa.',A:'To bateria lub akumulator – bez kodu tworzywa.',L:'To lek – bez kodu tworzywa.',N:'To odpad niebezpieczny – bez kodu tworzywa.'};
const MAT_NOTE_EN = {P:'This is paper – marked 20–22 PAP, not a plastic.',S:'This is glass – marked 70–72 GL, not a plastic.',M:'This is metal – marked 40 FE (steel) or 41 ALU (aluminium).',B:'This is organic waste – it has no plastic code.',Z:'This item has no plastic recycling code.',E:'This is electrical equipment – a mix of many materials, no plastic code.',A:'This is a battery or accumulator – no plastic code.',L:'This is a medicine – no plastic code.',N:'This is hazardous waste – no plastic code.'};
