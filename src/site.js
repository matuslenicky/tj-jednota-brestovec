// Statický generátor webu TJ Jednota Brestovec: data/ + src/ -> dist/   (node build.js; TODAY=2026-11-18 prepíše dnešný dátum)
// Zostavuje ho kluby-siet/engine/assemble.py zo spoločného jadra v2 a tohto súboru (vzhľad, úvod, stránka Klub).
// Kostra „Rozpis“: hlavným obsahom úvodu je celý rozpis kôl áčka ako sadzaná tabuľka zo športovej strany novín
// (kolo, dátum, zápas domáci – hostia, výsledok alebo čas), rozdelená na jeseň a jar. Vedľa najbližší zápas a miesto
// v tabuľke, pod tým celá tabuľka ligy. Modrá a žltá z erbu a obce, papierová biela. Písmo Barlow Condensed a EB Garamond.
const SKIN = {
  nav: 'bar', theme: '#1d4a9b', brand: 'TJ Jednota Brestovec', brandSub: 'futbal od roku 1951',
  fonts: ['barlow-condensed-700.woff', 'eb-garamond-400.woff', 'eb-garamond-600.woff'],
  sources: 'Ihrisko a obec podľa webu obce Brestovec.',
  adminHero: 'Rozpis jesene a jari',
  adminFacts: club.kronika.zoznam.map((x) => ({ k: x.rok, t: x.text })),
  links: [[club.obecKlub, 'Futbal na webe obce']],
};
const NAV = [['zapasy/', 'Zápasy'], ['tabulky/', 'Tabuľky'], ['timy/', 'Tímy'], ['klub/', 'Klub'], ['kontakt/', 'Kontakt']];
const DESC = `${club.nazov} – rozpis, výsledky a tabuľka áčka (${A.leagueName}), prípravka a súpisky. Futbal v Brestovci od roku ${club.zalozenie}.`;

// rozpis áčka po polsezónach: jeseň (júl – december) a jar (január – jún)
const shortOpp = (s) => esc(s);
function rozpis(R) {
  const list = teamMatches(A.slug).filter((m) => !m.cup).sort((a, b) => (a.date < b.date ? -1 : 1));
  const half = (m) => (Number(m.date.slice(5, 7)) >= 7 ? 'j' : 'r');
  const groups = [['j', `Jeseň ${SEASON.slice(0, 4)}`], ['r', `Jar ${Number(SEASON.slice(0, 4)) + 1}`]];
  const row = (m) => {
    const d = dObj(m.date);
    const us = '<b>Brestovec</b>';
    const them = shortOpp(m.opponent);
    const match = m.home ? `${us} – ${them}` : `${them} – ${us}`;
    const href = m.detail || !m.past ? `${R}${m.url}` : '';
    const val = m.past ? (m.score ? `<span class="rz-s rz-s--${m.res}"><span class="sr">${RES[m.res]}, </span>${esc(m.score)}</span>` : '<span class="rz-s">–</span>') : `<span class="rz-t">${esc(m.time || '')}</span>`;
    const isNext = m === nextA;
    return `<tr${isNext ? ' class="rz-next"' : ''}><td class="rz-k">${esc((m.roundName || '').replace(/\D+/g, '')) || '·'}</td><td class="rz-d"><span class="rz-dd">${dDay(m.date)}</span> ${d.getUTCDate()}. ${d.getUTCMonth() + 1}.</td><th scope="row" class="rz-m">${href ? `<a href="${href}">${match}</a>` : match}${isNext ? '<span class="rz-tag">najbližší</span>' : ''}</th><td class="rz-v">${val}</td></tr>`;
  };
  return groups.map(([k, label]) => {
    const g = list.filter((m) => half(m) === k);
    if (!g.length) return '';
    return `<tbody><tr class="rz-h"><th colspan="4" scope="rowgroup">${label}</th></tr>${g.map(row).join('')}</tbody>`;
  }).join('');
}

add('', {
  title: 'futbal v Brestovci', active: '', bodyClass: 'home',
  body: (R) => {
    const n = nextA;
    const wl = winterLine();
    const me = A.table?.rows.find((r) => r.our);
    return `<section class="rz-top"><div class="wrap">
  <h1 class="h1">TJ Jednota Brestovec</h1>
  <p class="rz-p">${esc(A.leagueName)}, ročník ${SEASON}. Víťaz VII. ligy ObFZ Trenčín 2023/24, futbal v obci od roku ${club.zalozenie}.</p>
</div></section>
<section class="sec sec--first"><div class="wrap rz-grid">
  <section class="rz-main" aria-labelledby="rz-h">
    <h2 class="rz-h2" id="rz-h">Rozpis áčka</h2>
    <div class="tbl-wrap"><table class="rz"><caption class="sr">Rozpis zápasov áčka v ročníku ${SEASON}: kolo, dátum, zápas (domáci – hostia), výsledok alebo čas výkopu</caption>
      <thead><tr><th scope="col" class="rz-k">Kolo</th><th scope="col" class="rz-d">Dátum</th><th scope="col" class="rz-m">Zápas</th><th scope="col" class="rz-v">Výsledok</th></tr></thead>
      ${rozpis(R)}
    </table></div>
    ${more(`${R}zapasy/`, 'Všetky zápasy aj prípravky')}
  </section>
  <aside class="rz-side">
    ${n ? `<section class="rz-box" aria-labelledby="n-h">
      <h2 class="rz-k2" id="n-h">${wl ? 'Po zimnej prestávke' : 'Najbližší zápas'}</h2>
      <p class="rz-big">${n.home ? 'Brestovec – ' : ''}${glueAbbr(esc(n.opponent))}${n.home ? '' : ' – Brestovec'}</p>
      <p class="rz-meta"><time datetime="${n.date}">${dLong(n.date)}</time>${n.time ? `, ${esc(n.time)}` : ''}</p>
      <a class="btn" href="${R}kalendar/zapas-${n.id}.ics" download>${I.cal}Do kalendára</a>
    </section>` : ''}
    ${me ? `<section class="rz-box" aria-labelledby="m-h">
      <h2 class="rz-k2" id="m-h">V tabuľke</h2>
      <p class="rz-big">${me.pos}. miesto <span>${zo(A.of)}</span></p>
      <p class="rz-meta">${me.pts} ${pw(me.pts, 'bod', 'body', 'bodov')}, skóre ${me.gf}:${me.ga}, ${me.won} ${pw(me.won, 'výhra', 'výhry', 'výhier')}</p>
      ${more(`${R}tabulky/`, 'Celá tabuľka')}
    </section>` : ''}
  </aside>
</div></section>
${A.table ? `<section class="sec sec--tint" aria-labelledby="t-h"><div class="wrap rz-tablewrap">
  <h2 class="rz-h2" id="t-h">${esc(A.leagueName)}</h2>
  ${tableHtml(A.table, R)}
</div></section>` : ''}`;
  },
});

add('klub/', {
  title: 'Klub', active: 'klub/', desc: `${club.nazov}: futbal od roku ${club.zalozenie}, tituly vo VII. lige ObFZ Trenčín 2015/16 a 2023/24, ročníky áčka, ihrisko Pod Solniskom a obec Brestovec.`,
  body: (R) => `${pageHead({ title: 'Klub', sub: `${esc(club.pravnyNazov)}, v erbe rok ${club.zalozenie}. Klubové farby: ${esc(club.farby)}.`, R, crumbs: [[null, 'Klub']] })}
<section class="sec sec--first"><div class="wrap cols2">
  <div><h2 class="h2">Z ročníkov</h2>${facts(club.kronika.zoznam.map((x) => ({ k: x.rok, t: x.text })))}</div>
  <div><h2 class="h2">Ročníky áčka</h2>${seasonsTable(club.rocniky.zoznam)}</div>
</div></section>
<section class="sec sec--tint"><div class="wrap cols2">
  <div><h2 class="h2">${esc(ST.nazov)}</h2>${facts(ST.fakty)}
    <p class="btns"><a class="btn btn--line" href="https://www.google.com/maps/dir/?api=1&amp;destination=${ST.geo.join(',')}" rel="noopener">Navigovať na ihrisko</a></p></div>
  <div><h2 class="h2">Brestovec</h2>${facts(club.obec.fakty)}<p class="note">Zdroje: Sportnet, web obce Brestovec (História a život obce, Symboly obce, Futbal).</p></div>
</div></section>`,
});
