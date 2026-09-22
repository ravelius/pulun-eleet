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

Julkaisutyökalu kopioi vain yksitoista nimettyä katselutiedostoa ja alkuperäiset
käyttöehdot julkisesta Matkakirja-reposta. Se sovittaa sivun ulkolinkit ja astronautin
kypärän osoitteen itsenäiselle sivustolle; pelin lähdetiedostot eivät muutu.
Sivusto on tekijän tilaama erillinen katselu, ja alkuperäiset käyttöehdot
säilyvät. Julkisuus ei anna oikeutta käyttää aineistoa muihin tuotteisiin.

## Seuraava taiteellinen vaihe

Kirjan korjattu suunta ja kannet on hyväksytty 22.9.2026: niitä ei muuteta.
Omistaja on antanut luvan siirtää myös vanhat eleet uuden katselupohjan
sulavaan liikkeeseen. **Hauska nähdä** -eleen linnunsuun jälkeen toinen
erä kokeilee suuta naurussa, haukotuksessa, virneessä ja epäuskossa.
Suun käyttö valitaan ilmeen tarkoituksen mukaan;
sitä ei lisätä jokaiseen eleeseen automaattisesti. Katselumuutos ja peliin
integrointi ovat erilliset vaiheet.

## Selainvarmennus

`node tyokalut/tarkista-selain.mjs` tarkistaa julkisen osoitteen kaikki
80 valintaa, kymmenen ehdotuksen aidon ajallisen toiston, suun ja kielen
näkyvyyden, kirjan suunnan, 390 px leveyden, vähennetyn liikkeen sekä
kaikkien julkaistujen tiedostojen tiivisteet. Se tarvitsee Playwrightin;
`PLAYWRIGHT_MODULE` voi osoittaa valmiiseen asennukseen ja `CHROME_PATH`
paikalliseen Chromeen. Kuittaus tulostuu lopuksi, kaappaukset menevät
oletuksena `/tmp/pulu-julkaistu-suu.png` ja `/tmp/pulu-julkaistu-kirja.png`.

Viides katseluele on omistajan pyytämä **Kiireinen kirjanhaku** (11 s):
seitsemän nopeaa sivunkääntöä syvässä kyyryssä, hiki, havahtuminen, kirjan
läimäys kiinni, pitkäksi suoristautuminen, visuaalinen vihellys ja hidas
kirjan kääntö, kirjan avaaminen, silmälasien oikaisu ja arvokas loppuasento.
Se on erillinen harvinainen sähläysnumero; hyväksytty rauhallinen selaus säilyy.
Suljettu kirja ei vain pyöri paikoillaan: ranteen vastaliike, nosto rinnan
lähelle, kahden kierron välissä tapahtuva otteenvaihto ja syvyyssuunnan
kallistus saavat esineen seuraamaan Pulun siipeä ja vartaloa.

Toisen erän neljä versiota ovat ryhmän alussa: **Hiljainen naurunpyrskähdys**,
**Valtava haukotus**, **Leveä virne** ja **Et ole tosissasi**. Nauru purkautuu
kahdessa erikokoisessa painotuksessa, haukotus kasvaa venytykseen, virne
alkaa silmistä ja epäusko jää hetkeksi paikalleen suu raollaan.
Kieli ja posken läpi näkyvä aukko kuuluvat kaikkiin neljään. Aiemmat viisi
katseluversiota säilyvät muuttumattomina. Tämäkään erä ei muuta peliä.

## Erillinen sarjakuvakokeilu

Omistajan 22.9.2026 pyytämä Aku Ankka -henkinen piirrostyylin kokeilu on
ryhmän ensimmäinen painike **Sarjakuvapulu — tyylikokeilu**. Se käyttää omaa
SVG-piirrosta ja tutun tervehdyksen ajoitusta. Livia on omistajan täsmennyksen
mukaan nuori naaras: utelias, viehättävä ja omanarvontuntoinen. Koralliroosa
kaulahuivi, suuret silmät, selkeä ääriviiva ja joustava nokka muuttavat
piirroksen ilmettä. Ei ihmishuulia tai hampaita. Aiemmat yhdeksän ehdotusta
säilyvät tavulleen. Tämä ei ole hahmon vaihtaminen peliin.

Omistajan seuraava tarkennus: oma kyyhkyhahmo sarjakuvan maailmassa,
ei Aku Ankkaa muistuttava Pulu. Toisessa piirroksessa on lyhyempi ja
terävämpi kyyhkyn nokka, kevyemmät kulmat, lämpimämpi katse, pienet
ripset ja pehmeämmät posket. Huivi ja tervehdysrata säilyvät. Sama
kokeilupainike päivittyy, edellinen piirros säilyy versiona
`cc2bf7a24c35-571733d1`.
