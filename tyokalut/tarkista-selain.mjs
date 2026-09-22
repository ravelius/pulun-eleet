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
  assert.equal(uudet.length,10);
  assert.equal(uudet[0].id,'uusi-ilahtuu');
  assert.equal(await sivu.locator('#gesture-categories [aria-pressed=true]').textContent(),'Uudet versiot (10)');
  assert.equal(await sivu.locator('#actual svg').getAttribute('data-uusi-versio'),'uusi-ilahtuu');
  const asento=async p=>sivu.locator('#position').evaluate((el,p)=>{
    el.value=p*1000;el.dispatchEvent(new Event('input'));
  },p);
  for(const e of uudet){
    await sivu.locator(`[data-gesture="${e.id}"]`).click();await asento(.4);
    const svg=await sivu.locator('#zoom').innerHTML();
    assert.match(svg,/fill="#2e4756"/,e.id+' vanha nokka');
    assert.doesNotMatch(svg,/sarjakuvakokeilu|cartoon-eye|cartoon-beak|friendly-beak|mouth-space|data-part="tongue"|data-part="scarf"/,e.id+' ei sarjakuvahahmoa tai suukokeilua');
  }
  await sivu.locator('[data-gesture="uusi-ilahtuu"]').click();
  await asento(.325);
  assert.equal(await sivu.locator('#zoom [data-part="chest-wing"]').getAttribute('opacity'),'1');
  await sivu.screenshot({path:process.env.KUVA_RINTA||'/tmp/pulu-julkaistu-vanha-rintasiipi.png'});
  await asento(.615);
  assert.equal(await sivu.locator('#zoom [data-part="chest-wing"]').count(),0);
  assert.ok(Number(await sivu.locator('#zoom [data-part="near-wing"]').getAttribute('opacity'))>.9);
  await sivu.screenshot({path:process.env.KUVA_TERVEHDYS||'/tmp/pulu-julkaistu-vanha-tervehdys.png'});
  await asento(.70);await sivu.locator('#pause').click();
  assert.ok(Number(await sivu.locator('#position').inputValue())>=700);
  await sivu.waitForFunction(()=>Number(document.querySelector('#position').value)>730,{},{timeout:1500});
  await sivu.locator('#pause').click();
  const pysaytetty=await sivu.locator('#zoom').innerHTML();await sivu.waitForTimeout(150);
  assert.equal(await sivu.locator('#zoom').innerHTML(),pysaytetty);
  await sivu.locator('[data-gesture="uusi-bookStudy"]').click();await asento(.54);
  assert.equal(await sivu.locator('#zoom [data-part="book"]').getAttribute('data-facing'),'pulu');
  await sivu.locator('[data-gesture="uusi-bookPanic"]').click();await asento(.155);
  assert.ok(await sivu.locator('#zoom [data-part="sweat"]').count()>0);
  await asento(.31);
  assert.equal(await sivu.locator('#zoom [data-part="book-closed"]').getAttribute('opacity'),'1');
  await asento(.54);
  assert.ok((await sivu.locator('#zoom [data-part="book-turn"]').getAttribute('transform')).includes('rotate(246 23 14) translate(23 14) scale(0.73 1)'));
  await asento(.855);
  assert.ok((await sivu.locator('#zoom [data-part="glasses-adjust"]').getAttribute('transform')).startsWith('translate(0 -4)'));
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
  assert.equal(eleet.size,80);
  await sivu.locator('[data-category="uudet-versiot"]').click();
  await sivu.locator('#all').click();
  const nahdyt=new Set(),loppuraja=Date.now()+uudet.reduce((sum,e)=>sum+e.duration+650,0)+5000;
  while(Date.now()<loppuraja){
    nahdyt.add(await sivu.locator('#actual svg').getAttribute('data-uusi-versio'));
    if(await sivu.locator('#all').getAttribute('aria-pressed')==='false')break;
    await sivu.waitForTimeout(500);
  }
  assert.deepEqual([...nahdyt],uudet.map(e=>e.id));
  assert.equal(await sivu.locator('#all').getAttribute('aria-pressed'),'false');
  await sivu.setViewportSize({width:390,height:844});
  await sivu.locator('[data-gesture="uusi-ilahtuu"]').click();await asento(.3);
  assert.equal(await sivu.evaluate(()=>document.documentElement.scrollWidth),390);
  await sivu.emulateMedia({reducedMotion:'reduce'});
  await sivu.waitForFunction(()=>document.querySelector('#position').value==='450'&&!document.querySelector('#reduced').hidden);
  const ennen=await sivu.locator('#actual').innerHTML();await sivu.waitForTimeout(200);
  assert.equal(await sivu.locator('#actual').innerHTML(),ennen);
  const kypara=await sivu.evaluate(async()=>{
    const m=await import(new URL('../js/livia-astronautti.js',document.baseURI).href);
    const kuva=new Image();kuva.src=m.LIVIAN_ASTRONAUTTI_KYPARA;await kuva.decode();
    return {osoite:kuva.src,leveys:kuva.naturalWidth};
  });
  assert.ok(kypara.leveys>0&&kypara.osoite.includes('/versiot/'));
  assert.deepEqual(virheet,[]);
  const kuitti=await (await fetch(new URL('versio.json',osoite))).json();
  for(const tiedosto of kuitti.tiedostot){
    const url=new URL(`versiot/${kuitti.versio}/${tiedosto.polku}`,osoite);
    const r=await fetch(url);assert.equal(r.status,200,url.href);
    const hash=createHash('sha256').update(Buffer.from(await r.arrayBuffer())).digest('hex');
    assert.equal(hash,tiedosto.julkaisuSha256,tiedosto.polku);
  }
  console.log(JSON.stringify({osoite,versio:kuitti.versio,kategorioita:kategoriat.length,eleita:eleet.size,uusiaLiikkeessa:[...nahdyt],virheet,vanhaPulu:'PASS',rintasiipi:'PASS',tervehdys:'PASS',kirja:'PASS',hikipisarat:'PASS',mobiili:'PASS',reduced:'PASS',tiedostojenTiivisteet:'PASS',kypara},null,2));
}finally{await selain.close();}
