/* Hyväksytyn kokopulun pää. Kasvon muoto pysyy samana; ilmeen osat liikkuvat. */
export function livianSvgPaa(s,{prefix='livia',lean=0,strength=.5}={}) {
 const f=s.frame||'rest',n=s.phase||0;
 const shock=['shock','eyes','fluster'].includes(f),shy=['embarrassed','fluster'].includes(f);
 const sleepy=['sleep','blink'].includes(f),manic=['manic','chewManic'].includes(f);
 const gentle=['rest','front','talk','talkSmall','glance','up','down'].includes(f);
 const yaw=f==='right'?1:f==='left'?-1:f==='front'?0:-.25*(1-lean);
 const front=Math.max(0,1-Math.abs(yaw)*2.5),mirror=yaw>.5;
 const nearX=61,farX=34+front*8,nearY=42+front*2,farY=46-front*2;
 let lid=f==='smug'?1.06:f==='bored'?1.45:f==='angry'?.5:shock?.05:manic?.02:shy?.45:gentle?.52:.66;
 if(f==='yawn')lid=1.35;
 if(['smile','wink'].includes(f))lid=.35;
 const ylakatselu=s.gazeUp||f==='up';
 if(ylakatselu)lid=.25;
 const lookX=ylakatselu?-3:f==='glance'?4:f==='disbelief'?-3:shy?3:f==='crumb'||f==='caught'?-3:0;
 const lookY=ylakatselu?-4:f==='down'?3:f==='preen'?4:shy?2:0;
 const eyes=(x,y,rx,ry,far)=>{
  const key=prefix+(far?'far':'near'),joy=['smile','grin','wink'].includes(f),closed=sleepy||f==='grin'||['happy','wink'].includes(f)&&far;
  const brow=joy?0:f==='angry'?(far?.5:-.5):shy?(far?-.3:.48):f==='disbelief'?(far?.1:-.5):gentle||ylakatselu?(far?.07:-.07):far?.24:-.28;
  const l=closed?2.2:lid+(f==='disbelief'?(far?-.55:.55):0),edge=y-ry+ry*l;
  const px=x+lookX,py=y+lookY,pr=manic?1.6:shock?2:far?2.1:2.9;
  const heart=`M${px} ${py+4}C${px-9} ${py-1} ${px-5} ${py-8} ${px} ${py-4}C${px+5} ${py-8} ${px+9} ${py-1} ${px} ${py+4}Z`;
  return `<g><defs><clipPath id="${key}"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/></clipPath></defs><g clip-path="url(#${key})"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#b8b8a3"/><ellipse cx="${x}" cy="${y+.5}" rx="${rx-1.3}" ry="${ry-1}" fill="${manic?'#dfac51':'#cf9652'}"/>${f==='love'?`<path d="${heart}" fill="#975d65"/>`:`<ellipse cx="${px}" cy="${py}" rx="${pr}" ry="${pr*1.2}" fill="#263840"/><circle cx="${px-.8}" cy="${py-1.2}" r=".8" fill="#eeeadd"/>`}<path d="M${x-rx-2} ${y-ry-2}H${x+rx+2}V${edge+rx*brow}Q${x} ${edge} ${x-rx-2} ${edge-rx*brow}Z" fill="${far?'#92a0a7':'#7b8d97'}"/></g><path d="M${x-rx} ${closed?y:edge-rx*brow}Q${x} ${closed?(joy?y-5:y+2):edge+1} ${x+rx} ${closed?y:edge+rx*brow}" fill="none" stroke="#536a76" stroke-width="1.3" stroke-linecap="round"/></g>`;
 };
 const mouth=s.mouth||f;
 const gape=mouth==='yawn'?1:mouth==='shock'?.9:mouth==='talk'?.7:mouth==='talkSmall'?.3:['chew','chewManic'].includes(mouth)?.2+(n%2)*.2:0;
 const puff=f==='puff',chew=['chew','chewManic','crumb'].includes(f);
 // Nokka osoittaa vasemmalle: POSITIIVINEN kierto nostaa sitä ylös.
 const twist=ylakatselu?18:f==='preen'?28:f==='down'?8:shy?5:gentle?1.2:0;
 const beak=f==='front'?`<path d="M48 58Q53 55 59 59L55 ${66+gape*10}L46 64Z" fill="#334d5b"/><path d="M48 58Q53 55 59 59L53 65L46 63Z" fill="#82979f"/><path d="M49 58Q49 54 54 55Q58 54 59 59L54 61Z" fill="#e3e2d6"/>`:
 `<path d="M30 60L44 61L40 ${65+gape*10}L21 ${68+gape*4}Z" fill="#2e4756"/><path d="M21 ${68+gape*4}Q32 ${70+gape*7} 41 ${65+gape*10}L43 64Z" fill="#6c8490"/><path d="M32 57Q37 55 42 59L46 63Q38 66 19 68Q22 64 26 61Z" fill="#526b79"/><path d="M31 59Q35 57 40 60Q30 65 21 67L27 63Z" fill="#9baaae"/><path d="M27 59Q28 54 33 55Q36 51 39 55Q42 56 41 60Q35 59 32 62Z" fill="#e3e2d6"/>`;
 return `<g data-part="head" data-gaze="${ylakatselu?'up-left':'neutral'}" data-expression="${gentle||ylakatselu?'gentle':'active'}" transform="${mirror?'translate(112 0) scale(-1 1) ':''}rotate(${twist} 57 74)">
 <path d="M29 36Q33 27 44 26Q57 22 70 26Q83 28 86 40Q90 52 82 65Q79 70 81 73L85 74L79 78Q79 91 71 98L68 95L65 100Q53 104 42 95Q37 90 38 80Q34 73 31 65Q24 60 24 51Q24 42 29 36Z" fill="#8d9da5"/>
 <path d="M62 26Q80 27 84 43Q87 53 79 72L82 75L77 78Q79 90 71 98L68 95L65 100Q56 104 47 98Q61 84 59 73Q70 61 70 47Q70 34 62 26Z" fill="${mirror?'#a4b2b8':'#657c89'}"/>
 <path d="M29 40Q34 29 45 29Q59 25 71 30Q61 28 53 34Q44 39 40 45Q31 50 27 55Q24 48 29 40Z" fill="${mirror?'#748b97':'#acb7bb'}"/>
 <path d="M39 78Q46 72 54 77Q63 80 66 87Q68 94 65 100Q53 101 44 94Q39 88 39 78Z" fill="#668b83"/><path d="M54 79Q63 84 66 90Q70 88 76 83Q77 93 70 97L66 95L65 100Q62 98 61 94Q59 85 54 79Z" fill="#788297"/>
 <path d="M42 78Q46 78 49 81M46 85Q50 86 53 89" fill="none" stroke="#8ba69c" stroke-width="1.4" stroke-linecap="round"/>
 ${puff||chew?`<ellipse cx="38" cy="66" rx="${puff?12+strength*3:8+n%2}" ry="10" fill="#a3b0b5"/><ellipse cx="72" cy="65" rx="${puff?12+strength*3:7+n%2}" ry="11" fill="#7b919c"/>`:''}
 ${eyes(farX,farY,(shock?7:5.2)+front*3,shock?10:6.6,true)}${eyes(nearX,nearY,manic?12.5:shock?12:10.2,shock?14:manic?12:10,false)}
 ${beak}
 ${['smile','grin','wink'].includes(f)?'<path data-part="smile" d="M24 67Q38 71 46 62" fill="none" stroke="#334e5b" stroke-width="1.7" stroke-linecap="round"/>':''}
 ${s.glasses>0?`<g data-part="glasses" opacity="${Math.min(1,s.glasses*3)}" transform="translate(0 ${(1-s.glasses)*42-(s.glassesLift||0)})" fill="none" stroke="#655a48" stroke-width="2.2"><ellipse cx="${farX}" cy="${farY}" rx="8.5" ry="9"/><ellipse cx="${nearX}" cy="${nearY}" rx="13" ry="12"/><path d="M${farX+8.5} ${farY-2}Q47 37 ${nearX-13} ${nearY-2}M${nearX+13} ${nearY-3}l8-5M${farX-8.5} ${farY-3}l-4-3"/><path d="M${nearX-6} ${nearY-6}l4-2" stroke="#eee9d9" stroke-width="1.5"/></g>`:''}
 ${shy?'<path d="M48 58l5 1M72 57l4 1" stroke="#b28d89" stroke-width="2.5" stroke-linecap="round"/>':''}
 ${['crumb','caught','chew','chewManic'].includes(f)?'<path d="M26 67l3-1 1 3-3 1Z M39 71l2 1-1 2-2-1Z" fill="#c89653"/>':''}
 </g>`;
}
