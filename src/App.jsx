import React, { useState, useMemo } from 'react';

// ---------- TRANSLATIONS ----------
const T = {
  de: {
    eyebrow: 'Köln · heute', title1: 'Köln', title2: 'Umsonst',
    tabToday: 'Heute', tabWeek: 'Diese Woche', tabMonth: 'Diesen Monat', tabUpcoming: 'Demnächst', tabPast: 'Bereits vorbei',
    free: 'KOSTENLOS', past: 'VORBEI',
    emptyTitle: 'Willkommen bei Köln Umsonst!',
    emptyText: 'Hier findest du alle kostenlosen Open-Air-Events in Köln: Straßenfeste, Weihnachtsmärkte, Feuerwerk und mehr. Für diesen Zeitraum ist noch nichts eingetragen. Schau doch bei Diesen Monat vorbei oder komm später wieder.',
    eventsNear: v => `${v} Events`, fromStation: 'Von:', route: 'Route',
  },
  en: {
    eyebrow: 'Cologne · today', title1: 'Köln', title2: 'Umsonst',
    tabToday: 'Today', tabWeek: 'This Week', tabMonth: 'This Month', tabUpcoming: 'Upcoming', tabPast: 'Already past',
    free: 'FREE', past: 'PAST',
    emptyTitle: 'Welcome to Köln Umsonst!',
    emptyText: "Here you'll find every free open-air event in Cologne: street festivals, Christmas markets, fireworks and more. Nothing is listed for this time range yet. Try This Month or check back soon.",
    eventsNear: v => `${v} events`, fromStation: 'From:', route: 'Route',
  },
  es: {
    eyebrow: 'Colonia · hoy', title1: 'Köln', title2: 'Umsonst',
    tabToday: 'Hoy', tabWeek: 'Esta semana', tabMonth: 'Este mes', tabUpcoming: 'Próximamente', tabPast: 'Ya pasaron',
    free: 'GRATIS', past: 'PASADO',
    emptyTitle: '¡Bienvenido a Köln Umsonst!',
    emptyText: 'Aquí encontrarás todos los eventos gratis al aire libre en Colonia: fiestas de barrio, mercados de Navidad, fuegos artificiales y más. Todavía no hay nada para este período. Prueba con Este mes o vuelve pronto.',
    eventsNear: v => `${v} eventos`, fromStation: 'Desde:', route: 'Ruta',
  },
};

// ---------- EVENT DATA (verified 24 Aug 2026) ----------
// category colors pulled from the sunset-photo palette
const CATS = {
  strassenfest: { label: { de: 'Straßenfest', en: 'Street Festival', es: 'Fiesta de barrio' }, stripe: '#c9812f', chip: '#f3e3d0', text: '#8a4a1a', icon: '🎉',
    desc: { de: 'Ein Veedel (Stadtviertel) sperrt seine Straßen für den Verkehr und feiert mit Live-Musik, Essensständen und Nachbarschaftsflair.',
      en: 'A neighborhood closes its streets to traffic and celebrates with live music, food stalls and a community atmosphere.',
      es: 'Un barrio cierra sus calles al tráfico y celebra con música en vivo, puestos de comida y ambiente vecinal.' } },
  kirmes: { label: { de: 'Kirmes', en: 'Funfair', es: 'Feria' }, stripe: '#b5762a', chip: '#f0dcc0', text: '#7a4318', icon: '🎡',
    desc: { de: 'Traditioneller Jahrmarkt mit Fahrgeschäften, Riesenrad und Buden am Rheinufer. Der Eintritt zum Gelände ist frei, Fahrten kosten extra.',
      en: 'Traditional funfair with rides, a ferris wheel and stalls on the Rhine riverbank. Entry to the grounds is free, rides cost extra.',
      es: 'Feria tradicional con atracciones, noria y puestos junto al Rin. La entrada al recinto es gratis, las atracciones se pagan aparte.' } },
  weihnacht: { label: { de: 'Weihnachtsmarkt', en: 'Christmas Market', es: 'Mercado navideño' }, stripe: '#8a4560', chip: '#ecd9de', text: '#6a3348', icon: '🎄',
    desc: { de: 'Weihnachtlich geschmückte Stände mit Glühwein, Kunsthandwerk und Süßem. Der Eintritt ist frei, nur einzelne Attraktionen wie Eislaufen kosten.',
      en: 'Festively decorated stalls with mulled wine, crafts and sweets. Entry is free; only extras like ice skating cost money.',
      es: 'Puestos decorados navideños con vino caliente, artesanías y dulces. La entrada es gratis, solo algunas atracciones como patinaje se pagan.' } },
  gamescom: { label: { de: 'Gamescom City Festival', en: 'Gamescom City Festival', es: 'Fiesta post-Gamescom' }, stripe: '#5a7d8a', chip: '#dde8ea', text: '#2f4a52', icon: '🎮',
    desc: { de: 'Kostenlose Open-Air-Konzerte in der Innenstadt zum Abschluss der Gamescom, der weltgrößten Videospielmesse. Kein Messeticket nötig.',
      en: 'Free open-air concerts downtown marking the close of Gamescom, the world\'s largest video game trade fair. No expo ticket needed.',
      es: 'Conciertos gratis al aire libre en el centro para cerrar la Gamescom, la feria de videojuegos más grande del mundo. No requiere entrada a la feria.' } },
  karneval: { label: { de: 'Karneval', en: 'Carnival', es: 'Carnaval' }, stripe: '#a83a5a', chip: '#f2d8e0', text: '#7a2840', icon: '🎭',
    desc: { de: 'Kölns fünfte Jahreszeit: die offizielle Eröffnung der Karnevalssession auf dem Alter Markt, mit Musik und Kostümen.',
      en: "Cologne's fifth season: the official opening of the carnival season at Alter Markt, with music and costumes.",
      es: 'La quinta estación de Colonia: apertura oficial de la temporada de Carnaval en Alter Markt, con música y disfraces.' } },
  feuerwerk: { label: { de: 'Feuerwerk', en: 'Fireworks', es: 'Fuegos artificiales' }, stripe: '#c9812f', chip: '#f3e3d0', text: '#8a4a1a', icon: '🎆',
    desc: { de: 'Musiksynchrones Höhenfeuerwerk über dem Rhein, eines der größten Europas. Der Blick vom Ufer ist kostenlos.',
      en: "Music-synchronized fireworks over the Rhine, one of Europe's largest. Viewing from the riverbank is free.",
      es: 'Fuegos artificiales sincronizados con música sobre el Rin, de los más grandes de Europa. Verlos desde la orilla es gratis.' } },
  pride: { label: { de: 'CSD / Pride', en: 'CSD / Pride', es: 'CSD / Orgullo' }, stripe: '#a83a5a', chip: '#f2d8e0', text: '#7a2840', icon: '🏳️‍🌈',
    desc: { de: 'Straßenfest und Parade für queere Rechte in der Altstadt, mit Bühnen, Musik und Reden. Eines der größten CSD-Events Europas.',
      en: 'Street festival and parade for queer rights in the old town, with stages, music and speeches. One of the largest CSD events in Europe.',
      es: 'Fiesta callejera y desfile por los derechos queer en el casco antiguo, con escenarios, música y discursos. Uno de los CSD más grandes de Europa.' } },
  marathon: { label: { de: 'Marathon', en: 'Marathon', es: 'Maratón' }, stripe: '#4a7d5a', chip: '#dcecdf', text: '#2f5a3a', icon: '🏃',
    desc: { de: 'Der Kölner Marathon zieht Hunderttausende Zuschauer an die Strecke. Die ganze Stadt feiert mit Live-Musik und Partystimmung am Streckenrand — Zuschauen ist kostenlos.',
      en: "The Cologne Marathon draws hundreds of thousands of spectators along the route. The whole city celebrates with live music and a party vibe on the sidelines — watching is free.",
      es: 'El Maratón de Colonia atrae a cientos de miles de espectadores a lo largo del recorrido. Toda la ciudad festeja con música en vivo — ver la carrera es gratis.' } },
};

const EVENTS = [
  { id: 'e1', date: '2026-08-28', endDate: '2026-08-30', cat: 'strassenfest',
    name: { de: 'Rot-Weißes Straßenfest', en: 'Rot-Weißes Straßenfest', es: 'Rot-Weißes Straßenfest' },
    loc: 'Porz-Wahn', source: 'koeln.de' },
  { id: 'e2', date: '2026-08-29', endDate: '2026-08-30', cat: 'gamescom',
    name: { de: 'Gamescom City Festival', en: 'Gamescom City Festival', es: 'Gamescom City Festival' },
    loc: 'Hohenzollernring, Rudolfplatz', source: 'citynews-koeln.de' },
  { id: 'e3', date: '2026-08-29', endDate: '2026-08-30', cat: 'strassenfest',
    name: { de: 'Lindenthaler Sommerfest', en: 'Lindenthaler Sommerfest', es: 'Lindenthaler Sommerfest' },
    loc: 'Dürener Straße, Lindenthal', source: 'citynews-koeln.de' },
  { id: 'e4', date: '2026-09-12', endDate: '2026-09-13', cat: 'strassenfest',
    name: { de: 'Straßenfest Landmannstraße', en: 'Landmannstraße Street Festival', es: 'Fiesta de Landmannstraße' },
    loc: 'Ehrenfeld', source: 'koeln-muelheim.de' },
  { id: 'e5', date: '2026-09-19', endDate: '2026-09-20', cat: 'strassenfest',
    name: { de: 'Dä längste Desch vun Kölle', en: 'Dä längste Desch vun Kölle', es: 'Dä längste Desch vun Kölle' },
    loc: 'Severinsviertel', source: 'mitvergnuegen.com' },
  { id: 'e6', date: '2026-09-19', endDate: '2026-09-19', cat: 'strassenfest',
    name: { de: 'Trimbornstraßenfest', en: 'Trimbornstraßenfest', es: 'Trimbornstraßenfest' },
    loc: 'Kalk', source: 'mitvergnuegen.com' },
  { id: 'e7', date: '2026-10-24', endDate: '2026-11-01', cat: 'kirmes',
    name: { de: 'Herbstkirmes Deutz', en: 'Deutz Autumn Funfair', es: 'Feria de otoño en Deutz' },
    loc: 'Deutzer Werft', source: 'deutzerkirmes.de' },
  { id: 'e8', date: '2026-11-11', endDate: '2026-11-11', cat: 'karneval',
    name: { de: 'Elfter im Elften: Sessionseröffnung', en: 'Carnival Season Opening (11.11)', es: 'Apertura de la temporada de Carnaval (11.11)' },
    loc: 'Alter Markt', source: 'koelnerkarneval.de' },
  { id: 'e9', date: '2026-11-13', endDate: '2027-01-03', cat: 'weihnacht',
    name: { de: 'Hafen-Weihnachtsmarkt', en: 'Harbour Christmas Market', es: 'Mercado navideño del puerto' },
    loc: 'Schokoladenmuseum', source: 'schokoladenmuseum.de' },
  { id: 'e10', date: '2026-11-16', endDate: '2026-12-23', cat: 'weihnacht',
    name: { de: 'Weihnachtsmarkt am Kölner Dom', en: 'Christmas Market at Cologne Cathedral', es: 'Mercado navideño de la Catedral' },
    loc: 'Roncalliplatz', source: 'koelnerweihnachtsmarkt.com' },
  { id: 'e11', date: '2026-11-16', endDate: '2026-12-23', cat: 'weihnacht',
    name: { de: 'Weihnachtsmarkt im Stadtgarten', en: 'Stadtgarten Christmas Market', es: 'Mercado navideño Stadtgarten' },
    loc: 'Venloer Str. 40', source: 'deutsche-weihnachtsmaerkte.de' },
  { id: 'e12', date: '2026-11-17', endDate: '2026-12-23', cat: 'weihnacht',
    name: { de: 'Markt der Engel', en: 'Market of Angels', es: 'Mercado de los Ángeles' },
    loc: 'Neumarkt', source: 'koeln.de' },
  { id: 'e13', date: '2026-11-24', endDate: '2026-12-23', cat: 'weihnacht', img: '/images/heinzels-altermarkt.jpg',
    name: { de: "Heinzels Wintermärchen (Alter Markt)", en: "Heinzel's Winter Fairytale (Alter Markt)", es: 'Heinzels Wintermärchen (Alter Markt)' },
    loc: 'Altstadt', source: 'heinzels-wintermaerchen.de',
    caption: { de: 'Der Eingang im Stil der Kölner Heinzelmännchen-Sage, mit Türmchen und goldenen Verzierungen.',
      en: 'The entrance, styled after the Cologne legend of the Heinzelmännchen, with turrets and golden details.',
      es: 'La entrada con estilo de la leyenda de los Heinzelmännchen de Colonia, con torretas y detalles dorados.' } },
  { id: 'e14', date: '2026-11-24', endDate: '2027-01-04', cat: 'weihnacht', img: '/images/heinzels-heumarkt.jpg',
    name: { de: "Heinzels Wintermärchen (Heumarkt, Eislaufbahn)", en: "Heinzel's Winter Fairytale (Heumarkt, ice rink)", es: 'Heinzels Wintermärchen (Heumarkt, pista de hielo)' },
    loc: 'Altstadt', source: 'heinzels-wintermaerchen.de',
    caption: { de: 'Zweiter Eingang zu Heinzels Wintermärchen, hier mit Zugang zur großen Eislaufbahn auf dem Heumarkt.',
      en: 'Second entrance to Heinzels Wintermärchen, leading to the large ice rink at Heumarkt.',
      es: 'Segunda entrada a Heinzels Wintermärchen, que da acceso a la gran pista de hielo en el Heumarkt.' } },
  { id: 'e15', date: '2026-09-05', endDate: '2026-09-06', cat: 'strassenfest',
    name: { de: 'Bunt im Carrée', en: 'Bunt im Carrée', es: 'Bunt im Carrée' },
    loc: 'Berrenrather Str. / Sülzburgstr., Sülz-Klettenberg', source: 'koeln.de' },
  { id: 'e16', date: '2026-09-12', endDate: '2026-09-12', cat: 'strassenfest',
    name: { de: 'Herthastraßenfest', en: 'Herthastraßenfest', es: 'Herthastraßenfest' },
    loc: 'Herthastraße, Zollstock', source: 'koeln.de' },
  { id: 'e17', date: '2026-09-26', endDate: '2026-09-27', cat: 'strassenfest',
    name: { de: 'Dellbrücker Straßenfest', en: 'Dellbrücker Straßenfest', es: 'Dellbrücker Straßenfest' },
    loc: 'Dellbrücker Hauptstraße', source: 'koeln.de' },
  { id: 'e18', date: '2026-10-04', endDate: '2026-10-04', cat: 'marathon',
    name: { de: 'Generali Köln Marathon', en: 'Generali Cologne Marathon', es: 'Maratón de Colonia (Generali)' },
    loc: 'Innenstadt, Start Ottoplatz Deutz', source: 'generali-koeln-marathon.de' },
  { id: 'e19', date: '2026-10-09', endDate: '2026-10-11', cat: 'strassenfest',
    name: { de: 'Lindenthaler Herbstfest (Street Gallery)', en: 'Lindenthal Autumn Festival (Street Gallery)', es: 'Fiesta de otoño en Lindenthal (Street Gallery)' },
    loc: 'Karl-Schwering-Platz, Lindenthal', source: 'koeln.de' },
  { id: 'e20', date: '2026-11-16', endDate: '2026-12-23', cat: 'weihnacht',
    name: { de: 'Nikolausdorf', en: 'Nikolausdorf Christmas Market', es: 'Nikolausdorf' },
    loc: 'Rudolfplatz', source: 'rheinlandtourismus.de' },
  { id: 'e21', date: '2026-12-31', endDate: '2027-01-01', cat: 'feuerwerk',
    name: { de: 'Silvester am Rhein', en: "New Year's Eve on the Rhine", es: 'Fin de año en el Rin' },
    loc: 'Rheinufer, Altstadt und Brücken', source: 'stadt-koeln.de',
    caption: { de: 'Traditioneller Treffpunkt zum Jahreswechsel am Ufer und auf den Brücken, mit informellem Feuerwerk aus der Nachbarschaft.',
      en: 'Traditional New Year gathering spot along the riverbank and bridges, with informal neighborhood fireworks.',
      es: 'Punto de encuentro tradicional de fin de año en la orilla y los puentes, con fuegos artificiales informales del vecindario.' } },
  // already past — included per request, marked visually
  { id: 'p1', date: '2026-04-24', endDate: '2026-04-25', cat: 'strassenfest',
    name: { de: 'Tag des Veedels', en: 'Tag des Veedels', es: 'Tag des Veedels' },
    loc: 'Mülheim, Braunsfeld u.a.', source: 'citynews-koeln.de', isPast: true },
  { id: 'p2', date: '2026-04-25', endDate: '2026-04-26', cat: 'strassenfest',
    name: { de: 'Bunt im Carrée', en: 'Bunt im Carrée', es: 'Bunt im Carrée' },
    loc: 'Berrenrather Str., Sülz', source: 'verliebtinkoeln.com', isPast: true },
  { id: 'p3', date: '2026-05-14', endDate: '2026-05-17', cat: 'strassenfest',
    name: { de: 'Frühlingsfest Rheinuferpromenade', en: 'Frühlingsfest Rheinuferpromenade', es: 'Frühlingsfest Rheinuferpromenade' },
    loc: 'Rheinuferpromenade, Innenstadt', source: 'verliebtinkoeln.com', isPast: true },
  { id: 'p4', date: '2026-05-14', endDate: '2026-05-17', cat: 'strassenfest',
    name: { de: 'Porzer Inselfest', en: 'Porzer Inselfest', es: 'Porzer Inselfest' },
    loc: 'Zündorfer Groov, Porz', source: 'verliebtinkoeln.com', isPast: true },
  { id: 'p5', date: '2026-05-30', endDate: '2026-05-31', cat: 'strassenfest',
    name: { de: 'Musikfestival Rath/Heumar', en: 'Musikfestival Rath/Heumar', es: 'Musikfestival Rath/Heumar' },
    loc: 'Kurt-Henn-Platz', source: 'verliebtinkoeln.com', isPast: true },
  { id: 'p6', date: '2026-06-04', endDate: '2026-06-05', cat: 'strassenfest',
    name: { de: 'Frühlingsmarkt Rodenkirchen', en: 'Frühlingsmarkt Rodenkirchen', es: 'Frühlingsmarkt Rodenkirchen' },
    loc: 'Maternusplatz, Rodenkirchen', source: 'verliebtinkoeln.com', isPast: true },
  { id: 'p7', date: '2026-06-19', endDate: '2026-06-21', cat: 'strassenfest',
    name: { de: 'Sommerfest am Rheinauhafen', en: 'Sommerfest am Rheinauhafen', es: 'Sommerfest am Rheinauhafen' },
    loc: 'Rheinauhafen am Schokoladenmuseum', source: 'lindweiler.de', isPast: true },
  { id: 'p8', date: '2026-07-11', endDate: '2026-07-12', cat: 'strassenfest',
    name: { de: 'Veedelsfest Rodenkirchen', en: 'Veedelsfest Rodenkirchen', es: 'Veedelsfest Rodenkirchen' },
    loc: 'Maternusplatz, Rodenkirchen', source: 'lindweiler.de', isPast: true },
  { id: 'p9', date: '2026-07-12', endDate: '2026-07-12', cat: 'strassenfest',
    name: { de: 'Rothehausstraßenfest', en: 'Rothehausstraßenfest', es: 'Rothehausstraßenfest' },
    loc: 'Ehrenfeld', source: 'festivalsindeutschland.de', isPast: true },
  { id: 'p10', date: '2026-07-03', endDate: '2026-07-05', cat: 'pride',
    name: { de: 'CSD-Straßenfest', en: 'CSD Street Festival', es: 'Fiesta callejera del CSD' },
    loc: 'Heumarkt, Altstadt', source: 'koeln.de', isPast: true },
  { id: 'p11', date: '2026-08-01', endDate: '2026-08-01', cat: 'feuerwerk',
    name: { de: 'Kölner Lichter', en: 'Kölner Lichter Fireworks', es: 'Kölner Lichter (fuegos artificiales)' },
    loc: 'Rheinufer', source: 'koelner-lichter.de', isPast: true },
];

const STATIONS = {
  hbf: { label: 'Köln Hbf', query: 'Köln Hauptbahnhof' },
  friesenplatz: { label: 'Friesenplatz', query: 'Friesenplatz, Köln' },
};

function mapsUrl(fromQuery, loc) {
  const origin = encodeURIComponent(fromQuery);
  const destination = encodeURIComponent(loc + ', Köln');
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=transit`;
}

const TODAY = new Date('2026-08-24T00:00:00');

function inRange(ev, days) {
  const start = new Date(ev.date + 'T00:00:00');
  const end = new Date((ev.endDate || ev.date) + 'T00:00:00');
  const rangeEnd = new Date(TODAY);
  rangeEnd.setDate(rangeEnd.getDate() + days);
  return start <= rangeEnd && end >= TODAY;
}

function formatDate(ev, lang) {
  const opts = { day: '2-digit', month: 'short' };
  const locale = lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : 'en-GB';
  const start = new Date(ev.date + 'T00:00:00').toLocaleDateString(locale, opts);
  if (ev.endDate && ev.endDate !== ev.date) {
    const end = new Date(ev.endDate + 'T00:00:00').toLocaleDateString(locale, opts);
    return `${start} – ${end}`;
  }
  return start;
}

export default function App() {
  const [lang, setLang] = useState('de');
  const [tab, setTab] = useState('today');
  const [fromStation, setFromStation] = useState('hbf');
  const t = T[lang];

  const filtered = useMemo(() => {
    const upcoming = EVENTS.filter(e => !e.isPast);
    const past = EVENTS.filter(e => e.isPast);
    if (tab === 'past') return past.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (tab === 'upcoming') return upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
    const days = tab === 'today' ? 1 : tab === 'week' ? 7 : 31;
    return upcoming.filter(e => inRange(e, days)).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [tab]);

  return (
    <div style={{ minHeight: '100vh', background: '#E8E3D9', fontFamily: '-apple-system, "Helvetica Neue", Arial, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,500;1,600&display=swap');`}</style>
      <div style={{ maxWidth: 430, margin: '0 auto', background: '#E8E3D9', paddingBottom: 40 }}>

        {/* HERO */}
        <div style={{ position: 'relative', height: 210, overflow: 'hidden', color: '#F7F3EA' }}>
          <img src="/images/hero-dom.jpg" alt="Kölner Dom" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '35% 25%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,30,38,0.35) 0%, rgba(15,30,38,0.25) 40%, rgba(15,30,38,0.92) 100%)' }} />
          <div style={{ position: 'relative', padding: '22px 20px 16px 20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['de', 'en', 'es'].map(l => (
                <button key={l} onClick={() => setLang(l)}
                  style={{
                    fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: lang === l ? '#E7B876' : 'rgba(247,243,234,0.16)',
                    color: lang === l ? '#1F4E5C' : '#F7F3EA',
                  }}>{l.toUpperCase()}</button>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 28, fontWeight: 500, fontStyle: 'italic', marginTop: 8, lineHeight: 1.05, letterSpacing: '0.01em', textShadow: '0 2px 10px rgba(0,0,0,0.45)' }}>
                {t.title1} <span style={{ color: '#E7B876', fontWeight: 600 }}>{t.title2}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TIME TABS */}
        <div style={{ display: 'flex', gap: 5, padding: '14px 20px 0 20px', overflowX: 'auto' }}>
          {[['today', t.tabToday], ['week', t.tabWeek], ['month', t.tabMonth], ['upcoming', t.tabUpcoming], ['past', t.tabPast]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{
                flex: '1 0 auto', textAlign: 'center', fontSize: 9.5, fontWeight: 600, padding: '7px 6px', borderRadius: 16, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                background: tab === key ? '#1F4E5C' : '#faf7f0', color: tab === key ? '#F7F3EA' : '#57534e',
              }}>{label}</button>
          ))}
        </div>

        {/* STATION SELECTOR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px 0 20px' }}>
          <span style={{ fontSize: 11, color: '#8a8378', fontWeight: 600 }}>{t.fromStation}</span>
          {Object.entries(STATIONS).map(([key, s]) => (
            <button key={key} onClick={() => setFromStation(key)}
              style={{
                fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 14, border: fromStation === key ? 'none' : '1px solid #d8d2c0', cursor: 'pointer',
                background: fromStation === key ? '#c9812f' : 'white', color: fromStation === key ? 'white' : '#57534e',
              }}>{s.label}</button>
          ))}
        </div>

        {/* EVENT LIST */}
        <div style={{ padding: '14px 20px 0 20px' }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '36px 14px', background: 'white', borderRadius: 16, boxShadow: '0 1px 4px rgba(31,78,92,0.07)' }}>
              <div style={{ fontSize: 34, marginBottom: 10 }}>🏛️</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 600, color: '#1F4E5C', marginBottom: 8 }}>{t.emptyTitle}</div>
              <div style={{ fontSize: 12.5, color: '#57534e', lineHeight: 1.5, maxWidth: 280, margin: '0 auto' }}>{t.emptyText}</div>
            </div>
          )}
          {filtered.map(ev => {
            const cat = CATS[ev.cat];
            return (
              <div key={ev.id} style={{ display: 'flex', background: 'white', marginBottom: 10, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(31,78,92,0.07)', opacity: ev.isPast ? 0.6 : 1 }}>
                <div style={{ width: 6, flexShrink: 0, background: cat.stripe }} />
                <div style={{ width: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, background: cat.chip, backgroundImage: ev.img ? `url(${ev.img})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  {!ev.img && cat.icon}
                </div>
                <div style={{ flex: 1, padding: '11px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: cat.text, marginBottom: 2 }}>{cat.label[lang]}</div>
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: '#22201C' }}>{ev.name[lang]}</div>
                    </div>
                    <div style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 8, background: ev.isPast ? '#e5e1d6' : '#e2f0e9', color: ev.isPast ? '#8a8378' : '#2f6d52', whiteSpace: 'nowrap' }}>
                      {ev.isPast ? t.past : t.free}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#8a8378', marginTop: 3 }}>{ev.loc} · {formatDate(ev, lang)}</div>
                  <div style={{ fontSize: 11, color: '#57534e', marginTop: 4, lineHeight: 1.35 }}>{cat.desc[lang]}</div>
                  {ev.caption && (
                    <div style={{ fontSize: 10.5, color: '#8a8378', marginTop: 4, lineHeight: 1.35, fontStyle: 'italic' }}>{ev.caption[lang]}</div>
                  )}
                  {!ev.isPast && (
                    <a href={mapsUrl(STATIONS[fromStation].query, ev.loc)} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-block', marginTop: 6, fontSize: 10.5, fontWeight: 700, color: '#1F4E5C', textDecoration: 'none', border: '1px solid #c8d4d8', borderRadius: 10, padding: '3px 8px' }}>
                      🚋 {t.route} {STATIONS[fromStation].label} →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
