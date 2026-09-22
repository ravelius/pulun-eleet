/* Erillinen omistajan tilaama piirrostyylikokeilu. Ei pelin hahmomalli.
 * Pyöreät massat, musteääriviiva ja selkeät väripinnat korvaavat pienen
 * höyhengeometrian. Sama tervehdysrata liikuttaa omaa piirrosta: kokeilu
 * ei muuta aiemmin hyväksyttyä Pulua eikä tuo ulkoisia kuva-aineistoja. */
const n=x=>Math.round(x*1000)/1000;
const rajaa=x=>Math.max(0,Math.min(1,x));
const muste='#293b48';

function silma(s,prefix,taka){
  const x=taka?77:101,y=taka?99:94,rx=taka?8.5:13,ry=taka?14:18;
  const sulku=rajaa(s.rapaytys),ilo=s.ilme,ylareuna=y-ry+4-ilo*3;
  const reuna=ylareuna+(y+ry-ylareuna)*sulku,id=prefix+(taka?'sarja-far':'sarja-near');
  return `<g data-part="cartoon-eye"><g data-part="cartoon-lid" transform="translate(${x} ${y}) scale(1 ${n(1-.96*sulku)}) translate(${-x} ${-y})"><defs><clipPath id="${id}"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/></clipPath></defs><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff8df"/><g clip-path="url(#${id})"><ellipse cx="${x-2}" cy="${n(y+1-ilo*2)}" rx="${taka?4.8:6.3}" ry="${taka?7:9}" fill="#d69b49" stroke="none"/><ellipse cx="${x-3}" cy="${n(y+1-ilo*2)}" rx="${taka?3.1:4.3}" ry="${taka?5.8:7.4}" fill="${muste}" stroke="none"/><ellipse cx="${x-4}" cy="${n(y-2-ilo*2)}" rx="1.8" ry="2.5" fill="#fffdf1" stroke="none"/><path d="M${x-rx-2} ${y-ry-2}H${x+rx+2}V${n(reuna+2)}Q${x} ${n(reuna-3*ilo)} ${x-rx-2} ${n(reuna)}Z" fill="${taka?'#a9bbc5':'#99aebc'}" stroke="none"/></g><path d="M${n(x-rx)} ${n(reuna+1)}Q${x} ${n(reuna-3*ilo)} ${n(x+rx)} ${n(reuna+2)}" fill="none" stroke-width="1.7"/></g><path data-part="closed-eye" d="M${x-rx} ${y}Q${x} ${y+4} ${x+rx} ${y}" fill="none" stroke-width="2" opacity="${n(sulku)}"/><path data-part="cartoon-brow" d="M${x-rx+1} ${n(y-ry-5-ilo*3)}Q${x} ${n(y-ry-9-ilo*4)} ${x+rx-1} ${n(y-ry-4-ilo*2)}" fill="none" stroke-width="2.5"/></g>`;
}

function paa(s,prefix){
  const a=rajaa(s.suu),maski=prefix+'sarja-mouth';
  // Posken aukko ja leuka ovat samaa geometriaa: rako ei ole musta läiskä.
  const aukko=`M40 115Q65 116 89 112Q96 ${n(118+4*a)} 84 ${n(122+18*a)}L42 ${n(125+20*a)}Z`;
  return `<g data-part="cartoon-head" transform="translate(${n(s.paaX)} ${n(s.paaY)}) rotate(${n(s.paaKulma)} 107 137)"><defs><mask id="${maski}" maskUnits="userSpaceOnUse" x="20" y="50" width="140" height="115" style="mask-type:luminance"><rect x="20" y="50" width="140" height="115" fill="white" stroke="none"/><path data-part="mouth-space" d="${aukko}" fill="black" stroke="none" opacity="${n(rajaa(a*4))}"/></mask></defs><g mask="url(#${maski})"><path d="M67 87C73 72 90 68 108 71C131 70 143 87 140 106Q139 123 128 131L130 136L124 136L126 141L118 138Q102 147 84 139Q75 134 75 125Q60 122 61 108Q59 96 67 87Z" fill="#9bafbd"/><path d="M114 75Q140 85 138 105Q137 122 126 132L128 135L122 135L123 139L117 136Q108 143 99 141Q119 123 121 102Q123 86 114 75Z" fill="#718c9e" stroke="none"/><path d="M71 88Q81 76 102 76Q83 80 74 96" fill="none" stroke="#c3d0d5" stroke-width="3.5"/><path d="M96 73Q101 66 111 65Q110 69 107 71Q116 66 124 70L116 75" fill="#9bafbd"/></g>${silma(s,prefix,true)}${silma(s,prefix,false)}<g data-part="cartoon-beak" data-opening="${n(a)}"><path data-part="mouth-inside" d="M84 114Q93 110 96 116Q97 ${n(125+9*a)} 82 ${n(124+17*a)}L76 ${n(126+15*a)}Q91 ${n(123+4*a)} 84 114Z" fill="#855d69" stroke-width="1.6"/><path data-part="tongue" d="M52 ${n(120+15*a)}Q58 ${n(112+14*a)} 69 ${n(116+15*a)}Q77 ${n(111+16*a)} 83 ${n(118+15*a)}Q80 ${n(125+15*a)} 67 ${n(125+15*a)}Q59 ${n(125+15*a)} 52 ${n(120+15*a)}Z" fill="#e7a0a8" stroke="#af7280" stroke-width="1.2" opacity="${n(rajaa(a*2))}"/><path d="M64 ${n(117+15*a)}Q70 ${n(121+15*a)} 75 ${n(117+15*a)}" fill="none" stroke="#b87785" stroke-width="1" opacity="${n(a)}"/><path data-part="lower-beak" d="M43 ${n(120+17*a)}Q64 ${n(126+20*a)} 83 ${n(123+17*a)}Q91 ${n(120+10*a)} 93 114Q97 ${n(122+10*a)} 85 ${n(127+17*a)}Q64 ${n(131+20*a)} 43 ${n(124+17*a)}Q37 ${n(122+17*a)} 43 ${n(120+17*a)}Z" fill="#7994a4"/><g transform="rotate(${n(a*7)} 86 113)"><path d="M71 108Q78 104 86 109Q91 109 93 114Q79 120 60 121Q47 122 39 118Q45 112 58 112Z" fill="#728b9d"/><path d="M45 117Q60 113 76 112" fill="none" stroke="#bdd0d5" stroke-width="2.5"/><path data-part="cere" d="M63 109Q64 103 69 105Q70 99 75 102Q80 99 83 105Q88 106 86 111Q80 108 76 113Q71 109 67 112Z" fill="#ede7d1" stroke-width="1.6"/></g><path d="M91 117Q99 119 102 111" fill="none" stroke-width="2"/><path d="M94 110Q101 107 105 111" fill="none" stroke-width="1.4" opacity="${n(a)}"/></g></g>`;
}

function siipi(s,taka=false){
  const t=taka?s.takasiipi:s.siipi,auki=rajaa(t/.18);
  const taittunut='<path data-part="folded-wing" d="M120 145Q138 145 141 157Q139 169 127 174Q116 164 120 145Z" fill="#829cac"/><path d="M125 152q7 4 11 8m-11 0q5 3 7 7" fill="none" stroke-width="1.8"/>';
  if(t===0)return taka?'':taittunut;
  return `${taka?'':`<g data-part="folded-wing-layer" opacity="${n(1-auki)}">${taittunut}</g>`}<g data-part="${taka?'far':'near'}-wing" opacity="${n(auki)}" transform="translate(${taka?93:125} ${n(146-10*t)}) scale(${taka?-1:1} 1) rotate(${n(155-150*t+(s.sulat-t)*19)}) scale(${n(.72+.28*t)} ${n(.64+.58*t)})"><path d="M-5 6Q-11-3-7-13L-4-34Q-3-42 2-40Q6-39 5-32L5-21L11-45Q13-51 18-47Q21-45 18-38L14-23L23-39Q27-44 30-39Q32-36 29-31L21-17L29-24Q34-28 36-23Q38-20 33-15L18 2Q8 12-5 6Z" fill="${taka?'#7d97a8':'#a1b6c2'}"/><path d="M-1-16Q7-9 16-11M1-7Q6-2 10 1" fill="none" stroke-width="1.5"/></g>`;
}

function huivi(s){
  // Solmu pysyy kaulalla, vapaat päät reagoivat siiven jälkiliikkeeseen.
  const heilahdus=(s.sulat-s.siipi)*24+s.paaKulma*.45;
  return `<g data-part="scarf" transform="rotate(${n(s.rinta)} 110 174)"><path d="M91 138Q104 145 120 138L123 144Q109 153 94 145Z" fill="#d98a98" stroke-width="1.5"/><path d="M94 140Q106 147 119 141" fill="none" stroke="#efb6bd" stroke-width="1.6"/><g data-part="scarf-tails" transform="translate(119 145) rotate(${n(heilahdus)})"><path d="M-2 1Q-8 11-4 22L1 18L5 20Q8 10 4 1Z" fill="#b96d85" stroke-width="1.5"/><path d="M2 1Q12 3 18 14L12 14L12 19Q5 15-1 4Z" fill="#e3a0aa" stroke-width="1.5"/><path d="M0 5Q0 11-1 16M4 5l6 6" fill="none" stroke="#f1bcc3" stroke-width="1.2"/></g><path d="M116 140Q121 137 124 142L123 147Q119 150 115 145Z" fill="#d98a98" stroke-width="1.5"/></g>`;
}

export function sarjakuvapulunKuva(s,{prefix,right}){
  const jalka=x=>`<path d="M${x} 175l-2 9" fill="none" stroke="#293b48" stroke-width="5"/><path d="M${x} 175l-2 9" fill="none" stroke="#bd8581" stroke-width="2.7"/><path d="M${x-2} 182q-8 1-10 5q2 2 9-1q-4 5 0 4l5-4q4 3 7 1q1-2-8-5Z" fill="#cf9890" stroke-width="1.5"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${152+right} 304" width="${152+right}" height="304" aria-hidden="true" data-uusi-versio="${s.id}" data-style="sarjakuvakokeilu"><ellipse cx="128" cy="301" rx="21" ry="2.8" fill="#776e5a" opacity=".17"/><g data-part="whole-bird" transform="translate(128 302) scale(.56) translate(-108 -188)" stroke="${muste}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><g data-part="feet">${jalka(100)}${jalka(121)}</g>${siipi(s,true)}<g data-part="body" transform="rotate(${n(s.rinta)} 110 174)"><path d="M127 157Q141 158 152 169Q145 171 139 168L147 176Q132 178 123 167Z" fill="#698596"/><path d="M92 135Q110 127 126 140Q139 148 136 162Q133 179 112 178Q88 178 86 157Q84 145 92 135Z" fill="#a3b6c1"/><path d="M119 140Q133 145 133 159Q130 174 115 175Q123 161 119 140Z" fill="#809bad" stroke="none"/><path d="M96 140Q91 148 94 161" fill="none" stroke="#d1dadb" stroke-width="4"/><path d="M90 129Q103 123 117 133L120 149Q104 159 91 147Z" fill="#638f82"/><path d="M96 143Q103 149 113 145" fill="none" stroke="#9dbdab" stroke-width="2.5"/></g>${paa(s,prefix)}${huivi(s)}${siipi(s)}</g></svg>`;
}
