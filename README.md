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

Julkaisutyökalu kopioi vain kymmenen nimettyä, julkisesta Matkakirja-reposta
peräisin olevaa katselutiedostoa. Se sovittaa sivun ulkolinkit ja astronautin
kypärän osoitteen itsenäiselle sivustolle; pelin lähdetiedostot eivät muutu.

## Seuraava taiteellinen vaihe

Omistaja on antanut luvan siirtää myös vanhat eleet uuden katselupohjan
sulavaan liikkeeseen. Ensin katsotaan **Hauska nähdä** -eleen suurempi
linnunsuu. Suun käyttö muissa eleissä valitaan ilmeen tarkoituksen mukaan;
sitä ei lisätä jokaiseen eleeseen automaattisesti. Katselumuutos ja peliin
integrointi ovat erilliset vaiheet.
