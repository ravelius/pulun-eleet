/* Alkuperäinen pikselipiirros. Suuret värimuodot, valo ylävasemmalta.
 * Ei ulkoreunan mustaa piirtoa, pehmennystä tai satunnaista kohinaa. */
export const LIVIA_HOYHEN_PALETTI=Object.freeze([null,
 '#303b43','#e5e4db','#83929a','#4c5d67','#60727c','#9eacb2','#c0c8c9',
 '#426b65','#65968a','#687181','#806f89','#ad6d40','#dca459','#202c32',
 '#bd837c','#a67c47','#d5ac68','#efe0b2','#6f827e']);
const lhGrid=(w=44,h=44)=>Array.from({length:h},()=>Array(w).fill(0));
const lhDot=(g,x,y,c)=>{x=Math.round(x);y=Math.round(y);if(g[y]&&x>=0&&x<g[y].length)g[y][x]=c;};
const lhRect=(g,x,y,w,h,c)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)lhDot(g,i,j,c);};
function lhPoly(g,p,c){for(let y=0;y<g.length;y++)for(let x=0;x<g[0].length;x++){let hit=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y+.5)!==(b[1]>y+.5)&&(x+.5)<(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0])hit=!hit;}if(hit)g[y][x]=c;}}
function lhLine(g,x,y,ex,ey,c=4){const n=Math.max(Math.abs(ex-x),Math.abs(ey-y));for(let i=0;i<=n;i++)lhDot(g,x+(ex-x)*i/(n||1),y+(ey-y)*i/(n||1),c);}
function lhEllipse(g,cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)lhDot(g,x,y,c);}
function lhShade(g){
 for(let y=0;y<g.length;y++)for(let x=0;x<g[y].length;x++)if(g[y][x]){
  const nx=(x-22)/22,ny=(y-19)/30,nz=Math.sqrt(Math.max(0,1-nx*nx*.65-ny*ny*.55));
  const light=-nx*.48-ny*.25+nz*.62;
  g[y][x]=light>.87?7:light>.70?6:light>.48?3:light>.24?5:4;
  // Kaulan väri kuuluu höyheniin; kasvoihin ei piirretä värikästä reunaa.
  if(y>29&&x>15&&x<40){const neck=y-29;
   if(x<25+neck*.25)g[y][x]=x<21&&y<38?9:8;
   else g[y][x]=y<36?10:11;
   if((y===34&&x>20&&x<25)||(y===38&&x>22&&x<26))g[y][x]=19;
  }
 }
}
function lhEye(g,cx,cy,rx,ry,{lid=0,slope=0,look=0,lookY=0,closed=false,heart=false,cross=false,manic=false}={}){
 const under=g.map(r=>[...r]);
 if(closed){lhLine(g,cx-rx,cy,cx,cy+1,4);lhLine(g,cx,cy+1,cx+rx,cy-1,4);lhLine(g,cx-rx,cy-1,cx,cy,6);return;}
 // Harmaa silmärengas ja oranssi iiris, ei valkoista palloa mustassa kehyksessä.
 lhEllipse(g,cx,cy,rx+1,ry+1,6);lhEllipse(g,cx,cy,rx,ry,12);
 lhEllipse(g,cx-.6,cy-.5,Math.max(1,rx-1),Math.max(1,ry-1),13);
 if(heart){lhPoly(g,[[cx-4,cy-2],[cx-2,cy-3],[cx,cy-1],[cx+2,cy-3],[cx+4,cy-2],[cx+4,cy],[cx,cy+4],[cx-4,cy]],15);}
 else if(cross){lhLine(g,cx-3,cy-3,cx+3,cy+3,14);lhLine(g,cx+3,cy-3,cx-3,cy+3,14);}
 else{lhEllipse(g,cx+look,cy+lookY,manic?2.8:2,manic?3.7:2.7,14);lhDot(g,cx+look-1,cy+lookY-1,2);}
 const cover=closed?ry*2+1:lid;
 for(let yy=Math.floor(cy-ry-2);yy<=cy+ry+1;yy++)for(let xx=Math.floor(cx-rx-2);xx<=cx+rx+2;xx++){
  const upper=cy-ry+cover+(xx-cx)*slope;
  if(yy<upper&&g[yy]?.[xx])g[yy][xx]=under[yy][xx];
 }
 const a=cx-rx,b=cx+rx;
 lhLine(g,a,cy-ry+cover-rx*slope,b,cy-ry+cover+rx*slope,4);
 if(!closed)lhLine(g,a,cy-ry+cover-1-rx*slope,b,cy-ry+cover-1+rx*slope,cx<22?6:3);
}
function lhBeak(g,{front=false,open=false,small=false,low=0}={}){
 if(front){lhPoly(g,[[18,24+low],[24,24+low],[28,29+low],[23,33+low],[18,32+low],[14,29+low]],5);lhPoly(g,[[18,25+low],[23,25+low],[24,28+low],[15,29+low]],6);lhLine(g,16,30+low,25,30+low,1);lhEllipse(g,21,24+low,3,2,2);if(open)lhPoly(g,[[17,33+low],[25,32+low],[24,38+low],[18,37+low]],14);return;}
 lhPoly(g,[[12,23+low],[16,25+low],[17,28+low],[12,30+low],[3,30+low],[4,28+low]],5);
 lhPoly(g,[[12,24+low],[14,25+low],[11,27+low],[4,29+low],[10,29+low],[15,27+low]],6);
 lhLine(g,4,30+low,14,28+low,1);lhEllipse(g,12,23+low,3,2,2);lhDot(g,14,24+low,3);
 if(open){lhPoly(g,[[6,32+low],[15,30+low],[18,35+low],[14,38+low],[8,36+low]],14);lhPoly(g,[[8,36+low],[14,36+low],[17,34+low],[16,38+low],[9,39+low]],5);}
 else if(small){lhLine(g,7,32+low,14,30+low,14);lhLine(g,9,33+low,15,31+low,5);}
}
const lhMoods={
 rest:[{lid:3,slope:.22},{lid:3,slope:-.28}],glance:[{lid:4,look:-1},{lid:4,slope:-.18,look:-2}],
 blink:[{closed:true},{closed:true}],sleep:[{closed:true,slope:.15},{closed:true,slope:-.12}],
 angry:[{lid:3,slope:.65,look:1},{lid:3,slope:-.65,look:-1}],embarrassed:[{lid:4,slope:.12,look:2,lookY:1},{lid:4,slope:.2,look:2,lookY:1}],
 bored:[{lid:6},{lid:6}],manic:[{manic:true},{manic:true}],disbelief:[{lid:0},{lid:5,slope:-.15}],
 happy:[{closed:true,slope:-.2},{closed:true,slope:.2}],smug:[{lid:5,slope:.13},{lid:4,slope:-.35}],
 confused:[{lid:5,slope:.15},{lid:0}],love:[{heart:true},{heart:true}],up:[{lookY:-2},{lookY:-2}],down:[{lid:3,lookY:2},{lid:3,lookY:2}],
 fluster:[{lid:0,look:-1},{lid:5,slope:.3,look:2}],caught:[{lid:0,look:2},{lid:4,slope:.3,look:2}],
 shock:[{lid:0},{lid:0}],splat:[{cross:true},{cross:true}],
};
const lhAliases={crumb:'rest',chew:'blink',chewManic:'manic',talk:'rest',talkSmall:'rest',puff:'bored',yawn:'sleep',preen:'blink',cover:'embarrassed',wing:'rest',eyes:'rest'};
const lhCache=new Map();
export function livianHoyhenkasvo(frame='rest',mouth=null){
 const key=frame+':'+(mouth||'');if(lhCache.has(key))return lhCache.get(key);
 const front=frame==='front'||frame==='splat',profile=frame==='left'||frame==='right',shock=frame==='shock';
 const g=lhGrid(44,shock?60:44);
 lhPoly(g,front?[[12,3],[19,2],[23,1],[27,3],[32,3],[38,7],[41,14],[40,26],[36,33],[35,40],[31,44],[12,44],[9,38],[7,30],[3,25],[3,14],[7,7]]:
 [[20,3],[25,2],[28,1],[31,3],[35,3],[39,6],[42,12],[42,24],[39,31],[38,39],[34,44],[20,44],[16,40],[15,34],[13,31],[9,26],[8,20],[9,12],[13,7]],3);
 if(shock)lhPoly(g,[[16,28],[40,22],[42,48],[39,60],[21,60],[17,52]],3);
 if(frame==='puff')lhPoly(g,[[11,29],[17,30],[22,35],[29,31],[36,30],[42,34],[43,40],[38,44],[14,44],[5,40],[5,34]],3);
 lhShade(g);
 const m=lhMoods[lhAliases[frame]||frame]||lhMoods.rest;
 if(shock){lhEye(g,13,20,4,11,m[0]);lhEye(g,31,17,7,16,m[1]);}
 else if(profile)lhEye(g,27,17,7,6,{lid:3,slope:-.24,look:-1});
 else if(front){lhEye(g,12,18,6,6,m[0]);lhEye(g,30,17,6,7,m[1]);}
 else{lhEye(g,13,17,4,5,m[0]);lhEye(g,30,16,7,6,m[1]);}
 const open=['talk','chew','chewManic','yawn','shock'].includes(mouth||frame),small=(mouth||frame)==='talkSmall';
 lhBeak(g,{front,open,small,low:shock?14:0});
 if(['embarrassed','fluster','caught'].includes(frame)){lhLine(g,19,26,22,27,15);lhLine(g,34,25,37,26,11);}
 if(['crumb','chew','caught','chewManic'].includes(frame)){lhDot(g,3,31,18);lhDot(g,6,34,17);}
 if(['preen','cover','wing'].includes(frame)){
  const pts=frame==='cover'?[[19,43],[18,31],[22,17],[25,12],[27,15],[25,27],[31,16],[34,17],[31,29],[38,23],[40,27],[36,39],[39,44]]:frame==='preen'?[[25,44],[23,35],[30,25],[35,18],[37,23],[34,31],[42,39],[43,44]]:[[33,44],[31,33],[34,25],[36,28],[39,16],[42,17],[42,44]];
  lhPoly(g,pts,5);lhPoly(g,pts.map(([x,y])=>[x-1,y-1]),3);
  for(let i=0;i<3;i++)lhLine(g,25+i*5,40,29+i*4,31+i,5);
 }
 if(frame==='eyes')for(let y=0;y<g.length;y++)for(let x=0;x<44;x++)if(!((x>=8&&x<=18&&y>=10&&y<=23)||(x>=22&&x<=38&&y>=8&&y<=23)))g[y][x]=0;
 if(frame==='right'){g.forEach(r=>r.reverse());for(let y=0;y<g.length;y++)for(let x=0;x<44;x++){const c=g[y][x];if([3,4,5,6,7].includes(c)){const nx=(x-22)/22,ny=(y-19)/30,nz=Math.sqrt(Math.max(0,1-nx*nx*.65-ny*ny*.55)),v=-nx*.48-ny*.25+nz*.62;g[y][x]=v>.87?7:v>.70?6:v>.48?3:v>.24?5:4;}}}
 lhCache.set(key,g);return g;
}
export function livianPieniHoyhenkasvo(frame='rest'){
 const g=lhGrid(24,24);lhPoly(g,[[10,2],[14,1],[17,2],[21,4],[23,9],[23,15],[21,19],[20,24],[11,24],[9,21],[8,18],[5,15],[5,10],[7,5]],3);
 for(let y=0;y<24;y++)for(let x=0;x<24;x++)if(g[y][x])g[y][x]=x<11?6:x<17?3:5;
 lhPoly(g,[[11,19],[15,18],[19,19],[20,24],[12,24]],8);lhPoly(g,[[17,19],[21,18],[20,24],[17,24]],11);
 lhEye(g,9,9,2,3,{lid:2,slope:.2,closed:frame==='sleep'||frame==='blink'});lhEye(g,18,9,3,4,{lid:3,slope:-.3,closed:frame==='sleep'||frame==='blink'});
 lhPoly(g,[[7,13],[10,15],[9,17],[2,17],[3,16]],5);lhLine(g,3,16,8,14,6);lhRect(g,7,13,3,1,2);return g;
}
