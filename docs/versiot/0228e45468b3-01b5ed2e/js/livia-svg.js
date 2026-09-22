/* Kokonainen Livia: sama eleaikajana, optinen lähestyminen ja siipien eleet. */
import {LIVIA_PIX_ELEET,livianPikseliAsento} from './livia-pikselit.js';
import {livianSvgPaa} from './livia-svg-paa.js';
import {LIVIAN_ASTRONAUTTI_KYPARA} from './livia-astronautti.js';
export const LIVIA_SVG_ELEET=Object.freeze([...LIVIA_PIX_ELEET,
 Object.freeze({id:'glideIn',label:'Kiireinen ensiliito kartalta',duration:2700,group:'Liike'}),
 Object.freeze({id:'trailerFlee',label:'Väistö trailerin tieltä',duration:1200,group:'Liike'}),
 Object.freeze({id:'trailerBack',label:'Varovainen paluu trailerista',duration:1700,group:'Liike'}),
 Object.freeze({id:'chatDashOut',label:'Salamana chatista',duration:300,group:'Liike'}),
 Object.freeze({id:'chatDashBack',label:'Salamana takaisin chattiin',duration:100,group:'Liike'}),
 Object.freeze({id:'chatDustOff',label:'Pölyt pois sulista',duration:1400,group:'Pelitilanne'}),
 Object.freeze({id:'mapPeck',label:'Kartan pinnan nokkiminen',duration:2500,group:'Pelitilanne'}),
 Object.freeze({id:'bunFeast',label:'Riemukas pullapalkinto',duration:4600,group:'Pelitilanne'}),
 Object.freeze({id:'cityExplain',label:'Nykykaupungin selitys',duration:6200,group:'Puhe'}),
 ...[['smile','Lämmin hymy',2700],['grin','Leveä virne',2900],['wink','Yhteisymmärrys',2300],['welcome','Hauska nähdä',3000],['present','Minun ottamani!',3400],['glasses','Silmälasit esiin',4800],['bookStudy','Tietäväinen kirjan selaus',4200],['scratch','Pään raapaisu',2600],['eyeRub','Lasit ylös ja silmien hieraisu',5200],['chuckle','Hiljainen naurunpyrskähdys',2500]].map(([id,label,duration])=>Object.freeze({id,label,duration,group:'Pelitilanne'}))]);
/** Pitkä askel–selitys tarvitsee oikeasta äänestä vähintään tämän ikkunan. */
export const LIVIAN_PITKAN_SELITYKSEN_MIN_MS=5600;
/**
 * Vain semanttinen cityExplain saa kävelyn. Nopeutettu kuuntelu vaihtaa
 * paikalliseen eleeseen, jotta äänikello ei tee askelluksesta hätäistä.
 */
export function livianSelityseleenVariantti(cueKestoMs,playbackRate=1){
 const kesto=Number(cueKestoMs),nopeus=Math.max(.25,Number(playbackRate)||1);
 return kesto>=LIVIAN_PITKAN_SELITYKSEN_MIN_MS&&kesto/nopeus>=5000?'pitka':'lyhyt';
}
const lvClamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
const lvEase=n=>{n=lvClamp(n);return n*n*(3-2*n);};
const lvGate=p=>lvEase((p-.06)/.18)*(1-lvEase((p-.79)/.18));
const lvRound=n=>Math.round(n*1000)/1000;
const lvEmotion={shock:1,embarrassed:.6,angry:.9,bored:.3,puff:.72,manic:1,expert:.65,disbelief:.8,confused:.55,happy:.65,smile:.35,grin:.6,chuckle:.6,wink:.3,welcome:.35,present:.5,glasses:.38,love:.65,facepalm:.6,doubleTake:.75,bread:.85};
export function livianEleenVoima(id,text='') {
 let strength=lvEmotion[id]??.35;
 if(/!{2,}|aivan mahdoton|todellakaan|kääk!/iu.test(text))strength+=.15;
 return lvClamp(strength);
}
export function livianSvgAsento(id,p=0,{voimakkuus=livianEleenVoima(id),cueKestoMs=0,playbackRate=1}={}) {
 const s={...livianPikseliAsento(id,p),ele:id,p:lvClamp(p),voimakkuus:lvClamp(voimakkuus)};
 if(id==='bunFeast'){
  const t=s.p;
  s.frame=t===0||t===1?'rest':t<.2?'grin':t<.9?'smile':'rest';
  if(t>0&&t<.2){s.mouth='talk';s.feast={phase:'squeal',hop:Math.sin(t/.2*Math.PI)};}
  else if(t>=.2&&t<.7){
   const bites=t>=.62?3:t>=.48?2:t>=.34?1:0;
   s.mouth=bites&&Math.sin((t-.2)*Math.PI*22)>0?'talkSmall':'rest';
   s.feast={phase:'bite',grab:lvEase((t-.2)/.1),bites};
  } else if(t>=.7&&t<.9){
   s.mouth=Math.sin((t-.7)*Math.PI*18)>0?'talkSmall':'rest';
   s.feast={phase:'chew',chew:Math.sin((t-.7)*Math.PI*18)};
  }
 }
 if(id==='mapPeck'){
  // Kaksi rauhallista, toisistaan erottuvaa nokkaisua. Lyhyt väli tekee
  // liikkeestä uteliaan eikä mekaanista edestakaista pumppausta.
  const first=s.p>.12&&s.p<.42?Math.sin((s.p-.12)/.30*Math.PI):0;
  const second=s.p>.52&&s.p<.82?Math.sin((s.p-.52)/.30*Math.PI):0;
  const amount=Math.max(0,first,second);
  s.frame=amount>.08?'down':'rest';
  s.gazeDown=amount>.08;
  s.mapPeck={amount,peck:first>second?1:second>0?2:0};
 }
 if(id==='cityExplain'){
  const variant=livianSelityseleenVariantti(cueKestoMs,playbackRate);
  if(variant==='pitka'){
   // Rauhallinen askel sivuun, pysähdys, kaksi selityseletta ja paluu.
   const out=lvEase(s.p/.20),back=1-lvEase((s.p-.80)/.18),amount=out*back;
   const point=lvEase((s.p-.18)/.10)*(1-lvEase((s.p-.40)/.10));
   const open=lvEase((s.p-.50)/.10)*(1-lvEase((s.p-.72)/.12));
   s.frame=s.p<=0||s.p>=1?'rest':s.p<.42?'glance':s.p<.72?'front':'rest';
   s.cityExplain={variant,amount,point,open,gesture:Math.max(point,open),phase:s.p};
  }else{
   // Oma lyhyt koreografia, ei 6,2 sekunnin kävelyn nopeutettu pienennös:
   // katse sivuun, yksi hillitty siipiele ja pehmeä paluu paikallaan.
   const point=lvEase((s.p-.12)/.18)*(1-lvEase((s.p-.68)/.22));
   s.frame=s.p<=0||s.p>=1?'rest':s.p<.78?'glance':'rest';
   s.cityExplain={variant,amount:0,point,open:0,gesture:point*.65,phase:s.p};
  }
 }
 if(id==='glideIn')s.flight={kind:'opening',t:lvEase(p)};
 if(id==='trailerFlee')s.flight={kind:'trailerAway',t:lvEase(p)};
 if(id==='trailerBack')s.flight={kind:'trailerBack',t:lvEase(p)};
 if(id==='chatDashOut')s.flight={kind:'chatDashOut',t:lvEase(lvClamp(p/.55))};
 if(id==='chatDashBack')s.flight={kind:'chatDashBack',t:lvEase(p)};
 if(id==='chuckle'&&p>.12&&p<.86){
  const syke=Math.sin((p-.12)/.74*Math.PI*6),voima=s.voimakkuus;
  s.frame='grin';s.mouth=syke>0?'talk':'talkSmall';
  s.y=-Math.abs(syke)*voima*1.6;s.tilt=syke*voima*.55;
 }
 if(id==='eyeRub'){
  s.glasses=1;
  s.glassesLift=22*lvEase((p-.10)/.18)*(1-lvEase((p-.70)/.18));
  s.frame=p>.30&&p<.68?'blink':'rest';
 }
 if(id==='bookStudy'){
  s.frame='smug';s.glasses=1;s.gazeDown=true;s.pageTurn=Math.sin(lvClamp((p-.18)/.64)*Math.PI);
 }
 if(p>.08&&p<.94){
  if(['smile','grin','wink','welcome','present'].includes(id))s.frame=id==='welcome'||id==='present'?'smile':id;
  if(id==='glasses'){s.frame=p<.24?'down':'smug';s.glasses=lvEase((p-.12)/.20)*(1-lvEase((p-.78)/.16));}
  if(id==='welcome')s.tilt=Math.sin(p*Math.PI*3)*.4;
  if(id==='scratch'){s.frame='up';s.tilt=Math.sin(p*Math.PI*14)*.45;}
 }
 return s;
}
export function livianSvgMalli(s,{right=0}={}) {
 const id=s.ele||'',p=lvClamp(s.p??0),strength=lvClamp(s.voimakkuus??livianEleenVoima(id));
 const gate=lvGate(p),moving=Boolean(s.flight||s.walk||['arrive','crash','emerge','leaveDown','handoff','peek','owl','flyAway','flyBack','clumsyLand','glassCrash','walkRight','walkBack','leaveRight'].includes(id));
 const lean=!moving&&id in lvEmotion?strength*gate:0;
 const m={id,p,strength,gate,lean,headScale:1/(1-.48*lean),bodyLean:-9*lean,
  x:128+(s.x||0)*4,y:302+(moving?(s.y||0)*4:0),headY:moving?0:(s.y||0)*2,headAngle:(s.tilt||0)*(3+5*strength),scale:.56,angle:0,squash:1,visible:true,
  flight:Boolean(s.flight),walking:Boolean(s.walk),mirror:s.walk?.direction===1,face:s.frame||'rest',wing:'fold',wingAmount:0};
 if(id==='bunFeast'&&s.feast?.hop){m.y-=7*Math.abs(s.feast.hop);m.angle=2.5*Math.sin(p/.2*Math.PI*2);}
 if(id==='mapPeck'&&s.mapPeck){
  const amount=lvClamp(s.mapPeck.amount);
  // Vartalo joustaa vain vähän: varsinainen nokkaisu syntyy kaulan ja pään
  // liikkeestä, joten jalkojen polut ja koko linnun ankkuri eivät liiku.
  // Paa-moduulin vasemmalle osoittava nokka laskee negatiivisella kierrolla.
  // Huipussa nokankarki (19,68) osuu koko SVG:n maailmassa y~=300:aan.
  m.headY=16.1*amount;m.headAngle=-65*amount;m.bodyLean=4*amount;
 }
 if(id==='cityExplain'&&s.cityExplain){
  const amount=lvClamp(s.cityExplain.amount),reach=s.compactExplain?28:52;
  if(amount>0){
   const stride=p<.5?p/.20:(1-p)/.20;
   m.x=128-reach*amount;
   m.walking=p<.20||p>.80;
   m.step=Math.sin(lvClamp(stride)*Math.PI*2)*Math.min(1,amount*2);
   const gesture=lvClamp(s.cityExplain.gesture);
   m.headAngle=2*Math.sin(p*Math.PI*2)*gesture;
   m.bodyLean=-1.5*gesture;
  }
 }
 if(s.walk){const t=s.walk.direction===1?s.walk.t:1-s.walk.t;m.x=128+(right+96)*t;m.y=302-2*Math.sin(p*Math.PI*14);if(t>=1)m.visible=false;}
 if(['arrive','crash','owl','leaveRight'].includes(id)&&!s.flight&&!s.walk){const edge=id==='arrive'?1-lvEase((p-.08)/.46):id==='crash'?1-lvEase((p-.05)/.24):lvClamp((s.x||0)/24);m.x=128+(right+100)*edge;}
 if(id==='leaveRight'&&p>=1)m.visible=false;
 if(id==='flyAway'&&p>0)m.mirror=true;
 if(s.flight){
  const f=s.flight,t=lvClamp(f.t);m.face='rest';m.wing='flap';m.wingAmount=Math.sin(p*Math.PI*22);
  if(f.kind==='away'||f.kind==='back'){
   const near=f.kind==='away'?1-t:f.near?.45+.55*t:t;
   m.x=(152+right-8)*(1-near)+128*near;m.y=25*(1-near)+284*near;
   m.scale=.56*Math.max(.018,near);m.angle=(1-near)*-20;
   if(f.kind==='away'&&t>=1||f.kind==='back'&&t<=0)m.visible=false;
  } else if(f.kind==='trailerAway'){
   const near=1-t;m.x=128-72*t;m.y=284-205*t-32*Math.sin(Math.PI*t);m.scale=.56*Math.max(.06,near);m.angle=-18*t;m.face='shock';
   if(t>=1)m.visible=false;
  } else if(f.kind==='trailerBack'){
   m.x=56+72*t;m.y=79+223*t-22*Math.sin(Math.PI*t);m.scale=.034+.526*t;m.angle=-18*(1-t);m.face=t<.72?'glance':'smug';
  } else if(f.kind==='chatDashOut'||f.kind==='chatDashBack'){
   const d=right+96,back=f.kind==='chatDashBack';
   m.x=128+d*(back?1-t:t);m.y=302;m.scale=.56;m.angle=t===1&&back?0:(back?1-t:t)*-8;m.mirror=!back;
   if(f.kind==='chatDashOut'&&t>=1||f.kind==='chatDashBack'&&t<=0)m.visible=false;
   if(f.kind==='chatDashBack'&&t>=1){m.wing='fold';m.wingAmount=0;}
  } else if(f.kind==='glass'){
   m.x=128;m.y=25+230*t;m.scale=.015+.55*t+.16*lvEase((t-.68)/.32);m.face=t>.8?'shock':'front';
  } else if(f.kind==='splat'){
   m.x=123;m.y=271+140*lvEase((t-.3)/.7);m.scale=.70;m.squash=.57;m.face='fluster';m.wing='spread';m.wingAmount=1;
  } else if(f.kind==='opening'){
   // Kiireinen mutta luettava perspektiivikaari. Viimeinen viidennes on
   // pieni kahden askeleen haparointi, ei törmäys tai kaatuminen.
   const u=lvClamp(t/.78);m.x=26+(128-26)*u;m.y=38+(302-38)*u-48*Math.sin(Math.PI*u);
   m.scale=.07+.49*u;m.angle=-20*(1-u)+8*Math.sin(Math.PI*u);
   if(t>.78){const land=(t-.78)/.22,wobble=Math.sin(land*Math.PI*2)*(1-land);
    m.x=128+4*Math.sin(land*Math.PI*4)*(1-land);m.y=302-3*Math.abs(Math.sin(land*Math.PI*2))*(1-land);
    m.angle=8*wobble;m.squash=1-.08*Math.max(0,Math.sin(land*Math.PI));
    m.face=land<.62?'fluster':'smug';m.wing=land<.48?'spread':'fold';m.wingAmount=land<.48?.35*(1-land):0;
    m.walking=true;m.step=Math.sin(land*Math.PI*4)*(1-land);
   }
  }
 }
 if(!s.flight){
  if(s.frame==='wing')m.wing='shade';
  else if(s.frame==='cover')m.wing='cover';
  else if(s.frame==='preen')m.wing='preen';
  else if(['expert','present','welcome'].includes(id)&&gate>.01)m.wing=id==='welcome'?'shrug':'point';
  else if(id==='scratch'&&gate>.01)m.wing='scratch';
  else if(id==='eyeRub'&&gate>.01)m.wing=p>.30&&p<.68?'rubEyes':'liftGlasses';
  else if(id==='glasses'&&(p<.34||p>.76)&&gate>.01)m.wing='shy';
  else if(id==='angry'&&gate>.01)m.wing='spread';
  else if(['disbelief','confused'].includes(id)&&gate>.01)m.wing='shrug';
  else if(['embarrassed','facepalm'].includes(id)&&gate>.01)m.wing='shy';
  else if(['bread','manic'].includes(id)&&s.side)m.wing=s.propsRight?'reachRight':'reach';
  else if(id==='bunFeast'&&s.feast){m.wing=s.feast.phase==='squeal'?'spread':s.feast.phase==='bite'?'reach':'fold';}
  else if(s.frame==='shock')m.wing='spread';
  m.wingAmount=gate*(.25+.75*strength);
  if(['shade','cover','preen'].includes(m.wing))m.wingAmount=1;
 }
 if(id==='cityExplain'&&(s.cityExplain?.point>0||s.cityExplain?.open>0)){
  const point=lvClamp(s.cityExplain.point),open=lvClamp(s.cityExplain.open);
  m.wing=point>0?'point':'shrug';
  m.wingAmount=Math.max(point,open)*(.45+.35*strength);
 }
 if(id==='chatDustOff'&&p>0&&p<1){
  const dustGate=lvEase(p/.12)*(1-lvEase((p-.82)/.18));
  m.wing='spread';m.wingAmount=dustGate*(.58+.16*Math.sin(p*Math.PI*14));
  m.angle=dustGate*Math.sin(p*Math.PI*18)*2.4;
 }
 const hoverHeight=lvClamp(s.mapHover?.height);
 if(hoverHeight>0){
  const hoverPhase=Number.isFinite(s.mapHover?.phase)?s.mapHover.phase:0;
  m.mapHover={height:hoverHeight,phase:hoverPhase,groundY:m.y};
  m.y-=hoverHeight*(12+2*Math.sin(hoverPhase));
  m.wing='flap';m.wingAmount=.5+.5*Math.sin(hoverPhase);
 }
 if(id==='wind')m.bodyLean+=8*gate;
 return m;
}

const lvWingTransform=(anchor,shift,flip,angle)=>`translate(${anchor} ${143+shift}) scale(${flip} 1) rotate(${angle})`;
/* Leijunnan siiven kulma vaiheesta (sama kaava kuin lvWing 'flap'). */
export function livianLeijuntaSiipi(side,phase){
 const amount=.5+.5*Math.sin(phase);
 return lvWingTransform(side==='near'?121:88,0,side==='near'?1:-1,25+amount*65);
}
function lvWing(kind,side,amount,phase=0) {
 if(['rubEyes','liftGlasses'].includes(kind)&&side==='near'){
  const dx=kind==='rubEyes'?Math.sin(phase*3)*2:0,dy=kind==='rubEyes'?Math.cos(phase*3)*1.2:-12;
  return `<g data-part="${kind}" transform="translate(${lvRound(dx)} ${lvRound(dy)})"><path d="M117 140Q132 131 122 112L113 100Q115 93 109 92L105 88Q101 87 102 93L97 91Q93 93 99 97L96 98Q94 101 102 103L109 106Q107 122 112 135Z" fill="#8499a3"/><path d="M102 95l8 5m-8 0l8 4m3 5q-2 12 5 19" fill="none" stroke="#506b7a" stroke-width="2.2" stroke-linecap="round"/></g>`;
 }
 const anchor=side==='near'?121:88,flip=side==='near'?1:-1;
 let angle=0,raised=false;
 if(kind==='flap'){angle=25+amount*65;raised=true;}
 if(kind==='spread'){angle=38+amount*35+Math.sin(phase*6)*amount*8;raised=true;}
 if(kind==='shrug'){angle=34+amount*20;raised=true;}
 if(kind==='point'&&side==='near'){angle=-12;raised=true;}
 if(kind==='scratch'&&side==='near'){angle=-76+Math.sin(phase*4)*9;raised=true;}
 if(['shade','cover','shy','preen','reach','reachRight'].includes(kind)&&side==='near'){angle=kind==='shade'?-67:kind==='reachRight'?80:kind==='reach'?-110:kind==='preen'?-115:-78;raised=true;}
 if(!raised)return side==='near'?`<path d="M112 136Q128 137 133 150Q135 161 128 171Q116 166 112 151Z" fill="#84959f"/><path d="M119 145Q126 148 130 153L129 157Q123 151 118 150Z M120 155Q126 158 130 163L128 167Q124 162 120 160Z" fill="#4d6472"/>`:'';
 const shift=kind==='scratch'?-44:kind==='shade'?-55:kind==='cover'?-38:kind==='shy'?-16:0;
 return `<g data-part="${side}-wing" transform="${lvWingTransform(anchor,shift,flip,angle)}"><path d="M-3 4Q-11-7-4-20L4-38Q7-44 10-37L10-29Q16-42 20-37L17-24Q23-35 26-30L22-17Q29-23 29-17Q23-5 12 3Q4 8-3 4Z" fill="${side==='near'?'#8499a3':'#788e99'}"/><path d="M0-13L8-27M5-7L16-23M10-1L21-15" fill="none" stroke="#506b7a" stroke-width="3.7" stroke-linecap="round"/></g>`;
}
function lvFeet(m,s) {
 const step=m.walking?(m.step??Math.sin(m.p*Math.PI*14)):0;
 const tuck=m.mapHover?.height||0,leg=8-5*tuck,toes=1-.72*tuck;
 const foot=(x,dy)=>`<path d="M${x} ${lvRound(177+dy-3*tuck)}l-1 ${lvRound(leg)}m0 0l${lvRound(-7*toes)} ${lvRound(2*toes)}m${lvRound(7*toes)} ${lvRound(-2*toes)}l${lvRound(5*toes)} ${lvRound(3*toes)}m${lvRound(-5*toes)} ${lvRound(-3*toes)}l${lvRound(toes)} ${lvRound(3*toes)}" fill="none" stroke="#ac7b74" stroke-width="2.1" stroke-linecap="round"/>`;
 return `<g data-part="feet"${tuck?` data-hover-tuck="${lvRound(tuck)}"`:''}>${foot(99,step*5)}${foot(118,-step*5)}</g>`;
}
const lvBirdTransform=m=>`translate(${lvRound(m.x)} ${lvRound(m.y)}) rotate(${lvRound(m.angle)}) scale(${lvRound(m.scale*(m.mirror?-1:1))} ${lvRound(m.scale*m.squash)}) translate(-108 -188)`;
function lvBird(s,m,prefix){
 const headState={...s,frame:m.mirror?'left':m.face};
 const down=s.frame==='sleep'?10:s.frame==='preen'?8:0;
 // Foot anchors stay fixed. The chest leans and the neck is occluded as the head approaches the camera.
 const body=`<g transform="rotate(${m.bodyLean} 109 177)"><path d="M122 156L139 171L131 172L137 175L122 174L113 163Z" fill="#546b7a"/><path d="M87 137Q97 127 115 133Q131 137 132 152Q134 170 117 175Q100 178 89 165Q82 154 87 137Z" fill="#97a5ac"/><path d="M89 141Q98 134 105 137Q96 147 96 158Q97 170 109 175Q96 171 89 162Q84 152 89 141Z" fill="#b1bcc0"/><path d="M117 135Q132 140 132 154Q134 171 117 175L110 172Q119 161 117 135Z" fill="#738895"/></g>`;
 const peck=s.mapPeck?` data-map-peck="${s.mapPeck.peck}" data-map-peck-amount="${lvRound(s.mapPeck.amount)}"`:'';
 /* 192 px:n PNG piirretään 96 px:n nimelliskokoa suurempana, jotta
  * läpinäkyvä visiiri ympäröi koko pään mutta ei peitä nokkaa tai silmiä.
  * Asuste on samassa pään muunnoksessa: nyökkäys, kallistus ja ilme
  * pysyvät yhtenä paperinukkena. */
 const kypara=s.astronautti?`<image data-part="astronautti-kypara" href="${LIVIAN_ASTRONAUTTI_KYPARA}" x="-7" y="-10" width="126" height="126" preserveAspectRatio="xMidYMid meet"/>`:'';
 const head=`<g data-part="approach"${peck} transform="translate(${-8*m.lean} ${8*m.lean+down+m.headY}) rotate(${m.headAngle} 105 146) translate(105 146) scale(${lvRound(m.headScale)}) translate(-105 -146)"><g transform="translate(44 61) scale(1 .87)">${livianSvgPaa(headState,{prefix,lean:m.lean,strength:m.strength})}${kypara}</g></g>`;
 const dashPart=s.flight?.kind==='chatDashOut'||s.flight?.kind==='chatDashBack'?` data-part-chat-dash="${s.flight.kind}"`:'';
 const hoverPart=m.mapHover?` data-map-hover="${lvRound(m.mapHover.height)}"`:'';
 const wing=side=>m.mapHover?`<g opacity="${lvRound(1-m.mapHover.height)}">${lvWing('fold',side,0)}</g><g opacity="${lvRound(m.mapHover.height)}">${lvWing(m.wing,side,m.wingAmount,m.p*12)}</g>`:lvWing(m.wing,side,m.wingAmount,m.p*12);
 return `<g data-part="whole-bird"${dashPart}${hoverPart} transform="${lvBirdTransform(m)}">
 ${lvFeet(m,s)}${wing('far')}${body}${head}${wing('near')}
 </g>`;
}
function lvChatDashFx(s,m){
 if(s.flight?.kind!=='chatDashOut'||s.p<=.1||s.p>=1)return '';
 const opacity=lvClamp((s.p-.1)/.15)*(1-lvEase((s.p-.72)/.28));
 if(opacity<=0)return '';
 return `<g data-part="chat-speed-cloud" transform="translate(128 302)" opacity="${lvRound(opacity)}" fill="none" stroke="#a5a79f" stroke-linecap="round"><path d="M-21-31q-18-6-21 6q-16 1-13 13q-12 7 1 15q10 8 23 1q13 7 23-1q10-8-1-15q3-12-12-13q-2-6-10-7" fill="#dedbcf" fill-opacity=".72" stroke-width="1.4"/><path data-part="chat-dash-streak" d="M-62-20h27M-72-7h35M-59 7h25" stroke="#929b9b" stroke-width="2"/></g>`;
}
function lvChatDustFx(s){
 if(s.ele!=='chatDustOff'||s.p<=.08||s.p>=.92)return '';
 const opacity=lvEase((s.p-.08)/.14)*(1-lvEase((s.p-.72)/.20));
 const spread=lvRound(8+24*lvEase((s.p-.08)/.70));
 return `<g data-part="chat-dust" transform="translate(128 302)" opacity="${lvRound(opacity)}" fill="#c8c1b0"><circle cx="${-28-spread}" cy="-34" r="3.2"/><circle cx="${25+spread}" cy="-45" r="2.4"/><circle cx="${-18-spread*.6}" cy="-68" r="1.8"/><path data-part="chat-dust-speck" d="M${31+spread*.7}-67l3-2m-${65+spread*1.4} 12l-3-2" fill="none" stroke="#a9a18e" stroke-width="1.5" stroke-linecap="round"/></g>`;
}
function lvProps(s,m,prefix){
 let out='';const x=m.x,y=m.y;
 if(m.id==='bunFeast'&&s.feast?.phase==='bite'){
  const grab=lvClamp(s.feast.grab),bites=Math.max(0,Math.min(3,s.feast.bites||0));
  const bx=76+23*grab,by=286-35*grab,scale=1-bites*.105;
  // Jokainen puraisu etenee sisäänpäin, ei jo syödyn reunan ulkopuolelle.
  let cuts='';for(const[cx,cy]of[[16,-6],[12,5],[5,-4]].slice(0,bites))cuts+=`<circle cx="${cx}" cy="${cy}" r="7" fill="black"/>`;
  out+=`<g data-part="bun-feast" data-bites="${bites}" transform="translate(${lvRound(bx)} ${lvRound(by)}) scale(${lvRound(scale)})"><defs><mask id="${prefix}bun-bites"><rect x="-20" y="-22" width="52" height="44" fill="white"/>${cuts}</mask></defs><g mask="url(#${prefix}bun-bites)"><ellipse cx="0" cy="0" rx="19" ry="13" fill="#d59a50"/><path d="M-16 2Q-13-12 0-10Q14-13 17 2Q13 13 0 12Q-14 13-16 2Z" fill="#e7bd76"/><path d="M-10-2Q-7-9 0-6Q7-10 11-2M-8 5Q0 9 9 4" fill="none" stroke="#b8783e" stroke-width="2" stroke-linecap="round"/></g></g>`;
  if(bites>0){const burst=lvClamp(1-Math.abs((s.p-[.34,.48,.62][bites-1])/.035));for(let i=0;i<3;i++)out+=`<path data-part="bun-crumb" d="M${lvRound(91+i*7)} ${lvRound(250+Math.sin(i*2.1)*4+burst*8)}l3 1-1 3-3-1Z" fill="#c18b48" opacity="${lvRound(burst)}"/>`;}
 }
 if(s.side?.kind==='bread'){
  const bx=s.propsRight?x+12:x-80+(s.side.x||0)*2,by=y-50+(s.side.y||0)*1.5;
  out+=`<g transform="translate(${bx} ${by}) scale(${s.propsRight?.62:1})"><defs><mask id="${prefix}bite"><rect x="-8" y="-25" width="60" height="60" fill="white"/>${s.side.bite?'<circle cx="35" cy="-11" r="7" fill="black"/><circle cx="41" cy="0" r="7" fill="black"/>':''}</mask></defs><g mask="url(#${prefix}bite)"><path d="M0 9C-3-4 4-14 18-14C32-16 41-7 40 7Q38 21 20 20Q2 22 0 9Z" fill="#c18b48"/><ellipse cx="20" cy="1" rx="18" ry="13" fill="#e0b875"/><path d="M11 4C9-9 34-8 32 5C30 15 15 15 15 5C15 0 25-1 25 5" fill="none" stroke="#ab743f" stroke-width="2.5" stroke-linecap="round"/></g></g>`;
 }
 if(s.crumbY!==null&&s.crumbY!==undefined)out+=`<path d="M${x-34} ${y-36+(s.crumbY-35)*4}l4 1-2 4-3-1Z" fill="#c18b48"/>`;
 if(s.side?.kind==='pfft')out+=`<path d="M${x-47} ${y-46}q-16-10-22-4m20 8q-15 2-23 12" fill="none" stroke="#9b9c91" stroke-width="1.6" stroke-linecap="round"/>`;
 const fy=y-108,phase=s.phase||0;
 if((m.id==='reading'&&m.gate>.1)||m.id==='bookStudy')out+=`<g data-part="book" transform="translate(${x-66} ${y-33}) rotate(${-12+(s.pageTurn||0)*3})"><path d="M0 0L18 2L33-2L35 21L18 24L1 20Z" fill="#daceaf"/><path d="M18 2v22m-13-17l9 1m-9 4l9 1m8-6l7-2m-7 8l8-2" stroke="#9a8c73" stroke-width="1"/>${s.pageTurn?`<path d="M18 2q${9*s.pageTurn} 9 0 22" fill="none" stroke="#b8aa8e" stroke-width="1"/>`:''}</g>`;
 if(s.fx==='hearts')for(let i=0;i<2;i++)out+=`<path transform="translate(${x-42+i*38} ${fy-(phase+i)%3*5}) scale(.7)" d="M0 10C-20-2-9-17 0-7C9-17 20-2 0 10Z" fill="#a97078"/>`;
 if(s.fx==='stars'||s.flight?.kind==='splat')for(let i=0;i<3;i++)out+=`<path d="M${x-36+i*29} ${fy-5+i%2*9}l3 5 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1Z" fill="#bca362"/>`;
 if(['dots','question','z'].includes(s.fx))out+=`<text x="${x-20}" y="${fy-4}" font-family="Georgia,serif" font-size="${s.fx==='z'?16:22}" fill="#657780">${s.fx==='dots'?'.'.repeat(phase%3+1):s.fx==='question'?'?':s.fx==='z'?'z Z':'♯'}</text>`;
 if(s.fx==='anger')out+=`<path d="M${x-31} ${fy-11}q8 0 8-8m5 8q0-8 8-8m-21 13q8 0 8 8m5-8q0 8 8 8" fill="none" stroke="#967368" stroke-width="2.5" stroke-linecap="round"/>`;
 if(s.fx==='wind')out+=`<path d="M${x-105} ${y-86}q40-15 65 0m-77 14q24-5 45 0m-24 15q24-5 42 0" fill="none" stroke="#a5b1b5" stroke-width="1.5"/>`;
 if(s.fx==='sun')out+=`<g stroke="#c2a35a" stroke-width="1.5"><circle cx="${x-57}" cy="${fy-7}" r="10" fill="#e2c877"/><path d="M${x-57} ${fy-24}v-5m0 34v5m-17-17h-5m34 0h5"/></g>`;
 if(s.fx==='rain'||s.fx==='snow'){
  out+=`<path d="M${x-68} ${fy-22}q-5-14 9-15q10-17 22-2q20-5 21 17Z" fill="#a4b0b6"/>`;
  for(let i=0;i<6;i++){const px=x-68+i*9,py=fy-9+((phase*5+i*17)%47);out+=s.fx==='rain'?`<path d="M${px} ${py}l-3 7" stroke="#7a9aa9" stroke-width="1.5"/>`:`<path d="M${px-3} ${py}h6m-3-3v6" stroke="#cad5d8" stroke-width="1.5"/>`;}
 }
 return out;
}
export function livianSvgKuva(s,{right=0,prefix='livia'}={}) {
 right=Math.max(0,Number.isFinite(right)?right:0);prefix=prefix.replace(/[^a-zA-Z0-9_-]/g,'');
 const m=livianSvgMalli(s,{right}),width=152+right;
 // The contact shadow belongs to the ground, not to the leaning or flying body.
 const groundY=m.mapHover?.groundY??m.y,contact=m.visible&&!s.flight&&!s.line&&groundY<=304?lvClamp((groundY-290)/12):0;
 const hoverHeight=m.mapHover?.height||0,shadowOpacity=contact*(1-.65*hoverHeight),shadowRx=19*(1-.45*hoverHeight);
 const shadow=contact?`<defs><radialGradient id="${prefix}ground"><stop stop-color="#635b4e" stop-opacity=".58"/><stop offset=".55" stop-color="#635b4e" stop-opacity=".32"/><stop offset="1" stop-color="#635b4e" stop-opacity="0"/></radialGradient></defs><ellipse data-part="ground-shadow" cx="${lvRound(m.x)}" cy="301" rx="${lvRound(shadowRx)}" ry="2.8" fill="url(#${prefix}ground)" opacity="${lvRound(shadowOpacity)}"/>`:'';
 let markup=(m.visible?shadow+lvBird(s,m,prefix)+lvProps(s,m,prefix):'')+lvChatDashFx(s,m)+lvChatDustFx(s);
 if(s.owlX!==null&&s.owlX!==undefined){const ox=128+(right+80)*s.owlX/24;markup+=`<g transform="translate(${ox-14} 267)" fill="#73654f"><path d="M0 3L4-3L11 2L20-3L23 3V23Q12 35 0 23Z"/><circle cx="7" cy="10" r="5" fill="#e8ddc4"/><circle cx="17" cy="10" r="5" fill="#e8ddc4"/><circle cx="7" cy="10" r="2"/><circle cx="17" cy="10" r="2"/><path d="M9 15h6l-3 5Z" fill="#e8ddc4"/></g>`;}
 if(s.line)markup+=`<path d="M94 303H${Math.min(width,152)}" stroke="#988d79" stroke-width="1.3" stroke-linecap="round"/>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 304" width="${width}" height="304" overflow="${s.flight?.kind==='opening'?'visible':'hidden'}" aria-hidden="true" data-livia-visible="${m.visible}">${markup}</svg>`;
}
let lvSerial=0;
/*
 * LEIJUNTA PAIKATAAN, EI RAKENNETA (kartan sulavuus, Pelikoodari
 * 22.9.2026). Kartan liikkuessa Pulu leijuu (mapHover), ja `paint`
 * rakensi koko SVG:n innerHTML:llä 30 kertaa sekunnissa: jäsennys +
 * tyylit + asettelu + maalaus pääsäikeellä juuri zoomin aikana.
 * Mitattu (tools/savukkeet/mittaa-zoomipiirto.mjs, Chromium CPU 4×,
 * Ranska z6 zoomi): kerrokset ilman pulua p95 51 ms, pulun kanssa 74 ms;
 * pitkien kehysten selaimen oma aika 155 → 1 554 ms. Oikealla iPhonella
 * sama ero näkyi portaiden 5 ja 6 välissä (p95 18 → 50).
 * Kun vain leijunnan vaihe muuttuu (muu asento sama), päivitetään linnun
 * ja siipien transform-attribuutit paikalleen; koko kuva rakennetaan
 * vasta, kun asento oikeasti vaihtuu.
 *
 * MYÖS NOUSU JA LASKU PAIKATAAN (sulavuuskatsaus 22.9.2026 kohta 17):
 * korkeuden ramppi 0 → 1 (260 ms) ja 1 → 0 (280 ms) rakensi koko kuvan
 * JOKA KEHYS liikkeen alussa ja lopussa (~16 + 17 innerHTML-jäsennystä
 * juuri silloin, kun ele alkaa). Korkeus kuuluu avaimeen PORRASTETTUNA
 * (LV_LEIJUNNAN_PORTAAT askelta): jalkojen veto, siipien ristihäive ja
 * varjo päivittyvät portaittain (~43 ms välein, ei erotu), ja linnun
 * nousu sekä siipien vaihe paikataan joka kehys transformiin.
 */
const LV_LEIJUNNAN_PORTAAT=6;
const lvLeijuVanha=()=>{try{return new URLSearchParams(globalThis.location?.search??'').get('koe')?.split(',').includes('leijuvanha')??false;}catch{return false;}};
const lvLeijuntaAvain=s=>{try{const h=s.mapHover?.height;return JSON.stringify({...s,mapHover:Number.isFinite(h)?Math.round(h*LV_LEIJUNNAN_PORTAAT)/LV_LEIJUNNAN_PORTAAT:null});}catch{return null;}};
export function luoLivianSvg(element) {
 let right=0;const prefix='livia'+(++lvSerial);
 let viimeAvain=null,osat=null;
 function resize(extra=0){right=Math.max(0,extra);element.style.width=`${152+right}px`;element.style.height='304px';viimeAvain=null;}
 function paint(s){element.innerHTML=livianSvgKuva(s,{right,prefix});viimeAvain=lvLeijuntaAvain(s);osat=null;}
 /* Vaihe-eron paikkaus: true, kun kuva päivitettiin ilman rakennusta. */
 function paikkaa(s){
  if(!(s?.mapHover?.height>0)||!element.querySelector)return false;
  // Mittauslippu `?koe=leijuvanha`: vanha tapa (koko kuva joka kehys) vertailuksi.
  if(lvLeijuVanha())return false;
  const avain=lvLeijuntaAvain(s);
  if(avain==null||avain!==viimeAvain)return false;
  if(!osat){
   const lintu=element.querySelector('[data-part="whole-bird"]');
   const near=element.querySelector('[data-part="near-wing"]'),far=element.querySelector('[data-part="far-wing"]');
   if(!lintu||!near||!far)return false;
   osat={lintu,near,far};
  }
  const m=livianSvgMalli(s,{right});
  osat.lintu.setAttribute('transform',lvBirdTransform(m));
  osat.near.setAttribute('transform',livianLeijuntaSiipi('near',s.mapHover.phase));
  osat.far.setAttribute('transform',livianLeijuntaSiipi('far',s.mapHover.phase));
  return true;
 }
 resize();paint(livianSvgAsento('blink',0));return {resize,paint,paikkaa};
}
