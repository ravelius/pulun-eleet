import {LIVIA_SVG_ELEET,livianSvgAsento,livianSvgKuva,livianEleenVoima} from '../js/livia-svg.js';
import {LIVIAN_UUDET_VERSIOT,uudenEleenAsento,uudenEleenKuva} from './livia-uudet-versiot.mjs';
const $=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const KAIKKI_ELEET=[...LIVIAN_UUDET_VERSIOT,...LIVIA_SVG_ELEET];
let selected=LIVIAN_UUDET_VERSIOT[0].id,phase=0,strength=.5,raf=0,playing=false,all=false,timer=0,last=0;
// Katselusivun "uudet" tarkoittaa nykyisen SVG-kokopulun myöhemmin
// lisättyjä koreografioita. Ne ovat myös omissa varsinaisissa ryhmissään.
const UUDET_ELEET=new Set(['glideIn','trailerFlee','trailerBack','chatDashOut','chatDashBack','chatDustOff','mapPeck','bunFeast','cityExplain','smile','grin','wink','welcome','present','glasses','bookStudy','scratch','eyeRub','chuckle']);
const RYHMAT=[...new Set(LIVIA_SVG_ELEET.map(ele=>ele.group))];
const uudetId=Object.fromEntries(LIVIAN_UUDET_VERSIOT.map(ele=>[ele.id,ele]));
const KATEGORIAT=[
 {id:'uudet-versiot',nimi:'Uudet versiot',eleet:LIVIAN_UUDET_VERSIOT.filter(ele=>ele.group==='Uudet versiot')},
 ...RYHMAT.map(nimi=>({id:'uusi-'+nimi,nimi:'Uusi · '+nimi,eleet:LIVIA_SVG_ELEET.filter(ele=>ele.group===nimi).map(ele=>uudetId['uusi-'+ele.id])})),
 {id:'uudet',nimi:'Pelin lisätyt eleet',eleet:LIVIA_SVG_ELEET.filter(ele=>UUDET_ELEET.has(ele.id))},
 ...RYHMAT.map(nimi=>({id:nimi,nimi:'Pelissä · '+nimi,eleet:LIVIA_SVG_ELEET.filter(ele=>ele.group===nimi)})),
];
let kategoria='uudet-versiot';
function piirraKategoriat(){
 // Säilytä painikkeet ja näppäimistöfokus myös kategorian vaihtuessa.
 if(!$('gesture-categories').children.length)for(const ryhma of KATEGORIAT){const nappi=document.createElement('button');nappi.type='button';nappi.dataset.category=ryhma.id;nappi.textContent=`${ryhma.nimi} (${ryhma.eleet.length})`;nappi.onclick=()=>{cancelAll();kategoria=ryhma.id;piirraKategoriat();piirraElevalinnat();choose(ryhma.eleet[0].id,true);};$('gesture-categories').append(nappi);}
 for(const nappi of $('gesture-categories').children)nappi.setAttribute('aria-pressed',String(nappi.dataset.category===kategoria));
}
function piirraElevalinnat(){
 const ryhma=KATEGORIAT.find(r=>r.id===kategoria);$('gesture-options').replaceChildren();
 for(const ele of ryhma.eleet){const nappi=document.createElement('button');nappi.type='button';nappi.dataset.gesture=ele.id;nappi.textContent=ele.label;nappi.onclick=()=>{cancelAll();choose(ele.id,true);};$('gesture-options').append(nappi);}
 merkitseValittu();
}
function merkitseValittu(){for(const nappi of $('gesture-options').querySelectorAll('button'))nappi.setAttribute('aria-pressed',String(nappi.dataset.gesture===selected));}
function current(){return KAIKKI_ELEET.find(e=>e.id===selected);}
function ryhmanEleet(){return KATEGORIAT.find(r=>r.id===kategoria).eleet;}
function paint(){
 const uusi=Boolean(current().baseId),asento=uusi?uudenEleenAsento:livianSvgAsento,kuva=uusi?uudenEleenKuva:livianSvgKuva;
 const s=asento(selected,phase,{voimakkuus:strength});
 $('actual').innerHTML=kuva(s,{right:44,prefix:'actual'});
 let big=kuva(s,{right:44,prefix:'zoom'});
 if(uusi)big=big.replace('viewBox="0 0 196 304"','viewBox="65 207 115 99"');
 else if(current().group!=='Liike')big=big.replace('viewBox="0 0 196 304"','viewBox="0 125 196 179"');
 $('zoom').innerHTML=big;$('position').value=Math.round(phase*1000);$('progress').textContent=Math.round(phase*100)+' %';
 $('strength-label').textContent=Math.round(strength*100)+' %';
}
function stop(){cancelAnimationFrame(raf);clearTimeout(timer);raf=0;playing=false;$('pause').textContent='Jatka';}
function cancelAll(){all=false;$('all').setAttribute('aria-pressed','false');}
function run(){
 if(document.hidden||reduced.matches)return;
 stop();playing=true;$('pause').textContent='Pysäytä';const start=performance.now(),from=phase,duration=current().duration*($('slow').checked?2.5:1);
 const tick=now=>{phase=Math.min(1,from+(now-start)/duration);if(current().baseId||now-last>=30||phase>=1){paint();last=now;}if(phase<1)raf=requestAnimationFrame(tick);else{stop();if(all){timer=setTimeout(()=>{const eleet=ryhmanEleet(),i=eleet.findIndex(e=>e.id===selected);if(i===eleet.length-1){cancelAll();$('description').textContent=`Ryhmän ${eleet.length} elettä näytetty.`;}else choose(eleet[i+1].id,true);},650);}}};
 raf=requestAnimationFrame(tick);
}
function choose(id,pidaKategoria=false){
 stop();selected=id;
 if(!pidaKategoria){const ryhma=KATEGORIAT.find(r=>r.id!=='uudet'&&r.eleet.some(ele=>ele.id===id));if(ryhma&&ryhma.id!==kategoria){kategoria=ryhma.id;piirraKategoriat();piirraElevalinnat();}}
 strength=current().baseId?.5:livianEleenVoima(id);$('strength').value=Math.round(strength*100);phase=reduced.matches?.45:0;$('description').textContent=current().kuvaus||current().label;$('preview-note').hidden=!current().baseId;merkitseValittu();paint();run();
}
$('strength').oninput=()=>{strength=Number($('strength').value)/100;paint();};
$('position').oninput=()=>{cancelAll();stop();phase=Number($('position').value)/1000;paint();};
$('play').onclick=()=>{cancelAll();stop();phase=reduced.matches?.45:0;paint();run();};
$('pause').onclick=()=>{cancelAll();if(playing)stop();else{if(phase>=1)phase=0;run();}};
$('all').onclick=()=>{if(all){cancelAll();stop();}else if(!reduced.matches){all=true;$('all').setAttribute('aria-pressed','true');choose(ryhmanEleet()[0].id,true);}};
$('slow').onchange=()=>{if(playing)run();};
function motion(){stop();cancelAll();$('reduced').hidden=!reduced.matches;phase=reduced.matches?.45:0;paint();}
reduced.addEventListener('change',motion);document.addEventListener('visibilitychange',()=>{stop();cancelAll();});
$('reduced').hidden=!reduced.matches;piirraKategoriat();piirraElevalinnat();choose(selected,true);
