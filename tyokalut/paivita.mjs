// Kokoa vain elekatselun tiedostot hyväksytystä Matkakirjan työpuusta.
// Jokainen versio saa oman osoitepolun: uusi HTML ei voi sekoittua vanhoihin
// selaimen välimuistissa oleviin moduuleihin. Vanhat versiot säilytetään.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

const lahde=resolve(process.argv[2]||'');
if(!process.argv[2])throw new Error('Käyttö: node tyokalut/paivita.mjs /polku/Matkakirjan-tyopuuhun');
const juuri=resolve(dirname(fileURLToPath(import.meta.url)),'..');
assert.notEqual(lahde,juuri,'Lähde on erillinen Matkakirjan työpuu.');
const git=(...args)=>execFileSync('git',['-C',lahde,...args],{encoding:'utf8'}).trim();
assert.equal(git('status','--porcelain'),'','Committoi lähteen muutokset ennen julkaisupaketin kokoamista.');
const commit=git('rev-parse','HEAD'),haara=git('branch','--show-current');
const tiedostot=[
  'docs/livia-svg.html','docs/livia-svg.css','docs/livia-svg-demo.mjs','docs/livia-uudet-versiot.mjs',
  'js/livia-svg.js','js/livia-svg-paa.js','js/livia-pikselit.js','js/livia-hoyhenet.js','js/livia-astronautti.js',
  'assets/livia/livia-astronauttikypara-2x.png',
];
const hash=data=>createHash('sha256').update(data).digest('hex');
const sisallot=new Map(),kuitit=[];
const paivitetty=new Intl.DateTimeFormat('fi-FI',{dateStyle:'short',timeStyle:'short',timeZone:'Europe/Helsinki'}).format(new Date(git('show','-s','--format=%cI','HEAD')));
for(const polku of tiedostot){
  const alkuperainen=await readFile(resolve(lahde,polku));
  let julkaisu=alkuperainen;
  if(polku==='docs/livia-svg.html'){
    let html=alkuperainen.toString();
    assert.ok(html.includes('<footer>')&&html.includes('href="../"'));
    html=html.replace('href="livia-chat.html"','href="https://matkakirja.app/docs/livia-chat.html"')
      .replace('Kokeile chatin kanssa','Chattikokeilu pelisivulla').replace('href="../"','href="https://matkakirja.app/"')
      .replace('<footer>',`<footer><span>Itsenäinen elekatselu · päivitetty ${paivitetty}</span><br>`)
      .replace('<meta name="viewport"','<meta name="robots" content="noindex,nofollow"><meta name="viewport"')
      .replace('<title>Livia — kaikki eleet</title>','<title>Pulun eleet — katselu</title><link rel="icon" href="data:,">');
    julkaisu=Buffer.from(html);
  }
  if(polku==='js/livia-astronautti.js'){
    const ennen="'/assets/livia/livia-astronauttikypara-2x.png'";
    assert.ok(alkuperainen.toString().includes(ennen));
    julkaisu=Buffer.from(alkuperainen.toString().replace(ennen,"new URL('../assets/livia/livia-astronauttikypara-2x.png', import.meta.url).href"));
  }
  sisallot.set(polku,julkaisu);
  kuitit.push({polku,lahdeSha256:hash(alkuperainen),julkaisuSha256:hash(julkaisu)});
}
// Puuttuva uusi riippuvuus pysäyttää päivityksen ennen julkaisua.
for(const [polku,data]of sisallot){
  if(!/\.(?:m?js|html|css)$/.test(polku))continue;
  for(const m of data.toString().matchAll(/(?:\bfrom\s*|\bimport\s*\(|\bimport\s*)['"](\.[^'"]+)['"]/g)){
    const kohde=relative(lahde,resolve(lahde,dirname(polku),m[1]));
    assert.ok(sisallot.has(kohde),`Puuttuva moduuli: ${polku} → ${kohde}`);
  }
}
const versio=commit.slice(0,12)+'-'+hash(JSON.stringify(kuitit)).slice(0,8);
const kohde=resolve(juuri,'docs/versiot',versio);
for(const [polku,data]of sisallot){
  const tulos=resolve(kohde,polku);await mkdir(dirname(tulos),{recursive:true});await writeFile(tulos,data);
}
const html=sisallot.get('docs/livia-svg.html').toString();
await mkdir(resolve(juuri,'docs/docs'),{recursive:true});
await writeFile(resolve(juuri,'docs/index.html'),html.replace('<head>',`<head><base href="./versiot/${versio}/docs/">`));
await writeFile(resolve(juuri,'docs/docs/livia-svg.html'),html.replace('<head>',`<head><base href="../versiot/${versio}/docs/">`));
await writeFile(resolve(juuri,'docs/.nojekyll'),'');
const kuitti={lahde:'https://github.com/ravelius/Matkakirja',haara,commit,versio,tiedostot:kuitit};
await writeFile(resolve(juuri,'docs/versio.json'),JSON.stringify(kuitti,null,2)+'\n');
await writeFile(resolve(kohde,'versio.json'),JSON.stringify(kuitti,null,2)+'\n');
console.log(JSON.stringify({versio,tiedostoja:tiedostot.length,julkaisuhakemisto:resolve(juuri,'docs')},null,2));
