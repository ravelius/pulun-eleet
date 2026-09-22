/*
 * Livian astronauttiasu on vain Astronautin kamera -linssin tila.
 * Hahmo ja ilmeet pysyvät samassa SVG-paperinukessa; tämä moduuli
 * omistaa ainoastaan linssin body-luokan ja asusteen osoitteen.
 */

export const LIVIAN_ASTRONAUTTI_LUOKKA = 'livia-astronautti-paalla';
export const LIVIAN_ASTRONAUTTI_PUHE_LUOKKA = 'livia-astronautti-puhuu';
export const LIVIAN_ASTRONAUTTI_KYPARA = new URL('../assets/livia/livia-astronauttikypara-2x.png', import.meta.url).href;

/** Lisää astronauttitilan vain tämän linssin elinkaareksi. */
export function asennaLivianAstronauttitila(doc = document) {
  const body = doc?.body;
  if (!body?.classList) return { paalla: () => false, pura() {} };
  const oliPaalla = body.classList.contains(LIVIAN_ASTRONAUTTI_LUOKKA);
  if (!oliPaalla) body.classList.add(LIVIAN_ASTRONAUTTI_LUOKKA);
  let purettu = false;
  return {
    paalla: () => !purettu && body.classList.contains(LIVIAN_ASTRONAUTTI_LUOKKA),
    pura() {
      if (purettu) return;
      purettu = true;
      if (!oliPaalla) body.classList.remove(LIVIAN_ASTRONAUTTI_LUOKKA);
    },
  };
}
