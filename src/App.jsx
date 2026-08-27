import React, { useState, useMemo } from 'react';

// ---------- TRANSLATIONS ----------
const T = {
  de: {
    eyebrow: 'Köln · heute', title1: 'Köln', title2: 'Umsonst',
    tabToday: 'Heute', tabWeek: 'Diese Woche', tabMonth: 'Diesen Monat', tabUpcoming: 'Demnächst', tabPast: 'Bereits vorbei',
    free: 'KOSTENLOS', past: 'VORBEI',
    emptyTitle: 'Willkommen bei Köln Umsonst!',
    emptyText: 'Hier findest du alle kostenlosen Open-Air-Events in Köln: Straßenfeste, Weihnachtsmärkte, Feuerwerk und mehr. Für diesen Zeitraum ist noch nichts eingetragen. Schau doch bei Demnächst vorbei oder komm später wieder.',
    eventsNear: v => `${v} Events`, fromStation: 'Von:', route: 'Route',
  },
  en: {
    eyebrow: 'Cologne · today', title1: 'Köln', title2: 'Umsonst',
    tabToday: 'Today', tabWeek: 'This Week', tabMonth: 'This Month', tabUpcoming: 'Upcoming', tabPast: 'Already past',
    free: 'FREE', past: 'PAST',
    emptyTitle: 'Welcome to Köln Umsonst!',
    emptyText: "Here you'll find every free open-air event in Cologne: street festivals, Christmas markets, fireworks and more. Nothing is listed for this time range yet. Try Upcoming or check back soon.",
    eventsNear: v => `${v} events`, fromStation: 'From:', route: 'Route',
  },
  es: {
    eyebrow: 'Colonia · hoy', title1: 'Köln', title2: 'Umsonst',
    tabToday: 'Hoy', tabWeek: 'Esta semana', tabMonth: 'Este mes', tabUpcoming: 'Próximamente', tabPast: 'Ya pasaron',
    free: 'GRATIS', past: 'PASADO',
    emptyTitle: '¡Bienvenido a Köln Umsonst!',
    emptyText: 'Aquí encontrarás todos los eventos gratis al aire libre en Colonia: fiestas de barrio, mercados de Navidad, fuegos artificiales y más. Todavía no hay nada para este período. Prueba con Próximamente o vuelve pronto.',
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
    desc: { de: 'Der Kölner Marathon zieht Hunderttausende Zuschauer an die Strecke. Die ganze Stadt feiert mit Live-Musik und Partystimmung am Streckenrand, Zuschauen ist kostenlos.',
      en: 'The Cologne Marathon draws hundreds of thousands of spectators along the route. The whole city celebrates with live music and a party vibe on the sidelines, watching is free.',
      es: 'El Maratón de Colonia atrae a cientos de miles de espectadores a lo largo del recorrido. Toda la ciudad festeja con música en vivo, ver la carrera es gratis.' } },
};

const EVENTS = [
  { id: 'e1', slug: 'rot-weisses-strassenfest', date: '2026-08-28', endDate: '2026-08-30', cat: 'strassenfest', img: '/images/rot-weisses-strassenfest.jpg',
    time: { de: '16:00 Uhr', en: '4:00 PM', es: '16:00' },
    name: { de: 'Rot-Weißes Straßenfest', en: 'Rot-Weißes Straßenfest', es: 'Rot-Weißes Straßenfest' },
    loc: 'Porz-Wahn', address: 'Wahn-Kirche, Frankfurter Str. 177, 51147 Köln', source: 'koeln.de',
    story: {
      de: 'Jedes Jahr verwandelt die KG Rot-Weiß den Parkplatz an der Kirche in Wahn in den Treffpunkt für das ganze Veedel. Drei Tage lang sorgen Kaschämm und MAM, eine BAP Tribute Band, für Live Musik, während Tanzcorps und Nachbarn sich zwischen Essensständen mischen. Ein Straßenfest ganz ohne Bühne für Prominente, nur ein Viertel, das gemeinsam feiert.',
      en: 'Every year the KG Rot Weiß turns the car park by the church in Wahn into the meeting point for the whole neighborhood. For three days, Kaschämm and MAM, a BAP tribute band, provide live music while dance troupes and neighbors mix among the food stalls. A street festival with no celebrity stage, just a neighborhood celebrating together.',
      es: 'Cada año, la KG Rot Weiß convierte el estacionamiento junto a la iglesia de Wahn en el punto de encuentro de todo el barrio. Durante tres días, Kaschämm y MAM, una banda tributo a BAP, ponen la música en vivo mientras grupos de baile y vecinos se mezclan entre los puestos de comida. Una fiesta de barrio sin escenario de famosos, solo un Veedel que festeja junto.'
    } },
  { id: 'e2', slug: 'gamescom-city-festival', date: '2026-08-29', endDate: '2026-08-30', cat: 'gamescom',
    time: { de: 'ab ca. 16:00 Uhr', en: 'from about 4:00 PM', es: 'desde aprox. las 16:00' },
    name: { de: 'Gamescom City Festival', en: 'Gamescom City Festival', es: 'Gamescom City Festival' },
    loc: 'Hohenzollernring, Rudolfplatz', address: 'Hohenzollernring, 50674 Köln', source: 'citynews-koeln.de',
    story: {
      de: 'Während in den Messehallen von Deutz die größte Gaming Messe der Welt öffnet, verwandelt sich der Hohenzollernring in eine kostenlose Open Air Bühne. Am Rudolfplatz und am Ring spielen Bands wie The Notwist und Thees Uhlmann, dazwischen laden Streetfoodstände und Gaming Stationen zum Bleiben ein. Kein Messeticket nötig, nur Lust auf Musik mitten in der Stadt.',
      en: "While the world's largest gaming fair opens in the Deutz exhibition halls, Hohenzollernring turns into a free open air stage. Bands like The Notwist and Thees Uhlmann play at Rudolfplatz and along the ring, with street food stalls and gaming stations in between. No expo ticket needed, just an appetite for music in the middle of the city.",
      es: 'Mientras la feria de videojuegos más grande del mundo abre en los pabellones de Deutz, el Hohenzollernring se transforma en un escenario gratuito al aire libre. En Rudolfplatz y a lo largo del anillo tocan bandas como The Notwist y Thees Uhlmann, con puestos de comida callejera y estaciones de videojuegos entre medio. No hace falta entrada a la feria, solo ganas de música en pleno centro.'
    } },
  { id: 'e3', slug: 'lindenthaler-sommerfest', date: '2026-08-29', endDate: '2026-08-30', cat: 'strassenfest',
    name: { de: 'Lindenthaler Sommerfest', en: 'Lindenthaler Sommerfest', es: 'Lindenthaler Sommerfest' },
    loc: 'Dürener Straße, Lindenthal', address: 'Dürener Straße, 50931 Köln', source: 'citynews-koeln.de',
    story: {
      de: 'Die Dürener Straße in Lindenthal öffnet ihre Geschäfte auch am Sonntag und verwandelt den ganzen Boulevard in eine Flaniermeile. Zwischen Kunsthandwerk und Kulinarik trifft sich das Veedel zum Bummeln, während lokale Händler ihre Waren direkt auf der Straße präsentieren. Ein entspanntes Sommerfest ohne große Bühne, dafür mit viel Nachbarschaftsflair.',
      en: 'Dürener Straße in Lindenthal opens its shops on Sunday too, turning the whole boulevard into a place for strolling. Between crafts and food, the neighborhood gathers to browse while local shops display their goods right on the street. A relaxed summer festival without a big stage, but full of neighborhood spirit.',
      es: 'La Dürener Straße en Lindenthal abre sus comercios incluso el domingo y convierte todo el bulevar en un paseo. Entre artesanías y gastronomía, el barrio se junta para recorrer las calles mientras los negocios locales muestran sus productos directamente en la vereda. Una fiesta de verano tranquila, sin gran escenario, pero con mucho espíritu de vecindario.'
    } },
  { id: 'e4', slug: 'strassenfest-landmannstrasse', date: '2026-09-12', endDate: '2026-09-13', cat: 'strassenfest',
    name: { de: 'Straßenfest Landmannstraße', en: 'Landmannstraße Street Festival', es: 'Fiesta de Landmannstraße' },
    loc: 'Ehrenfeld', address: 'Landmannstraße, 50823 Köln', source: 'koeln-muelheim.de',
    story: {
      de: 'Fast jedes Geschäft auf der Landmannstraße in Ehrenfeld macht mit, wenn die Straße für zwei Tage zur Fußgängerzone wird. Zwischen Marktständen und offenen Ladentüren entsteht eine Mischung aus Einkaufsbummel und Nachbarschaftsfest, organisiert von der Werbepraxis von der Gathen, die auch andere Kölner Straßenfeste veranstaltet. Ein Fest, bei dem das ganze Veedel mitmacht.',
      en: 'Almost every shop on Landmannstraße in Ehrenfeld takes part when the street turns pedestrian only for two days. Between market stalls and open shop doors, a mix of shopping stroll and neighborhood party takes shape, organized by the same group behind several other Cologne street festivals. A festival where the whole neighborhood joins in.',
      es: 'Casi todos los comercios de la Landmannstraße en Ehrenfeld participan cuando la calle se cierra al tráfico durante dos días. Entre puestos de mercado y puertas abiertas de las tiendas, se arma una mezcla de paseo de compras y fiesta de barrio, organizada por el mismo grupo detrás de otras fiestas callejeras de Colonia. Un festejo en el que participa todo el Veedel.'
    } },
  { id: 'e5', slug: 'dae-laengste-desch-vun-koelle', date: '2026-09-19', endDate: '2026-09-20', cat: 'strassenfest',
    name: { de: 'Dä längste Desch vun Kölle', en: 'Dä längste Desch vun Kölle', es: 'Dä längste Desch vun Kölle' },
    loc: 'Severinsviertel', address: 'Severinstraße, 50678 Köln', source: 'mitvergnuegen.com',
    story: {
      de: 'Zwei Tage lang steht eine ein Kilometer lange rot weiße Tafel mitten auf der Severinstraße, gedeckt für ganz Köln. Der Vringsveedel lädt zum gemeinsamen Sitzen, Essen und Trinken ein, begleitet von Bühnenprogramm und Marktständen entlang der Straße. Der Name ist Programm, der längste Tisch der Stadt.',
      en: 'For two days, a one kilometer long red and white table stands right in the middle of Severinstraße, set for all of Cologne. The Vringsveedel neighborhood invites everyone to sit, eat and drink together, alongside a stage program and market stalls along the street. The name says it all, the longest table in the city.',
      es: 'Durante dos días, una mesa roja y blanca de un kilómetro de largo se instala en pleno centro de la Severinstraße, tendida para toda Colonia. El barrio de Vringsveedel invita a sentarse, comer y beber juntos, acompañado de programa de escenario y puestos de mercado a lo largo de la calle. El nombre lo dice todo, la mesa más larga de la ciudad.'
    } },
  { id: 'e6', slug: 'trimbornstrassenfest', date: '2026-09-19', endDate: '2026-09-20', cat: 'strassenfest',
    time: { de: '11:00 bis 22:00 Uhr', en: '11:00 AM to 10:00 PM', es: 'de 11:00 a 22:00' },
    name: { de: 'Trimbornstraßenfest', en: 'Trimbornstraßenfest', es: 'Trimbornstraßenfest' },
    loc: 'Kalk', address: 'Trimbornstraße, 51105 Köln', source: 'mitvergnuegen.com',
    story: {
      de: 'Die Trimbornstraße in Kalk ist normalerweise nur ein hektischer Durchgang zwischen S Bahn und Köln Arcaden. An diesem Wochenende wird sie autofrei und verwandelt sich in einen Ort der Begegnung, komplett organisiert von der Nachbarschaft selbst, ohne kommerzielle Sponsoren. Live Musik, Workshops und ein Flohmarkt füllen die Straße von früh bis spät.',
      en: 'Trimbornstraße in Kalk is usually just a busy passage between the S Bahn and the Köln Arcaden shopping center. This weekend it goes car free and turns into a meeting place, entirely organized by the neighborhood itself, without commercial sponsors. Live music, workshops and a flea market fill the street from morning to evening.',
      es: 'La Trimbornstraße en Kalk suele ser solo un paso apurado entre la estación de tren y el centro comercial Köln Arcaden. Este fin de semana se cierra al tráfico y se convierte en un lugar de encuentro, organizado enteramente por el propio vecindario, sin patrocinadores comerciales. Música en vivo, talleres y una feria americana llenan la calle de la mañana a la noche.'
    } },
  { id: 'e7', slug: 'herbstkirmes-deutz', date: '2026-10-24', endDate: '2026-11-01', cat: 'kirmes',
    name: { de: 'Herbstkirmes Deutz', en: 'Deutz Autumn Funfair', es: 'Feria de otoño en Deutz' },
    loc: 'Deutzer Werft', address: 'Deutzer Werft, 50679 Köln', source: 'deutzerkirmes.de',
    story: {
      de: 'Am Rheinufer in Deutz dreht sich für über eine Woche das Riesenrad, während Achterbahnen und klassische Fahrgeschäfte die Uferpromenade in einen Rummelplatz verwandeln. Der Zugang zum Gelände selbst kostet nichts, nur die einzelnen Fahrten werden bezahlt. Ein Spaziergang zwischen Lichtern, Zuckerwatte und Blick auf den Dom auf der anderen Rheinseite.',
      en: 'Along the Rhine bank in Deutz, a ferris wheel turns for over a week while roller coasters and classic rides transform the riverside promenade into a fairground. Entry to the grounds is free, only the individual rides are paid. A walk among lights, cotton candy and a view of the cathedral across the river.',
      es: 'En la orilla del Rin en Deutz, una noria gira durante más de una semana mientras montañas rusas y atracciones clásicas transforman el paseo ribereño en un parque de diversiones. El acceso al recinto es gratis, solo se pagan las atracciones individuales. Un paseo entre luces, algodón de azúcar y vista a la catedral del otro lado del río.'
    } },
  { id: 'e8', slug: 'elfter-im-elften-sessionseroeffnung', date: '2026-11-11', endDate: '2026-11-11', cat: 'karneval',
    time: { de: '11:11 Uhr', en: '11:11 AM', es: '11:11' },
    name: { de: '11 11', en: '11 11', es: '11 11' },
    loc: 'Alter Markt', address: 'Alter Markt, 50667 Köln', source: 'koelnerkarneval.de',
    story: {
      de: 'Punkt elf Uhr elf am elften Tag des elften Monats beginnt auf dem Alter Markt offiziell die fünfte Jahreszeit. Tausende Jecken in Kostümen singen und tanzen zu kölschen Tönen, während das Dreigestirn zum ersten Mal öffentlich auftritt. Der Startschuss für Monate voller Karneval in der ganzen Stadt.',
      en: 'At exactly eleven eleven on the eleventh day of the eleventh month, the fifth season officially opens on Alter Markt. Thousands of costumed carnival fans sing and dance to Kölsch tunes while the Dreigestirn, the carnival trio, makes its first public appearance. The starting shot for months of carnival across the whole city.',
      es: 'A las once y once del día once del mes once, se abre oficialmente la quinta estación del año en Alter Markt. Miles de jecken disfrazados cantan y bailan al ritmo de canciones kölsch mientras el Dreigestirn, el trío del carnaval, hace su primera aparición pública. El puntapié inicial para meses de carnaval en toda la ciudad.'
    } },
  { id: 'e9', slug: 'hafen-weihnachtsmarkt', date: '2026-11-13', endDate: '2027-01-03', cat: 'weihnacht',
    name: { de: 'Hafen-Weihnachtsmarkt', en: 'Harbour Christmas Market', es: 'Mercado navideño del puerto' },
    loc: 'Schokoladenmuseum', address: 'Am Schokoladenmuseum 1a, 50678 Köln', source: 'schokoladenmuseum.de',
    story: {
      de: 'Rund um das Schokoladenmuseum verwandelt sich der Rheinauhafen in einen maritimen Weihnachtsmarkt mit Schiffskulisse und Glühbier statt Glühwein. Ein Eröffnungsfeuerwerk am Wasser eröffnet die Saison, danach wechseln sich Seefahrergeschichten und musikalische Einlagen im Tagesprogramm ab. Der am längsten geöffnete Weihnachtsmarkt der Stadt, bis weit ins neue Jahr.',
      en: 'Around the Chocolate Museum, the Rheinauhafen turns into a maritime Christmas market with a ship backdrop and mulled beer instead of mulled wine. An opening fireworks show over the water kicks off the season, followed by seafaring stories and musical performances throughout the day. The longest running Christmas market in the city, open well into the new year.',
      es: 'Alrededor del Museo del Chocolate, el Rheinauhafen se transforma en un mercado navideño de estilo marítimo, con barcos de fondo y cerveza caliente en lugar de vino caliente. Un espectáculo de fuegos artificiales sobre el agua abre la temporada, seguido de historias de navegantes y música durante todo el día. El mercado navideño que más tiempo permanece abierto en la ciudad, hasta bien entrado el año nuevo.'
    } },
  { id: 'e10', slug: 'weihnachtsmarkt-am-koelner-dom', date: '2026-11-16', endDate: '2026-12-23', cat: 'weihnacht',
    time: { de: 'ab 11:00 Uhr', en: 'from 11:00 AM', es: 'desde las 11:00' },
    name: { de: 'Weihnachtsmarkt am Kölner Dom', en: 'Christmas Market at Cologne Cathedral', es: 'Mercado navideño de la Catedral' },
    loc: 'Roncalliplatz', address: 'Roncalliplatz 1, 50667 Köln', source: 'koelnerweihnachtsmarkt.com',
    story: {
      de: 'Zu Füßen der gotischen Kathedrale spannt sich ein funkelndes Sternenzelt über etwa 150 festlich geschmückte Stände auf dem Roncalliplatz. Ein 25 Meter hoher Tannenbaum bildet das Herzstück des größten und meistbesuchten Weihnachtsmarktes der Stadt, mit über 100 kostenlosen Bühnenauftritten während der Saison. Kunsthandwerk, Bio zertifizierte Köstlichkeiten und der Blick auf den Dom machen ihn zum Klassiker.',
      en: "At the foot of the gothic cathedral, a sparkling canopy of lights stretches over about 150 festively decorated stalls on Roncalliplatz. A 25 meter tall Christmas tree forms the centerpiece of the city's largest and most visited Christmas market, with over 100 free stage performances throughout the season. Handmade crafts, organic certified treats and the view of the cathedral make it a classic.",
      es: 'A los pies de la catedral gótica, un techo de estrellas de luces se extiende sobre unos 150 puestos decorados en Roncalliplatz. Un árbol de navidad de 25 metros de altura es el centro del mercado navideño más grande y visitado de la ciudad, con más de 100 presentaciones gratuitas en escenario durante la temporada. Artesanías, delicias con certificación orgánica y la vista a la catedral lo convierten en un clásico.'
    } },
  { id: 'e11', slug: 'weihnachtsmarkt-im-stadtgarten', date: '2026-11-16', endDate: '2026-12-23', cat: 'weihnacht',
    name: { de: 'Weihnachtsmarkt im Stadtgarten', en: 'Stadtgarten Christmas Market', es: 'Mercado navideño Stadtgarten' },
    loc: 'Venloer Str. 40', address: 'Venloer Str. 40, 50672 Köln', source: 'deutsche-weihnachtsmaerkte.de',
    story: {
      de: 'Im Grünen des Stadtgartens, etwas abseits vom Trubel der Innenstadt, setzt dieser Weihnachtsmarkt auf Design statt Massenware. Kleine Stände mit handgefertigtem Kunsthandwerk und ruhige Wege zwischen den Bäumen schaffen eine entspannte Alternative zu den größeren Märkten. Ideal für alle, die Weihnachtsstimmung ohne Gedränge suchen.',
      en: 'In the greenery of the Stadtgarten park, a bit away from the bustle of downtown, this Christmas market favors design over mass produced goods. Small stalls with handmade crafts and quiet paths between the trees create a relaxed alternative to the bigger markets. Ideal for anyone looking for holiday spirit without the crowds.',
      es: 'Entre el verde del Stadtgarten, un poco alejado del bullicio del centro, este mercado navideño apuesta por el diseño en lugar de productos en masa. Pequeños puestos con artesanías hechas a mano y caminos tranquilos entre los árboles crean una alternativa relajada a los mercados más grandes. Ideal para quienes buscan espíritu navideño sin multitudes.'
    } },
  { id: 'e12', slug: 'markt-der-engel', date: '2026-11-17', endDate: '2026-12-23', cat: 'weihnacht',
    name: { de: 'Markt der Engel', en: 'Market of Angels', es: 'Mercado de los Ángeles' },
    loc: 'Neumarkt', address: 'Neumarkt, 50667 Köln', source: 'koeln.de',
    story: {
      de: 'Auf dem Neumarkt taucht ein Meer aus Lichtern den Platz in weihnachtlichen Glanz mit dem Charme vergangener Jahrzehnte. Über 100 prächtig geschmückte Stände laden zum Bummeln und Naschen ein, während Kasperletheater und Kinderschminken auch die Kleinsten begeistern. Ein Adventsmarkt, der besonders am Abend seine volle Wirkung entfaltet.',
      en: 'On Neumarkt square, a sea of lights bathes the place in festive glow with the charm of past decades. Over 100 lavishly decorated stalls invite strolling and snacking, while puppet theater and face painting keep the youngest visitors entertained. An advent market that reveals its full charm especially after dark.',
      es: 'En la plaza Neumarkt, un mar de luces baña el lugar con un brillo festivo y el encanto de décadas pasadas. Más de 100 puestos decorados con esmero invitan a pasear y probar dulces, mientras el teatro de títeres y la pintura facial entretienen a los más chicos. Un mercado de adviento que muestra todo su encanto especialmente de noche.'
    } },
  { id: 'e13', slug: 'heinzels-wintermaerchen-alter-markt', date: '2026-11-24', endDate: '2026-12-23', cat: 'weihnacht', img: '/images/heinzels-altermarkt.jpg',
    name: { de: 'Heinzels Wintermärchen (Alter Markt)', en: "Heinzel's Winter Fairytale (Alter Markt)", es: 'Heinzels Wintermärchen (Alter Markt)' },
    loc: 'Altstadt', address: 'Alter Markt, 50667 Köln', source: 'heinzels-wintermaerchen.de',
    story: {
      de: 'Der Eingang zu Heinzels Wintermärchen erzählt schon von Weitem die kölsche Sage der Heinzelmännchen, jener nächtlichen Helfer, die einst heimlich die Arbeit der ganzen Stadt erledigten, bis eine neugierige Schneidersfrau sie vertrieb. Zwischen Türmchen und goldenen Verzierungen erstreckt sich der flächenmäßig größte Weihnachtsmarkt Kölns über die ganze Altstadt. Glühwein, Kunsthandwerk und der Duft von gebrannten Mandeln begleiten jeden Schritt durch die Gassen.',
      en: "The entrance to Heinzels Wintermärchen already tells, from a distance, the Cologne legend of the Heinzelmännchen, the nightly little helpers who once secretly did the work of the whole city until a curious tailor's wife scared them away. Between turrets and golden details, the largest Christmas market in Cologne by area stretches across the old town. Mulled wine, handmade crafts and the smell of roasted almonds accompany every step through the lanes.",
      es: 'La entrada a Heinzels Wintermärchen ya cuenta desde lejos la leyenda de Colonia sobre los Heinzelmännchen, aquellos pequeños duendes nocturnos que hacían en secreto el trabajo de toda la ciudad hasta que la esposa curiosa de un sastre los espantó. Entre torretas y detalles dorados se extiende el mercado navideño más grande de Colonia por superficie, a lo largo de todo el casco antiguo. Vino caliente, artesanías y el aroma de almendras garrapiñadas acompañan cada paso entre los callejones.'
    } },
  { id: 'e14', slug: 'heinzels-wintermaerchen-heumarkt-eislaufbahn', date: '2026-11-24', endDate: '2027-01-04', cat: 'weihnacht', img: '/images/heinzels-heumarkt.jpg',
    name: { de: 'Heinzels Wintermärchen (Heumarkt, Eislaufbahn)', en: "Heinzel's Winter Fairytale (Heumarkt, ice rink)", es: 'Heinzels Wintermärchen (Heumarkt, pista de hielo)' },
    loc: 'Altstadt', address: 'Heumarkt, 50667 Köln', source: 'heinzels-wintermaerchen.de',
    story: {
      de: 'Der zweite Eingang zu Heinzels Wintermärchen führt direkt zur großen Eisbahn auf dem Heumarkt, wo Schlittschuhe unter freiem Himmel zum Drehen einladen. Zwischen den beiden Standorten am Alter Markt und Heumarkt liegt das größte zusammenhängende Weihnachtsmarktgelände der Stadt. Wer bis in den Januar bleibt, findet hier sogar noch nach Neujahr geöffnete Stände.',
      en: 'The second entrance to Heinzels Wintermärchen leads straight to the large open air ice rink on Heumarkt, where skaters glide under the winter sky. Between the two locations at Alter Markt and Heumarkt lies the largest connected Christmas market area in the city. Anyone staying into January will find stalls still open even after New Year.',
      es: 'La segunda entrada a Heinzels Wintermärchen lleva directo a la gran pista de patinaje al aire libre en el Heumarkt, donde se puede patinar bajo el cielo invernal. Entre las dos sedes, en Alter Markt y Heumarkt, se extiende el área de mercado navideño conectada más grande de la ciudad. Quienes se queden hasta enero encontrarán puestos abiertos incluso después de año nuevo.'
    } },
  { id: 'e15', slug: 'bunt-im-carree', date: '2026-09-05', endDate: '2026-09-06', cat: 'strassenfest',
    name: { de: 'Bunt im Carrée', en: 'Bunt im Carrée', es: 'Bunt im Carrée' },
    loc: 'Berrenrather Str. / Sülzburgstr., Sülz-Klettenberg', address: 'Berrenrather Straße, 50937 Köln', source: 'koeln.de',
    story: {
      de: 'Sülz und Klettenberg tun sich zusammen und öffnen ihre Geschäfte entlang der Berrenrather Straße auch am verkaufsoffenen Sonntag. Crêpes, Bratwurst und Zuckerwatte versorgen die Besucher, während ein Bühnenprogramm mit kölschen Tönen für Stimmung sorgt. Ein entspanntes Spätsommerfest mit dem Charme zweier benachbarter Veedel.',
      en: 'Sülz and Klettenberg join forces and open their shops along Berrenrather Straße, including a special Sunday opening. Crepes, sausages and cotton candy keep visitors fed, while a stage program with Kölsch music sets the mood. A relaxed late summer festival with the charm of two neighboring districts.',
      es: 'Sülz y Klettenberg se unen y abren sus comercios a lo largo de la Berrenrather Straße, incluyendo una apertura especial en domingo. Crepes, salchichas y algodón de azúcar alimentan a los visitantes, mientras un programa de escenario con música kölsch pone ambiente. Una fiesta de fin de verano relajada, con el encanto de dos barrios vecinos.'
    } },
  { id: 'e16', slug: 'herthastrassenfest', date: '2026-09-12', endDate: '2026-09-12', cat: 'strassenfest',
    time: { de: '13:00 bis 21:00 Uhr', en: '1:00 PM to 9:00 PM', es: 'de 13:00 a 21:00' },
    name: { de: 'Herthastraßenfest', en: 'Herthastraßenfest', es: 'Herthastraßenfest' },
    loc: 'Herthastraße, Zollstock', address: 'Herthastraße, 50969 Köln', source: 'koeln.de',
    story: {
      de: 'Unter dem Motto von Nachbarn für Nachbarn verwandelt sich die Herthastraße in Zollstock für einen Tag in ein großes Nachbarschaftsfest. Kein kommerzieller Veranstalter steht dahinter, nur Anwohner, die Stände aufbauen, kochen und Musik organisieren. Der besondere Charme liegt genau darin, im ehrlichen Selbstgemachten.',
      en: 'Under the motto of neighbors for neighbors, Herthastraße in Zollstock turns into a big neighborhood party for one day. There is no commercial organizer behind it, only residents who set up stalls, cook and organize music. The special charm lies exactly there, in the honest, homemade feel of it all.',
      es: 'Bajo el lema de vecinos para vecinos, la Herthastraße en Zollstock se transforma por un día en una gran fiesta de barrio. No hay ningún organizador comercial detrás, solo vecinos que arman puestos, cocinan y organizan la música. Ahí está justamente su encanto especial, en lo genuino y hecho a mano.'
    } },
  { id: 'e17', slug: 'dellbruecker-strassenfest', date: '2026-09-26', endDate: '2026-09-27', cat: 'strassenfest',
    name: { de: 'Dellbrücker Straßenfest', en: 'Dellbrücker Straßenfest', es: 'Dellbrücker Straßenfest' },
    loc: 'Dellbrücker Hauptstraße', address: 'Dellbrücker Hauptstraße, 51069 Köln', source: 'koeln.de',
    story: {
      de: 'Das größte Straßenfest auf der rechten Rheinseite zieht nicht nur die Bewohner von Dellbrück an, sondern die ganze Stadt auf die Schäl Sick. Mehrere Bühnen sorgen mit Live Auftritten für Stimmung entlang der Dellbrücker Hauptstraße, während Aktionsstände die Kinder beschäftigen. Zwei Tage Ausnahmezustand in einem sonst ruhigen Veedel.',
      en: 'The largest street festival on the right bank of the Rhine draws not just Dellbrück residents but the whole city to the so called Schäl Sick side. Several stages provide live performances along Dellbrücker Hauptstraße, while activity booths keep children entertained. Two days of exception in an otherwise quiet neighborhood.',
      es: 'La fiesta callejera más grande del lado derecho del Rin atrae no solo a los vecinos de Dellbrück sino a toda la ciudad hacia el llamado Schäl Sick. Varios escenarios ofrecen presentaciones en vivo a lo largo de la Dellbrücker Hauptstraße, mientras puestos de actividades entretienen a los chicos. Dos días de excepción en un barrio normalmente tranquilo.'
    } },
  { id: 'e18', slug: 'generali-koeln-marathon', date: '2026-10-04', endDate: '2026-10-04', cat: 'marathon',
    time: { de: 'Halbmarathon 09:00 Uhr, Marathon 10:30 Uhr', en: 'Half marathon 9:00 AM, marathon 10:30 AM', es: 'Media maratón 09:00, maratón 10:30' },
    name: { de: 'Generali Köln Marathon', en: 'Generali Cologne Marathon', es: 'Maratón de Colonia (Generali)' },
    loc: 'Innenstadt, Start Ottoplatz Deutz', address: 'Ottoplatz, 50679 Köln', source: 'generali-koeln-marathon.de',
    story: {
      de: 'Rund 25000 Läufer starten am Ottoplatz in Deutz und ziehen über die Deutzer Brücke direkt auf den Dom zu, vorbei am Rudolfplatz, durch Sülz und die Severinstraße. Hunderttausende Zuschauer säumen die Strecke mit Musik und Anfeuerungen, und wer nicht selbst läuft, kann sich einfach eine Ecke suchen und mitfiebern. Der viertgrößte Marathon Deutschlands, mitten durch die eigene Stadt.',
      en: 'About 25000 runners start at Ottoplatz in Deutz and cross the Deutzer Brücke straight toward the cathedral, passing Rudolfplatz, Sülz and Severinstraße. Hundreds of thousands of spectators line the route with music and cheering, and anyone not running can simply pick a spot and join the excitement. The fourth largest marathon in Germany, running right through the city itself.',
      es: 'Unos 25000 corredores salen desde Ottoplatz en Deutz y cruzan el puente Deutzer directo hacia la catedral, pasando por Rudolfplatz, Sülz y la Severinstraße. Cientos de miles de espectadores acompañan el recorrido con música y aliento, y quien no corre puede simplemente elegir una esquina y sumarse al entusiasmo. El cuarto maratón más grande de Alemania, atravesando la propia ciudad.'
    } },
  { id: 'e19', slug: 'lindenthaler-herbstfest-street-gallery', date: '2026-10-09', endDate: '2026-10-11', cat: 'strassenfest',
    name: { de: 'Lindenthaler Herbstfest (Street Gallery)', en: 'Lindenthal Autumn Festival (Street Gallery)', es: 'Fiesta de otoño en Lindenthal (Street Gallery)' },
    loc: 'Karl-Schwering-Platz, Lindenthal', address: 'Karl-Schwering-Platz, 50931 Köln', source: 'koeln.de',
    story: {
      de: 'Der Karl Schwering Platz in Lindenthal verwandelt sich drei Tage lang in eine Gourmetmeile mit Speisen, Weinen und Cocktails unter freiem Himmel. Gleichzeitig eröffnet die Kunstaktion Street Gallery, bei der Kunstwerke direkt im öffentlichen Raum zu sehen sind. Hüpfburgen und ein Kinderkarussell sorgen dafür, dass auch die Jüngsten nicht zu kurz kommen.',
      en: 'Karl Schwering Platz in Lindenthal turns into a gourmet food mile for three days, with dishes, wines and cocktails served outdoors. At the same time, the Street Gallery art event opens, showing artworks right in the public space. Bouncy castles and a children\u2019s carousel make sure the youngest visitors have fun too.',
      es: 'La plaza Karl Schwering en Lindenthal se convierte durante tres días en una feria gastronómica al aire libre, con comidas, vinos y cócteles. Al mismo tiempo se inaugura la muestra de arte Street Gallery, con obras exhibidas directamente en el espacio público. Castillos inflables y un carrusel infantil aseguran diversión también para los más chicos.'
    } },
  { id: 'e20', slug: 'nikolausdorf', date: '2026-11-16', endDate: '2026-12-23', cat: 'weihnacht',
    name: { de: 'Nikolausdorf', en: 'Nikolausdorf Christmas Market', es: 'Nikolausdorf' },
    loc: 'Rudolfplatz', address: 'Rudolfplatz, 50674 Köln', source: 'rheinlandtourismus.de',
    story: {
      de: 'Rund um den Rudolfplatz entsteht mit Nikolausdorf ein familienfreundlicher Weihnachtsmarkt mit Bastelaktionen und Programm speziell für Kinder. Kleiner und ruhiger als die großen Märkte der Innenstadt, dafür mit direktem Zugang über die Stadtbahn. Ein guter Ort, um Weihnachtsstimmung mit den Kleinsten zu erleben.',
      en: 'Around Rudolfplatz, Nikolausdorf offers a family friendly Christmas market with craft activities and a program made especially for children. Smaller and calmer than the big markets downtown, but with direct access via the tram. A good spot to experience holiday spirit with the little ones.',
      es: 'Alrededor de Rudolfplatz, Nikolausdorf ofrece un mercado navideño pensado para familias, con talleres manuales y programación especial para niños. Más chico y tranquilo que los grandes mercados del centro, pero con acceso directo en tranvía. Un buen lugar para vivir el espíritu navideño junto a los más pequeños.'
    } },
  { id: 'e22', slug: 'veedelsadvent-chlodwigplatz', date: '2026-11-20', endDate: '2026-12-23', cat: 'weihnacht',
    time: { de: '12:00 bis 22:00 Uhr', en: '12:00 PM to 10:00 PM', es: 'de 12:00 a 22:00' },
    name: { de: 'VeedelsAdvent (Chlodwigplatz)', en: 'VeedelsAdvent Christmas Market (Chlodwigplatz)', es: 'VeedelsAdvent (Chlodwigplatz)' },
    loc: 'Südstadt', address: 'Chlodwigplatz, 50678 Köln', source: 'veedelsadvent.de',
    story: {
      de: 'Unter dem Schatten der Severinstorburg verwandelt sich der Chlodwigplatz in einen der kölschesten Weihnachtsmärkte der Stadt. Aussteller aus dem eigenen Veedel bieten Reibekuchen, Winzerglühwein und handgemachte Geschenke an, während ein Kinderkarussell die Kleinen unterhält. Klein, gemütlich und ganz ohne Hektik.',
      en: 'In the shadow of the Severinstorburg gate, Chlodwigplatz turns into one of the most local Christmas markets in the city. Vendors from the neighborhood itself offer potato pancakes, wine based mulled wine and handmade gifts, while a children\u2019s carousel keeps the little ones entertained. Small, cozy and completely unhurried.',
      es: 'A la sombra de la puerta Severinstorburg, la plaza Chlodwigplatz se convierte en uno de los mercados navideños más locales de la ciudad. Vendedores del propio barrio ofrecen tortitas de papa, vino caliente y regalos hechos a mano, mientras un carrusel entretiene a los más chicos. Pequeño, acogedor y sin apuro.'
    } },
  { id: 'e23', slug: 'heavenue-cologne', date: '2026-11-17', endDate: '2026-12-23', cat: 'weihnacht',
    name: { de: 'Heavenue Cologne', en: 'Heavenue Cologne', es: 'Heavenue Cologne' },
    loc: 'Friesenplatz', address: 'Friesenplatz, Ecke Limburger Straße, 50672 Köln', source: 'koeln.de',
    story: {
      de: 'Nach Jahren der Suche fand Heavenue ein neues Zuhause am Friesenplatz, mitten im Belgischen Viertel. Pastellfarbene Hütten, ein drehender Weihnachtsbaum und ein Brunnen mit Wasserfontänen prägen diesen bunten, für alle offenen Weihnachtsmarkt mit Wurzeln in der queeren Community. Täglich gibt es ein Bühnenprogramm mit Live Musik und Shows.',
      en: 'After years of searching, Heavenue found a new home at Friesenplatz, right in the Belgian Quarter. Pastel colored huts, a rotating Christmas tree and a fountain with water jets define this colorful market, open to everyone and rooted in the queer community. A daily stage program brings live music and shows.',
      es: 'Después de años buscando un lugar, Heavenue encontró un nuevo hogar en Friesenplatz, en pleno Barrio Belga. Casitas en tonos pastel, un árbol de navidad giratorio y una fuente con chorros de agua definen este colorido mercado, abierto a todos y con raíces en la comunidad queer. Todos los días hay programación en vivo con música y shows.'
    } },
  { id: 'e24', slug: 'winterzauber-eigelstein', date: '2026-12-03', endDate: '2026-12-07', cat: 'weihnacht',
    time: { de: 'ab 15:00 Uhr', en: 'from 3:00 PM', es: 'desde las 15:00' },
    name: { de: 'Winterzauber Eigelstein', en: 'Winterzauber Eigelstein', es: 'Winterzauber Eigelstein' },
    loc: 'Eigelsteintorburg', address: 'Eigelstein 135, 50668 Köln', source: 'koeln.de',
    story: {
      de: 'Nur fünf Tage lang verwandelt sich die Fläche rund um die mittelalterliche Eigelsteintorburg in einen kleinen, feinen Weihnachtsmarkt. Die kurze Dauer macht ihn zu einem der exklusivsten Termine im Kölner Advent, bevorzugt bei Anwohnern des Viertels.',
      en: 'For just five days, the area around the medieval Eigelstein gate turns into a small, refined Christmas market. Its short run makes it one of the more exclusive dates on the Cologne advent calendar, favored by locals from the neighborhood.',
      es: 'Durante solo cinco días, el área alrededor de la puerta medieval de Eigelstein se convierte en un pequeño y cuidado mercado navideño. Su corta duración lo vuelve una de las fechas más exclusivas del adviento en Colonia, preferido por los vecinos del barrio.'
    } },
  { id: 'e25', slug: 'kleinster-weihnachtsmarkt-der-stadt', date: '2026-11-19', endDate: '2026-12-20', cat: 'weihnacht',
    name: { de: 'Kleinster Weihnachtsmarkt der Stadt', en: "Cologne's Smallest Christmas Market", es: 'El mercado navideño más chico de la ciudad' },
    loc: 'Volksgarten, Südstadt', address: 'Volksgarten, 50677 Köln', source: 'koeln.de',
    story: {
      de: 'Wie der Name schon sagt, ist dieser Markt im Biergarten des Volksgartens bewusst winzig gehalten, mit nur einer Handvoll Hütten. Wer Weihnachtsstimmung ohne jegliches Gedränge sucht, findet sie genau hier, mitten im Grünen der Südstadt.',
      en: "As the name suggests, this market in the Volksgarten beer garden is intentionally tiny, with just a handful of huts. Anyone looking for holiday spirit without any crowding will find it right here, surrounded by the greenery of Südstadt.",
      es: 'Como su nombre indica, este mercado en el biergarten del Volksgarten es deliberadamente diminuto, con solo un puñado de casitas. Quien busque espíritu navideño sin ninguna multitud lo encuentra justo aquí, rodeado del verde de Südstadt.'
    } },
  { id: 'e26', slug: 'suelzer-weihnachtsdorf', date: '2026-11-25', endDate: '2026-12-23', cat: 'weihnacht',
    time: { de: 'Mo bis Fr 16 bis 22 Uhr, Sa und So 12 bis 22 Uhr', en: 'Mon to Fri 4 to 10 PM, Sat and Sun 12 to 10 PM', es: 'lunes a viernes de 16 a 22, sábado y domingo de 12 a 22' },
    name: { de: 'Sülzer Weihnachtsdorf', en: 'Sülz Christmas Village', es: 'Pueblo navideño de Sülz' },
    loc: 'Sülz', address: 'Elisabeth-von-Mumm-Platz, 50937 Köln', source: 'suelzer-weihnachtsdorf.de',
    story: {
      de: 'Nach vielen Jahren ohne eigenen Weihnachtsmarkt bekam Sülz sein Dorf zurück, getragen von einer lokalen Interessengemeinschaft und dem Deli Sülz. In der früheren Waisenhauskirche nebenan gibt es zusätzlich Konzerte und Weihnachtssingen, während draußen Glühwein und lokale Stände zum Verweilen einladen.',
      en: 'After many years without its own Christmas market, Sülz got its village back, run by a local business association and the Deli Sülz. In the former orphanage church next door there are also concerts and carol singing, while outside mulled wine and local stalls invite you to linger.',
      es: 'Después de muchos años sin mercado navideño propio, Sülz recuperó su pueblo, sostenido por una asociación local de comerciantes y el Deli Sülz. En la antigua iglesia del orfanato de al lado hay también conciertos y cantos navideños, mientras afuera el vino caliente y los puestos locales invitan a quedarse.'
    } },
  { id: 'e27', slug: 'santas-weihnachtsmarkt-im-mediapark', date: '2026-11-16', endDate: '2026-12-23', cat: 'weihnacht',
    name: { de: 'Santas Weihnachtsmarkt im MediaPark', en: "Santa's Christmas Market at MediaPark", es: 'Mercado navideño de Santa en el MediaPark' },
    loc: 'Mediapark', address: 'Im MediaPark, 50670 Köln', source: 'koeln.de',
    story: {
      de: 'Zwischen den modernen Glasfassaden des MediaPark entsteht ein Weihnachtsmarkt mit eigenem Charakter, abseits der historischen Kulissen der Innenstadt. Ein Kontrast, der besonders bei Nacht wirkt, wenn die Lichter der Stände sich in den Bürotürmen spiegeln.',
      en: 'Among the modern glass facades of MediaPark, a Christmas market with its own character takes shape, away from the historic backdrops of downtown. A contrast that stands out especially at night, when the lights of the stalls reflect in the office towers.',
      es: 'Entre las modernas fachadas de vidrio del MediaPark surge un mercado navideño con carácter propio, lejos de los escenarios históricos del centro. Un contraste que se nota especialmente de noche, cuando las luces de los puestos se reflejan en las torres de oficinas.'
    } },
  { id: 'e28', slug: 'lindenthaler-adventstreff', date: '2026-11-20', endDate: '2026-12-23', cat: 'weihnacht',
    time: { de: 'täglich 12 bis 22 Uhr', en: 'daily 12 to 10 PM', es: 'diario de 12 a 22' },
    name: { de: 'Lindenthaler Adventstreff', en: 'Lindenthal Advent Meeting Point', es: 'Punto de encuentro navideño de Lindenthal' },
    loc: 'Karl-Schwering-Platz, Lindenthal', address: 'Karl-Schwering-Platz, 50931 Köln', source: 'koeln.de',
    story: {
      de: 'Am selben Platz, an dem im Oktober noch die Street Gallery ihre Kunstwerke zeigte, entsteht im Advent ein gemütlicher Treffpunkt für das Veedel. Weniger Markt als vielmehr Wohnzimmer unter freiem Himmel, mit Glühwein zum Aufwärmen.',
      en: 'At the same square where the Street Gallery showed its artworks in October, a cozy meeting point for the neighborhood appears during advent. Less a market and more an open air living room, with mulled wine to warm up.',
      es: 'En la misma plaza donde en octubre la Street Gallery mostraba sus obras, durante el adviento aparece un punto de encuentro acogedor para el barrio. Más que un mercado, es como un living al aire libre, con vino caliente para entrar en calor.'
    } },
  { id: 'e29', slug: 'waldweihnacht-auf-gut-leidenhausen', date: '2026-11-29', endDate: '2026-11-29', cat: 'weihnacht',
    time: { de: '12:00 bis 19:30 Uhr', en: '12:00 PM to 7:30 PM', es: 'de 12:00 a 19:30' },
    name: { de: 'Waldweihnacht auf Gut Leidenhausen', en: 'Forest Christmas at Gut Leidenhausen', es: 'Navidad del bosque en Gut Leidenhausen' },
    loc: 'Porz-Eil', address: 'Gut Leidenhausen, 51143 Köln', source: 'gut-leidenhausen.de',
    story: {
      de: 'Umgeben von Wald statt von Häuserfassaden, bietet Gut Leidenhausen eine ruhigere Alternative zu den Märkten der Innenstadt. Nur ein einziger Tag, dafür mit dem besonderen Reiz eines historischen Gutshofs mitten im Grün.',
      en: 'Surrounded by forest instead of building facades, Gut Leidenhausen offers a calmer alternative to the downtown markets. Just a single day, but with the special charm of a historic manor farm in the middle of the greenery.',
      es: 'Rodeado de bosque en lugar de fachadas de edificios, Gut Leidenhausen ofrece una alternativa más tranquila a los mercados del centro. Solo un día, pero con el encanto especial de una hacienda histórica en medio del verde.'
    } },
  { id: 'e30', slug: 'advent-am-geisselmarkt', date: '2026-11-29', endDate: '2026-12-20', cat: 'weihnacht',
    time: { de: 'Mo bis Fr 16 bis 22 Uhr, Sa und So 14 bis 22 Uhr', en: 'Mon to Fri 4 to 10 PM, Sat and Sun 2 to 10 PM', es: 'lunes a viernes de 16 a 22, sábado y domingo de 14 a 22' },
    name: { de: 'Advent am Geisselmarkt', en: 'Advent at Geisselmarkt', es: 'Adviento en Geisselmarkt' },
    loc: 'Ehrenfeld', address: 'Geisselstraße, 50823 Köln', source: 'koeln.de',
    story: {
      de: 'In Ehrenfeld, direkt an der Haltestelle Körnerstraße, versammeln sich Nachbarn rund um den Geisselmarkt zu einem der zahlreichen kleinen Weihnachtsmärkte des Viertels. Ehrenfeld ist bekannt dafür, gleich mehrere solcher Adventstreffs gleichzeitig zu veranstalten.',
      en: 'In Ehrenfeld, right by the Körnerstraße stop, neighbors gather around Geisselmarkt for one of the district\u2019s many small Christmas markets. Ehrenfeld is known for hosting several such advent gatherings at the same time.',
      es: 'En Ehrenfeld, justo junto a la parada Körnerstraße, los vecinos se reúnen alrededor de Geisselmarkt en uno de los tantos pequeños mercados navideños del barrio. Ehrenfeld es conocido por organizar varios de estos encuentros de adviento al mismo tiempo.'
    } },
  { id: 'e31', slug: 'winterzauber-auf-dem-maternusplatz', date: '2026-12-05', endDate: '2026-12-07', cat: 'weihnacht',
    name: { de: 'Winterzauber auf dem Maternusplatz', en: 'Winter Magic at Maternusplatz', es: 'Magia de invierno en Maternusplatz' },
    loc: 'Rodenkirchen', address: 'Maternusplatz, 50996 Köln', source: 'koeln.de',
    story: {
      de: 'Auf demselben Platz, der im Frühling und Sommer schon Feste für Rodenkirchen ausrichtet, kehrt zur Adventszeit ein Winterzauber ein. Ein kurzes, aber intensives Wochenende mit Glühwein und weihnachtlichen Ständen im Süden der Stadt.',
      en: 'On the same square that hosts festivals for Rodenkirchen in spring and summer, a winter magic event returns during advent. A short but intense weekend with mulled wine and Christmas stalls in the south of the city.',
      es: 'En la misma plaza que en primavera y verano ya organiza fiestas para Rodenkirchen, llega en el adviento una magia de invierno. Un fin de semana corto pero intenso, con vino caliente y puestos navideños en el sur de la ciudad.'
    } },
  { id: 'e32', slug: 'porzer-weihnachtsmarkt', date: '2026-12-12', endDate: '2026-12-14', cat: 'weihnacht',
    time: { de: '13:00 bis 18:00 Uhr', en: '1:00 PM to 6:00 PM', es: 'de 13:00 a 18:00' },
    name: { de: 'Porzer Weihnachtsmarkt', en: 'Porz Christmas Market', es: 'Mercado navideño de Porz' },
    loc: 'City Center Porz', address: 'City Center Porz, 51143 Köln', source: 'koeln.de',
    story: {
      de: 'Rund um das City Center Porz lädt dieser Weihnachtsmarkt zusätzlich zu einer Wunschbaum Aktion ein, bei der Besucher Geschenke für bedürftige Kinder der Umgebung spenden können. Ein Nachmittagsmarkt mit sozialem Zweck.',
      en: 'Around the City Center Porz, this Christmas market also features a wish tree campaign, where visitors can donate gifts for children in need in the area. An afternoon market with a social purpose.',
      es: 'Alrededor del City Center Porz, este mercado navideño incluye además una campaña de árbol de los deseos, donde los visitantes pueden donar regalos para niños necesitados de la zona. Un mercado de tarde con un propósito social.'
    } },
  { id: 'e33', slug: 'adventsmarkt-holweide', date: '2026-11-28', endDate: '2026-11-30', cat: 'weihnacht',
    name: { de: 'Adventsmarkt Holweide', en: 'Holweide Advent Market', es: 'Mercado de adviento de Holweide' },
    loc: 'Holweide', address: 'Holweide, 51067 Köln', source: 'koeln.de',
    story: {
      de: 'Weit draußen im rechtsrheinischen Holweide bringt dieser kleine Adventsmarkt Weihnachtsstimmung in einen Stadtteil, der auf keiner Innenstadt Route liegt. Genau das macht ihn zu einem Geheimtipp für alle, die abseits der Touristenpfade feiern wollen.',
      en: 'Far out in Holweide, on the right bank of the Rhine, this small advent market brings holiday spirit to a district that is off the downtown route. That is exactly what makes it a hidden gem for anyone wanting to celebrate away from the tourist paths.',
      es: 'Lejos, en Holweide, del lado derecho del Rin, este pequeño mercado de adviento lleva espíritu navideño a un barrio que no está en la ruta del centro. Justamente eso lo convierte en un secreto bien guardado para quienes quieren festejar lejos de los caminos turísticos.'
    } },
  { id: 'e34', slug: 'duennwalder-adventsmarkt', date: '2026-11-30', endDate: '2026-11-30', cat: 'weihnacht',
    time: { de: '12:00 bis 18:00 Uhr', en: '12:00 PM to 6:00 PM', es: 'de 12:00 a 18:00' },
    name: { de: 'Dünnwalder Adventsmarkt', en: 'Dünnwald Advent Market', es: 'Mercado de adviento de Dünnwald' },
    loc: 'Dünnwald', address: 'Kirchplatz vor St. Hermann-Joseph, 51069 Köln', source: 'koeln.de',
    story: {
      de: 'Vor der Kirche St. Hermann Joseph in Dünnwald versammelt sich die Gemeinde für einen einzigen Nachmittag zu Glühwein und weihnachtlichen Ständen. Ein kirchlich geprägter, familiärer Markt am Stadtrand.',
      en: 'In front of St. Hermann Joseph church in Dünnwald, the community gathers for a single afternoon of mulled wine and Christmas stalls. A church centered, family style market on the edge of the city.',
      es: 'Frente a la iglesia de San Hermann José en Dünnwald, la comunidad se reúne por una sola tarde para tomar vino caliente y visitar puestos navideños. Un mercado familiar, de raíz parroquial, en las afueras de la ciudad.'
    } },
  { id: 'e35', slug: 'dellbruecker-weihnachtsmarkt', date: '2026-11-29', endDate: '2026-11-29', cat: 'weihnacht',
    time: { de: 'ab 15:00 Uhr', en: 'from 3:00 PM', es: 'desde las 15:00' },
    name: { de: 'Dellbrücker Weihnachtsmarkt', en: 'Dellbrück Christmas Market', es: 'Mercado navideño de Dellbrück' },
    loc: 'Dellbrück', address: 'SV Adler Dellbrück, 51069 Köln', source: 'koeln.de',
    story: {
      de: 'Beim Sportverein Adler Dellbrück verwandelt sich das Vereinsgelände für einen Nachmittag in einen Weihnachtsmarkt, getragen von den eigenen Mitgliedern. Ein Fest, das den Vereinscharakter des Veedels widerspiegelt.',
      en: 'At the SV Adler Dellbrück sports club, the grounds turn into a Christmas market for one afternoon, run by the club\u2019s own members. A festival that reflects the community club spirit of the neighborhood.',
      es: 'En el club deportivo SV Adler Dellbrück, el predio se transforma por una tarde en un mercado navideño, sostenido por sus propios miembros. Una fiesta que refleja el espíritu de club del barrio.'
    } },
  { id: 'e21', slug: 'silvester-am-rhein', date: '2026-12-31', endDate: '2027-01-01', cat: 'feuerwerk',
    name: { de: 'Silvester am Rhein', en: "New Year's Eve on the Rhine", es: 'Fin de año en el Rin' },
    loc: 'Rheinufer, Altstadt und Brücken', address: 'Rheinufer Altstadt, 50667 Köln', source: 'stadt-koeln.de',
    story: {
      de: 'In der Silvesternacht versammeln sich Tausende an den Rheinufern und auf den Brücken, um den Jahreswechsel gemeinsam zu erleben. Die Stadt richtet eine Böllerverbotszone in der linksrheinischen Innenstadt ein, Feuerwerksraketen bleiben davon aber unberührt. Ein informeller Treffpunkt, kein offizielles Feuerwerk der Stadt, sondern die Nachbarschaft, die gemeinsam ins neue Jahr startet.',
      en: "On New Year's Eve, thousands gather along the Rhine banks and on the bridges to welcome the new year together. The city sets up a firecracker free zone in the left bank city center, though fireworks rockets are not affected by it. An informal gathering spot, not an official city fireworks show, but neighbors starting the new year together.",
      es: 'En la noche de fin de año, miles de personas se reúnen en las orillas del Rin y en los puentes para recibir juntos el año nuevo. La ciudad establece una zona libre de petardos en el centro del lado izquierdo del río, aunque los cohetes de fuegos artificiales no están afectados por esa norma. Un punto de encuentro informal, no un espectáculo oficial de la ciudad, sino el vecindario recibiendo junto el año nuevo.'
    } },
  { id: 'k01', slug: 'umzug-jan-und-griet', date: '2027-02-04', endDate: '2027-02-04', cat: 'karneval',
    time: { de: '13:00 Uhr', en: '1:00 PM', es: '13:00' },
    name: { de: 'Umzug "Jan und Griet"', en: '"Jan und Griet" Parade', es: 'Desfile "Jan und Griet"' },
    loc: 'Innenstadt', address: 'Chlodwigplatz, 50678 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'An Weiberfastnacht, dem offiziellen Start des Straßenkarnevals, zieht dieser traditionsreiche Umzug vom Chlodwigplatz durch die Südstadt bis in die Altstadt. Organisiert vom Reiter Korps Jan von Werth, eröffnet er die tollen Tage mit Pferden, Musik und den ersten Kamelle des Jahres.',
      en: 'On Weiberfastnacht, the official start of street carnival, this long standing parade winds from Chlodwigplatz through Südstadt into the old town. Organized by the Reiter Korps Jan von Werth, it opens the crazy days with horses, music and the year’s first thrown candy.',
      es: 'En Weiberfastnacht, el inicio oficial del carnaval callejero, este desfile de larga tradición recorre desde Chlodwigplatz por la Südstadt hasta el casco antiguo. Organizado por el Reiter Korps Jan von Werth, abre los días locos con caballos, música y los primeros caramelos del año.'
    } },
  { id: 'k02', slug: 'sternmarsch', date: '2027-02-05', endDate: '2027-02-05', cat: 'karneval',
    time: { de: '16:00 Uhr', en: '4:00 PM', es: '16:00' },
    name: { de: 'Sternmarsch', en: 'Sternmarsch (Star March)', es: 'Sternmarsch (Marcha de las estrellas)' },
    loc: 'Innenstadt', address: 'Alter Markt, 50667 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalsfreitag ziehen mehrere kleine Gruppen aus verschiedenen Richtungen der Stadt gemeinsam auf den Alter Markt zu, wie Strahlen eines Sterns. Organisiert von den Freunden und Förderern des kölnischen Brauchtums, ein ruhigerer Auftakt vor dem großen Trubel des Wochenendes.',
      en: 'On Karnevalsfreitag, several small groups converge on Alter Markt from different directions of the city, like the rays of a star. Organized by the Freunde und Förderer des kölnischen Brauchtums, it is a calmer prelude before the big rush of the weekend.',
      es: 'El viernes de carnaval, varios grupos pequeños convergen hacia Alter Markt desde distintas direcciones de la ciudad, como los rayos de una estrella. Organizado por los Freunde und Förderer des kölnischen Brauchtums, es un preludio más tranquilo antes del gran ajetreo del fin de semana.'
    } },
  { id: 'k03', slug: 'schull-und-veedelszoech', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '10:30 Uhr', en: '10:30 AM', es: '10:30' },
    name: { de: 'Schull- und Veedelszöch', en: 'Schull- und Veedelszöch (Schools and Neighborhoods Parade)', es: 'Schull- und Veedelszöch (Desfile de escuelas y barrios)' },
    loc: 'Innenstadt', address: 'Chlodwigplatz, 50678 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Tulpensonntag ziehen Schulen und Veedel gemeinsam durch die Innenstadt, in einem der kölschesten und familienfreundlichsten Züge der Session. Kinder und Nachbarschaftsgruppen stehen hier im Mittelpunkt, nicht die großen Festwagen der Karnevalsgesellschaften.',
      en: 'On Tulpensonntag, schools and neighborhoods march together through downtown, in one of the most authentically Cologne and family friendly parades of the season. Children and neighborhood groups take center stage here, not the big floats of the carnival societies.',
      es: 'El domingo de tulipanes, escuelas y barrios desfilan juntos por el centro, en uno de los desfiles más típicamente colonienses y aptos para familias de la temporada. Aquí el protagonismo es de los niños y grupos vecinales, no de las grandes carrozas de las sociedades de carnaval.'
    } },
  { id: 'k04', slug: 'grosser-rosenmontagszug', date: '2027-02-08', endDate: '2027-02-08', cat: 'karneval',
    time: { de: '10:00 Uhr', en: '10:00 AM', es: '10:00' },
    name: { de: 'Großer Rosenmontagszug', en: 'Grand Rosenmontag Parade', es: 'Gran desfile del Lunes de Rosas' },
    loc: 'Innenstadt', address: 'Chlodwigplatz, 50678 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Der größte Karnevalsumzug Deutschlands, seit 1823 jedes Jahr veranstaltet, zieht auf einer 8,5 Kilometer langen Strecke vom Chlodwigplatz durch die gesamte Innenstadt bis zur Mohrenstraße. Rund 300 Tonnen Süßigkeiten werden unterwegs geworfen, verfolgt von mehr als einer Million Zuschauern am Straßenrand.',
      en: 'The largest carnival parade in Germany, held every year since 1823, travels an 8.5 kilometer route from Chlodwigplatz through the entire city center to Mohrenstraße. About 300 tons of sweets are thrown along the way, watched by more than a million spectators lining the streets.',
      es: 'El desfile de carnaval más grande de Alemania, celebrado cada año desde 1823, recorre 8.5 kilómetros desde Chlodwigplatz por todo el centro hasta la Mohrenstraße. Se lanzan cerca de 300 toneladas de dulces en el camino, seguido por más de un millón de espectadores en las calles.'
    } },
  { id: 'k05', slug: 'nubbelverbrennung-mit-lichterzug', date: '2027-02-09', endDate: '2027-02-09', cat: 'karneval',
    time: { de: '17:30 Uhr', en: '5:30 PM', es: '17:30' },
    name: { de: 'Nubbelverbrennung mit Lichterzug', en: 'Nubbel Burning with Lantern Parade', es: 'Quema del Nubbel con desfile de luces' },
    loc: 'Porz-Zündorf', address: 'Marktplatz an der Groov, 51143 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Zum Abschluss des Straßenkarnevals zieht ein Lichterzug zum Marktplatz an der Groov in Zündorf, wo traditionell der Nubbel verbrannt wird, eine Strohpuppe, der symbolisch alle Sünden der tollen Tage angelastet werden. Ein stimmungsvoller, etwas melancholischer Ausklang der Session.',
      en: 'To close out street carnival, a lantern parade heads to the market square at the Groov in Zündorf, where the Nubbel is traditionally burned, a straw effigy symbolically blamed for all the sins of the crazy days. An evocative, slightly melancholic end to the season.',
      es: 'Para cerrar el carnaval callejero, un desfile de luces se dirige a la plaza del mercado en la Groov, en Zündorf, donde tradicionalmente se quema al Nubbel, un muñeco de paja al que se le atribuyen simbólicamente todos los pecados de los días locos. Un cierre evocador y algo melancólico de la temporada.'
    } },
  { id: 'k06', slug: 'veedelszoch-buchforst', date: '2027-02-06', endDate: '2027-02-06', cat: 'karneval',
    time: { de: '13:00 Uhr', en: '1:00 PM', es: '13:00' },
    name: { de: 'Veedelszoch Buchforst', en: 'Buchforst Neighborhood Parade', es: 'Desfile de barrio Buchforst' },
    loc: 'Buchforst', address: 'Wildunger Straße, 51065 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssamstag zieht der Veedelszoch Buchforst durch die Straßen, organisiert von IG Karneval Buchforst. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Saturday, the Buchforst neighborhood parade winds through the streets, organized by IG Karneval Buchforst. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El sábado de carnaval, el desfile de barrio de Buchforst recorre las calles, organizado por IG Karneval Buchforst. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k07', slug: 'veedelszoch-wahn', date: '2027-02-06', endDate: '2027-02-06', cat: 'karneval',
    time: { de: '13:00 Uhr', en: '1:00 PM', es: '13:00' },
    name: { de: 'Veedelszoch Wahn', en: 'Wahn Neighborhood Parade', es: 'Desfile de barrio Wahn' },
    loc: 'Wahn', address: 'Nachtigallenstraße, 51147 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssamstag zieht der Veedelszoch Wahn durch die Straßen, organisiert von IG Wahner Karneval. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Saturday, the Wahn neighborhood parade winds through the streets, organized by IG Wahner Karneval. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El sábado de carnaval, el desfile de barrio de Wahn recorre las calles, organizado por IG Wahner Karneval. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k08', slug: 'veedelszoch-raderthal-kleinster-zoch-koelns', date: '2027-02-06', endDate: '2027-02-06', cat: 'karneval',
    time: { de: '13:11 Uhr', en: '1:11 PM', es: '13:11' },
    name: { de: 'Veedelszoch Raderthal (kleinster Zoch Kölns)', en: 'Raderthal (kleinster Zoch Kölns) Neighborhood Parade', es: 'Desfile de barrio Raderthal (kleinster Zoch Kölns)' },
    loc: 'Raderthal (kleinster Zoch Kölns)', address: 'Schulze-Delitzsch-Straße, 50968 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssamstag zieht der Veedelszoch Raderthal (kleinster Zoch Kölns) durch die Straßen, organisiert von IG Schulze-Delitzsch-Straße. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Saturday, the Raderthal (kleinster Zoch Kölns) neighborhood parade winds through the streets, organized by IG Schulze-Delitzsch-Straße. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El sábado de carnaval, el desfile de barrio de Raderthal (kleinster Zoch Kölns) recorre las calles, organizado por IG Schulze-Delitzsch-Straße. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k09', slug: 'veedelszoch-heimersdorf-und-volkhoven-weiler', date: '2027-02-06', endDate: '2027-02-06', cat: 'karneval',
    time: { de: '13:30 Uhr', en: '1:30 PM', es: '13:30' },
    name: { de: 'Veedelszoch Heimersdorf und Volkhoven-Weiler', en: 'Heimersdorf und Volkhoven-Weiler Neighborhood Parade', es: 'Desfile de barrio Heimersdorf und Volkhoven-Weiler' },
    loc: 'Heimersdorf und Volkhoven-Weiler', address: 'Deliastraße, 50767 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssamstag zieht der Veedelszoch Heimersdorf und Volkhoven-Weiler durch die Straßen, organisiert von 1. Große KG Köln-Nord von 1963. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Saturday, the Heimersdorf und Volkhoven-Weiler neighborhood parade winds through the streets, organized by 1. Große KG Köln-Nord von 1963. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El sábado de carnaval, el desfile de barrio de Heimersdorf und Volkhoven-Weiler recorre las calles, organizado por 1. Große KG Köln-Nord von 1963. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k10', slug: 'veedelszoch-hoehenberg', date: '2027-02-06', endDate: '2027-02-06', cat: 'karneval',
    time: { de: '13:30 Uhr', en: '1:30 PM', es: '13:30' },
    name: { de: 'Veedelszoch Höhenberg', en: 'Höhenberg Neighborhood Parade', es: 'Desfile de barrio Höhenberg' },
    loc: 'Höhenberg', address: 'Merheimer Heide, 51103 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssamstag zieht der Veedelszoch Höhenberg durch die Straßen, organisiert von Arbeitskreis Höhenberger Karneval. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Saturday, the Höhenberg neighborhood parade winds through the streets, organized by Arbeitskreis Höhenberger Karneval. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El sábado de carnaval, el desfile de barrio de Höhenberg recorre las calles, organizado por Arbeitskreis Höhenberger Karneval. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k11', slug: 'veedelszoch-weiss', date: '2027-02-06', endDate: '2027-02-06', cat: 'karneval',
    time: { de: '14:00 Uhr', en: '2:00 PM', es: '14:00' },
    name: { de: 'Veedelszoch Weiß', en: 'Weiß Neighborhood Parade', es: 'Desfile de barrio Weiß' },
    loc: 'Weiß', address: 'Auf dem Klemberg, 50996 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssamstag zieht der Veedelszoch Weiß durch die Straßen, organisiert von KG Kapelle Jonge Weiss von 1947. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Saturday, the Weiß neighborhood parade winds through the streets, organized by KG Kapelle Jonge Weiss von 1947. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El sábado de carnaval, el desfile de barrio de Weiß recorre las calles, organizado por KG Kapelle Jonge Weiss von 1947. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k12', slug: 'veedelszoch-ossendorf', date: '2027-02-06', endDate: '2027-02-06', cat: 'karneval',
    time: { de: '14:00 Uhr', en: '2:00 PM', es: '14:00' },
    name: { de: 'Veedelszoch Ossendorf', en: 'Ossendorf Neighborhood Parade', es: 'Desfile de barrio Ossendorf' },
    loc: 'Ossendorf', address: 'Ossendorf, 50827 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssamstag zieht der Veedelszoch Ossendorf durch die Straßen, organisiert von Löstige Fastelovendsfründe Köln-Ossendorf. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Saturday, the Ossendorf neighborhood parade winds through the streets, organized by Löstige Fastelovendsfründe Köln-Ossendorf. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El sábado de carnaval, el desfile de barrio de Ossendorf recorre las calles, organizado por Löstige Fastelovendsfründe Köln-Ossendorf. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k13', slug: 'veedelszoch-mauenheim', date: '2027-02-06', endDate: '2027-02-06', cat: 'karneval',
    time: { de: '14:30 Uhr', en: '2:30 PM', es: '14:30' },
    name: { de: 'Veedelszoch Mauenheim', en: 'Mauenheim Neighborhood Parade', es: 'Desfile de barrio Mauenheim' },
    loc: 'Mauenheim', address: 'Etzelstraße, 50733 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssamstag zieht der Veedelszoch Mauenheim durch die Straßen, organisiert von Karnevalsfreunde Mauenheimer Muschele von 1959. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Saturday, the Mauenheim neighborhood parade winds through the streets, organized by Karnevalsfreunde Mauenheimer Muschele von 1959. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El sábado de carnaval, el desfile de barrio de Mauenheim recorre las calles, organizado por Karnevalsfreunde Mauenheimer Muschele von 1959. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k14', slug: 'veedelszoch-merkenich', date: '2027-02-06', endDate: '2027-02-06', cat: 'karneval',
    time: { de: '14:30 Uhr', en: '2:30 PM', es: '14:30' },
    name: { de: 'Veedelszoch Merkenich', en: 'Merkenich Neighborhood Parade', es: 'Desfile de barrio Merkenich' },
    loc: 'Merkenich', address: 'Jungbluthstraße, 50769 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssamstag zieht der Veedelszoch Merkenich durch die Straßen, organisiert von IG Merkenicher Karneval. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Saturday, the Merkenich neighborhood parade winds through the streets, organized by IG Merkenicher Karneval. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El sábado de carnaval, el desfile de barrio de Merkenich recorre las calles, organizado por IG Merkenicher Karneval. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k15', slug: 'veedelszoch-riehl', date: '2027-02-06', endDate: '2027-02-06', cat: 'karneval',
    time: { de: '14:30 Uhr', en: '2:30 PM', es: '14:30' },
    name: { de: 'Veedelszoch Riehl', en: 'Riehl Neighborhood Parade', es: 'Desfile de barrio Riehl' },
    loc: 'Riehl', address: 'Boltensternstraße, 50735 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssamstag zieht der Veedelszoch Riehl durch die Straßen, organisiert von Riehler Fastelovendsfründe. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Saturday, the Riehl neighborhood parade winds through the streets, organized by Riehler Fastelovendsfründe. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El sábado de carnaval, el desfile de barrio de Riehl recorre las calles, organizado por Riehler Fastelovendsfründe. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k16', slug: 'veedelszoch-bocklemuend-und-mengenich', date: '2027-02-06', endDate: '2027-02-06', cat: 'karneval',
    time: { de: '15:00 Uhr', en: '3:00 PM', es: '15:00' },
    name: { de: 'Veedelszoch Bocklemünd und Mengenich', en: 'Bocklemünd und Mengenich Neighborhood Parade', es: 'Desfile de barrio Bocklemünd und Mengenich' },
    loc: 'Bocklemünd und Mengenich', address: 'Schumacherring, 50829 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssamstag zieht der Veedelszoch Bocklemünd und Mengenich durch die Straßen, organisiert von Bürgerschaftshaus Bocklemünd. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Saturday, the Bocklemünd und Mengenich neighborhood parade winds through the streets, organized by Bürgerschaftshaus Bocklemünd. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El sábado de carnaval, el desfile de barrio de Bocklemünd und Mengenich recorre las calles, organizado por Bürgerschaftshaus Bocklemünd. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k17', slug: 'veedelszoch-merheim', date: '2027-02-06', endDate: '2027-02-06', cat: 'karneval',
    time: { de: '15:00 Uhr', en: '3:00 PM', es: '15:00' },
    name: { de: 'Veedelszoch Merheim', en: 'Merheim Neighborhood Parade', es: 'Desfile de barrio Merheim' },
    loc: 'Merheim', address: 'Detmolder Straße, 51109 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssamstag zieht der Veedelszoch Merheim durch die Straßen, organisiert von Fördergemeinschaft Merheimer Karnevalszug von 1979. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Saturday, the Merheim neighborhood parade winds through the streets, organized by Fördergemeinschaft Merheimer Karnevalszug von 1979. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El sábado de carnaval, el desfile de barrio de Merheim recorre las calles, organizado por Fördergemeinschaft Merheimer Karnevalszug von 1979. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k18', slug: 'veedelszoch-worringen-fackelzug', date: '2027-02-06', endDate: '2027-02-06', cat: 'karneval',
    time: { de: '18:30 Uhr', en: '6:30 PM', es: '18:30' },
    name: { de: 'Veedelszoch Worringen (Fackelzug)', en: 'Worringen (Fackelzug) Neighborhood Parade', es: 'Desfile de barrio Worringen (Fackelzug)' },
    loc: 'Worringen (Fackelzug)', address: 'St.-Tönnis-Straße, 50859 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssamstag zieht der Veedelszoch Worringen (Fackelzug) durch die Straßen, organisiert von Festkomitee Worringer Karneval von 1886. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Saturday, the Worringen (Fackelzug) neighborhood parade winds through the streets, organized by Festkomitee Worringer Karneval von 1886. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El sábado de carnaval, el desfile de barrio de Worringen (Fackelzug) recorre las calles, organizado por Festkomitee Worringer Karneval von 1886. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k19', slug: 'veedelszoch-bickendorf', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '10:00 Uhr', en: '10:00 AM', es: '10:00' },
    name: { de: 'Veedelszoch Bickendorf', en: 'Bickendorf Neighborhood Parade', es: 'Desfile de barrio Bickendorf' },
    loc: 'Bickendorf', address: 'Josef-Esser-Platz, 50827 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Bickendorf durch die Straßen, organisiert von Gesellschaft der Karnevalsfreunde Köln Bickendorf von 1933. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Bickendorf neighborhood parade winds through the streets, organized by Gesellschaft der Karnevalsfreunde Köln Bickendorf von 1933. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Bickendorf recorre las calles, organizado por Gesellschaft der Karnevalsfreunde Köln Bickendorf von 1933. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k20', slug: 'veedelszoch-poll', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '10:00 Uhr', en: '10:00 AM', es: '10:00' },
    name: { de: 'Veedelszoch Poll', en: 'Poll Neighborhood Parade', es: 'Desfile de barrio Poll' },
    loc: 'Poll', address: 'Müllergasse, 51105 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Poll durch die Straßen, organisiert von IG Poller Zug. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Poll neighborhood parade winds through the streets, organized by IG Poller Zug. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Poll recorre las calles, organizado por IG Poller Zug. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k21', slug: 'veedelszoch-vingst', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '10:30 Uhr', en: '10:30 AM', es: '10:30' },
    name: { de: 'Veedelszoch Vingst', en: 'Vingst Neighborhood Parade', es: 'Desfile de barrio Vingst' },
    loc: 'Vingst', address: 'Marktplatz Vingst, 51103 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Vingst durch die Straßen, organisiert von 1. Vingster KG von 1971. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Vingst neighborhood parade winds through the streets, organized by 1. Vingster KG von 1971. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Vingst recorre las calles, organizado por 1. Vingster KG von 1971. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k22', slug: 'veedelszoch-porz', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '11:30 Uhr', en: '11:30 AM', es: '11:30' },
    name: { de: 'Veedelszoch Porz', en: 'Porz Neighborhood Parade', es: 'Desfile de barrio Porz' },
    loc: 'Porz', address: 'Hauptstraße, 51143 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Porz durch die Straßen, organisiert von Festausschuss Porzer Karneval. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Porz neighborhood parade winds through the streets, organized by Festausschuss Porzer Karneval. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Porz recorre las calles, organizado por Festausschuss Porzer Karneval. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k23', slug: 'veedelszoch-suerth', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '12:00 Uhr', en: '12:00 PM', es: '12:00' },
    name: { de: 'Veedelszoch Sürth', en: 'Sürth Neighborhood Parade', es: 'Desfile de barrio Sürth' },
    loc: 'Sürth', address: 'Linde-Parkplatz, 50999 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Sürth durch die Straßen, organisiert von IG Sürther Karnevalszug. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Sürth neighborhood parade winds through the streets, organized by IG Sürther Karnevalszug. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Sürth recorre las calles, organizado por IG Sürther Karnevalszug. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k24', slug: 'veedelszoch-neubrueck', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '12:00 Uhr', en: '12:00 PM', es: '12:00' },
    name: { de: 'Veedelszoch Neubrück', en: 'Neubrück Neighborhood Parade', es: 'Desfile de barrio Neubrück' },
    loc: 'Neubrück', address: 'Europaring, 51067 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Neubrück durch die Straßen, organisiert von Bürgerverein Neubrück. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Neubrück neighborhood parade winds through the streets, organized by Bürgerverein Neubrück. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Neubrück recorre las calles, organizado por Bürgerverein Neubrück. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k25', slug: 'veedelszoch-longerich', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '13:00 Uhr', en: '1:00 PM', es: '13:00' },
    name: { de: 'Veedelszoch Longerich', en: 'Longerich Neighborhood Parade', es: 'Desfile de barrio Longerich' },
    loc: 'Longerich', address: 'Contzenstraße, 50737 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Longerich durch die Straßen, organisiert von KG Blau-Weiss Alt Lunke von 1936. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Longerich neighborhood parade winds through the streets, organized by KG Blau-Weiss Alt Lunke von 1936. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Longerich recorre las calles, organizado por KG Blau-Weiss Alt Lunke von 1936. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k26', slug: 'veedelszoch-niehl', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '13:30 Uhr', en: '1:30 PM', es: '13:30' },
    name: { de: 'Veedelszoch Niehl', en: 'Niehl Neighborhood Parade', es: 'Desfile de barrio Niehl' },
    loc: 'Niehl', address: 'Nesselrodestraße, 50735 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Niehl durch die Straßen, organisiert von IG Niehler Karneval. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Niehl neighborhood parade winds through the streets, organized by IG Niehler Karneval. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Niehl recorre las calles, organizado por IG Niehler Karneval. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k27', slug: 'veedelszoch-esch', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '13:30 Uhr', en: '1:30 PM', es: '13:30' },
    name: { de: 'Veedelszoch Esch', en: 'Esch Neighborhood Parade', es: 'Desfile de barrio Esch' },
    loc: 'Esch', address: 'Greesberger Straße, 50389 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Esch durch die Straßen, organisiert von Dorfgemeinschaft Greesberger Esch 1953. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Esch neighborhood parade winds through the streets, organized by Dorfgemeinschaft Greesberger Esch 1953. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Esch recorre las calles, organizado por Dorfgemeinschaft Greesberger Esch 1953. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k28', slug: 'veedelszoch-brueck', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '13:30 Uhr', en: '1:30 PM', es: '13:30' },
    name: { de: 'Veedelszoch Brück', en: 'Brück Neighborhood Parade', es: 'Desfile de barrio Brück' },
    loc: 'Brück', address: 'Kleinfeldchensweg, 51109 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Brück durch die Straßen, organisiert von KG Löstije Brücker Müüs. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Brück neighborhood parade winds through the streets, organized by KG Löstije Brücker Müüs. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Brück recorre las calles, organizado por KG Löstije Brücker Müüs. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k29', slug: 'veedelszoch-duennwald', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '14:00 Uhr', en: '2:00 PM', es: '14:00' },
    name: { de: 'Veedelszoch Dünnwald', en: 'Dünnwald Neighborhood Parade', es: 'Desfile de barrio Dünnwald' },
    loc: 'Dünnwald', address: 'Leuchterstraße, 51069 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Dünnwald durch die Straßen, organisiert von Große Dünnwalder KG 1927 Fidele Jonge. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Dünnwald neighborhood parade winds through the streets, organized by Große Dünnwalder KG 1927 Fidele Jonge. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Dünnwald recorre las calles, organizado por Große Dünnwalder KG 1927 Fidele Jonge. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k30', slug: 'veedelszoch-holweide', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '14:00 Uhr', en: '2:00 PM', es: '14:00' },
    name: { de: 'Veedelszoch Holweide', en: 'Holweide Neighborhood Parade', es: 'Desfile de barrio Holweide' },
    loc: 'Holweide', address: 'Suitbertstraße, 51067 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Holweide durch die Straßen, organisiert von Bürgervereinigung Köln-Holweide. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Holweide neighborhood parade winds through the streets, organized by Bürgervereinigung Köln-Holweide. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Holweide recorre las calles, organizado por Bürgervereinigung Köln-Holweide. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k31', slug: 'veedelszoch-flittard', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '14:00 Uhr', en: '2:00 PM', es: '14:00' },
    name: { de: 'Veedelszoch Flittard', en: 'Flittard Neighborhood Parade', es: 'Desfile de barrio Flittard' },
    loc: 'Flittard', address: 'Georg-Zapf-Platz, 51067 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Flittard durch die Straßen, organisiert von IG Flittarder Sonntagszug. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Flittard neighborhood parade winds through the streets, organized by IG Flittarder Sonntagszug. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Flittard recorre las calles, organizado por IG Flittarder Sonntagszug. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k32', slug: 'veedelszoch-hoehenhaus', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '14:00 Uhr', en: '2:00 PM', es: '14:00' },
    name: { de: 'Veedelszoch Höhenhaus', en: 'Höhenhaus Neighborhood Parade', es: 'Desfile de barrio Höhenhaus' },
    loc: 'Höhenhaus', address: 'Von-Kettler-Straße, 51067 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Höhenhaus durch die Straßen, organisiert von Festausschuss Höhenhauser Vereine. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Höhenhaus neighborhood parade winds through the streets, organized by Festausschuss Höhenhauser Vereine. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Höhenhaus recorre las calles, organizado por Festausschuss Höhenhauser Vereine. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k33', slug: 'veedelszoch-loevenich-und-weiden', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '14:00 Uhr', en: '2:00 PM', es: '14:00' },
    name: { de: 'Veedelszoch Lövenich und Weiden', en: 'Lövenich und Weiden Neighborhood Parade', es: 'Desfile de barrio Lövenich und Weiden' },
    loc: 'Lövenich und Weiden', address: 'Kölner Straße, 50859 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Lövenich und Weiden durch die Straßen, organisiert von KG Lövenicher Neustädter 1903. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Lövenich und Weiden neighborhood parade winds through the streets, organized by KG Lövenicher Neustädter 1903. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Lövenich und Weiden recorre las calles, organizado por KG Lövenicher Neustädter 1903. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k34', slug: 'veedelszoch-meschenich', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '14:00 Uhr', en: '2:00 PM', es: '14:00' },
    name: { de: 'Veedelszoch Meschenich', en: 'Meschenich Neighborhood Parade', es: 'Desfile de barrio Meschenich' },
    loc: 'Meschenich', address: 'Alte Brühler Straße, 50969 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Meschenich durch die Straßen, organisiert von Bürger- und Vereinsgemeinschaft Meschenich. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Meschenich neighborhood parade winds through the streets, organized by Bürger- und Vereinsgemeinschaft Meschenich. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Meschenich recorre las calles, organizado por Bürger- und Vereinsgemeinschaft Meschenich. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k35', slug: 'veedelszoch-ostheim', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '14:00 Uhr', en: '2:00 PM', es: '14:00' },
    name: { de: 'Veedelszoch Ostheim', en: 'Ostheim Neighborhood Parade', es: 'Desfile de barrio Ostheim' },
    loc: 'Ostheim', address: 'Rösrather Straße, 51107 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Ostheim durch die Straßen, organisiert von Förderverein für den Ostheimer Karnevalsumzug. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Ostheim neighborhood parade winds through the streets, organized by Förderverein für den Ostheimer Karnevalsumzug. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Ostheim recorre las calles, organizado por Förderverein für den Ostheimer Karnevalsumzug. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k36', slug: 'veedelszoch-stammheim', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '14:00 Uhr', en: '2:00 PM', es: '14:00' },
    name: { de: 'Veedelszoch Stammheim', en: 'Stammheim Neighborhood Parade', es: 'Desfile de barrio Stammheim' },
    loc: 'Stammheim', address: 'Elias-Gut-Straße, 51061 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Stammheim durch die Straßen, organisiert von Bürgerverein Köln Stammheim. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Stammheim neighborhood parade winds through the streets, organized by Bürgerverein Köln Stammheim. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Stammheim recorre las calles, organizado por Bürgerverein Köln Stammheim. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k37', slug: 'veedelszoch-widdersdorf', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '14:00 Uhr', en: '2:00 PM', es: '14:00' },
    name: { de: 'Veedelszoch Widdersdorf', en: 'Widdersdorf Neighborhood Parade', es: 'Desfile de barrio Widdersdorf' },
    loc: 'Widdersdorf', address: 'Hauptstraße, 50859 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Widdersdorf durch die Straßen, organisiert von Dorfgemeinschaft Köln-Widdersdorf. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Widdersdorf neighborhood parade winds through the streets, organized by Dorfgemeinschaft Köln-Widdersdorf. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Widdersdorf recorre las calles, organizado por Dorfgemeinschaft Köln-Widdersdorf. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k38', slug: 'veedelszoch-worringen-kinderzug', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '14:00 Uhr', en: '2:00 PM', es: '14:00' },
    name: { de: 'Veedelszoch Worringen (Kinderzug)', en: 'Worringen (Kinderzug) Neighborhood Parade', es: 'Desfile de barrio Worringen (Kinderzug)' },
    loc: 'Worringen (Kinderzug)', address: 'An den Kaulen, 50859 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Worringen (Kinderzug) durch die Straßen, organisiert von Festkomitee Worringer Karneval. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Worringen (Kinderzug) neighborhood parade winds through the streets, organized by Festkomitee Worringer Karneval. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Worringen (Kinderzug) recorre las calles, organizado por Festkomitee Worringer Karneval. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k39', slug: 'veedelszoch-langel-rheinkassel-und-kasselberg', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '14:30 Uhr', en: '2:30 PM', es: '14:30' },
    name: { de: 'Veedelszoch Langel, Rheinkassel und Kasselberg', en: 'Langel, Rheinkassel und Kasselberg Neighborhood Parade', es: 'Desfile de barrio Langel, Rheinkassel und Kasselberg' },
    loc: 'Langel, Rheinkassel und Kasselberg', address: 'Langel, 51145 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Langel, Rheinkassel und Kasselberg durch die Straßen, organisiert von Dorfgemeinschaft Köln-Langel-Rheinkassel-Kasselberg 1972. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Langel, Rheinkassel und Kasselberg neighborhood parade winds through the streets, organized by Dorfgemeinschaft Köln-Langel-Rheinkassel-Kasselberg 1972. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Langel, Rheinkassel und Kasselberg recorre las calles, organizado por Dorfgemeinschaft Köln-Langel-Rheinkassel-Kasselberg 1972. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k40', slug: 'veedelszoch-rodenkirchen', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '15:00 Uhr', en: '3:00 PM', es: '15:00' },
    name: { de: 'Veedelszoch Rodenkirchen', en: 'Rodenkirchen Neighborhood Parade', es: 'Desfile de barrio Rodenkirchen' },
    loc: 'Rodenkirchen', address: 'Rodenkirchen, 50996 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Rodenkirchen durch die Straßen, organisiert von IG Rodenkirchener Karnevalszug. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Rodenkirchen neighborhood parade winds through the streets, organized by IG Rodenkirchener Karnevalszug. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Rodenkirchen recorre las calles, organizado por IG Rodenkirchener Karnevalszug. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k41', slug: 'veedelszoch-ensen-und-westhoven', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '16:00 Uhr', en: '4:00 PM', es: '16:00' },
    name: { de: 'Veedelszoch Ensen und Westhoven', en: 'Ensen und Westhoven Neighborhood Parade', es: 'Desfile de barrio Ensen und Westhoven' },
    loc: 'Ensen und Westhoven', address: 'Kölner Straße, 51149 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Ensen und Westhoven durch die Straßen, organisiert von Festkomitee Ensen-Westhovener Karneval. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Ensen und Westhoven neighborhood parade winds through the streets, organized by Festkomitee Ensen-Westhovener Karneval. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Ensen und Westhoven recorre las calles, organizado por Festkomitee Ensen-Westhovener Karneval. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k42', slug: 'veedelszoch-porz-langel', date: '2027-02-07', endDate: '2027-02-07', cat: 'karneval',
    time: { de: '16:15 Uhr', en: '4:15 PM', es: '16:15' },
    name: { de: 'Veedelszoch Porz-Langel', en: 'Porz-Langel Neighborhood Parade', es: 'Desfile de barrio Porz-Langel' },
    loc: 'Porz-Langel', address: 'Hintergasse, 51143 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Karnevalssonntag zieht der Veedelszoch Porz-Langel durch die Straßen, organisiert von KG Rut-Wiess Löstije Langeler. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Carnival Sunday (Tulpensonntag), the Porz-Langel neighborhood parade winds through the streets, organized by KG Rut-Wiess Löstije Langeler. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El domingo de carnaval, el desfile de barrio de Porz-Langel recorre las calles, organizado por KG Rut-Wiess Löstije Langeler. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k43', slug: 'veedelszoch-worringen', date: '2027-02-08', endDate: '2027-02-08', cat: 'karneval',
    time: { de: '10:00 Uhr', en: '10:00 AM', es: '10:00' },
    name: { de: 'Veedelszoch Worringen', en: 'Worringen Neighborhood Parade', es: 'Desfile de barrio Worringen' },
    loc: 'Worringen', address: 'Schmaler Wall, 50859 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Rosenmontag zieht der Veedelszoch Worringen durch die Straßen, organisiert von Festkomitee Worringer Karneval. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Rose Monday, the Worringen neighborhood parade winds through the streets, organized by Festkomitee Worringer Karneval. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El Lunes de Rosas, el desfile de barrio de Worringen recorre las calles, organizado por Festkomitee Worringer Karneval. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k44', slug: 'veedelszoch-godorf', date: '2027-02-08', endDate: '2027-02-08', cat: 'karneval',
    time: { de: '11:30 Uhr', en: '11:30 AM', es: '11:30' },
    name: { de: 'Veedelszoch Godorf', en: 'Godorf Neighborhood Parade', es: 'Desfile de barrio Godorf' },
    loc: 'Godorf', address: 'Buchfinkenstraße, 50997 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Rosenmontag zieht der Veedelszoch Godorf durch die Straßen, organisiert von KG Die Hexen. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Rose Monday, the Godorf neighborhood parade winds through the streets, organized by KG Die Hexen. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El Lunes de Rosas, el desfile de barrio de Godorf recorre las calles, organizado por KG Die Hexen. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k45', slug: 'veedelszoch-rondorf', date: '2027-02-08', endDate: '2027-02-08', cat: 'karneval',
    time: { de: '14:30 Uhr', en: '2:30 PM', es: '14:30' },
    name: { de: 'Veedelszoch Rondorf', en: 'Rondorf Neighborhood Parade', es: 'Desfile de barrio Rondorf' },
    loc: 'Rondorf', address: 'Rondorf, 50997 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Rosenmontag zieht der Veedelszoch Rondorf durch die Straßen, organisiert von KG Der Reiter 1960 und KG Löstige Öhs. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Rose Monday, the Rondorf neighborhood parade winds through the streets, organized by KG Der Reiter 1960 und KG Löstige Öhs. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El Lunes de Rosas, el desfile de barrio de Rondorf recorre las calles, organizado por KG Der Reiter 1960 und KG Löstige Öhs. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k46', slug: 'veedelszoch-zollstock', date: '2027-02-09', endDate: '2027-02-09', cat: 'karneval',
    time: { de: '10:49 Uhr', en: '10:49 AM', es: '10:49' },
    name: { de: 'Veedelszoch Zollstock', en: 'Zollstock Neighborhood Parade', es: 'Desfile de barrio Zollstock' },
    loc: 'Zollstock', address: 'Kendenicher Straße, 50969 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Veilchendienstag zieht der Veedelszoch Zollstock durch die Straßen, organisiert von Freunde des Zollstocker Dienstagszugs. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Violet Tuesday, the Zollstock neighborhood parade winds through the streets, organized by Freunde des Zollstocker Dienstagszugs. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El martes de carnaval, el desfile de barrio de Zollstock recorre las calles, organizado por Freunde des Zollstocker Dienstagszugs. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k47', slug: 'veedelszoch-nippes-und-weidenpesch', date: '2027-02-09', endDate: '2027-02-09', cat: 'karneval',
    time: { de: '13:00 Uhr', en: '1:00 PM', es: '13:00' },
    name: { de: 'Veedelszoch Nippes und Weidenpesch', en: 'Nippes und Weidenpesch Neighborhood Parade', es: 'Desfile de barrio Nippes und Weidenpesch' },
    loc: 'Nippes und Weidenpesch', address: 'Rennbahnstraße, 50733 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Veilchendienstag zieht der Veedelszoch Nippes und Weidenpesch durch die Straßen, organisiert von KKG Nippeser Bürgerwehr 1903. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Violet Tuesday, the Nippes und Weidenpesch neighborhood parade winds through the streets, organized by KKG Nippeser Bürgerwehr 1903. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El martes de carnaval, el desfile de barrio de Nippes und Weidenpesch recorre las calles, organizado por KKG Nippeser Bürgerwehr 1903. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k48', slug: 'veedelszoch-suelz', date: '2027-02-09', endDate: '2027-02-09', cat: 'karneval',
    time: { de: '13:00 Uhr', en: '1:00 PM', es: '13:00' },
    name: { de: 'Veedelszoch Sülz', en: 'Sülz Neighborhood Parade', es: 'Desfile de barrio Sülz' },
    loc: 'Sülz', address: 'Gerolsteiner Straße, 50937 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Veilchendienstag zieht der Veedelszoch Sülz durch die Straßen, organisiert von IG Sülz-Klettenberg-Lindenthal Veedelszoch. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Violet Tuesday, the Sülz neighborhood parade winds through the streets, organized by IG Sülz-Klettenberg-Lindenthal Veedelszoch. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El martes de carnaval, el desfile de barrio de Sülz recorre las calles, organizado por IG Sülz-Klettenberg-Lindenthal Veedelszoch. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k49', slug: 'veedelszoch-suedstadt', date: '2027-02-09', endDate: '2027-02-09', cat: 'karneval',
    time: { de: '13:00 Uhr', en: '1:00 PM', es: '13:00' },
    name: { de: 'Veedelszoch Südstadt', en: 'Südstadt Neighborhood Parade', es: 'Desfile de barrio Südstadt' },
    loc: 'Südstadt', address: 'Wormser Straße, 50677 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Veilchendienstag zieht der Veedelszoch Südstadt durch die Straßen, organisiert von AG Südstadt-Zug. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Violet Tuesday, the Südstadt neighborhood parade winds through the streets, organized by AG Südstadt-Zug. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El martes de carnaval, el desfile de barrio de Südstadt recorre las calles, organizado por AG Südstadt-Zug. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k50', slug: 'veedelszoch-kalk-und-humboldt-gremberg', date: '2027-02-09', endDate: '2027-02-09', cat: 'karneval',
    time: { de: '13:30 Uhr', en: '1:30 PM', es: '13:30' },
    name: { de: 'Veedelszoch Kalk und Humboldt-Gremberg', en: 'Kalk und Humboldt-Gremberg Neighborhood Parade', es: 'Desfile de barrio Kalk und Humboldt-Gremberg' },
    loc: 'Kalk und Humboldt-Gremberg', address: 'Eythstraße, 51103 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Veilchendienstag zieht der Veedelszoch Kalk und Humboldt-Gremberg durch die Straßen, organisiert von IG Kalk-Humboldt-Gremberger-Dienstagszug. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Violet Tuesday, the Kalk und Humboldt-Gremberg neighborhood parade winds through the streets, organized by IG Kalk-Humboldt-Gremberger-Dienstagszug. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El martes de carnaval, el desfile de barrio de Kalk und Humboldt-Gremberg recorre las calles, organizado por IG Kalk-Humboldt-Gremberger-Dienstagszug. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k51', slug: 'veedelszoch-ehrenfeld', date: '2027-02-09', endDate: '2027-02-09', cat: 'karneval',
    time: { de: '13:45 Uhr', en: '1:45 PM', es: '13:45' },
    name: { de: 'Veedelszoch Ehrenfeld', en: 'Ehrenfeld Neighborhood Parade', es: 'Desfile de barrio Ehrenfeld' },
    loc: 'Ehrenfeld', address: 'Lenauplatz, 50823 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Veilchendienstag zieht der Veedelszoch Ehrenfeld durch die Straßen, organisiert von Festausschuss Ehrenfelder Karneval 1953. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Violet Tuesday, the Ehrenfeld neighborhood parade winds through the streets, organized by Festausschuss Ehrenfelder Karneval 1953. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El martes de carnaval, el desfile de barrio de Ehrenfeld recorre las calles, organizado por Festausschuss Ehrenfelder Karneval 1953. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k52', slug: 'veedelszoch-deutz', date: '2027-02-09', endDate: '2027-02-09', cat: 'karneval',
    time: { de: '14:00 Uhr', en: '2:00 PM', es: '14:00' },
    name: { de: 'Veedelszoch Deutz', en: 'Deutz Neighborhood Parade', es: 'Desfile de barrio Deutz' },
    loc: 'Deutz', address: 'Alter Mühlenweg, 50679 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Veilchendienstag zieht der Veedelszoch Deutz durch die Straßen, organisiert von IG Deutzer Dienstagszug. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Violet Tuesday, the Deutz neighborhood parade winds through the streets, organized by IG Deutzer Dienstagszug. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El martes de carnaval, el desfile de barrio de Deutz recorre las calles, organizado por IG Deutzer Dienstagszug. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k53', slug: 'veedelszoch-dellbrueck', date: '2027-02-09', endDate: '2027-02-09', cat: 'karneval',
    time: { de: '14:00 Uhr', en: '2:00 PM', es: '14:00' },
    name: { de: 'Veedelszoch Dellbrück', en: 'Dellbrück Neighborhood Parade', es: 'Desfile de barrio Dellbrück' },
    loc: 'Dellbrück', address: 'Hagedornstraße, 51069 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Veilchendienstag zieht der Veedelszoch Dellbrück durch die Straßen, organisiert von Festausschuss Dellbrücker Dienstagszug. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Violet Tuesday, the Dellbrück neighborhood parade winds through the streets, organized by Festausschuss Dellbrücker Dienstagszug. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El martes de carnaval, el desfile de barrio de Dellbrück recorre las calles, organizado por Festausschuss Dellbrücker Dienstagszug. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k54', slug: 'veedelszoch-junkersdorf', date: '2027-02-09', endDate: '2027-02-09', cat: 'karneval',
    time: { de: '14:00 Uhr', en: '2:00 PM', es: '14:00' },
    name: { de: 'Veedelszoch Junkersdorf', en: 'Junkersdorf Neighborhood Parade', es: 'Desfile de barrio Junkersdorf' },
    loc: 'Junkersdorf', address: 'Alfons-Nowak-Straße, 50858 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Veilchendienstag zieht der Veedelszoch Junkersdorf durch die Straßen, organisiert von Große Junkersdorfer KG von 1973. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Violet Tuesday, the Junkersdorf neighborhood parade winds through the streets, organized by Große Junkersdorfer KG von 1973. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El martes de carnaval, el desfile de barrio de Junkersdorf recorre las calles, organizado por Große Junkersdorfer KG von 1973. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k55', slug: 'veedelszoch-muelheim', date: '2027-02-09', endDate: '2027-02-09', cat: 'karneval',
    time: { de: '14:00 Uhr', en: '2:00 PM', es: '14:00' },
    name: { de: 'Veedelszoch Mülheim', en: 'Mülheim Neighborhood Parade', es: 'Desfile de barrio Mülheim' },
    loc: 'Mülheim', address: 'Tiefentalstraße, 51063 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Veilchendienstag zieht der Veedelszoch Mülheim durch die Straßen, organisiert von Festausschuss Karnevalsdienstagszug Köln-Mülheim. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Violet Tuesday, the Mülheim neighborhood parade winds through the streets, organized by Festausschuss Karnevalsdienstagszug Köln-Mülheim. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El martes de carnaval, el desfile de barrio de Mülheim recorre las calles, organizado por Festausschuss Karnevalsdienstagszug Köln-Mülheim. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  { id: 'k56', slug: 'veedelszoch-pesch', date: '2027-02-09', endDate: '2027-02-09', cat: 'karneval',
    time: { de: '14:11 Uhr', en: '2:11 PM', es: '14:11' },
    name: { de: 'Veedelszoch Pesch', en: 'Pesch Neighborhood Parade', es: 'Desfile de barrio Pesch' },
    loc: 'Pesch', address: 'Jakobusstraße, 50767 Köln', source: 'koelner-karneval.org',
    story: {
      de: 'Am Veilchendienstag zieht der Veedelszoch Pesch durch die Straßen, organisiert von IG Pescher Dienstagszug 1966. Nachbarn stehen am Straßenrand, um Kamelle zu fangen und das eigene Veedel hochleben zu lassen.',
      en: 'On Violet Tuesday, the Pesch neighborhood parade winds through the streets, organized by IG Pescher Dienstagszug 1966. Neighbors line the road to catch candy and celebrate their own district.',
      es: 'El martes de carnaval, el desfile de barrio de Pesch recorre las calles, organizado por IG Pescher Dienstagszug 1966. Los vecinos se ubican junto al recorrido para atrapar caramelos y festejar su propio Veedel.'
    } },
  // eventos ya pasados, incluidos a pedido, marcados visualmente
  { id: 'p1', slug: 'tag-des-veedels', date: '2026-04-24', endDate: '2026-04-25', cat: 'strassenfest',
    name: { de: 'Tag des Veedels', en: 'Tag des Veedels', es: 'Tag des Veedels' },
    loc: 'Mülheim, Braunsfeld u.a.', address: 'Mülheim / Braunsfeld, Köln', source: 'citynews-koeln.de', isPast: true,
    story: {
      de: 'An diesem Tag öffneten mehrere Kölner Veedel gleichzeitig ihre Straßen für Nachbarschaftsfeste, von Mülheim bis Braunsfeld. Jedes Viertel gestaltete sein eigenes Programm, verbunden durch die gemeinsame Idee des Feierns vor der eigenen Haustür.',
      en: 'On this day, several Cologne neighborhoods opened their streets at the same time for community festivals, from Mülheim to Braunsfeld. Each district shaped its own program, united by the shared idea of celebrating right at home.',
      es: 'Ese día, varios barrios de Colonia abrieron sus calles al mismo tiempo para fiestas vecinales, desde Mülheim hasta Braunsfeld. Cada barrio armó su propia programación, unidos por la misma idea de festejar en la propia puerta de casa.'
    } },
  { id: 'p2', slug: 'bunt-im-carree-2', date: '2026-04-25', endDate: '2026-04-26', cat: 'strassenfest',
    name: { de: 'Bunt im Carrée', en: 'Bunt im Carrée', es: 'Bunt im Carrée' },
    loc: 'Berrenrather Str., Sülz', address: 'Berrenrather Straße, 50937 Köln', source: 'verliebtinkoeln.com', isPast: true,
    story: {
      de: 'Die Frühlingsausgabe von Bunt im Carrée brachte Sülz und Klettenberg schon im April zusammen, mit Livemusik und einem bunten Warenangebot entlang der Berrenrather Straße.',
      en: 'The spring edition of Bunt im Carrée brought Sülz and Klettenberg together already in April, with live music and a colorful range of goods along Berrenrather Straße.',
      es: 'La edición de primavera de Bunt im Carrée reunió a Sülz y Klettenberg ya en abril, con música en vivo y una variada oferta de productos a lo largo de la Berrenrather Straße.'
    } },
  { id: 'p3', slug: 'fruehlingsfest-rheinuferpromenade', date: '2026-05-14', endDate: '2026-05-17', cat: 'strassenfest',
    name: { de: 'Frühlingsfest Rheinuferpromenade', en: 'Frühlingsfest Rheinuferpromenade', es: 'Frühlingsfest Rheinuferpromenade' },
    loc: 'Rheinuferpromenade, Innenstadt', address: 'Rheinuferpromenade, 50667 Köln', source: 'verliebtinkoeln.com', isPast: true,
    story: {
      de: 'Direkt am Rhein entstand für ein verlängertes Wochenende ein Markt mit kulinarischen Ständen und Blick auf das Wasser, mitten in der Innenstadt.',
      en: 'Right by the Rhine, a market with food stalls and a view of the water popped up for a long weekend, right in the city center.',
      es: 'Junto al Rin, apareció durante un fin de semana largo un mercado con puestos de comida y vista al río, en pleno centro de la ciudad.'
    } },
  { id: 'p4', slug: 'porzer-inselfest', date: '2026-05-14', endDate: '2026-05-17', cat: 'strassenfest',
    name: { de: 'Porzer Inselfest', en: 'Porzer Inselfest', es: 'Porzer Inselfest' },
    loc: 'Zündorfer Groov, Porz', address: 'Zündorfer Groov, 51143 Köln', source: 'verliebtinkoeln.com', isPast: true,
    story: {
      de: 'Am Zündorfer Groov in Porz feierte das Inselfest mit Ständen und Programm direkt am Rheinufer, ein Frühlingstreffen für den ganzen Stadtbezirk.',
      en: 'At Zündorfer Groov in Porz, the island festival celebrated with stalls and a program right on the Rhine bank, a spring gathering for the whole district.',
      es: 'En Zündorfer Groov, en Porz, el festival de la isla celebró con puestos y programación justo en la orilla del Rin, un encuentro de primavera para todo el distrito.'
    } },
  { id: 'p5', slug: 'musikfestival-rath-heumar', date: '2026-05-30', endDate: '2026-05-31', cat: 'strassenfest',
    name: { de: 'Musikfestival Rath/Heumar', en: 'Musikfestival Rath/Heumar', es: 'Musikfestival Rath/Heumar' },
    loc: 'Kurt-Henn-Platz', address: 'Kurt-Henn-Platz, 51107 Köln', source: 'verliebtinkoeln.com', isPast: true,
    story: {
      de: 'Auf dem Kurt Henn Platz spielten lokale Bands für ein Wochenende und brachten Musik direkt in den Stadtbezirk Rath Heumar.',
      en: 'On Kurt Henn Platz, local bands played for a weekend, bringing music straight into the Rath Heumar district.',
      es: 'En la plaza Kurt Henn, bandas locales tocaron durante un fin de semana, llevando música directamente al distrito de Rath Heumar.'
    } },
  { id: 'p6', slug: 'fruehlingsmarkt-rodenkirchen', date: '2026-06-04', endDate: '2026-06-05', cat: 'strassenfest',
    name: { de: 'Frühlingsmarkt Rodenkirchen', en: 'Frühlingsmarkt Rodenkirchen', es: 'Frühlingsmarkt Rodenkirchen' },
    loc: 'Maternusplatz, Rodenkirchen', address: 'Maternusplatz, 50996 Köln', source: 'verliebtinkoeln.com', isPast: true,
    story: {
      de: 'Der Maternusplatz in Rodenkirchen füllte sich mit Marktständen zum Start in den Frühling, begleitet von kulinarischen Angeboten aus der Nachbarschaft.',
      en: 'Maternusplatz in Rodenkirchen filled with market stalls to welcome spring, accompanied by food offerings from the neighborhood.',
      es: 'La plaza Maternusplatz en Rodenkirchen se llenó de puestos de mercado para dar la bienvenida a la primavera, acompañados de ofertas gastronómicas del barrio.'
    } },
  { id: 'p7', slug: 'sommerfest-am-rheinauhafen', date: '2026-06-19', endDate: '2026-06-21', cat: 'strassenfest',
    name: { de: 'Sommerfest am Rheinauhafen', en: 'Sommerfest am Rheinauhafen', es: 'Sommerfest am Rheinauhafen' },
    loc: 'Rheinauhafen am Schokoladenmuseum', address: 'Rheinauhafen, 50678 Köln', source: 'lindweiler.de', isPast: true,
    story: {
      de: 'Am Rheinauhafen, direkt beim Schokoladenmuseum, verwandelte sich die Uferpromenade für ein Wochenende in einen Sommertreffpunkt mit Blick auf die Kranhäuser.',
      en: 'At Rheinauhafen, right by the Chocolate Museum, the riverside promenade turned into a summer gathering spot for a weekend, with a view of the crane houses.',
      es: 'En el Rheinauhafen, justo al lado del Museo del Chocolate, el paseo ribereño se convirtió por un fin de semana en un punto de encuentro veraniego con vista a las casas grúa.'
    } },
  { id: 'p8', slug: 'veedelsfest-rodenkirchen', date: '2026-07-11', endDate: '2026-07-12', cat: 'strassenfest',
    name: { de: 'Veedelsfest Rodenkirchen', en: 'Veedelsfest Rodenkirchen', es: 'Veedelsfest Rodenkirchen' },
    loc: 'Maternusplatz, Rodenkirchen', address: 'Maternusplatz, 50996 Köln', source: 'lindweiler.de', isPast: true,
    story: {
      de: 'Wieder auf dem Maternusplatz feierte Rodenkirchen sein eigenes Veedelsfest mitten im Sommer, mit Ständen und Programm für die ganze Familie.',
      en: 'Again on Maternusplatz, Rodenkirchen celebrated its own neighborhood festival in midsummer, with stalls and a program for the whole family.',
      es: 'Nuevamente en la plaza Maternusplatz, Rodenkirchen celebró su propia fiesta de barrio en pleno verano, con puestos y programación para toda la familia.'
    } },
  { id: 'p9', slug: 'rothehausstrassenfest', date: '2026-07-12', endDate: '2026-07-12', cat: 'strassenfest',
    name: { de: 'Rothehausstraßenfest', en: 'Rothehausstraßenfest', es: 'Rothehausstraßenfest' },
    loc: 'Ehrenfeld', address: 'Ehrenfeld, 50825 Köln', source: 'festivalsindeutschland.de', isPast: true,
    story: {
      de: 'In Ehrenfeld verwandelte sich die Rothehausstraße für einen Tag in eine Festmeile mit Ständen, Musik und dem typischen Nachbarschaftsflair des Viertels.',
      en: "In Ehrenfeld, Rothehausstraße turned into a festival mile for a day, with stalls, music and the neighborhood's typical community feel.",
      es: 'En Ehrenfeld, la Rothehausstraße se transformó por un día en una zona festiva con puestos, música y el típico ambiente vecinal del barrio.'
    } },
  { id: 'p10', slug: 'csd-strassenfest', date: '2026-07-03', endDate: '2026-07-05', cat: 'pride',
    name: { de: 'CSD-Straßenfest', en: 'CSD Street Festival', es: 'Fiesta callejera del CSD' },
    loc: 'Heumarkt, Altstadt', address: 'Heumarkt, 50667 Köln', source: 'koeln.de', isPast: true,
    story: {
      de: 'Rund um Heumarkt, Gürzenich und Alter Markt bildete das CSD Straßenfest den Abschluss des Cologne Pride, mit Bühnen, Reden und Auftritten für queere Rechte.',
      en: 'Around Heumarkt, Gürzenich and Alter Markt, the CSD street festival marked the finale of Cologne Pride, with stages, speeches and performances for queer rights.',
      es: 'Alrededor de Heumarkt, Gürzenich y Alter Markt, la fiesta callejera del CSD marcó el cierre del Cologne Pride, con escenarios, discursos y presentaciones por los derechos queer.'
    } },
  { id: 'p11', slug: 'koelner-lichter', date: '2026-08-01', endDate: '2026-08-01', cat: 'feuerwerk',
    name: { de: 'Kölner Lichter', en: 'Kölner Lichter Fireworks', es: 'Kölner Lichter (fuegos artificiales)' },
    loc: 'Rheinufer', address: 'Rheinufer, 50667 Köln', source: 'koelner-lichter.de', isPast: true,
    story: {
      de: 'Am Rheinufer verfolgten Hunderttausende das musiksynchrone Feuerwerk der Kölner Lichter, eines der größten Spektakel seiner Art in Europa, kostenlos vom Ufer aus zu sehen.',
      en: 'Along the Rhine bank, hundreds of thousands watched the music synchronized fireworks of Kölner Lichter, one of the largest spectacles of its kind in Europe, free to watch from the riverside.',
      es: 'En la orilla del Rin, cientos de miles de personas vieron los fuegos artificiales sincronizados con música de Kölner Lichter, uno de los espectáculos más grandes de su tipo en Europa, gratis desde la costa.'
    } },
];

const STATIONS = {
  hbf: { label: 'Köln Hbf', query: 'Köln Hauptbahnhof' },
  friesenplatz: { label: 'Friesenplatz', query: 'Friesenplatz, Köln' },
};

function mapsUrl(fromQuery, destQuery) {
  const origin = encodeURIComponent(fromQuery);
  const destination = encodeURIComponent(destQuery.includes('Köln') ? destQuery : destQuery + ', Köln');
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

function EventImage({ ev, cat }) {
  const [failed, setFailed] = useState(false);
  const src = ev.img || `/images/${ev.slug || ev.id}.jpg`;
  if (failed) {
    return (
      <div style={{ width: '100%', height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, background: cat.chip }}>
        {cat.icon}
      </div>
    );
  }
  return (
    <img src={src} alt="" style={{ width: '100%', height: 170, objectFit: 'cover', display: 'block' }} onError={() => setFailed(true)} />
  );
}

function formatDate(ev, lang) {
  const opts = { day: '2-digit', month: 'short' };
  const locale = lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : 'en-GB';
  const start = new Date(ev.date + 'T00:00:00').toLocaleDateString(locale, opts);
  let dateStr;
  if (ev.endDate && ev.endDate !== ev.date) {
    const end = new Date(ev.endDate + 'T00:00:00').toLocaleDateString(locale, opts);
    if (lang === 'es') dateStr = `del ${start} al ${end}`;
    else if (lang === 'de') dateStr = `${start} bis ${end}`;
    else dateStr = `${start} to ${end}`;
  } else {
    dateStr = start;
  }
  if (ev.time && ev.time[lang]) {
    dateStr += `, ${ev.time[lang]}`;
  }
  return dateStr;
}

export default function App() {
  const [lang, setLang] = useState('de');
  const [tab, setTab] = useState('week');
  const [fromStation, setFromStation] = useState('hbf');
  const t = T[lang];

  const filtered = useMemo(() => {
    const upcoming = EVENTS.filter(e => !e.isPast);
    const past = EVENTS.filter(e => e.isPast);
    if (tab === 'past') return past.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (tab === 'upcoming') return upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
    const days = 7;
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
                    fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: lang === l ? '#E7B876' : 'rgba(247,243,234,0.16)',
                    color: lang === l ? '#1F4E5C' : '#F7F3EA',
                  }}>{l.toUpperCase()}</button>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 32, fontWeight: 500, fontStyle: 'italic', marginTop: 8, lineHeight: 1.05, letterSpacing: '0.01em', textShadow: '0 2px 10px rgba(0,0,0,0.45)' }}>
                {t.title1} <span style={{ color: '#E7B876', fontWeight: 600 }}>{t.title2}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TIME TABS */}
        <div style={{ display: 'flex', gap: 5, padding: '14px 20px 0 20px', overflowX: 'auto' }}>
          {[['week', t.tabWeek], ['upcoming', t.tabUpcoming], ['past', t.tabPast]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{
                flex: '1 0 auto', textAlign: 'center', fontSize: 12, fontWeight: 700, padding: '9px 8px', borderRadius: 16, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                background: tab === key ? '#1F4E5C' : '#faf7f0', color: tab === key ? '#F7F3EA' : '#57534e',
              }}>{label}</button>
          ))}
        </div>

        {/* STATION SELECTOR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px 0 20px' }}>
          <span style={{ fontSize: 13, color: '#8a8378', fontWeight: 700 }}>{t.fromStation}</span>
          {Object.entries(STATIONS).map(([key, s]) => (
            <button key={key} onClick={() => setFromStation(key)}
              style={{
                fontSize: 13, fontWeight: 700, padding: '6px 12px', borderRadius: 14, border: fromStation === key ? 'none' : '1px solid #d8d2c0', cursor: 'pointer',
                background: fromStation === key ? '#c9812f' : 'white', color: fromStation === key ? 'white' : '#57534e',
              }}>{s.label}</button>
          ))}
        </div>

        {/* EVENT LIST */}
        <div style={{ padding: '14px 20px 0 20px' }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '36px 14px', background: 'white', borderRadius: 16, boxShadow: '0 1px 4px rgba(31,78,92,0.07)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏛️</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 600, color: '#1F4E5C', marginBottom: 10 }}>{t.emptyTitle}</div>
              <div style={{ fontSize: 14.5, color: '#57534e', lineHeight: 1.55, maxWidth: 300, margin: '0 auto' }}>{t.emptyText}</div>
            </div>
          )}
          {filtered.map(ev => {
            const cat = CATS[ev.cat];
            return (
              <div key={ev.id} style={{ background: 'white', marginBottom: 14, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 10px rgba(31,78,92,0.10)', opacity: ev.isPast ? 0.6 : 1 }}>
                <EventImage ev={ev} cat={cat} />
                <div style={{ padding: '16px 18px 18px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: cat.text, background: cat.chip, padding: '4px 10px', borderRadius: 10 }}>{cat.label[lang]}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 10, background: ev.isPast ? '#e5e1d6' : '#e2f0e9', color: ev.isPast ? '#8a8378' : '#2f6d52', whiteSpace: 'nowrap' }}>
                      {ev.isPast ? t.past : t.free}
                    </div>
                  </div>
                  <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontSize: 25, fontWeight: 600, color: '#1F4E5C', lineHeight: 1.15, marginBottom: 8 }}>{ev.name[lang]}</div>
                  <div style={{ fontSize: 14.5, color: '#57534e', marginBottom: 12 }}>
                    {formatDate(ev, lang)}
                  </div>
                  {ev.story && (
                    <div style={{ borderLeft: '3px solid #E7B876', padding: '1px 0 1px 13px', marginBottom: 12 }}>
                      <div style={{ fontSize: 14.5, color: '#3a362e', lineHeight: 1.6 }}>{ev.story[lang]}</div>
                    </div>
                  )}
                  {ev.address && (
                    <div style={{ fontSize: 13, color: '#8a8378', marginBottom: 14 }}>{ev.address}</div>
                  )}
                  {!ev.isPast && (
                    <a href={mapsUrl(STATIONS[fromStation].query, ev.address || ev.loc)} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 700, color: '#F7F3EA', textDecoration: 'none', background: '#1F4E5C', borderRadius: 13, padding: '9px 14px' }}>
                      {t.route} {STATIONS[fromStation].label} →
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
