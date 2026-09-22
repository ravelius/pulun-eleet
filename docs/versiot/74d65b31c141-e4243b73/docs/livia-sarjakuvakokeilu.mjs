/* Erillinen omistajan tilaama piirrostyylikokeilu. Ei pelin hahmomalli.
 * Pyöreät massat, musteääriviiva ja selkeät väripinnat korvaavat pienen
 * höyhengeometrian. Piirrostyylin koe ja oma tervehdys liikuttavat piirrosta: kokeilu
 * ei muuta aiemmin hyväksyttyä Pulua eikä tuo ulkoisia kuva-aineistoja. */
const n=x=>Math.round(x*1000)/1000;
const rajaa=x=>Math.max(0,Math.min(1,x));
const muste='#344653';

function silma(s,prefix,taka){
  const x=taka?80:101,y=taka?100:98,rx=taka?7.4:11.4,ry=taka?11.5:14.2;
  const sulku=rajaa(s.rapaytys),ilo=s.ilme,ylareuna=y-ry+7.5-ilo*2,nosto=rajaa(s.poski||0);
  const alaluomi=nosto?`<path data-part="smile-lid" d="M${n(x-rx-2)} ${n(y+ry+2)}V${n(y+ry-4*nosto)}Q${x} ${n(y+ry-9*nosto)} ${n(x+rx+2)} ${n(y+ry-5*nosto)}V${n(y+ry+2)}Z" fill="${taka?'#a9bbc5':'#99aebc'}" stroke="none"/><path data-part="lower-lid-smile" d="M${n(x-rx-2)} ${n(y+ry-4*nosto)}Q${x} ${n(y+ry-9*nosto)} ${n(x+rx+2)} ${n(y+ry-5*nosto)}" fill="none" stroke-width="1.5" opacity="${n(nosto)}"/>`:'';
  const reuna=ylareuna+(y+ry-ylareuna)*sulku,id=prefix+(taka?'sarja-far':'sarja-near');
  // Ulkonurkka nousee hieman, sisänurkka jää rauhallisemmaksi. Eri
  // kaaret ja vino yläluomi antavat katseelle särmää ilman vihaista V:tä.
  const ulko=taka?-1:-3,luomi='M'+n(x-rx)+' '+n(reuna+1)+'Q'+x+' '+n(reuna-1-ilo)+' '+n(x+rx)+' '+n(reuna+ulko);
  const muoto='M'+n(x-rx)+' '+y+'C'+n(x-rx)+' '+n(y-ry*.65)+' '+n(x-rx*.55)+' '+n(y-ry)+' '+n(x+1)+' '+n(y-ry)+'Q'+n(x+rx-1)+' '+n(y-ry*.95)+' '+n(x+rx)+' '+n(y-2)+'C'+n(x+rx+1)+' '+n(y+ry*.6)+' '+n(x+rx*.2)+' '+n(y+ry+1)+' '+n(x-2)+' '+n(y+ry)+'Q'+n(x-rx)+' '+n(y+ry-.5)+' '+n(x-rx)+' '+y+'Z';
  return `<g data-part="cartoon-eye" data-eye-shape="almond" transform="rotate(${taka?0:-6} ${x} ${y})"><g data-part="cartoon-lid" transform="translate(${x} ${y}) scale(1 ${n(1-.96*sulku)}) translate(${-x} ${-y})"><defs><clipPath id="${id}"><path d="${muoto}"/></clipPath></defs><path data-part="eye-white" d="${muoto}" fill="#fff9e8" stroke-width="1.6"/><g clip-path="url(#${id})">${s.katse?`<g data-part="gaze" transform="translate(${n(s.katse*(taka?2:3))} 0)">`:""}<ellipse cx="${x-1}" cy="${n(y+2-ilo)}" rx="${taka?5.3:7.8}" ry="${taka?8:10.3}" fill="#c89255" stroke="none"/><ellipse cx="${x-1.5}" cy="${n(y+2-ilo)}" rx="${taka?3.8:5.7}" ry="${taka?6.6:8.6}" fill="${muste}" stroke="none"/><ellipse cx="${x-3}" cy="${n(y-1-ilo)}" rx="${taka?1.7:2.3}" ry="${taka?2.3:3}" fill="#fffdf1" stroke="none"/>${s.katse?"</g>":""}<path d="${luomi}L${n(x+rx+2)} ${n(y-ry-2)}H${n(x-rx-2)}Z" fill="${taka?'#a9bbc5':'#99aebc'}" stroke="none"/>${alaluomi}</g><path data-part="upper-lid" d="${luomi}" fill="none" stroke-width="1.9"/></g><path data-part="closed-eye" d="M${n(x-rx)} ${y}Q${x} ${y+3} ${n(x+rx)} ${y+ulko}" fill="none" stroke-width="2" opacity="${n(sulku)}"/><path data-part="cartoon-brow" d="M${n(x-rx+2)} ${n(y-ry-1-ilo)}Q${x} ${n(y-ry-(taka?5:7)-ilo)} ${n(x+rx-2)} ${n(y-ry-(taka?1:4)-ilo)}" fill="none" stroke-width="1.7" opacity=".82"/><path data-part="eyelashes" d="M${n(x+rx-1)} ${n(reuna+ulko+1)}q4-1 5-4M${n(x+rx-3)} ${n(reuna+ulko)}q3-2 3-5" fill="none" stroke-width="1.6" opacity="${n((taka?.65:1)*(1-sulku))}"/></g>`;
}

function hymynNokka(s,prefix){
  // Kärki pysyy paikallaan. Suupieli liikkuu posken suuntaan ja ylös;
  // erillinen avauskanava erottaa suljetun hymyn avoimesta naurusta.
  const h=rajaa(s.hymy),a=rajaa(s.suu),x=96+13*h,y=119-5*h,d=14*a;
  const yla=`M60 121C76 122 ${n(x-12)} ${n(122+2*h)} ${n(x)} ${n(y)}`;
  const ala=`M60 ${n(121+d)}C76 ${n(122+d)} ${n(x-12)} ${n(122+2*h+d*.5)} ${n(x)} ${n(y)}`;
  const aukko=`${yla}C${n(x-12)} ${n(122+2*h+d*.5)} 76 ${n(122+d)} 60 ${n(121+d)}Z`,clip=prefix+'hymy-aukko';
  const svg=`<g data-part="cartoon-beak" data-beak-shape="pigeon-smile" data-opening="${n(a)}" data-smile="${n(h)}" stroke-width="1.7"><defs><clipPath id="${clip}"><path d="${aukko}"/></clipPath></defs><g clip-path="url(#${clip})"><path data-part="mouth-inside" d="M86 112H118V150H82Q94 130 86 112Z" fill="#936f79" stroke="none"/><path data-part="tongue" d="M76 ${n(122+d*.6)}Q79 ${n(117+d*.7)} 85 ${n(120+d*.6)}Q91 ${n(116+d*.75)} 98 ${n(120+d*.58)}Q97 ${n(126+d*.7)} 88 ${n(127+d*.75)}Q79 ${n(127+d*.75)} 76 ${n(122+d*.6)}Z" fill="#e7a0a8" stroke="#af7280" stroke-width="1.2" opacity="${n(rajaa((a-.28)*5))}"/></g><path data-part="lower-beak" d="${ala}Q${n(x-7)} ${n(125+d*.6)} 82 ${n(126+d)}Q66 ${n(125+d)} 59 ${n(123+d)}Z" fill="#7994a4"/><path data-part="upper-beak" d="M77 110Q83 106 88 110L92 114Q79 117 58 120Q64 114 70 112Z" fill="#728b9d"/><path data-part="smile-line" d="${yla}" fill="none"/><path d="M64 117Q73 113 80 113" fill="none" stroke="#bdd0d5" stroke-width="2.5"/><path data-part="cere" d="M73 110Q74 105 79 106Q81 103 85 106Q89 106 88 111Q82 110 79 113Z" fill="#ede7d1" stroke-width="1.6"/><path data-part="smile-corner" d="M${n(x-3)} ${n(y+2)}Q${n(x+1)} ${n(y-4)} ${n(x+5)} ${n(y-1)}" fill="none" stroke-width="1.6" opacity="${n(h)}"/></g>`;
  return {aukko,svg};
}

function vanhaNokka(a){
  return `<g data-part="cartoon-beak" data-opening="${n(a)}" data-beak-shape="pigeon" stroke-width="1.7"><path data-part="mouth-inside" d="M85 115Q92 111 95 116Q96 ${n(124+7*a)} 85 ${n(123+13*a)}L81 ${n(125+11*a)}Q92 ${n(122+3*a)} 85 115Z" fill="#936f79" stroke-width="1.6"/><path data-part="tongue" d="M67 ${n(120+11*a)}Q70 ${n(115+10*a)} 76 ${n(118+11*a)}Q81 ${n(114+12*a)} 85 ${n(120+11*a)}Q82 ${n(126+11*a)} 76 ${n(125+11*a)}Q70 ${n(125+11*a)} 67 ${n(120+11*a)}Z" fill="#e7a0a8" stroke="#af7280" stroke-width="1.2" opacity="${n(rajaa(a*2))}"/><path d="M73 ${n(119+11*a)}Q76 ${n(122+11*a)} 80 ${n(119+11*a)}" fill="none" stroke="#b87785" stroke-width="1" opacity="${n(a)}"/><path data-part="lower-beak" d="M62 ${n(121+13*a)}Q74 ${n(125+15*a)} 86 ${n(121+14*a)}Q92 ${n(119+8*a)} 93 115Q96 ${n(123+8*a)} 87 ${n(125+14*a)}Q74 ${n(129+15*a)} 62 ${n(124+13*a)}Q59 ${n(122+13*a)} 62 ${n(121+13*a)}Z" fill="#7994a4"/><g transform="rotate(${n(a*7)} 86 113)"><path d="M77 110Q83 106 88 110L92 114Q79 117 58 120Q64 114 70 112Z" fill="#728b9d"/><path d="M64 117Q73 113 80 113" fill="none" stroke="#bdd0d5" stroke-width="2.5"/><path data-part="cere" d="M73 110Q74 105 79 106Q81 103 85 106Q89 106 88 111Q82 110 79 113Z" fill="#ede7d1" stroke-width="1.6"/></g><path d="M91 117Q96 120 99 115" fill="none" stroke-width="2"/><path d="M95 114Q99 112 102 115" fill="none" stroke-width="1.4" opacity="${n(a)}"/></g>`;
}

function paa(s,prefix){
  const a=rajaa(s.suu),maski=prefix+'sarja-mouth',hymy=s.id.startsWith('uusi-hymy-')?hymynNokka(s,prefix):null;
  // Posken aukko ja leuka ovat samaa geometriaa: rako ei ole musta läiskä.
  const aukko=hymy?hymy.aukko:`M55 116Q72 115 89 113Q96 ${n(118+3*a)} 84 ${n(123+13*a)}L58 ${n(123+17*a)}Z`;
  return `<g data-part="cartoon-head" data-face-shape="slender" transform="translate(${n(s.paaX)} ${n(s.paaY)}) rotate(${n(s.paaKulma)} 107 137)"><defs><mask id="${maski}" maskUnits="userSpaceOnUse" x="20" y="50" width="140" height="115" style="mask-type:luminance"><rect x="20" y="50" width="140" height="115" fill="white" stroke="none"/><path data-part="mouth-space" d="${aukko}" fill="black" stroke="none" opacity="${hymy?1:n(rajaa(a*4))}"/></mask></defs><g mask="url(#${maski})"><path data-part="face-outline" d="M72 88C78 76 90 72 105 74C122 72 133 85 132 101C132 116 124 127 118 133L120 136L115 136Q105 143 92 138Q80 134 80 126Q67 121 67 109Q66 97 72 88Z" fill="#9bafbd"/><path d="M111 77Q130 84 130 101Q129 119 119 131L121 134L116 135Q108 140 98 138Q116 124 117 103Q119 86 111 77Z" fill="#7f99a9" stroke="none"/><path d="M74 89Q82 78 99 77Q84 82 77 95" fill="none" stroke="#c3d0d5" stroke-width="3.5"/><path d="M94 75Q98 67 108 68Q107 72 103 74Q112 69 119 73L112 77" fill="#9bafbd"/><path data-part="soft-cheek"${s.poski?` transform="translate(0 ${n(-2.5*s.poski)})"`:""} d="M93 115Q100 112 105 116L104 125Q98 128 90 124Z" fill="#c2cfd2" stroke="none" opacity=".24"/><ellipse data-part="cheek-warmth" cx="101" cy="${n(122-3*(s.poski||0))}" rx="4.8" ry="2.5" fill="#d59fa7" stroke="none" opacity="${n(.14+s.ilme*.1)}"/></g>${silma(s,prefix,true)}${silma(s,prefix,false)}${hymy?hymy.svg:vanhaNokka(rajaa(s.suu))}</g>`;
}

function siipi(s,taka=false){
  const t=taka?s.takasiipi:s.siipi,auki=rajaa(t/.18),rinta=taka?0:rajaa(s.rintasiipi||0);
  const kulma=155-150*t+(s.sulat-t)*19;
  const kyynar=rinta?`<path data-part="chest-elbow" d="M123 145Q138 146 140 156Q138 168 125 166L115 158Z" fill="#829cac" opacity="${n(rinta)}"/>`:"";
  const taittunut='<path data-part="folded-wing" d="M120 145Q138 145 141 157Q139 169 127 174Q116 164 120 145Z" fill="#829cac"/><path d="M125 152q7 4 11 8m-11 0q5 3 7 7" fill="none" stroke-width="1.8"/>';
  if(t===0)return taka?'':taittunut;
  return `${kyynar}${taka?'':`<g data-part="folded-wing-layer" opacity="${n(1-auki)}">${taittunut}</g>`}<g data-part="${taka?'far':'near'}-wing" opacity="${n(auki)}" transform="translate(${taka?93:125} ${n(146-10*t+17*rinta)}) scale(${taka?-1:1} 1) rotate(${n(kulma+(-85-kulma)*rinta)}) scale(${n(.72+.28*t-.15*rinta)} ${n(.64+.58*t+(.53-.64-.58*t)*rinta)})"><path d="M-5 6Q-11-3-7-13L-4-34Q-3-42 2-40Q6-39 5-32L5-21L11-45Q13-51 18-47Q21-45 18-38L14-23L23-39Q27-44 30-39Q32-36 29-31L21-17L29-24Q34-28 36-23Q38-20 33-15L18 2Q8 12-5 6Z" fill="${taka?'#7d97a8':'#a1b6c2'}"/><path d="M-1-16Q7-9 16-11M1-7Q6-2 10 1" fill="none" stroke-width="1.5"/></g>`;
}

function huivi(s){
  // Solmu pysyy kaulalla, vapaat päät reagoivat siiven jälkiliikkeeseen.
  const heilahdus=(s.sulat-s.siipi)*24+s.paaKulma*.45+(s.huiviliike||0);
  return `<g data-part="scarf" transform="rotate(${n(s.rinta)} 110 174)"><path d="M91 138Q104 145 120 138L123 144Q109 153 94 145Z" fill="#d98a98" stroke-width="1.5"/><path d="M94 140Q106 147 119 141" fill="none" stroke="#efb6bd" stroke-width="1.6"/><g data-part="scarf-tails" transform="translate(119 145) rotate(${n(heilahdus)})"><path d="M-2 1Q-8 11-4 22L1 18L5 20Q8 10 4 1Z" fill="#b96d85" stroke-width="1.5"/><path d="M2 1Q12 3 18 14L12 14L12 19Q5 15-1 4Z" fill="#e3a0aa" stroke-width="1.5"/><path d="M0 5Q0 11-1 16M4 5l6 6" fill="none" stroke="#f1bcc3" stroke-width="1.2"/></g><path d="M116 140Q121 137 124 142L123 147Q119 150 115 145Z" fill="#d98a98" stroke-width="1.5"/></g>`;
}

export function sarjakuvapulunKuva(s,{prefix,right}){
  const jalka=x=>`<path d="M${x} 175l-2 9" fill="none" stroke="#293b48" stroke-width="5"/><path d="M${x} 175l-2 9" fill="none" stroke="#bd8581" stroke-width="2.7"/><path d="M${x-2} 182q-8 1-10 5q2 2 9-1q-4 5 0 4l5-4q4 3 7 1q1-2-8-5Z" fill="#cf9890" stroke-width="1.5"/>`;
  // Hengitys joustaa nilkkojen yläpuolella; jalat eivät luista.
  // Vain uusi oma ele saa tämän kanavan, vanha tyylinäyte säilyy täsmälleen.
  const jousto=(s.id==='uusi-livia-ilahtuu'||s.id.startsWith('uusi-hymy-'))?`<g data-part="breath" transform="translate(110 174) scale(${n(1-.035*s.hengitys)} ${n(1+.05*s.hengitys)}) translate(-110 -174)">`:"";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${152+right} 304" width="${152+right}" height="304" aria-hidden="true" data-uusi-versio="${s.id}" data-style="sarjakuvakokeilu"><ellipse cx="128" cy="301" rx="21" ry="2.8" fill="#776e5a" opacity=".17"/><g data-part="whole-bird" transform="translate(128 302) scale(.56) translate(-108 -188)" stroke="${muste}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><g data-part="feet">${jalka(100)}${jalka(121)}</g>${jousto}${siipi(s,true)}<g data-part="body" transform="rotate(${n(s.rinta)} 110 174)"><path d="M127 157Q141 158 152 169Q145 171 139 168L147 176Q132 178 123 167Z" fill="#698596"/><path d="M92 135Q110 127 126 140Q139 148 136 162Q133 179 112 178Q88 178 86 157Q84 145 92 135Z" fill="#a3b6c1"/><path d="M119 140Q133 145 133 159Q130 174 115 175Q123 161 119 140Z" fill="#809bad" stroke="none"/><path d="M96 140Q91 148 94 161" fill="none" stroke="#d1dadb" stroke-width="4"/><path d="M90 129Q103 123 117 133L120 149Q104 159 91 147Z" fill="#638f82"/><path d="M96 143Q103 149 113 145" fill="none" stroke="#9dbdab" stroke-width="2.5"/></g>${paa(s,prefix)}${huivi(s)}${siipi(s)}${jousto?"</g>":""}</g></svg>`;
}
