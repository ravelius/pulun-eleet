/* Livian lähikasvot: alkuperäinen kokonaispikseleillä piirretty pelihahmo.
 * 44 × 44 aktiivikasvo, 24 × 24 lepo. Liikeradat omassa loogisessa ruudukossa.
 * Omistajan 9.9.2026 hyväksymä pikselisuunta; ei kuvatiedostoja. */
import { LIVIA_HOYHEN_PALETTI, livianHoyhenkasvo, livianPieniHoyhenkasvo } from './livia-hoyhenet.js';
// Kokonaispikseleitä: yksi liikeradan yksikkö = kaksi piirron pikseliä.
export const LIVIA_PIX_W=38, LIVIA_PIX_H=44, LIVIA_PIX_LEFT=16;
const lpWIDTH=22, lpHEIGHT=LIVIA_PIX_H, lpLEFT=LIVIA_PIX_LEFT;
export const LIVIA_PIX_PALETTI=LIVIA_HOYHEN_PALETTI;
export const LIVIA_PIX_TARKKUUS=2;
const lpK=1,lpW=2,lpG=3;
const lpgrid=(height=22,width=lpWIDTH)=>Array.from({length:height},()=>Array(width).fill(0));
function lpdot(g,x,y,c=lpK){if(y>=0&&y<g.length&&x>=0&&x<g[y].length)g[y][x]=c;}
function lprect(g,x,y,w,h,c=lpK){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)lpdot(g,i,j,c);}
function lpline(g,x,y,ex,ey,c=lpK){let dx=Math.abs(ex-x),sx=x<ex?1:-1,dy=-Math.abs(ey-y),sy=y<ey?1:-1,err=dx+dy;for(;;){lpdot(g,x,y,c);if(x===ex&&y===ey)break;let e=2*err;if(e>=dy){err+=dy;x+=sx;}if(e<=dx){err+=dx;y+=sy;}}}
function lppolygon(g,pts,c){for(let y=0;y<g.length;y++)for(let x=0;x<g[y].length;x++){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if((a[1]>y+.5)!==(b[1]>y+.5)&&(x+.5)<(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0])inside=!inside;}if(inside)lpdot(g,x,y,c);}}
const lpNames=['rest','blink','glance','crumb','chew','fluster','caught','shock','eyes','front','left','right','angry','embarrassed','bored','sleep','manic','disbelief','happy','smug','confused','love','up','down','puff','yawn','talk','talkSmall','chewManic','preen','cover','wing'];
export const LIVIA_PIX_RUUDUT=Object.freeze(Object.fromEntries(lpNames.map(name=>[name,livianHoyhenkasvo(name)])));
const lprest=LIVIA_PIX_RUUDUT.rest;

// Kesto sisältää tauot. Vain suuntakohtaiset tulo-/poistumisklipit eivät pääty lepoon.
export const LIVIA_PIX_ELEET=Object.freeze([
 ['blink','Rauhallinen kaksoisräpäytys',1600,'Pieni ele'],['glance','Sivusilmäys',2300,'Pieni ele'],
 ['turn','Pään kääntö',3000,'Pää'],['lookRight','Katse oikealle',2200,'Pää'],['lookUp','Katse ylös',2400,'Pää'],['lookDown','Katse alas',2200,'Pää'],['tilt','Mitä ihmettä?',2400,'Pää'],['nod','Kyllä kyllä',1800,'Pää'],['shake','Ei todellakaan',2100,'Pää'],['doubleTake','Hetkinen!',2600,'Pää'],
 ['shock','Kääk!',2400,'Ilme'],['embarrassed','Nolostuminen',3200,'Ilme'],['angry','Tuohtuminen',2800,'Ilme'],['bored','Kyllästyminen',3600,'Ilme'],['puff','Pieruposket',3100,'Ilme'],['manic','Maaninen pullan tuijotus',3300,'Ilme'],['expert','Arvokas tietäjä',3200,'Ilme'],['disbelief','Ei voi olla',3300,'Ilme'],['confused','Häh?',2800,'Ilme'],['happy','Vahingonilo',2500,'Ilme'],['love','Ihastus',3800,'Ilme'],['facepalm','Voi minua',3000,'Ilme'],
 ['talk','Puhe',1500,'Puhe'],['listen','Kuuntelen',2600,'Puhe'],['think','Ajatus jumissa',3400,'Puhe'],['reading','Pienellä painettu',3200,'Puhe'],
 ['crumb','En minä syönyt',3800,'Touhu'],['bread','Pulla voittaa',4100,'Touhu'],['preen','Sulkapuku kuntoon',3600,'Touhu'],['yawn','Haukotus',3000,'Touhu'],['sleep','Nukahdus',5400,'Touhu'],['wake','Enhän minä nukkunut',2200,'Touhu'],['sneeze','Aivastus',2100,'Touhu'],['wind','Vastatuuli',2900,'Touhu'],['rain','Siipi sateensuojana',3500,'Touhu'],['sun','Liian kirkasta',3000,'Touhu'],['snow','Lumi nokalla',3600,'Touhu'],
 ['flyAway','Lento kaukaisuuteen',3100,'Liike'],['flyBack','Taivaalta takaisin',3400,'Liike'],['clumsyLand','Kömpelö lasku',2700,'Liike'],['glassCrash','Liian kovaa lasiin',4200,'Liike'],['walkRight','Astelen oikealle',2200,'Liike'],['walkBack','Astelen takaisin',2200,'Liike'],
 ['peek','Viivan alta kurkistus',3300,'Liike'],['owl','Käyn pöllöllä',4400,'Liike'],['arrive','Saapuminen oikealta',1900,'Liike'],['crash','Rymistellen paikalle',2600,'Liike'],['emerge','Ylös viivan alta',1700,'Liike'],['leaveRight','Oikealle pois',1100,'Liike'],['leaveDown','Alas piiloon',1100,'Liike'],['handoff','Pöllön sijainen',4700,'Liike'],
].map(([id,label,duration,group])=>Object.freeze({id,label,duration,group})));
const lpStep=(p,stops)=>{let result=stops[0][1];for(const[at,value]of stops){if(p<at)break;result=value;}return result;};
const lpRamp=(p,a,b,from,to)=>Math.round(from+(to-from)*Math.max(0,Math.min(1,(p-a)/(b-a))));
const lpPulse=(p,n=8)=>Math.floor(p*n)%2;
export function livianPikseliAsento(id,p=0) {
 p=Math.max(0,Math.min(1,p));const s={frame:'rest',x:0,y:0,line:false,crumbY:null,eyesAhead:false,tilt:0,fx:null,phase:p===1?0:Math.floor(p*12),owlX:null,side:null,flight:null,walk:null};
 const tulot=['arrive','crash','emerge','handoff','flyBack','clumsyLand','glassCrash','walkBack'],poistumiset=['leaveRight','leaveDown','flyAway','walkRight'];
 if(p===0&&!tulot.includes(id)||p===1&&!poistumiset.includes(id))return s;
 const seq=(stops)=>{s.frame=lpStep(p,[[0,'rest'],...stops,[.94,'rest']]);};
 if(id==='blink')seq([[.28,'blink'],[.36,'rest'],[.52,'blink'],[.59,'rest']]);
 if(id==='glance')seq([[.15,'glance'],[.67,'blink'],[.74,'rest']]);
 if(id==='turn')seq([[.12,'front'],[.25,'left'],[.51,'front'],[.67,'right'],[.81,'front']]);
 if(id==='lookRight')seq([[.13,'front'],[.26,'right'],[.70,'front']]);
 if(id==='lookUp'||id==='lookDown'){seq([[.18,id==='lookUp'?'up':'down'],[.78,'blink']]);s.y=p>.18&&p<.78?(id==='lookUp'?-2:1):0;}
 if(id==='tilt'){seq([[.15,'confused'],[.76,'blink']]);s.tilt=p>.24&&p<.65?1:0;}
 if(id==='nod'){seq([[.1,'front'],[.86,'rest']]);if(p>.18&&p<.76)s.y=lpPulse(p,12)?2:0;}
 if(id==='shake'){seq([[.13,'front'],[.23,'left'],[.35,'right'],[.47,'left'],[.59,'right'],[.72,'front']]);}
 if(id==='doubleTake')seq([[.1,'right'],[.27,'rest'],[.34,'front'],[.42,'shock'],[.67,'disbelief']]);
 if(id==='shock'){seq([[.12,'blink'],[.23,'shock'],[.66,'fluster'],[.84,'rest']]);if(p>=.23&&p<.38)s.y=-1;}
 if(id==='embarrassed'){seq([[.12,'embarrassed'],[.50,'down'],[.62,'embarrassed']]);if(p>.2&&p<.8)s.y=1;}
 if(id==='angry'){seq([[.1,'angry'],[.77,'blink'],[.85,'angry']]);if(p>.25&&p<.60){s.y=-lpPulse(p,15);s.fx='anger';}}
 if(id==='bored')seq([[.12,'bored'],[.42,'glance'],[.57,'bored'],[.80,'blink']]);
 if(id==='puff'){seq([[.12,'puff'],[.65,'talk'],[.72,'fluster'],[.85,'rest']]);if(p>.25&&p<.64)s.y=-lpPulse(p,15);if(p>=.65&&p<.80)s.side={kind:'pfft'};}
 if(id==='manic'){seq([[.12,'manic'],[.82,'caught']]);if(p>.2&&p<.8){s.y=-lpPulse(p,20);s.side={kind:'bread',y:0,bite:false};}}
 if(id==='expert'){seq([[.13,'smug'],[.54,'front'],[.68,'smug']]);if(p>.2&&p<.82)s.y=-2;}
 if(id==='disbelief')seq([[.13,'disbelief'],[.51,'blink'],[.57,'disbelief'],[.8,'front']]);
 if(id==='confused'){seq([[.15,'confused'],[.79,'blink']]);if(p>.3&&p<.7){s.tilt=1;s.fx='question';}}
 if(id==='happy'){seq([[.12,'happy'],[.45,'chew'],[.53,'happy'],[.7,'smug']]);if(p>.3&&p<.6)s.y=-lpPulse(p,14);}
 if(id==='love'){seq([[.12,'love'],[.78,'embarrassed']]);if(p>.16&&p<.79){s.fx='hearts';s.y=-1;}}
 if(id==='facepalm')seq([[.12,'embarrassed'],[.32,'cover'],[.74,'embarrassed']]);
 if(id==='talk')s.frame=lpStep(p,[[0,'rest'],[.08,'talk'],[.17,'talkSmall'],[.26,'rest'],[.35,'talk'],[.47,'talkSmall'],[.57,'talk'],[.68,'blink'],[.76,'talkSmall'],[.86,'talk'],[.95,'rest']]);
 if(id==='listen'){seq([[.15,'front'],[.36,'glance'],[.68,'front']]);s.tilt=p>.36&&p<.68?-1:0;}
 if(id==='think'){seq([[.13,'up'],[.40,'confused'],[.63,'up'],[.82,'smug']]);if(p>.22&&p<.75)s.fx='dots';}
 if(id==='reading'){seq([[.13,'down'],[.3,'glance'],[.47,'down'],[.63,'confused'],[.83,'blink']]);s.y=p>.13&&p<.80?2:0;}
 if(id==='crumb'||id==='bread'){
  seq([[.08,id==='bread'?'manic':'crumb'],[.22,'chew'],[.31,'crumb'],[.39,id==='bread'?'chewManic':'chew'],[.46,'caught'],[.63,'blink'],[.69,'caught'],[.74,'fluster'],[.86,'rest']]);
  if(p>=.63&&p<.69)s.y=-lpPulse(p,60);if(p>=.74&&p<.87)s.crumbY=lpRamp(p,.74,.87,35,44);if(id==='bread'&&p>.08&&p<.74){s.side={kind:'bread',x:p<.3?lpRamp(p,.16,.3,0,6):lpRamp(p,.4,.5,6,0),y:p<.22?lpRamp(p,.08,.22,17,0):p>.46?lpRamp(p,.46,.74,0,18):0,bite:p>=.22};}
 }
 if(id==='preen')seq([[.1,'down'],[.23,'preen'],[.36,'down'],[.46,'preen'],[.62,'preen'],[.78,'smug']]);
 if(id==='yawn')seq([[.12,'bored'],[.32,'yawn'],[.71,'sleep'],[.86,'blink']]);
 if(id==='sleep'){seq([[.1,'bored'],[.24,'blink'],[.34,'bored'],[.45,'sleep'],[.86,'fluster']]);if(p>.45&&p<.86){s.y=3;s.tilt=1;s.fx='z';}}
 if(id==='wake'){seq([[.0,'sleep'],[.20,'shock'],[.40,'front'],[.56,'smug']]);if(p>.2&&p<.4)s.y=-2;}
 if(id==='sneeze'){seq([[.12,'up'],[.32,'confused'],[.46,'yawn'],[.57,'blink'],[.71,'fluster']]);if(p>.46&&p<.57){s.y=-2;s.side={kind:'pfft'};}}
 if(id==='wind'){seq([[.1,'glance'],[.25,'blink'],[.68,'fluster']]);if(p>.2&&p<.75){s.tilt=1;s.x=lpPulse(p,15);s.fx='wind';}}
 if(id==='rain'){seq([[.1,'up'],[.33,'wing'],[.78,'angry']]);if(p>.15&&p<.8)s.fx='rain';}
 if(id==='sun'){seq([[.12,'up'],[.3,'blink'],[.50,'wing'],[.78,'bored']]);if(p>.14&&p<.8)s.fx='sun';}
 if(id==='snow'){seq([[.12,'up'],[.42,'disbelief'],[.68,'blink'],[.8,'fluster']]);if(p>.14&&p<.8)s.fx='snow';}
 if(id==='peek'){
  s.line=p>=.1&&p<.94;if(p<.28)s.y=lpRamp(p,.13,.28,0,24);else if(p<.42)s.y=24;
  else if(p<.52)s.y=lpRamp(p,.42,.52,24,10);else if(p<.68){s.y=10;s.frame='glance';}else if(p<.77)s.y=lpRamp(p,.68,.77,10,24);else s.y=lpRamp(p,.79,.92,24,0);
 }
 if(id==='owl'){
  if(p<.28){s.x=lpRamp(p,.12,.28,0,24);s.frame=p>.12?'right':'rest';}
  else if(p<.55)s.x=24;else if(p<.69){s.frame='eyes';s.x=lpRamp(p,.55,.65,24,0);}
  else if(p<.79){s.frame='fluster';s.x=lpRamp(p,.69,.79,22,0);s.eyesAhead=true;}
  else{seq([[.79,'fluster'],[.84,'blink'],[.89,'rest']]);s.y=p<.84?-1:0;}
 }
 if(id==='arrive'){s.x=lpRamp(p,.08,.54,24,0);seq([[0,'left'],[.56,'front'],[.76,'smug']]);}
 if(id==='crash'){s.x=lpRamp(p,.05,.29,24,0);seq([[0,'shock'],[.36,'fluster'],[.62,'front'],[.77,'smug']]);if(p>.29&&p<.55){s.y=lpPulse(p,20)?-3:1;s.fx='stars';}}
 if(id==='emerge'){s.line=true;s.y=lpRamp(p,.08,.57,24,0);seq([[0,'glance'],[.65,'smug']]);}
 if(id==='leaveRight'){s.frame='right';s.x=lpRamp(p,.15,.85,0,24);}
 if(id==='leaveDown'){s.frame='down';s.line=true;s.y=lpRamp(p,.15,.85,0,24);}
 if(id==='handoff'){
  s.line=true;s.owlX=lpRamp(p,.17,.37,0,24);s.y=p<.39?24:lpRamp(p,.40,.66,24,0);
  s.frame=lpStep(p,[[0,'wing'],[.43,'glance'],[.68,'shock'],[.77,'smug']]);if(p>.39)s.owlX=null;
 }
 if(id==='flyAway'){
  if(p<.16){s.frame='down';s.y=lpRamp(p,.02,.14,0,3);}
  else s.flight={kind:'away',t:Math.min(1,(p-.16)/.74)};
 }
 if(id==='flyBack'||id==='clumsyLand'){
  const end=id==='clumsyLand'?.40:.58;
  if(p<end)s.flight={kind:'back',t:p/end,near:id==='clumsyLand'};
  else{const t=(p-end)/(1-end);s.frame=t<.20?'shock':t<.65?'fluster':'smug';s.y=lpStep(t,[[0,-9],[.10,3],[.22,-3],[.36,1],[.5,0]]);s.tilt=t>.22&&t<.5?1:0;if(t>.10&&t<.36)s.fx='stars';}
 }
 if(id==='glassCrash'){
  if(p<.37)s.flight={kind:'glass',t:p/.37};
  else if(p<.71)s.flight={kind:'splat',t:(p-.37)/.34};
  else{s.line=true;s.frame=p<.85?'fluster':'embarrassed';s.y=lpRamp(p,.75,.90,25,0);}
 }
 if(id==='walkRight'||id==='leaveRight'){s.walk={direction:1,t:lpRamp(p,.08,.94,0,100)/100};s.frame='right';s.x=0;s.y=lpPulse(p,14);}
 if(id==='walkBack'){s.walk={direction:-1,t:lpRamp(p,.02,.83,0,100)/100};s.frame='left';s.x=0;s.y=lpPulse(p,14);}
 return s;
}
function lpKoriste(g,fx,phase) {
 const heart=(x,y)=>{lprect(g,x,y,2,2);lprect(g,x+3,y,2,2);lprect(g,x,y+2,5,1);lprect(g,x+1,y+3,3,1);lpdot(g,x+2,y+4);};
 if(fx==='hearts'){heart(3,11-phase%3);heart(14,3+phase%3);}
 if(fx==='bread'){lprect(g,8,5,8,5,lpG);lpline(g,9,4,14,4);lpline(g,7,6,7,9);lpline(g,16,6,16,9);lpline(g,8,10,15,10);lpdot(g,10,6,lpW);lpdot(g,13,7,lpW);}
 if(fx==='anger'){lpline(g,12,7,15,10);lpline(g,16,7,13,10);lpline(g,17,11,20,14);lpline(g,20,11,17,14);}
 if(fx==='question'){lpline(g,10,6,14,6);lpdot(g,9,7);lpline(g,15,7,15,9);lpline(g,14,10,12,11);lpdot(g,12,12);lpdot(g,12,15);}
 if(fx==='dots')for(let i=0;i<3;i++)if(i<=phase%4)lprect(g,6+i*5,12,2,2);
 if(fx==='z'){lpline(g,11,6,16,6);lpline(g,16,7,11,11);lpline(g,11,12,16,12);if(phase%2)lpdot(g,18,3);}
 if(fx==='pfft'||fx==='wind'){for(let i=0;i<3;i++)lpline(g,12+i,8+i*4,19,8+i*4,lpG);}
 if(fx==='stars'){for(const[x,y]of[[5,9],[16,6]]){lpline(g,x-2,y,x+2,y);lpline(g,x,y-2,x,y+2);}}
 if(fx==='rain'){lprect(g,5,4,13,3,lpG);lprect(g,8,2,6,3,lpG);for(let i=0;i<3;i++)lpline(g,6+i*5,10+(phase+i)%4,5+i*5,12+(phase+i)%4);}
 if(fx==='sun'){lprect(g,12,5,5,5,lpW);lpline(g,12,4,16,4);lpline(g,12,10,16,10);lpline(g,11,5,11,9);lpline(g,17,5,17,9);lpdot(g,14,1);lpdot(g,14,13);lpdot(g,8,7);lpdot(g,20,7);}
 if(fx==='snow')for(const[x,y]of[[5,6],[14,11],[18,3]]){const yy=y+phase%5;lpdot(g,x,yy,lpW);lpdot(g,x-1,yy,lpG);lpdot(g,x+1,yy,lpG);lpdot(g,x,yy-1,lpG);lpdot(g,x,yy+1,lpG);}
}
export function livianPikselit(s) {
 const out=lpgrid(lpHEIGHT,LIVIA_PIX_W),head=lpgrid(lpHEIGHT);
 if(s.eyesAhead)lpStamp(head,LIVIA_PIX_RUUDUT.eyes,0,21,22,22);
 if(s.owlX!==null&&s.owlX!==undefined){const x=s.owlX;lprect(head,x+4,29,14,12,lpG);lprect(head,x+5,31,5,5,lpW);lprect(head,x+12,31,5,5,lpW);lpdot(head,x+7,33);lpdot(head,x+14,33);lpline(head,x+4,28,x+7,30);lpline(head,x+17,28,x+14,30);lpdot(head,x+10,37);lpdot(head,x+11,38);}
 if(s.line)lprect(head,1,lpHEIGHT-1,21,1,5);
 if(s.crumbY!==null&&s.crumbY!==undefined)lpdot(head,2,s.crumbY,17);
 if(s.fx)lpKoriste(head,s.fx,s.phase||0);
 for(let y=0;y<lpHEIGHT;y++)for(let x=0;x<lpWIDTH;x++)out[y][x+lpLEFT]=head[y][x];
 if(s.side?.kind==='bread'){
  const y=29+s.side.y,dx=s.side.x||0;
  const prop=lpgrid(lpHEIGHT,LIVIA_PIX_W);
  lppolygon(prop,[[4,y+6],[7,y+4],[14,y+6],[20,y+9],[19,y+12],[10,y+10],[4,y+9]],lpG);
  lpline(prop,5,y+9,18,y+12);lpline(prop,11,y+7,17,y+9);
  lppolygon(prop,[[3,y],[5,y-2],[10,y-2],[13,y],[13,y+5],[11,y+7],[4,y+7],[2,y+4]],16);
  lppolygon(prop,[[4,y],[6,y-1],[10,y-1],[12,y+1],[12,y+4],[10,y+6],[5,y+6],[3,y+3]],17);
  lpline(prop,6,y+1,9,y+1,18);lpline(prop,9,y+2,7,y+3,16);
  if(s.side.bite){lprect(prop,10,y-1,4,3,0);lpdot(prop,9,y,0);lpdot(prop,14,y+5,lpK);}
  for(let yy=0;yy<lpHEIGHT;yy++)for(let xx=0;xx<LIVIA_PIX_W;xx++)if(prop[yy][xx])lpdot(out,xx+dx,yy,prop[yy][xx]);
 }
 if(s.side?.kind==='pfft')for(let i=0;i<3;i++)lpline(out,3+i*2,29+i*4,11+i,31+i*3,lpK);

 const detail=lpgrid(lpHEIGHT*2,LIVIA_PIX_W*2),f=livianHoyhenkasvo(s.frame,s.mouth);
 const top=lpHEIGHT*2-f.length+s.y*2-2;
 for(let y=0;y<f.length;y++)for(let x=0;x<f[y].length;x++){
  const yy=y+top;if(s.line&&yy>=lpHEIGHT*2-2)continue;
  const shear=s.tilt?Math.round((y-20)/18)*s.tilt*2:0;
  if(f[y][x])lpdot(detail,x+lpLEFT*2+s.x*2+shear,yy,f[y][x]);
 }
 for(let y=0;y<lpHEIGHT;y++)for(let x=0;x<LIVIA_PIX_W;x++)if(out[y][x])lprect(detail,x*2,y*2,2,2,out[y][x]);
 return detail;
}
// Koko näyttämö ulottuu oikeaan näytönreunaan, ei vain kuvakkeen reunaan.
export const LIVIA_STAGE_H=76;
function lpBird(phase=0){
 const g=lpgrid(18,22);
 lppolygon(g,[[9,6],[13,5],[16,7],[15,12],[11,15],[8,12]],lpG);
 lppolygon(g,[[10,5],[12,3],[15,3],[17,6],[16,8],[12,8]],lpG);
 lprect(g,13,4,3,3,lpW);lpdot(g,14,5);lpline(g,17,6,19,7);
 lppolygon(g,[[8,12],[11,14],[7,17],[6,15]],lpK);
 if(phase%2){lppolygon(g,[[9,9],[1,3],[0,5],[4,11],[10,12]],lpK);lppolygon(g,[[14,9],[21,2],[21,6],[17,12]],lpK);}
 else{lppolygon(g,[[9,9],[2,12],[0,15],[7,14],[10,11]],lpK);lppolygon(g,[[14,9],[21,13],[20,16],[16,13]],lpK);}
 const detail=lpgrid(36,44);
 for(let y=0;y<18;y++)for(let x=0;x<22;x++)if(g[y][x]){
  const c=g[y][x]===lpW?13:g[y][x]===lpK?(x===14&&y===5?14:x<10?5:4):x<13?6:3;
  lprect(detail,x*2,y*2,2,2,c);
 }
 lprect(detail,25,16,4,4,8);lprect(detail,29,17,2,3,11);lpdot(detail,29,10,14);lpdot(detail,28,9,2);lprect(detail,33,11,2,2,2);
 // Siipijuovat kulkevat levitettyjen lentosulkien mukana.
 if(phase%2){lpline(detail,6,12,15,21,4);lpline(detail,35,19,40,10,4);}
 else{lpline(detail,3,29,13,25,4);lpline(detail,34,26,40,29,4);}
 return detail;
}
function lpStamp(out,src,x,y,w,h){
 for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){const c=src[Math.floor(yy*src.length/h)]?.[Math.floor(xx*src[0].length/w)];if(c)lpdot(out,x+xx,y+yy,c);}
}
export function livianNayttamo(s,{right=0,compact=false}={}){
 right=Math.max(0,Math.round(right));const width=LIVIA_PIX_W+right,out=lpgrid(LIVIA_STAGE_H*2,width*2),dy=(LIVIA_STAGE_H-LIVIA_PIX_H)*2;
 if(s.flight){
  const f=s.flight,t=f.t;
  if(f.kind==='away'&&t>=1||f.kind==='back'&&t<=0)return out;
  if(f.kind==='splat'){
   const slip=t<.35?0:Math.round(((t-.35)/.65)**2*70),x=(lpLEFT+1)*2,y=(38+slip)*2;
   lpStamp(out,livianHoyhenkasvo('splat'),x,y,42,30);
   if(t<.23){lpline(out,x-10,y+4,x-4,y+8,5);lpline(out,x-6,y-8,x-2,y-2,5);lpline(out,x+42,y-6,x+46,y-12,5);}
   return out;
  }
  const near=f.kind==='away'?1-t:f.near?.45+t*.55:t;
  const size=near<.1?1:Math.max(3,Math.round(near*44));
  const cx=Math.round(((width-4)*(1-near)+27*near)*2),cy=Math.round((5*(1-near)+63*near)*2);
  if(size===1)lpdot(out,cx,cy,5);
  else if(f.kind==='glass'&&t>.7){const w=Math.round((13+(t-.7)*50)*2);lpStamp(out,LIVIA_PIX_RUUDUT.front,Math.round(cx-w/2),Math.round(cy-w/2)-24,w,w);}
  else lpStamp(out,lpBird(s.phase),Math.round(cx-size/2),cy-Math.round(size*.4),size,Math.max(2,Math.round(size*.82)));
  return out;
 }
 const base=livianPikselit(s);
 if(s.walk){
  const t=s.walk.direction===1?s.walk.t:1-s.walk.t,shift=Math.round((right+24)*t)*2;
  for(let y=0;y<base.length;y++)for(let x=0;x<base[y].length;x++)if(base[y][x])lpdot(out,x+shift,y+dy-6,base[y][x]);
  for(const [x,y]of [[26,74-s.phase%2],[33,73+s.phase%2]]){lpline(out,x*2+shift,(y-2)*2,x*2+shift,y*2,15);lpline(out,x*2+shift,y*2,x*2+shift+4,y*2,15);}
  return out;
 }
 if(compact)lpStamp(out,livianPieniHoyhenkasvo(s.frame),LIVIA_PIX_W*2-24,LIVIA_STAGE_H*2-24,24,24);
 else for(let y=0;y<base.length;y++)for(let x=0;x<base[y].length;x++)if(base[y][x])lpdot(out,x,y+dy,base[y][x]);
 return out;
}
export function luoLivianPikselit(canvas,scale=2) {
 if(!Number.isInteger(scale)||scale<1)throw new RangeError('Pikselimittakaavan on oltava positiivinen kokonaisluku.');
 let right=0;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas ei ole käytettävissä.');
 function resize(extra=0){right=Math.max(0,Math.ceil(extra/(scale*2)));const w=(LIVIA_PIX_W+right)*scale*2,h=LIVIA_STAGE_H*scale*2;
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;canvas.style.width=`${w}px`;canvas.style.height=`${h}px`;ctx.imageSmoothingEnabled=false;}}
 function paint(state,{compact=false}={}){ctx.clearRect(0,0,canvas.width,canvas.height);const data=livianNayttamo(state,{right,compact});for(let y=0;y<data.length;y++)for(let x=0;x<data[y].length;x++)if(data[y][x]){ctx.fillStyle=LIVIA_PIX_PALETTI[data[y][x]];ctx.fillRect(x*scale,y*scale,scale,scale);}}
 resize();paint(livianPikseliAsento('blink',0),{compact:true});return{paint,resize};
}
