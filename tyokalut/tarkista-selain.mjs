// Tarkista nimenomaan julkaistu osoite, ei lähdetyöpuun localhost-sivua.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const osoite=process.argv[2]||'https://ravelius.github.io/pulun-eleet/';
const selain=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
try{
  const sivu=await selain.newPage({viewport:{width:1280,height:900}}),virheet=[];
  sivu.on('pageerror',e=>virheet.push(e.message));
  sivu.on('requestfailed',r=>virheet.push(r.url()+': '+r.failure()?.errorText));
  sivu.on('response',r=>{if(r.status()>=400)virheet.push(r.status()+' '+r.url());});
  const vastaus=await sivu.goto(osoite,{waitUntil:'networkidle'});
  assert.equal(vastaus.status(),200);
  const uudet=await sivu.evaluate(async()=>{
    const {LIVIAN_UUDET_VERSIOT}=await import(new URL('livia-uudet-versiot.mjs',document.baseURI).href);
    return LIVIAN_UUDET_VERSIOT;
  });
  assert.equal(uudet.length,10,'sarjakuvakokeilu ja aiemmat yhdeksän ovat mukana');
  assert.equal(await sivu.locator('#gesture-categories [aria-pressed=true]').textContent(),`Uudet versiot (${uudet.length})`);
  const asento=async p=>sivu.locator('#position').evaluate((el,p)=>{el.value=p*1000;el.dispatchEvent(new Event('input'));},p);
  await asento(.22);
  assert.equal(await sivu.locator('#zoom [data-style="sarjakuvakokeilu"]').count(),1);
  assert.equal(await sivu.locator('#zoom [data-part="cartoon-eye"]').count(),2);
  assert.equal(await sivu.locator('#zoom [data-part="scarf"]').count(),1);
  assert.equal(await sivu.locator('#zoom [data-part="cartoon-beak"]').getAttribute('data-beak-shape'),'pigeon');
  assert.equal(await sivu.locator('#zoom [data-part="eyelashes"]').count(),2);
  await asento(0);
  assert.ok(await sivu.locator('#zoom [data-part="cartoon-beak"]').evaluate(el=>el.getBBox().width<48),'nokka on lyhyempi kyyhkyn nokka');
  await asento(.22);
  assert.equal(await sivu.locator('#zoom [data-part="cartoon-beak"]').getAttribute('data-opening'),'1');
  const sarjaKieli=await sivu.locator('#zoom [data-part="tongue"]').evaluate(el=>{
    const b=el.getBoundingClientRect();return [.2,.4,.6,.8].some(x=>[.2,.4,.6,.8].some(y=>document.elementFromPoint(b.x+b.width*x,b.y+b.height*y)===el));
  });
  assert.ok(sarjaKieli,'sarjakuvakokeilun kieli näkyy');
  await sivu.screenshot({path:process.env.KUVA_SARJA||'/tmp/pulu-julkaistu-sarjakuvakoe.png'});
  const suueranKuvat=[];
  for(const [id,p]of [['chuckle',.32],['yawn',.48],['grin',.37],['disbelief',.33]]){
    await sivu.locator(`[data-gesture="uusi-${id}"]`).click();await asento(p);
    assert.equal(await sivu.locator('#zoom [data-part="mouth-space"]').count(),1,id+' posken aukko');
    assert.equal(await sivu.locator('#zoom [data-part="tongue"]').count(),1,id+' kieli');
    const nakyy=await sivu.locator('#zoom [data-part="tongue"]').evaluate(el=>{
      const b=el.getBoundingClientRect();
      return [.2,.4,.6,.8].some(x=>[.2,.4,.6,.8].some(y=>document.elementFromPoint(b.x+b.width*x,b.y+b.height*y)===el));
    });
    assert.ok(nakyy,id+' kieli näkyy eikä jää siiven tai alaleuan taakse');
    suueranKuvat.push(await sivu.locator('#zoom').innerHTML());
  }
  assert.equal(new Set(suueranKuvat).size,4);
  await sivu.locator('[data-gesture="uusi-welcome"]').click();await asento(.22);
  assert.equal(await sivu.locator('#zoom [data-part="friendly-beak"]').getAttribute('data-opening'),'1');
  assert.equal(await sivu.locator('#zoom [data-part="tongue"]').count(),1);
  const kieliNakyvissa=await sivu.locator('#zoom [data-part="tongue"]').evaluate(el=>{
    const b=el.getBoundingClientRect();
    return [.3,.5,.7].some(x=>[.3,.5,.7].some(y=>document.elementFromPoint(b.x+b.width*x,b.y+b.height*y)===el));
  });
  assert.ok(kieliNakyvissa,'kieli on oikeasti näkyvissä, ei vain SVG:ssä alaleuan takana');
  await sivu.screenshot({path:process.env.KUVA_SUU||'/tmp/pulu-julkaistu-suu.png'});
  await sivu.locator('[data-gesture="uusi-bookStudy"]').click();await asento(.54);
  assert.equal(await sivu.locator('#zoom [data-part="book"]').getAttribute('data-facing'),'pulu');
  await sivu.screenshot({path:process.env.KUVA_KIRJA||'/tmp/pulu-julkaistu-kirja.png'});
  await sivu.locator('[data-gesture="uusi-bookPanic"]').click();await asento(.155);
  assert.ok(await sivu.locator('#zoom [data-part="sweat"]').count()>0);
  assert.equal(await sivu.locator('#zoom [data-part="book-turn"]').getAttribute('transform'),'rotate(180 23 14)');
  await asento(.31);assert.equal(await sivu.locator('#zoom [data-part="book-closed"]').getAttribute('opacity'),'1');
  await asento(.54);
  assert.match(await sivu.locator('#zoom [data-part="book-turn"]').getAttribute('transform'),/rotate\(246 23 14\).*scale\(0.73 1\)/,'otteenvaihdon pito ja syvyyssuunnan kallistus ovat julkaistussa versiossa');
  await asento(.56);assert.ok(await sivu.locator('#zoom [data-part="whistle"]').count()>0);
  assert.equal(await sivu.locator('#zoom [data-part="book-open"]').getAttribute('opacity'),'0');
  await asento(.855);assert.ok((await sivu.locator('#zoom [data-part="glasses-adjust"]').getAttribute('transform')).startsWith('translate(0 -4)'));
  await asento(1);assert.equal(await sivu.locator('#zoom [data-part="book-turn"]').getAttribute('transform'),'rotate(360 23 14)');
  await sivu.screenshot({path:process.env.KUVA_KIIRE||'/tmp/pulu-julkaistu-kirjanhaku.png'});
  const kategoriat=await sivu.locator('[data-category]').evaluateAll(es=>es.map(e=>e.dataset.category));
  const eleet=new Set();
  for(const k of kategoriat){
    await sivu.locator(`[data-category="${k}"]`).click();
    const ids=await sivu.locator('[data-gesture]').evaluateAll(es=>es.map(e=>e.dataset.gesture));
    for(const id of ids){
      eleet.add(id);await sivu.locator(`[data-gesture="${id}"]`).click();await asento(.45);
      assert.equal(await sivu.locator('#actual svg').count(),1,id);
      assert.ok(!/NaN|Infinity|undefined/.test(await sivu.locator('#actual').innerHTML()),id);
    }
  }
  assert.equal(eleet.size,70+uudet.length);
  await sivu.locator('[data-category="uudet-versiot"]').click();
  await sivu.locator('#all').click();
  const nahdyt=new Set();
  const loppuraja=Date.now()+uudet.reduce((sum,e)=>sum+e.duration+650,0)+5000;
  while(Date.now()<loppuraja){
    nahdyt.add(await sivu.locator('#actual svg').getAttribute('data-uusi-versio'));
    if(await sivu.locator('#all').getAttribute('aria-pressed')==='false')break;
    await sivu.waitForTimeout(500);
  }
  assert.deepEqual([...nahdyt],uudet.map(e=>e.id));
  assert.equal(await sivu.locator('#all').getAttribute('aria-pressed'),'false');
  await sivu.setViewportSize({width:390,height:844});
  await sivu.locator('[data-gesture="uusi-welcome"]').click();await asento(.3);
  assert.equal(await sivu.evaluate(()=>document.documentElement.scrollWidth),390);
  await sivu.emulateMedia({reducedMotion:'reduce'});
  // matchMedia-change saapuu seuraavalla selainkierroksella.
  await sivu.waitForFunction(()=>document.querySelector('#position').value==='450'&&!document.querySelector('#reduced').hidden);
  const ennen=await sivu.locator('#actual').innerHTML();await sivu.waitForTimeout(200);
  assert.equal(await sivu.locator('#actual').innerHTML(),ennen);
  const kypara=await sivu.evaluate(async()=>{
    const m=await import(new URL('../js/livia-astronautti.js',document.baseURI).href);
    const kuva=new Image();kuva.src=m.LIVIAN_ASTRONAUTTI_KYPARA;await kuva.decode();
    return {osoite:kuva.src,leveys:kuva.naturalWidth};
  });
  assert.ok(kypara.leveys>0);assert.ok(kypara.osoite.includes('/versiot/'));
  assert.deepEqual(virheet,[]);
  const kuitti=await (await fetch(new URL('versio.json',osoite))).json();
  for(const tiedosto of kuitti.tiedostot){
    const url=new URL(`versiot/${kuitti.versio}/${tiedosto.polku}`,osoite);
    const r=await fetch(url);assert.equal(r.status,200,url.href);
    const hash=createHash('sha256').update(Buffer.from(await r.arrayBuffer())).digest('hex');
    assert.equal(hash,tiedosto.julkaisuSha256,tiedosto.polku);
  }
  console.log(JSON.stringify({osoite,versio:kuitti.versio,kategorioita:kategoriat.length,eleita:eleet.size,uusiaLiikkeessa:[...nahdyt],virheet,sarjakuvakokeiluJaHuivi:'PASS',suu:'PASS',toinenSuuerä:'PASS',kirja:'PASS',mobiili:'PASS',reduced:'PASS',tiedostojenTiivisteet:'PASS',kypara},null,2));
}finally{await selain.close();}
