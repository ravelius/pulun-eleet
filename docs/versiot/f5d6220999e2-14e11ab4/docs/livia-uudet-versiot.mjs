/* Katseluehdotukset. Pelin ohjain ei tuo tätä moduulia.
 * Piirretyt liikeavaimet ovat samassa aikajanassa: pään ele johtaa,
 * rintakehä ja siipien kärjet seuraavat viiveellä. Ei satunnaisuutta,
 * joten kelaus ja tauko palaavat aina täsmälleen samaan asentoon.
 * Kasvon geometria tulee hyväksytystä SVG-päästä, myös väliruuduissa. */
import {livianSvgPaa} from '../js/livia-svg-paa.js';

export const LIVIAN_UUDET_VERSIOT=Object.freeze([
  {id:'uusi-chuckle',baseId:'chuckle',label:'Hiljainen naurunpyrskähdys',duration:3600,group:'Uudet versiot',kuvaus:'Uusi erä: nauru yrittää pysyä sisällä, mutta karkaa kahdessa erikokoisessa pyrskähdyksessä. Siipi peittää suupieltä; hartiat ja pää seuraavat eri aikaan.'},
  {id:'uusi-yawn',baseId:'yawn',label:'Valtava haukotus',duration:4700,group:'Uudet versiot',kuvaus:'Uusi erä: raskaat luomet, sisäänhengitys ja suuri linnunhaukotus. Kieli näkyy, siipi nousee suun eteen ja venytys sulaa rauhalliseksi huokaukseksi.'},
  {id:'uusi-grin',baseId:'grin',label:'Leveä virne',duration:3200,group:'Uudet versiot',kuvaus:'Uusi erä: ensin silmät tietävät jotain, sitten nokkaan leviää leveä virne. Pieni ylpeä takakeno ja lopuksi hillitty paluu pokerinaamaan.'},
  {id:'uusi-disbelief',baseId:'disbelief',label:'Et ole tosissasi',duration:3800,group:'Uudet versiot',kuvaus:'Uusi erä: katse pysähtyy, toinen kulma nousee ja nokka loksahtaa raolleen. Epätasainen siipien kohautus, sivusilmäys ja harkittu suun sulkeminen.'},
  {id:'uusi-nod',baseId:'nod',label:'Kyllä kyllä',duration:2100,group:'Uudet versiot',kuvaus:'Pieni valmistelu, napakka nyökkäys ja pienempi vahvistus. Pää palaa rauhassa paikalleen.'},
  {id:'uusi-doubleTake',baseId:'doubleTake',label:'Hetkinen!',duration:2750,group:'Uudet versiot',kuvaus:'Sivusilmäys, havahtuminen ja nopea toinen vilkaisu. Vartalo seuraa päätä hieman jäljessä.'},
  {id:'uusi-welcome',baseId:'welcome',label:'Hauska nähdä',duration:2900,group:'Uudet versiot',kuvaus:'Iloinen linnunsuu avautuu tervehdykseen. Siivet seuraavat eri aikaan, ja hymy sulkeutuu rauhassa.'},
  {id:'uusi-bookStudy',baseId:'bookStudy',label:'Kirjan selaus',duration:4400,group:'Uudet versiot',kuvaus:'Kirjan sivut ovat Pulua kohti, kannet katsojaan päin. Katse seuraa riviä; siipi kääntää sivun ja paperi asettuu.'},
  {id:'uusi-bookPanic',baseId:'bookStudy',label:'Kiireinen kirjanhaku',duration:11000,group:'Uudet versiot',kuvaus:'Hirveä kiire ja syvä kyyry — kirja väärin päin! Läimäys kiinni, Pulu pitkäksi. Hidas kääntö vihellellen, kirja auki ja lasit suoraan. Eihän tässä mitään sattunut.'},
].map(Object.freeze));

const rajaa=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
const pyorista=n=>Math.round(n*1000)/1000;

// Monotoninen Hermite säilyttää nopeuden saman suuntaisilla avaimilla.
// Vain suunnanvaihto ja kirjoitettu pito pysäyttävät liikkeen; yksittäinen
// pehmennys jokaisen avaimen välissä tekisi liikkeestä nykivän.
export function liikearvo(p,avaimet){
  p=rajaa(p);
  const kulma=i=>{
    if(i===0||i===avaimet.length-1)return 0;
    const a=(avaimet[i][1]-avaimet[i-1][1])/(avaimet[i][0]-avaimet[i-1][0]);
    const b=(avaimet[i+1][1]-avaimet[i][1])/(avaimet[i+1][0]-avaimet[i][0]);
    return a*b<=0?0:2*a*b/(a+b);
  };
  for(let i=1;i<avaimet.length;i++){
    const [a,x]=avaimet[i-1],[b,y]=avaimet[i];
    if(p>b)continue;
    const t=rajaa((p-a)/(b-a)),t2=t*t,t3=t2*t;
    return (2*t3-3*t2+1)*x+(t3-2*t2+t)*(b-a)*kulma(i-1)
      +(-2*t3+3*t2)*y+(t3-t2)*(b-a)*kulma(i);
  }
  return avaimet.at(-1)[1];
}

const RADAT={
  'uusi-chuckle':{
    paaKulma:[[0,0],[.12,5],[.24,5],[.32,-16],[.40,5],[.46,5],[.53,-10],[.62,3],[.73,-2],[.94,0],[1,0]],
    paaY:[[0,0],[.19,-4],[.26,-4],[.34,7],[.43,-2],[.48,-2],[.55,4],[.66,0],[1,0]],
    rinta:[[0,0],[.24,-3],[.36,5],[.45,-1],[.57,3],[.70,0],[1,0]],
    hengitys:[[0,0],[.20,.7],[.27,.7],[.35,-.55],[.45,.35],[.48,.35],[.57,-.35],[.73,0],[1,0]],
    ilme:[[0,0],[.15,.6],[.27,.9],[.34,1],[.62,1],[.78,.6],[.96,0],[1,0]],
    suu:[[0,0],[.25,0],[.32,.9],[.40,.08],[.47,.08],[.53,.63],[.63,.1],[.78,0],[1,0]],
    siipi:[[0,0],[.20,0],[.30,.75],[.38,.85],[.64,.85],[.85,0],[1,0]],
    suusiipi:[[0,0],[.23,0],[.34,1],[.63,1],[.85,0],[1,0]],
    sulat:[[0,0],[.24,0],[.36,.85],[.67,.85],[.89,0],[1,0]],
    rapaytys:[[0,0],[.84,0],[.88,1],[.92,0],[1,0]],
  },
  'uusi-yawn':{
    paaKulma:[[0,0],[.12,-8],[.21,-8],[.37,17],[.50,20],[.60,20],[.72,4],[.81,-7],[.96,0],[1,0]],
    paaY:[[0,0],[.14,4],[.21,4],[.38,-10],[.52,-13],[.61,-13],[.78,5],[.94,0],[1,0]],
    rinta:[[0,0],[.19,2],[.43,-5],[.62,-5],[.79,3],[.97,0],[1,0]],
    hengitys:[[0,0],[.18,-.25],[.38,.8],[.53,1],[.62,1],[.78,-.4],[.98,0],[1,0]],
    ilme:[[0,0],[.13,.7],[.25,1],[.68,1],[.87,.7],[1,0]],
    suu:[[0,0],[.20,0],[.29,.18],[.40,.82],[.48,1],[.61,1],[.68,.65],[.77,.1],[.84,0],[1,0]],
    siipi:[[0,0],[.24,0],[.40,.8],[.64,.8],[.79,.3],[.93,0],[1,0]],
    suusiipi:[[0,0],[.28,0],[.45,1],[.65,1],[.89,0],[1,0]],
    takasiipi:[[0,0],[.30,0],[.49,.42],[.63,.42],[.88,0],[1,0]],
    sulat:[[0,0],[.29,0],[.47,.8],[.67,.8],[.95,0],[1,0]],
    rapaytys:[[0,0],[.25,0],[.38,.88],[.65,.88],[.79,.3],[.88,0],[1,0]],
  },
  'uusi-grin':{
    paaKulma:[[0,0],[.13,-4],[.24,-4],[.39,10],[.49,7],[.69,7],[.83,2],[1,0]],
    paaX:[[0,0],[.24,0],[.42,3],[.69,3],[.96,0],[1,0]],
    paaY:[[0,0],[.20,2],[.40,-5],[.51,-3],[.72,-3],[1,0]],
    rinta:[[0,0],[.25,1],[.46,-3],[.72,-3],[.97,0],[1,0]],
    hengitys:[[0,0],[.25,-.1],[.46,.45],[.71,.45],[.98,0],[1,0]],
    katse:[[0,0],[.12,.75],[.27,.75],[.40,0],[1,0]],
    ilme:[[0,0],[.17,.5],[.37,1],[.69,1],[.91,0],[1,0]],
    suu:[[0,0],[.23,0],[.37,.6],[.48,.5],[.69,.5],[.84,0],[1,0]],
    rapaytys:[[0,0],[.90,0],[.935,.7],[.97,0],[1,0]],
  },
  'uusi-disbelief':{
    paaKulma:[[0,0],[.13,4],[.26,4],[.32,-5],[.42,-3],[.57,-3],[.68,7],[.79,7],[.98,0],[1,0]],
    paaX:[[0,0],[.13,-2],[.27,-2],[.37,5],[.58,5],[.70,7],[.81,7],[1,0]],
    paaY:[[0,0],[.27,0],[.34,3],[.59,3],[.72,-1],[1,0]],
    rinta:[[0,0],[.31,0],[.42,-3],[.64,-3],[.84,0],[1,0]],
    ilme:[[0,0],[.14,.7],[.28,.7],[.37,1],[.75,1],[.96,0],[1,0]],
    suu:[[0,0],[.27,0],[.33,.55],[.51,.55],[.63,.18],[.72,0],[1,0]],
    katse:[[0,0],[.55,0],[.66,1],[.80,1],[.96,0],[1,0]],
    siipi:[[0,0],[.35,0],[.46,.7],[.57,.7],[.77,0],[1,0]],
    takasiipi:[[0,0],[.42,0],[.55,.42],[.62,.42],[.84,0],[1,0]],
    sulat:[[0,0],[.40,0],[.51,.7],[.60,.7],[.82,0],[1,0]],
    rapaytys:[[0,0],[.80,0],[.84,1],[.89,0],[1,0]],
  },
  'uusi-nod':{
    paaKulma:[[0,0],[.07,0],[.15,8],[.245,-24],[.27,-23],[.40,3],[.53,-12],[.59,-9],[.79,1],[.94,0],[1,0]],
    paaY:[[0,0],[.15,-3],[.25,8],[.40,-1],[.53,4],[.81,0],[1,0]],
    rinta:[[0,0],[.18,-1.2],[.31,3],[.45,0],[.59,1.3],[.85,0],[1,0]],
    rapaytys:[[0,0],[.18,0],[.215,.85],[.275,0],[.81,0],[.84,1],[.88,0],[1,0]],
  },
  'uusi-doubleTake':{
    paaKulma:[[0,0],[.08,0],[.16,7],[.24,7],[.32,0],[.395,15],[.46,-4],[.54,4],[.67,4],[.88,0],[1,0]],
    paaX:[[0,0],[.16,4],[.24,4],[.32,0],[.40,-7],[.48,-4],[.67,-4],[.94,0],[1,0]],
    paaY:[[0,0],[.33,0],[.405,-9],[.48,-4],[.64,-4],[.94,0],[1,0]],
    rinta:[[0,0],[.20,-1],[.33,0],[.45,4],[.55,1.2],[.71,1.2],[.96,0],[1,0]],
    katse:[[0,0],[.095,1],[.26,1],[.32,0],[.37,-.5],[.64,-.5],[.9,0],[1,0]],
    ilme:[[0,0],[.34,0],[.395,1],[.55,1],[.83,0],[1,0]],
    rapaytys:[[0,0],[.27,0],[.30,1],[.33,0],[.81,0],[.85,1],[.89,0],[1,0]],
  },
  'uusi-welcome':{
    paaKulma:[[0,0],[.08,5],[.19,-6],[.29,2],[.40,-2],[.62,-2],[.90,0],[1,0]],
    paaY:[[0,0],[.1,-2],[.20,3],[.31,0],[1,0]],
    rinta:[[0,0],[.12,2],[.25,-4],[.38,-2],[.64,-2],[.89,.5],[1,0]],
    siipi:[[0,0],[.09,0],[.16,.15],[.245,1],[.31,.89],[.45,.89],[.52,1],[.60,.87],[.67,.87],[.90,0],[1,0]],
    takasiipi:[[0,0],[.15,0],[.28,.74],[.38,.62],[.64,.62],[.94,0],[1,0]],
    sulat:[[0,0],[.15,0],[.28,1],[.34,.82],[.54,1],[.69,.84],[.95,0],[1,0]],
    ilme:[[0,0],[.09,.2],[.22,1],[.70,1],[.96,0],[1,0]],
    suu:[[0,0],[.11,0],[.22,1],[.32,.83],[.57,.83],[.70,.5],[.88,0],[1,0]],
    rapaytys:[[0,0],[.07,0],[.10,1],[.14,0],[.75,0],[.78,.9],[.82,0],[1,0]],
  },
  'uusi-bookStudy':{
    paaKulma:[[0,0],[.10,-10],[.28,-10],[.37,-5],[.49,-5],[.58,-8],[.73,-8],[.88,3],[1,0]],
    paaX:[[0,0],[.11,-3],[.30,1],[.38,-2],[.56,-2],[.70,2],[.88,0],[1,0]],
    paaY:[[0,0],[.12,4],[.30,4],[.39,1],[.55,3],[.73,3],[.88,-1],[1,0]],
    rinta:[[0,0],[.16,-1.8],[.31,-1.8],[.45,-3],[.61,-1.5],[.77,-1.5],[1,0]],
    katse:[[0,0],[.1,-.6],[.29,.6],[.34,-.6],[.57,-.6],[.72,.5],[.86,0],[1,0]],
    ilme:[[0,0],[.10,1],[.73,1],[.9,0],[1,0]],
    siipi:[[0,0],[.30,0],[.40,.65],[.46,.75],[.535,1],[.60,.8],[.73,0],[1,0]],
    sulat:[[0,0],[.34,0],[.44,.75],[.555,1],[.64,.7],[.78,0],[1,0]],
    sivu:[[0,0],[.445,0],[.49,.12],[.565,.88],[.605,1],[1,1]],
    paperi:[[0,0],[.52,0],[.61,1],[.66,-.38],[.72,.12],[.80,0],[1,0]],
    rapaytys:[[0,0],[.305,0],[.326,1],[.35,0],[.83,0],[.855,1],[.885,0],[1,0]],
  },
  'uusi-bookPanic':{
    paaKulma:[[0,-18],[.02,-27],[.055,-16],[.075,-29],[.105,-16],[.125,-30],[.155,-17],[.175,-31],[.205,-16],[.225,-28],[.245,-20],[.27,4],[.285,4],[.305,-12],[.33,4],[.39,14],[.43,10],[.69,10],[.76,-3],[.82,-3],[.86,5],[.91,9],[1,9]],
    paaY:[[0,16],[.035,21],[.06,15],[.09,22],[.12,15],[.15,22],[.18,15],[.21,22],[.245,18],[.27,3],[.285,3],[.305,9],[.33,1],[.395,-15],[.44,-12],[.71,-12],[.78,-7],[.84,-9],[.90,-12],[1,-12]],
    paaX:[[0,-9],[.045,-13],[.07,-8],[.095,-14],[.12,-8],[.145,-14],[.17,-8],[.195,-14],[.22,-8],[.245,-12],[.28,-2],[.33,-2],[.40,4],[.70,4],[.78,-2],[.83,-2],[.89,2],[1,2]],
    rinta:[[0,-10],[.06,-16],[.09,-7],[.12,-17],[.15,-7],[.18,-17],[.21,-7],[.24,-16],[.28,-4],[.30,-4],[.31,4],[.34,-2],[.405,-7],[.45,-4],[.48,-2],[.53,-5],[.56,-3],[.62,-5],[.69,-4],[1,-4]],
    kyyry:[[0,.8],[.03,1],[.245,1],[.29,.6],[.31,.75],[.395,0],[1,0]],
    katse:[[0,-.6],[.04,.6],[.06,-.6],[.09,.6],[.11,-.6],[.14,.6],[.16,-.6],[.19,.6],[.21,-.6],[.24,.6],[.265,0],[.39,0],[.44,1],[.705,1],[.75,-.6],[.815,-.6],[.87,.3],[.93,0],[1,0]],
    ilme:[[0,1],[.245,1],[.27,0],[.71,0],[.76,1],[.82,1],[.86,0],[1,0]],
    havahdus:[[0,0],[.247,0],[.269,1],[.285,1],[.31,0],[1,0]],
    siipi:[[0,.65],[.033,1],[.052,.55],[.066,1],[.086,.55],[.100,1],[.12,.55],[.134,1],[.154,.55],[.168,1],[.188,.55],[.202,1],[.222,.55],[.236,1],[.265,.75],[.285,.75],[.304,1.2],[.33,.5],[.39,.6],[.46,.7],[.50,.86],[.529,.72],[.546,.62],[.604,.86],[.657,.7],[.705,.6],[.79,1],[.815,.7],[.855,1],[.884,1],[.94,0],[1,0]],
    sulat:[[0,.6],[.043,1],[.059,.58],[.076,1],[.093,.58],[.110,1],[.127,.58],[.144,1],[.161,.58],[.178,1],[.195,.58],[.212,1],[.229,.58],[.246,1],[.27,.75],[.285,.75],[.314,1.2],[.35,.5],[.4,.6],[.47,.7],[.512,.86],[.54,.72],[.557,.62],[.615,.86],[.668,.7],[.72,.6],[.8,1],[.825,.7],[.865,1],[.90,1],[.95,0],[1,0]],
    sivu:[[0,0],[.016,0],[.042,1],[.050,1],[.076,2],[.084,2],[.110,3],[.118,3],[.144,4],[.152,4],[.178,5],[.186,5],[.212,6],[.220,6],[.246,7],[1,7]],
    paperi:[[0,0],[.25,.7],[.27,0],[.302,0],[.310,1],[.323,-.3],[.345,0],[1,0]],
    kirjaKiinni:[[0,0],[.286,0],[.304,1],[.728,1],[.80,0],[1,0]],
    kirjaKulma:[[0,180],[.43,180],[.449,174],[.505,244],[.529,246],[.546,246],[.611,342],[.65,363],[.69,360],[1,360]],
    kirjaX:[[0,0],[.30,0],[.34,9],[.42,11],[.49,15],[.53,17],[.556,15],[.615,12],[.67,10],[.73,10],[.80,0],[1,0]],
    kirjaY:[[0,0],[.30,0],[.34,-1],[.40,-4],[.43,-3],[.49,-8],[.53,-5],[.556,-3],[.615,-7],[.67,-4],[.73,-4],[.80,0],[1,0]],
    kirjaKallistus:[[0,0],[.43,0],[.50,.65],[.54,.9],[.61,.4],[.67,0],[1,0]],
    vihellys:[[0,0],[.425,0],[.46,1],[.68,1],[.73,0],[1,0]],
    ryhti:[[0,0],[.33,0],[.40,.8],[.75,.8],[.80,.5],[.87,.8],[1,.8]],
    lasikorjaus:[[0,0],[.82,0],[.852,1],[.875,1],[.923,0],[1,0]],
    rapaytys:[[0,0],[.251,0],[.26,1],[.272,0],[.296,0],[.305,1],[.318,0],[.40,0],[.412,1],[.425,0],[.732,0],[.746,1],[.759,0],[.887,0],[.9,.8],[.918,0],[1,0]],
  },
};

export function uudenEleenAsento(id,p,{voimakkuus=.5}={}){
  const radat=RADAT[id];
  if(!radat)throw new RangeError('Tuntematon katseluele: '+id);
  const s={id,p:rajaa(p),paaKulma:0,paaX:0,paaY:0,rinta:0,siipi:0,takasiipi:0,sulat:0,katse:0,ilme:0,suu:0,rapaytys:0,sivu:0,paperi:0,havahdus:0,kirjaKulma:0,kirjaKiinni:0,kirjaX:0,kirjaY:0,kirjaKallistus:0,vihellys:0,ryhti:0,kyyry:0,lasikorjaus:0,hengitys:0,suusiipi:0};
  for(const [avain,rata]of Object.entries(radat))s[avain]=liikearvo(s.p,rata);
  const voima=.55+.9*rajaa(voimakkuus);
  for(const avain of ['paaKulma','paaX','paaY','rinta'])s[avain]*=voima;
  return s;
}

// Samat muodot kuin pelissä. Vain numeeriset SVG-geometriat interpoloidaan:
// värit, id:t ja polkukäskyt pysyvät koskemattomina. Smile-polku lisätään
// erikseen, koska muilla ilmeillä sitä ei ole. Ei päällekkäisiä kasvokuvia.
const GEOMETRIA=/\b(d|transform|cx|cy|rx|ry|x|y)="([^"]*)"/g;
const NUMERO=/-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
const ILMEET=['rest','glance','down','shock','blink','smile','smug','grin','disbelief','yawn'];
const POHJAT=Object.fromEntries(ILMEET.map(frame=>{
  const svg=livianSvgPaa({frame},{prefix:'katselupaa'}).replace(/<path data-part="smile"[^>]*\/>/,'');
  return [frame,{svg,luvut:[...svg.matchAll(GEOMETRIA)].flatMap(m=>[...m[2].matchAll(NUMERO)].map(n=>Number(n[0])))}];
}));
// Vain katselueleet kokeilevat suurempaa linnunsuuta. Ylänokka ja vahanahka
// säilyvät tunnistettavina; avautuminen tulee alaleuasta, ei ihmishuulista.
const VANHA_NOKKA=/<path d="M30 60L44 61[^"]*" fill="#2e4756"\/>(?:<path[^>]*\/>){4}/;
function iloinenNokka(avaus){
  const a=rajaa(avaus),n=pyorista;
  return `<g data-part="friendly-beak" data-opening="${n(a)}"><path data-part="mouth-inside" d="M20 67Q34 ${n(66-2*a)} 47 62Q51 ${n(67+3*a)} 40 ${n(69+13*a)}Q29 ${n(72+13*a)} 21 ${n(68+11*a)}Z" fill="#795a64"/><g opacity="${n(rajaa(a*1.5))}"><path data-part="tongue" d="M25 ${n(68+9*a)}Q28 ${n(63+10*a)} 34 ${n(66+9*a)}Q40 ${n(63+10*a)} 43 ${n(66+9*a)}Q40 ${n(73+9*a)} 32 ${n(72+10*a)}Q28 ${n(72+10*a)} 25 ${n(68+9*a)}Z" fill="#d99fa5"/><path d="M29 ${n(68+9*a)}Q34 ${n(65+9*a)} 39 ${n(67+9*a)}" fill="none" stroke="#efbdb8" stroke-width="1.1" stroke-linecap="round"/></g><path data-part="lower-beak" d="M21 ${n(68+11*a)}Q29 ${n(72+13*a)} 40 ${n(69+13*a)}Q45 ${n(66+9*a)} 47 62L48 ${n(64+2*a)}Q45 ${n(70+14*a)} 40 ${n(71+14*a)}Q29 ${n(74+13*a)} 20 ${n(70+11*a)}Z" fill="#6c8490"/><g transform="rotate(${n(a*8)} 43 63)"><path d="M32 57Q37 55 42 59L46 63Q38 66 19 68Q22 64 26 61Z" fill="#526b79"/><path d="M31 59Q35 57 40 60Q30 65 21 67L27 63Z" fill="#9baaae"/><path d="M27 59Q28 54 33 55Q36 51 39 55Q42 56 41 60Q35 59 32 62Z" fill="#e3e2d6"/></g><path d="M44 66Q49 65 50 62" fill="none" stroke="#334e5b" stroke-width="1.4" stroke-linecap="round" opacity="${n(a)}"/></g>`;
}
function paa(s,prefix){
  const ilmekartta={'uusi-chuckle':'grin','uusi-yawn':'yawn','uusi-grin':'grin','uusi-disbelief':'disbelief'};
  const lepo=POHJAT.rest.luvut,ilme=POHJAT[ilmekartta[s.id]||(s.id==='uusi-doubleTake'?'shock':s.id==='uusi-welcome'?'smile':onKirja(s)?'down':'rest')].luvut;
  let i=0;
  let kuva=POHJAT.rest.svg.replaceAll('katselupaa',prefix).replace(GEOMETRIA,(_,nimi,arvo)=>`${nimi}="${arvo.replace(NUMERO,()=>{
    const n=i++,avoin=lepo[n]+(ilme[n]-lepo[n])*s.ilme+(POHJAT.glance.luvut[n]-lepo[n])*s.katse+(POHJAT.shock.luvut[n]-lepo[n])*s.havahdus+(POHJAT.smug.luvut[n]-lepo[n])*s.ryhti;
    return pyorista(avoin+(POHJAT.blink.luvut[n]-avoin)*s.rapaytys);
  })}"`);
  if(s.id==='uusi-welcome'||ilmekartta[s.id]){
    // Nokan aukko leikkaa myös takana olevan posken: tausta näkyy raosta.
    // Kurkku ja kieli jäävät suun takaosaan, eivät täytä koko nokkaväliä.
    const a=rajaa(s.suu),maski=prefix+'mouth-space';
    // Virne leviää sivulle, haukotus alas. Sama muutos koskee sekä
    // nokkaa että posken aukkoa, jotta tausta jää oikeasti näkyviin.
    const muoto=s.id==='uusi-grin'?`translate(47 62) scale(${pyorista(1+.15*a)} ${pyorista(1-.3*a)}) translate(-47 -62)`:s.id==='uusi-yawn'?`translate(47 62) scale(1 ${pyorista(1+.2*a)}) translate(-47 -62)`:'';
    const aukko=`M16 65Q33 63 47 62Q49 ${pyorista(66+7*a)} 42 ${pyorista(67+14*a)}L14 ${pyorista(69+15*a)}Z`;
    kuva=kuva.replace(/^(<g[^>]*>)/,`$1<defs><mask id="${maski}" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120" style="mask-type:luminance"><rect width="120" height="120" fill="white"/><path data-part="mouth-space" d="${aukko}" fill="black" opacity="${pyorista(rajaa(a*4))}"/></mask></defs><g mask="url(#${maski})">`)
      .replace('<g><defs><clipPath','</g><g><defs><clipPath');
    let nokka=iloinenNokka(s.suu);
    nokka=nokka.replace(/(<path data-part="mouth-inside" d=")[^"]+/,`$1M39 65Q44 62 47 62Q51 ${pyorista(67+3*a)} 40 ${pyorista(69+13*a)}L34 ${pyorista(70+12*a)}Q44 ${pyorista(69+4*a)} 39 65Z`);
    if(muoto){
      nokka=`<g data-part="mouth-shape" transform="${muoto}">${nokka}</g>`;
      kuva=kuva.replace('data-part="mouth-space"',`data-part="mouth-space" transform="${muoto}"`);
    }
    kuva=kuva.replace(VANHA_NOKKA,nokka);
  }
  if(s.vihellys>0)kuva=kuva.replace(VANHA_NOKKA,iloinenNokka(s.vihellys*.2));
  let lasit=onKirja(s)?'<g fill="none" stroke="#655a48" stroke-width="2.2"><ellipse cx="37" cy="45.5" rx="8.5" ry="9"/><ellipse cx="61" cy="42.75" rx="13" ry="12"/><path d="M45.5 43.5Q47 37 48 40.75m26-1l8-5m-53.5 9l-4-3"/><path d="M55 36.75l4-2" stroke="#eee9d9" stroke-width="1.5"/></g>':'';
  if(s.id==='uusi-bookPanic')lasit=lasit.replace('<g ',`<g data-part="glasses-adjust" transform="translate(0 ${pyorista(-4*s.lasikorjaus)}) rotate(${pyorista(-3*s.lasikorjaus)} 61 43)" `);
  return kuva.replace(/<\/g>\s*$/,`${lasit}</g>`);
}

const VARTALO='<path d="M122 156L139 171L131 172L137 175L122 174L113 163Z" fill="#546b7a"/><path d="M87 137Q97 127 115 133Q131 137 132 152Q134 170 117 175Q100 178 89 165Q82 154 87 137Z" fill="#97a5ac"/><path d="M89 141Q98 134 105 137Q96 147 96 158Q97 170 109 175Q96 171 89 162Q84 152 89 141Z" fill="#b1bcc0"/><path d="M117 135Q132 140 132 154Q134 171 117 175L110 172Q119 161 117 135Z" fill="#738895"/>';
const TAITTUNUT_SIIPI='<path d="M112 136Q128 137 133 150Q135 161 128 171Q116 166 112 151Z" fill="#84959f"/><path d="M119 145Q126 148 130 153L129 157Q123 151 118 150Z M120 155Q126 158 130 163L128 167Q124 162 120 160Z" fill="#4d6472"/>';
const onKirja=s=>s.id==='uusi-bookStudy'||s.id==='uusi-bookPanic';
function siipi(s,taka=false){
  const t=taka?s.takasiipi:s.siipi,auki=rajaa(t/.22),kirja=onKirja(s);
  if(t===0)return taka?'':TAITTUNUT_SIIPI;
  // Kirjaan kurotetaan alhaalta rinnan ohi, ei kasvojen poikki.
  const moikkaus=s.id==='uusi-welcome'&&!taka,lasit=!taka?s.lasikorjaus:0;
  const perus=165+(kirja?75:moikkaus?-153:-112)*t+(s.sulat-t)*14;
  const suulle=taka?0:s.suusiipi,kulma=perus+(-8-perus)*lasit+(-73-perus)*suulle;
  // Naurun pää nyökkää alas: siipikin laskee suupieleen, ei silmän päälle.
  const suupieli=s.id==='uusi-chuckle'?10*suulle:0;
  return `${taka?'':`<g opacity="${pyorista(1-auki)}">${TAITTUNUT_SIIPI}</g>`}<g data-part="${taka?'far':'near'}-wing" opacity="${pyorista(auki)}" transform="translate(${pyorista((taka?88:121)-(kirja?8:0)*t-lasit*2)} ${pyorista(143+(kirja?2:0)*t-(moikkaus?14:0)*t-lasit*18+suupieli)}) scale(${taka?-1:1} 1) rotate(${pyorista(kulma)}) scale(${pyorista((.65+.35*t)*(1-lasit*.2)*(1-.2*suulle))} ${pyorista(.5+(kirja?.65:moikkaus?1.05:.5)*t+.4*suulle)})"><path d="M-3 4Q-11-7-4-20L4-38Q7-44 10-37L10-29Q16-42 20-37L17-24Q23-35 26-30L22-17Q29-23 29-17Q23-5 12 3Q4 8-3 4Z" fill="${taka?'#788e99':'#8499a3'}"/><path d="M0-13L8-27M5-7L16-23M10-1L21-15" fill="none" stroke="#506b7a" stroke-width="3.7" stroke-linecap="round"/></g>`;
}
function kirja(s){
  if(!onKirja(s))return '';
  const kiire=s.id==='uusi-bookPanic',t=kiire?s.sivu%1:s.sivu,karki=22+21*Math.cos(t*Math.PI),kaari=-18*Math.sin(t*Math.PI)-s.paperi*2;
  // Katsoja näkee ulkokannet ja selän. Sivun alapää jää kansien taakse:
  // vain yläreuna ja käännön kaari näkyvät Pulua kohti avautuvasta kirjasta.
  return `<g data-part="book" data-facing="pulu" transform="translate(48 148) rotate(${pyorista(-10+s.paperi*1.7)})">${kiire?`<g data-part="book-turn" transform="rotate(${pyorista(s.kirjaKulma)} 23 14)">`:''}<path data-part="page-edges" d="M1-3Q12-5 22 1Q33-5 42-4L43 2Q32 1 22 7Q11 2 1 2Z" fill="#e9dfc5" stroke="#b6a88d" stroke-width=".8"/><path data-part="page" d="M22 3Q${pyorista((22+karki)/2)} ${pyorista(kaari)} ${pyorista(karki)} -3L${pyorista(karki+1)} 20Q${pyorista((22+karki)/2)} ${pyorista(19+kaari*.2)} 22 27Z" fill="#f3ead5" stroke="#b6a88d" stroke-width=".8" opacity="${t>0&&t<1?1:0}"/><g data-part="book-covers"><path d="M0 0Q12 0 22 6L23 30Q12 24 2 23Z" fill="#829080" stroke="#52685e" stroke-width="1"/><path d="M22 6Q33 0 44-2L46 22Q33 23 23 30Z" fill="#60766b" stroke="#415d51" stroke-width="1"/><path d="M22 6L23 30" stroke="#b1b6a0" stroke-width="1.8"/><path d="M4 5Q11 5 18 9L19 24Q11 20 5 20Z M27 9Q34 5 40 4L42 18Q34 19 28 23Z" fill="none" stroke="#b0b29b" stroke-width=".65"/>${kiire?'<g transform="rotate(-16 34 13)"><text x="34" y="11" text-anchor="middle" fill="#e4d5ac" font-family="Georgia,serif" font-size="4.2">ATLAS</text><path d="M34 13l3 4h-6Z" fill="#c8c29e"/><path d="M34 14v5" stroke="#e4d5ac" stroke-width=".7"/></g>':'<path d="M34 10l3 3-2 4-3-3Z" fill="#b6b58c"/>'}</g>${kiire?'</g>':''}</g>`;
}
function katselukirja(s){
  const kuva=kirja(s);
  if(s.id!=='uusi-bookPanic')return kuva;
  const k=rajaa(s.kirjaKiinni);
  const kiinni=`<g data-part="book-closed" opacity="${pyorista(k)}"><path d="M10-3H34L36 27L11 30Z" fill="#485f53" stroke="#3c574b" stroke-width="1"/><path d="M12-1H33L34 26L13 28Z" fill="#ded2b6"/><path d="M10-3H31L33 28L11 30Z" fill="#687c6e" stroke="#465d50" stroke-width="1"/><path d="M13 1H28L30 24L14 26Z" fill="none" stroke="#b0b29b" stroke-width=".8"/><text x="21" y="9" text-anchor="middle" fill="#e4d5ac" font-family="Georgia,serif" font-size="4.7">ATLAS</text><path d="M21 13l4 6h-8Z" fill="#c8c29e"/></g>`;
  const tilassa=kuva.replace('translate(48 148)',`translate(${pyorista(48+s.kirjaX)} ${pyorista(148+s.kirjaY)})`)
    .replace(/(<g data-part="book-turn" transform="[^"]*)/,`$1${s.kirjaKallistus>0?` translate(23 14) scale(${pyorista(1-.3*s.kirjaKallistus)} 1) translate(-23 -14)`:''}`);
  return tilassa.replace(/(<g data-part="book-turn"[^>]*>)/,`$1<g data-part="book-open" opacity="${pyorista(1-k)}" transform="translate(23 14) scale(${pyorista(1-.6*k)} 1) translate(-23 -14)">`)
    .replace(/<\/g><\/g>$/,`</g>${kiinni}</g></g>`);
}
function kommellus(s){
  if(s.id!=='uusi-bookPanic')return '';
  let merkit='';
  for(const [i,alku]of [.025,.055,.085,.115,.145,.175,.205,.23].entries()){
    const t=(s.p-alku)/.055;if(t<=0||t>=1)continue;
    const x=112+25*t+(i%2)*5,y=92-9*Math.sin(t*Math.PI)+24*t*t;
    merkit+=`<path data-part="sweat" d="M0-3C-3 0-3 4 0 4C3 4 3 0 0-3Z" fill="#8bb3bc" stroke="#507a87" stroke-width=".6" opacity="${pyorista(Math.sin(t*Math.PI)*.9)}" transform="translate(${pyorista(x)} ${pyorista(y)}) rotate(${pyorista(-45+t*90)})"/>`;
  }
  for(const alku of [.44,.515,.59,.655]){
    const t=(s.p-alku)/.13;if(t<=0||t>=1)continue;
    merkit+=`<g data-part="whistle" transform="translate(${pyorista(64-20*t)} ${pyorista(100-22*t)}) rotate(-8)" opacity="${pyorista(Math.sin(t*Math.PI)*s.vihellys)}" fill="#7b806a"><ellipse cx="0" cy="0" rx="2.5" ry="1.7" transform="rotate(-20)"/><path d="M1-1v-10q6 0 5 5q-2-2-4-2v8Z"/></g>`;
  }
  if(s.p>.300&&s.p<.327)merkit+=`<path data-part="book-slap" d="M54 144l-6-5m7 12l-9-1m10 7l-7 3" fill="none" stroke="#988a6c" stroke-width="1.5" stroke-linecap="round" opacity="${pyorista(Math.sin((s.p-.300)/.027*Math.PI))}"/>`;
  return `<g data-part="book-comedy">${merkit}</g>`;
}
export function uudenEleenKuva(s,{prefix='uusi',right=44}={}){
  prefix=prefix.replace(/[^a-zA-Z0-9_-]/g,'');
  const jalka=x=>`<path d="M${x} 177l-1 8m0 0l-7 2m7-2l5 3m-5-3l1 3" fill="none" stroke="#ac7b74" stroke-width="2.1" stroke-linecap="round"/>`;
  const vartalo=s.id==='uusi-bookPanic'?`translate(109 177) rotate(${pyorista(s.rinta)}) scale(${pyorista(1+s.kyyry*.12)} ${pyorista(1-s.kyyry*.3+s.ryhti*.16)}) translate(-109 -177)`:s.hengitys?`translate(109 177) rotate(${pyorista(s.rinta)}) scale(${pyorista(1-s.hengitys*.07)} ${pyorista(1+s.hengitys*.16)}) translate(-109 -177)`:`rotate(${pyorista(s.rinta)} 109 177)`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${152+right} 304" width="${152+right}" height="304" aria-hidden="true" data-uusi-versio="${s.id}"><defs><radialGradient id="${prefix}ground"><stop stop-color="#635b4e" stop-opacity=".58"/><stop offset=".55" stop-color="#635b4e" stop-opacity=".32"/><stop offset="1" stop-color="#635b4e" stop-opacity="0"/></radialGradient></defs><ellipse cx="128" cy="301" rx="19" ry="2.8" fill="url(#${prefix}ground)"/><g data-part="whole-bird" transform="translate(128 302) scale(.56) translate(-108 -188)"><g data-part="feet">${jalka(99)}${jalka(118)}</g>${siipi(s,true)}<g data-part="body" transform="${vartalo}">${VARTALO}</g><g data-part="approach" transform="translate(${pyorista(s.paaX)} ${pyorista(s.paaY)}) rotate(${pyorista(s.paaKulma)} 105 146)"><g transform="translate(44 61) scale(1 .87)">${paa(s,prefix)}</g></g>${siipi(s)}${katselukirja(s)}${kommellus(s)}</g></svg>`;
}
