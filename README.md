# Pulun eleiden itsenäinen katselu

Pysyvä osoite: https://ravelius.github.io/pulun-eleet/

Tämä sivusto on erillinen katselupaketti. Se ei julkaise Matkakirjan peliä
eikä kytke katseluehdotuksia pelin ohjaimeen. Sivulla ovat nykyiset 70 elettä
ja erillinen **Uudet versiot** -ryhmä. Chattikokeilun linkki avaa pelisivun.

## Päivitys

1. Tee ja tarkista elemuutokset omassa Matkakirjan työpuussa. Committoi ne.
2. Aja tämän repon juuressa:

   ```sh
   node tyokalut/paivita.mjs /polku/Matkakirjan-tyopuuhun
   ```

3. Tarkista katselu selaimessa. Lisää vain uudet versiotiedostot sekä
   muuttuneet `docs/index.html`, `docs/docs/livia-svg.html` ja `docs/versio.json`.
4. Committoi ja pushaa `codex/katselu`-haaraan. GitHub Pages julkaisee sen
   `docs/`-hakemiston automaattisesti. Fablea tai pelin julkaisua ei tarvita.
5. Tarkista Pages-ajon onnistuminen ja julkinen sivu, ennen kuin ilmoitat
   päivityksen julkaistuksi.

`docs/versio.json` kertoo lähdecommitin sekä tiedostojen SHA-256-tiivisteet.
Versiopolut estävät uuden sivun ja vanhan JavaScriptin sekoittumisen
välimuistissa. Vanhat versiot jäävät talteen. Sivusto ei käytä service workeria,
seurantaa, kirjautumista, äänten generointia tai pelitallennuksia.

Julkaisutyökalu kopioi vain kymmenen nimettyä katselutiedostoa ja alkuperäiset
käyttöehdot julkisesta Matkakirja-reposta. Se sovittaa sivun ulkolinkit ja astronautin
kypärän osoitteen itsenäiselle sivustolle; pelin lähdetiedostot eivät muutu.
Sivusto on tekijän tilaama erillinen katselu, ja alkuperäiset käyttöehdot
säilyvät. Julkisuus ei anna oikeutta käyttää aineistoa muihin tuotteisiin.

## Nykyinen taiteellinen suunta

Omistajan 22.9.2026 palautteen jälkeen katselun kaikki kymmenen
**Uudet versiot** -elettä käyttävät alkuperäisen Pulun SVG-kasvoja,
nokkaa ja vartaloa. Sarjakuvahahmon viisi viimeisintä versiota on poistettu
nykyisestä valikoimasta. Myös vanhoihin eleisiin kokeiltu suurennettu suu
ja kieli on poistettu; ilmeet tulevat taas alkuperäisestä piirroksesta.
Aiemmat julkaisuversiot säilyvät teknisessä versiohistoriassa.

Uusi **Ihana nähdä! — vanha Pulu** hyödyntää onnistuneen tervehdyksen
liikeratoja: katse ehtii ensin, siipi käy rinnalla ja nousee sitten korkeaan
vilkutukseen. Rintasiipi, pää, hengitys ja siivenkärjet liikkuvat eri tahdissa.
Kirjan hyväksytty suunta ja peittelyele, hikipisarat sekä käsieleet säilyvät.
Katselun ehdotuksia ei ole kytketty peliin.

## Selainvarmennus

`node tyokalut/tarkista-selain.mjs` tarkistaa julkisen osoitteen kaikki
80 valintaa, kymmenen ehdotuksen ajallisen toiston, alkuperäisen Pulun
kasvot ja nokan, rintasiiven ja korkean vilkutuksen, kirjan suunnan ja
hikipisarat, 390 px leveyden, vähennetyn liikkeen sekä julkaistujen
tiedostojen SHA-256-tiivisteet. Se tarvitsee Playwrightin;
`PLAYWRIGHT_MODULE` voi osoittaa valmiiseen asennukseen ja `CHROME_PATH`
paikalliseen Chromeen.
