'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import AnalyseResultaat from './AnalyseResultaat';
import { streamAnalyse, roepAnalyseAan, vervangMDashes } from '@/lib/huisstijl';

const TraumaTalentPdfKnop = dynamic(
  () => import('./TraumaTalentPdf').then((m) => m.TraumaTalentPdfKnop),
  { ssr: false, loading: () => <span className="text-sm px-3 py-1.5 text-midGreen">PDF laden…</span> }
);

export type TraumaPatroon = {
  id: string;
  emoji: string;
  naam: string;
  elastiekBeschrijving: string;
  gedachten: string[];
  talent: string;
  talentBeschrijving: string;
  valkuil: string;
  affirmaties: string[];
  positieveIntentie: string;
  behoefte: string;
  lichaamsgevoel: string;
  regulatie: {
    stressstand: string;
    heeftNodig: string[];
    oefeningen: string[];
    sleutelzin: string;
    ontvangenTip: string;
  };
  feedbackPositief: string;
  feedbackNegatief: string;
  bewustwording: {
    vermedenGevoel: string;
    accepteer: string;
    eersteStap: string;
  };
};

const PATRONEN: TraumaPatroon[] = [
  {
    id: 'doorzetter',
    emoji: '🔥',
    naam: 'De Doorzetter',
    elastiekBeschrijving: 'Je gaat altijd door, werkt hard en geeft nooit op, ook als je lichaam om rust vraagt',
    gedachten: [
      '"Stoppen is falen"',
      '"Ik moet dit afmaken, dan pas kan ik rusten"',
      '"Als ik even gas teruggooi, loop ik achter"',
    ],
    talent: 'Discipline & veerkracht',
    talentBeschrijving: 'Jij zet door als anderen stoppen. Je discipline, doorzettingsvermogen en vermogen om dingen af te maken zijn een echte kracht als je ze bewust inzet.',
    valkuil: 'Rigiditeit / doordraven zonder grenzen',
    positieveIntentie: 'Je hebt bergen verzet die anderen opgaven. Jouw doorzettingsvermogen heeft je door zware periodes heen getrokken en resultaten opgeleverd waar je trots op mag zijn.',
    behoefte: 'Veiligheid en rust: het gevoel dat je er mag zijn, ook als je stilstaat.',
    lichaamsgevoel: 'Een gespannen kaak, strakke schouders, een gevoel van "aan" staan dat maar niet uitzet.',
    regulatie: {
      stressstand: 'fight (altijd "aan")',
      heeftNodig: ['vertragen', 'voelen in plaats van doen', 'veiligheid in stilstand'],
      oefeningen: ['bewust pauzes nemen vóórdat je moe bent', 'inchecken: wat voel ik in mijn lichaam?', 'jezelf toestemming geven om te stoppen'],
      sleutelzin: 'Ik ben veilig, ook als ik stilsta',
      ontvangenTip: 'Oefen met complimenten of hulp ontvangen zonder ze meteen te relativeren. Zeg "dank je" en laat het landen.',
    },
    affirmaties: [
      'Ik leer dat rust ook productief is.',
      'Elke dag oefen ik met stoppen als het genoeg is.',
      'Ik leer dat ik genoeg heb gedaan als ik moe ben.',
      'Elke dag verdien ik mijn rust, zonder dat ik het hoef te verdienen.',
      'Ik leer dat zachtheid en kracht samen gaan.',
    ],
    feedbackPositief: 'Laat het amper landen: je bent al bezig met de volgende taak. "Ja maar het kan beter."',
    feedbackNegatief: 'Je ervaart het als aanval op je inzet. Je wordt defensief of gaat juist nóg harder werken om het te compenseren.',
    bewustwording: {
      vermedenGevoel: 'Machteloosheid en verdriet. Zolang je doorgaat, hoef je niet te voelen hoe moe of verdrietig je eigenlijk al bent.',
      accepteer: 'Dat je jezelf voorbij je grenzen jaagt omdat stilstaan voelt als gevaar. Je zenuwstelsel kent "aan staan" als baseline, rust voelt onveilig en dus vermijd je het.',
      eersteStap: 'Plan vandaag één bewuste pauze vóórdat je moe bent, en blijf erin zitten zonder iets te doen. Blijf bij het ongemak dat opkomt zodra je stilstaat, zonder het weg te duwen. Dat voelt spannend, want dat heb je waarschijnlijk jarenlang vermeden.',
    },
  },
  {
    id: 'pleaser',
    emoji: '💛',
    naam: 'De Pleaser',
    elastiekBeschrijving: 'Je past jezelf aan, zorgt voor anderen en vermijdt conflict, ook als dat je uitput',
    gedachten: [
      '"Wat vinden ze van me als ik nee zeg?"',
      '"Ik wil niemand teleurstellen"',
      '"Mijn behoeften komen op de tweede plaats"',
    ],
    talent: 'Empathie & verbinding',
    talentBeschrijving: 'Jij voelt haarfijn aan wat de ander nodig heeft. Je empathie, vermogen tot afstemming en warmte creëren echte verbinding.',
    valkuil: 'Jezelf verliezen / grenzeloosheid',
    positieveIntentie: 'Je bent geliefd en mensen voelen zich veilig bij jou. Je hebt harmonie bewaard en verbindingen gecreëerd op momenten dat dat echt nodig was.',
    behoefte: 'Acceptatie en liefde: het gevoel dat je geliefd bent zoals je bent, zonder iets te hoeven doen.',
    lichaamsgevoel: 'Een zinkend gevoel in je maag op het moment dat je "ja" zegt terwijl je "nee" voelt. Je adem wordt vlakker, iets in je trekt zich samen.',
    regulatie: {
      stressstand: 'fawn (aanpassen voor verbinding)',
      heeftNodig: ['terug naar jezelf', 'grenzen voelen', 'eigen behoefte serieus nemen'],
      oefeningen: ['eerst jezelf iets geven vóór je een ander helpt', 'oefenen met "nee" voelen (en daarna met "nee" zeggen)', 'hand op je hart: wat wil ík?'],
      sleutelzin: 'Mijn behoeften doen ertoe',
      ontvangenTip: 'Merk op wanneer je een compliment meteen teruggeeft of klein maakt ("jij deed het ook zo goed"). Oefen met het gewoon aannemen, zonder het te verdelen of weg te geven.',
    },
    affirmaties: [
      'Ik leer dat mijn gevoel er ook toe doet.',
      'Ik leer nee zeggen als daad van zelfliefde.',
      'Elke dag ontdek ik meer wat ik zelf nodig heb.',
      'Elke dag vertrouw ik iets meer op mijn eigen gevoel.',
      'Ik leer dat ik niet overal voor verantwoordelijk ben.',
    ],
    feedbackPositief: 'Even opluchting, maar al snel: "Oh het stelde niks voor." Je schrijft het toe aan geluk of de ander.',
    feedbackNegatief: 'Spiraal van zelfverwijt en over-excuus maken. Soms ga je akkoord met kritiek die niet klopt, want blokkeren voelt gevaarlijker dan instemmen.',
    bewustwording: {
      vermedenGevoel: 'Afwijzing en alleen-zijn. Zolang je je aanpast, hoef je niet te voelen hoe het is om "nee" te horen of er niet meer bij te horen.',
      accepteer: 'Dat je "ja" zegt terwijl je "nee" voelt, om de verbinding niet te verliezen. Je zenuwstelsel heeft geleerd: aanpassen is veilig, je eigen behoefte voelen is risico.',
      eersteStap: 'Voel vandaag bij één vraag eerst bewust wat jij zelf wilt, vóórdat je antwoord geeft. Je hoeft het nog niet uit te spreken. Blijf bij het ongemak dat opkomt als je bij jezelf blijft in plaats van bij de ander. Dat voelt spannend, want dat heb je waarschijnlijk jarenlang vermeden.',
    },
  },
  {
    id: 'perfectionist',
    emoji: '🎯',
    naam: 'De Perfectionist',
    elastiekBeschrijving: 'Alles moet goed en foutloos, want anders is het niet genoeg',
    gedachten: [
      '"Dit is nog niet goed genoeg"',
      '"Stel dat ik een fout maak?"',
      '"Anderen zien het als ik het niet perfect doe"',
    ],
    talent: 'Kwaliteit & precisie',
    talentBeschrijving: 'Jij ziet wat anderen missen. Je oog voor detail, precisie en kwaliteitsbewustzijn tillen alles wat je aanraakt naar een hoger niveau.',
    valkuil: 'Verlammend perfectionisme / nooit klaar',
    positieveIntentie: 'Je werk valt op door kwaliteit. Je oog voor detail heeft fouten voorkomen, vertrouwen gewonnen en een reputatie opgebouwd als iemand op wie je kunt rekenen.',
    behoefte: 'Erkenning en goedkeuring: het gevoel dat je goed genoeg bent, ook zonder bewijs.',
    lichaamsgevoel: 'Een knoop in je maag als iets "nog niet goed genoeg" is, een constante innerlijke spanning die niet weggaat.',
    regulatie: {
      stressstand: 'fight + freeze',
      heeftNodig: ['veiligheid in imperfectie', 'speelsheid', 'zachtheid'],
      oefeningen: ['iets expres "goed genoeg" doen', 'kleine acties in plaats van grote perfectie', 'fouten normaliseren'],
      sleutelzin: 'Ik ben goed, ook als het niet perfect is',
      ontvangenTip: 'Ontvang een compliment zonder te reageren met een "ja maar". Schrijf op wat goed was, vóórdat je kijkt naar wat beter kon.',
    },
    affirmaties: [
      'Ik leer dat goed genoeg echt goed genoeg is.',
      'Elke dag oefen ik met klaar is klaar.',
      'Ik leer vertrouwen op mijn kwaliteit zonder dat ik bewijs hoef te leveren.',
      'Elke dag laat ik iets los wat niet meer perfect hoeft.',
      'Ik leer dat fouten me laten groeien, niet falen.',
    ],
    feedbackPositief: 'Korte tevredenheid, dan onmiddellijk de volgende tekortkoming. "Maar hier had ik beter kunnen..."',
    feedbackNegatief: 'Disproportioneel zware landing. Eén kritiekpunt overschaduwt tien complimenten. Kan dagenlang blijven hangen.',
    bewustwording: {
      vermedenGevoel: 'Schaamte en het gevoel "niet goed genoeg te zijn". Zolang je blijft schaven, hoef je niet te voelen hoe het is om gezien te worden mét je imperfectie.',
      accepteer: 'Dat je nooit echt klaar bent en dat "goed" nooit goed genoeg is. Je zenuwstelsel kent constante innerlijke spanning als normaal, ontspannen voelt onveilig.',
      eersteStap: 'Rond vandaag bewust iets af op het moment dat het "goed genoeg" is, zonder het nog een keer te checken of bij te schaven. Blijf bij het ongemak dat opkomt als je het loslaat zonder het te compenseren. Dat voelt spannend, want dat heb je waarschijnlijk jarenlang vermeden.',
    },
  },
  {
    id: 'controleur',
    emoji: '🛡️',
    naam: 'De Controleur',
    elastiekBeschrijving: 'Je wilt alles sturen en overzien, want loslaten voelt onveilig',
    gedachten: [
      '"Als ik het loslaat, gaat het mis"',
      '"Ik kan anderen niet vertrouwen hiermee"',
      '"Ik moet het zelf doen"',
    ],
    talent: 'Structuur & overzicht',
    talentBeschrijving: 'Jij houdt het hoofd koel als het complex wordt. Je verantwoordelijkheidsgevoel, oog voor structuur en overzicht zijn echte sterktes.',
    valkuil: 'Overcontrole / micromanagen',
    positieveIntentie: 'Je hebt chaos voorkomen op momenten dat anderen het overzicht verloren. Jouw structuur heeft projecten en mensen in goede banen geleid wanneer het er echt toe deed.',
    behoefte: 'Veiligheid en vertrouwen: het gevoel dat het goed komt, ook als jij het niet stuurt.',
    lichaamsgevoel: 'Een onrust in je borst als dingen buiten je controle gaan, een vasthouden in je ademhaling.',
    regulatie: {
      stressstand: 'fight',
      heeftNodig: ['vertrouwen', 'overgave', 'loslaten in kleine stapjes'],
      oefeningen: ['één ding per dag níet controleren', 'ademhaling vertragen', 'één onderdeel van een taak door iemand anders laten doen, niet de hele taak, gewoon een stukje'],
      sleutelzin: 'Ik hoef het niet alleen te doen',
      ontvangenTip: 'Als iemand hulp aanbiedt, oefen dan met "ja, graag" in plaats van "nee hoor, laat maar". Daarna: niet bijsturen hoe het gedaan wordt.',
    },
    affirmaties: [
      'Ik leer loslaten wat niet van mij is.',
      'Elke dag vertrouw ik iets meer op anderen.',
      'Ik leer dat rust en controle naast elkaar kunnen bestaan.',
      'Elke dag oefen ik met vertrouwen in het proces.',
      'Ik leer dat loslaten me geen controle kost, maar ruimte geeft.',
    ],
    feedbackPositief: 'Klopt het met je eigen beeld, dan neem je het aan. Zo niet: je legt het naast je neer of herformuleert het net zo lang tot jij er zelf ook achter kunt staan.',
    feedbackNegatief: 'Eerste reactie: weerstand. Je moet zelf concluderen dat de feedback klopt, anders zet je het van je af. Externe kritiek voelt als: ik heb het niet goed genoeg gedaan.',
    bewustwording: {
      vermedenGevoel: 'Onmacht en angst. Zolang jij de touwtjes in handen houdt, hoef je niet te voelen hoe het is om afhankelijk te zijn van iets of iemand anders.',
      accepteer: 'Dat je het zelf moet doen, omdat loslaten voelt als risico op chaos. Je zenuwstelsel kent vertrouwen op anderen niet als veilige basisstand.',
      eersteStap: 'Laat vandaag één klein onderdeel van een taak door iemand anders doen, en stuur niet bij hoe het gedaan wordt. Blijf bij het ongemak dat opkomt zodra je de controle uit handen geeft. Dat voelt spannend, want dat heb je waarschijnlijk jarenlang vermeden.',
    },
  },
  {
    id: 'vermijder',
    emoji: '🌪️',
    naam: 'De Vermijder',
    elastiekBeschrijving: 'Je stelt uit, leidt jezelf af of kijkt dingen niet aan als het spannend wordt',
    gedachten: [
      '"Ik begin er morgen mee"',
      '"Het is nog niet het juiste moment"',
      '"Ik weet niet waar te beginnen"',
    ],
    talent: 'Timing & aanvoelen',
    talentBeschrijving: 'Jij voelt aan wanneer iets nog niet klopt. Die intuïtie voor timing en het vermogen om subtiele signalen op te pikken zijn een onmisbare kracht.',
    valkuil: 'Eindeloos afwachten / handelingsverlamming',
    positieveIntentie: 'Je hebt jezelf beschermd tegen pijn en afwijzing op momenten dat je dat nodig had. Door te wachten heb je risico\'s vermeden en ruimte gecreëerd om na te denken.',
    behoefte: 'Veiligheid en toestemming: het gevoel dat het oké is om te beginnen, ook als de uitkomst onzeker is.',
    lichaamsgevoel: 'Een plotselinge vermoeidheid of waas (brain fog) die over je heen trekt zodra iets je aandacht vraagt. Je lichaam wil letterlijk een andere kant op.',
    regulatie: {
      stressstand: 'freeze',
      heeftNodig: ['zachte activatie', 'veiligheid in beweging', 'kleine stapjes'],
      oefeningen: ['mini-acties (2 minuten beginnen)', 'lichaam activeren: wandelen, bewegen', 'niet denken, doen'],
      sleutelzin: 'Ik mag het stap voor stap doen',
      ontvangenTip: 'Begin klein: ontvang één compliment zonder te minimaliseren of van onderwerp te wisselen. Laat het er gewoon zijn.',
    },
    affirmaties: [
      'Ik leer kleine stappen te zetten, ook als het niet perfect voelt.',
      'Elke dag doe ik één ding waar ik van af wil kijken.',
      'Ik leer dat beginnen altijd beter is dan wachten op het perfecte moment.',
      'Elke dag ontdek ik dat ik meer aankan dan ik denk.',
      'Ik leer dat mijn timing-gevoel kracht is als ik het bewust gebruik.',
    ],
    feedbackPositief: 'Het voelt goed, maar leidt niet tot actie. Er iets mee doen voelt te groots of te spannend, dus het blijft rustig in je hoofd hangen.',
    feedbackNegatief: 'Je trekt je terug, stelt een reactie uit, kan weken later nog "vergeten" om iets te veranderen. Niet passief-agressief, gewoon bevroren.',
    bewustwording: {
      vermedenGevoel: 'Teleurstelling en falen. Zolang je niet begint, kan het ook niet mislukken, en hoef je niet te voelen hoe het is als iets niet goed gaat.',
      accepteer: 'Dat uitstellen je beschermt, ook als het je juist op je plek houdt. Je lichaam kiest bevriezen boven beginnen, want beginnen voelt spannender dan stilstaan.',
      eersteStap: 'Zet vandaag 2 minuten op de klok en begin, zonder dat het af moet zijn. Stop als de tijd om is, ook al wil je door. Voel bewust het ongemak dat opkomt zodra je begint. Dat voelt spannend, want dat heb je waarschijnlijk jarenlang vermeden.',
    },
  },
  {
    id: 'afsluiter',
    emoji: '🧊',
    naam: 'De Afsluiter',
    elastiekBeschrijving: 'Je sluit emoties af en leeft op ratio, omdat voelen te overweldigend voelt',
    gedachten: [
      '"Gevoel heeft hier geen plek"',
      '"Ik los dit gewoon rationeel op"',
      '"Als ik voel, verlies ik de controle"',
    ],
    talent: 'Helder denken & rust bewaren',
    talentBeschrijving: 'Jij blijft helder als de emoties hoog oplopen. Je vermogen om te relativeren, rust te bewaren en scherp te denken is waardevol.',
    valkuil: 'Kilheid / emotionele afstandelijkheid',
    positieveIntentie: 'Je bleef functioneren op momenten dat anderen instortten. Je rustige hoofd heeft je geholpen om helder te blijven in situaties die voor anderen overweldigend waren.',
    behoefte: 'Rust en veiligheid om te voelen: het gevoel dat emoties je niet overweldigen maar informeren.',
    lichaamsgevoel: 'Een soort verdoving of leegte vanbinnen, alsof je achter glas zit en de wereld op afstand houdt.',
    regulatie: {
      stressstand: 'freeze / shutdown',
      heeftNodig: ['weer voelen (veilig)', 'lichaamsbewustzijn', 'zachte verbinding'],
      oefeningen: ['voelen via lichaam: warm/koud, spanning', 'muziek, aanraking, adem', 'emoties in kleine doses toelaten'],
      sleutelzin: 'Het is veilig om te voelen',
      ontvangenTip: 'Oefen met complimenten lichamelijk ontvangen: wat voel je als iemand je iets aardigs zegt? Sta toe dat je het voelt.',
    },
    affirmaties: [
      'Ik leer dat voelen me niet overweldigt, maar informeert.',
      'Elke dag maak ik iets meer ruimte voor wat ik voel.',
      'Ik leer dat verbinding begint bij mezelf.',
      'Elke dag oefen ik met één ding voelen in plaats van denken.',
      'Ik leer dat mijn helderheid nog krachtiger wordt als ik ook voel.',
    ],
    feedbackPositief: 'Je verwerkt het intellectueel en reageert beleefd. Maar het komt emotioneel niet echt binnen.',
    feedbackNegatief: 'Hetzelfde patroon bij kritiek: rationeel verwerken, geen zichtbare reactie. Maar vanbinnen valt er iets stil. Verbinding verbreekt subtiel daarna.',
    bewustwording: {
      vermedenGevoel: 'Overweldiging en pijn. Zolang je op afstand blijft, hoef je niet te voelen hoe groot het verdriet of de pijn eigenlijk is.',
      accepteer: 'Dat afstand houden van je gevoel veiliger voelt dan voelen. Je zenuwstelsel kent "verdoofd" als baseline, voelen voelt als controle verliezen.',
      eersteStap: 'Leg vandaag één keer bewust je hand op je hart en voel: warm of koud, gespannen of los? Niet oplossen, alleen voelen. Blijf erbij, ook als het ongemakkelijk voelt. Dat voelt spannend, want dat heb je waarschijnlijk jarenlang vermeden.',
    },
  },
  {
    id: 'aanpasser',
    emoji: '🎭',
    naam: 'De Aanpasser',
    elastiekBeschrijving: 'Je past jezelf aan aan wat verwacht wordt, ook als je jezelf daarin kwijtraakt',
    gedachten: [
      '"Ik mag niet te veel ruimte innemen"',
      '"Als ik mezelf ben, schrik ik mensen af"',
      '"Ik moet me aanpassen om geaccepteerd te worden"',
    ],
    talent: 'Flexibiliteit & sociale intelligentie',
    talentBeschrijving: 'Jij beweegt moeiteloos tussen mensen en situaties. Je sociale antenne en flexibiliteit zijn strategische talenten.',
    valkuil: 'Geen eigenheid / verdwijnen in de verwachting',
    positieveIntentie: 'Je wordt overal geaccepteerd en past je moeiteloos aan. Je flexibiliteit heeft je geholpen om in veel verschillende omgevingen te overleven en erbij te horen.',
    behoefte: 'Erbij horen en gezien worden: het gevoel dat je geaccepteerd bent zoals je werkelijk bent.',
    lichaamsgevoel: 'Een gevoel van jezelf "samenpersen" als je een ruimte binnenkomt, alsof je minder plek mag innemen.',
    regulatie: {
      stressstand: 'fawn',
      heeftNodig: ['eigen identiteit voelen', 'vertragen vóór reageren: pauze inbouwen om eerst te voelen', 'innerlijk kompas: weten wat jíj wilt'],
      oefeningen: ['eerst voelen, dan reageren', 'jezelf afvragen: wil ik dit echt?', 'tijd nemen voordat je "ja" zegt'],
      sleutelzin: 'Ik mag mezelf zijn',
      ontvangenTip: 'Merk op of je een compliment krijgt omdat je jezelf was of omdat je je aanpaste. Alleen het eerste voedt je echt.',
    },
    affirmaties: [
      'Ik leer wie ik ben, los van andermans verwachtingen.',
      'Elke dag neem ik iets meer ruimte in als mezelf.',
      'Ik leer dat mijn eigenheid verbindt in plaats van afstoot.',
      'Elke dag ontdek ik wat ik echt denk en voel.',
      'Ik leer dat aanpassen en mezelf zijn samen kunnen gaan.',
    ],
    feedbackPositief: 'Je past je direct aan om nog meer te behagen. Het compliment bevestigt dat aanpassen werkt.',
    feedbackNegatief: 'Je past je aan de kritiek aan, ook als die onterecht is. Je eigen mening verdwijnt. Achteraf soms wrok zonder te weten waaruit.',
    bewustwording: {
      vermedenGevoel: 'Afwijzing en eenzaamheid. Zolang je je aanpast, hoef je niet te voelen hoe het is om jezelf te laten zien en mogelijk niet geaccepteerd te worden.',
      accepteer: 'Dat je jezelf kleiner maakt om erbij te horen. Je zenuwstelsel heeft aanpassen geleerd als enige manier om veilig te zijn, eigenheid voelt als risico op afwijzing.',
      eersteStap: 'Neem vandaag in één gesprek een paar seconden langer de tijd voordat je reageert, en voel eerst wat jij zelf wilt zeggen. Blijf bij het ongemak van die stilte, zonder die snel op te vullen. Dat voelt spannend, want dat heb je waarschijnlijk jarenlang vermeden.',
    },
  },
  {
    id: 'bewijzer',
    emoji: '👑',
    naam: 'De Bewijzer',
    elastiekBeschrijving: 'Je wilt jezelf bewijzen en presteren voor erkenning, want van jezelf is het nooit genoeg',
    gedachten: [
      '"Ik moet laten zien dat ik het kan"',
      '"Pas als ik dit bereik, ben ik genoeg"',
      '"Anderen moeten zien hoe goed ik ben"',
    ],
    talent: 'Ambitie & drive',
    talentBeschrijving: 'Jij gaat voor resultaat. Je ambitie, drive en vermogen om doelen te stellen zijn een echte kracht als je ze bewust inzet.',
    valkuil: 'Verslavend presteren / nooit stilstaan',
    positieveIntentie: 'Je hebt indrukwekkende dingen bereikt. Je drive heeft je gestimuleerd grenzen te verleggen en resultaten neer te zetten waar je zonder die motor misschien niet was gekomen.',
    behoefte: 'Erkenning en "genoeg zijn": het gevoel dat je waardevol bent, los van wat je presteert.',
    lichaamsgevoel: 'Een rusteloosheid in je lijf alsof stilstaan niet mag, een drang die je voortdrijft ook als je moe bent.',
    regulatie: {
      stressstand: 'fight',
      heeftNodig: ['intrinsieke waarde voelen', 'rust in "zijn"', 'erkenning van binnenuit'],
      oefeningen: ['stoppen vóór het "af" is', 'jezelf waarderen zonder resultaat', 'oefenen met ontvangen (van bijv. complimenten, hulp, liefde, geld)'],
      sleutelzin: 'Ik ben al genoeg',
      ontvangenTip: 'Oefen met ontvangen vóór je iets terug doet. Complimenten, hulp, rust: laat het binnenkomen zonder dat je er iets voor hoeft te doen.',
    },
    affirmaties: [
      'Ik leer dat ik genoeg ben, ook zonder bewijs.',
      'Elke dag herken ik één moment waarop ik al genoeg was.',
      'Ik leer dat mijn waarde niet zit in wat ik presteer.',
      'Elke dag kies ik bewuster waar ik mijn energie in stop.',
      'Ik leer dat ambitie vanuit kracht anders voelt dan ambitie vanuit angst.',
    ],
    feedbackPositief: 'Korte boost, dan de lat hoger. "Mooi, maar nu moet ik ook nog..." Nooit echt genoeg.',
    feedbackNegatief: 'Identiteitsbedreiging. Je zet de kritiek weg ("ze begrijpen het niet") of je overcompenseert en levert bewijs dat het niet klopt.',
    bewustwording: {
      vermedenGevoel: 'Waardeloosheid. Zolang je blijft presteren, hoef je niet te voelen hoe het is om er gewoon te mogen zijn, zonder dat je iets levert.',
      accepteer: 'Dat je waarde afhangt van wat je presteert, waardoor stilstaan voelt als waardeloos zijn. Je zenuwstelsel kent rust niet als veilig.',
      eersteStap: 'Ontvang vandaag één compliment, hulp of iets fijns zonder er meteen iets voor terug te doen of het te relativeren. Blijf bij het ongemak dat opkomt als je het zomaar aanneemt. Dat voelt spannend, want dat heb je waarschijnlijk jarenlang vermeden.',
    },
  },
];

const STAP_LABELS = ['Herkennen', 'Ontdekken', 'Kiezen', 'Kwadrant'];

function AutoTextarea({ value, onChange, placeholder, className }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className={className}
      style={{ resize: 'none', overflow: 'hidden' }}
    />
  );
}

export default function TraumaTalent() {
  const [stap, setStap] = useState(0);
  const [aangevinkt, setAangevinkt] = useState<string[]>([]);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [uitdaging, setUitdaging] = useState('');
  const [allergie, setAllergie] = useState('');
  const [uitdagingToelichting, setUitdagingToelichting] = useState('');
  const [allergieToelichting, setAllergieToelichting] = useState('');
  const [suggestieLoading, setSuggestieLoading] = useState(false);
  const [analyse, setAnalyse] = useState('');
  const [loading, setLoading] = useState(false);
  const [fout, setFout] = useState('');
  const [uitgeklapt, setUitgeklapt] = useState<string[]>([]);
  const [uitgeklaptRegulatie, setUitgeklaptRegulatie] = useState<string[]>([]);
  const [uitgeklaptFeedback, setUitgeklaptFeedback] = useState<string[]>([]);
  const [uitgeklaptBewustwording, setUitgeklaptBewustwording] = useState<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const geselecteerdePatronen = PATRONEN.filter((p) => aangevinkt.includes(p.id));
  const focusPatroon = PATRONEN.find((p) => p.id === focusId) ?? null;
  const voortgang = Math.round((stap / 3) * 100);

  function togglePatroon(id: string) {
    setAangevinkt((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function suggereerKwadrant() {
    if (!focusPatroon) return;
    abortRef.current?.abort();
    setSuggestieLoading(true);
    setFout('');
    try {
      const abortCtrl = new AbortController();
      abortRef.current = abortCtrl;
      const prompt = `Geef uitsluitend JSON terug, geen andere tekst. Voorbeeld:
{"uitdaging":"Eigenheid","uitdagingToelichting":"Jezelf durven zijn, ook als dat spannend voelt","allergie":"Egocentrisch","allergieToelichting":"Als eigenheid doorslaat naar alleen aan jezelf denken"}

Kwaliteit: ${focusPatroon.talent}: ${focusPatroon.talentBeschrijving}
Valkuil: ${focusPatroon.valkuil}

Uitdaging = de positieve tegenhanger van de valkuil (1-4 woorden).
UitdagingToelichting = één zin die uitlegt wat die uitdaging betekent of vraagt (max 12 woorden).
Allergie = wat jou irriteert in anderen, de doorgeslagen versie van de uitdaging (1-3 woorden).
AllergieToelichting = één zin die uitlegt hoe de allergie eruitziet in de praktijk (max 12 woorden).
Gebruik nooit een m-dash. Gebruik "je" in plaats van "jij".`;
      const raw = await roepAnalyseAan(prompt, 400, abortCtrl.signal);
      const match = raw.match(/\{[\s\S]*?\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.uitdaging) setUitdaging(parsed.uitdaging);
        if (parsed.allergie) setAllergie(parsed.allergie);
        setUitdagingToelichting(parsed.uitdagingToelichting ?? '');
        setAllergieToelichting(parsed.allergieToelichting ?? '');
      } else {
        setFout('AI gaf een onverwacht antwoord. Vul zelf in of probeer opnieuw.');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setFout('Suggestie ophalen mislukt. Vul zelf in of probeer opnieuw.');
      }
    } finally {
      setSuggestieLoading(false);
    }
  }

  async function analyseAanvragen() {
    if (!focusPatroon || !uitdaging.trim() || !allergie.trim()) return;
    abortRef.current?.abort();
    setLoading(true);
    setAnalyse('');
    setFout('');
    const abortCtrl = new AbortController();
    abortRef.current = abortCtrl;
    try {
      const herkend = geselecteerdePatronen
        .map((p) => `- ${p.naam}: ${p.elastiekBeschrijving}`)
        .join('\n');
      const feedbackContext = geselecteerdePatronen
        .map((p) => `- ${p.naam}: bij complimenten: ${p.feedbackPositief} Bij kritiek: ${p.feedbackNegatief}`)
        .join('\n');
      const prompt = `Je helpt iemand ontdekken hoe hun trauma-elastieken werken en welk talent er onder schuilt, gebaseerd op het werk van Monique Lavec (Fearless Ondernemen).

Herkende patronen van deze persoon:
${herkend}

Hoe deze persoon omgaat met feedback (relevant voor de analyse):
${feedbackContext}

Focuspatroon voor het kernkwadrant:
- Trauma-elastiek: ${focusPatroon.naam}: ${focusPatroon.elastiekBeschrijving}
- Herkenbare gedachten: ${focusPatroon.gedachten.join(' / ')}

Ingevuld kernkwadrant (Ofman):
- Kwaliteit: ${focusPatroon.talent}: ${focusPatroon.talentBeschrijving}
- Valkuil: ${focusPatroon.valkuil}
- Uitdaging: ${uitdaging}
- Allergie: ${allergie}

Schrijf een persoonlijke, warme analyse in markdown. Gebruik "je" (niet "jij" of "u"). Gebruik nooit een m-dash. Gebruik dubbele punt in subkoppen.

## Jouw kwaliteit
2-3 zinnen over het trauma-talent en waarom dit een echte kwaliteit is, ook al voelde het lang als overleven.

## Van elastiek naar talent
2-3 zinnen over het verschil tussen het patroon als elastiek (onbewust, vanuit angst) versus als talent (bewust, vanuit kracht). Geef een concreet herkenbaar voorbeeld uit het dagelijkse leven.

## Jouw uitdaging
2-3 zinnen over wat de uitdaging "${uitdaging}" betekent voor jou en hoe die de kwaliteit volledig tot z'n recht laat komen.

## Herkenning in je dagelijkse leven
Beschrijf 2-3 concrete herkenbare situaties of gedachten. Laat zien hoe het elastiek eruitziet én hoe het talent eruitziet als het bewust ingezet wordt.
${geselecteerdePatronen.length > 1 ? `
## De combinatie
2-3 zinnen over hoe de combinatie van patronen (${geselecteerdePatronen.map((p) => p.naam).join(', ')}) samenhangt of elkaar kan versterken. Benoem ook hoe de feedbackpatronen van deze combinatie elkaar kunnen versterken of hoe ze samen laten zien wat er echt speelt. Wat zegt het over de onderliggende behoefte als je meerdere patronen herkent?` : ''}

## Afsluiting
Warme afsluitende alinea over de reis van elastiek naar talent. Kies daarna de 3-4 meest passende groei-affirmaties uit onderstaande lijst en schrijf ze elk op een nieuwe regel, beginnend met ✨. Pas de gekozen affirmaties niet aan.

Beschikbare groei-affirmaties:
${focusPatroon.affirmaties.map((a) => `- ${a}`).join('\n')}`;

      let acc = '';
      await streamAnalyse(
        prompt,
        2500,
        (chunk) => { acc += chunk; setAnalyse(acc); },
        undefined,
        abortCtrl.signal
      );
      setAnalyse(vervangMDashes(acc));
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setFout('Analyse mislukt. Probeer het opnieuw.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (analyse || loading) {
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="text-center">
          <h1 className="font-salmon text-2xl text-darkSlate mb-1">Trauma-talent</h1>
          {focusPatroon && (
            <p className="text-midGreen italic text-sm">
              {focusPatroon.emoji} {focusPatroon.naam} · {focusPatroon.talent}
            </p>
          )}
        </div>
        <AnalyseResultaat tekst={analyse} titel="Trauma-talent" isLoading={loading} verbergPrintKnop />
        {!loading && analyse && (
          <div className="flex justify-center pt-2">
            <TraumaTalentPdfKnop
              patronen={geselecteerdePatronen}
              focusPatroon={focusPatroon!}
              uitdaging={uitdaging}
              allergie={allergie}
              uitdagingToelichting={uitdagingToelichting}
              allergieToelichting={allergieToelichting}
              analyse={analyse}
            />
          </div>
        )}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              if (!window.confirm('Weet je zeker dat je opnieuw wilt beginnen? Al je invoer gaat verloren.')) return;
              setAnalyse('');
              setStap(0);
              setAangevinkt([]);
              setFocusId(null);
              setUitdaging('');
              setAllergie('');
              setUitdagingToelichting('');
              setAllergieToelichting('');
              setUitgeklapt([]);
              setUitgeklaptRegulatie([]);
              setUitgeklaptFeedback([]);
              setUitgeklaptBewustwording([]);
            }}
            className="text-sm text-midGreen hover:text-darkGreen underline underline-offset-2"
          >
            Opnieuw beginnen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">

      <div className="text-center">
        <h1 className="font-salmon text-2xl text-darkSlate mb-1">Trauma-talent</h1>
        <p className="text-midGreen italic text-sm">De 8 Fearless Archetypen · naar Monique Lavec</p>
      </div>

      {/* Voortgang */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-darkSlate/60">
          <span>{STAP_LABELS[stap]}</span>
          <span>{voortgang}%</span>
        </div>
        <div className="w-full bg-lightBg rounded-full h-2">
          <div
            className="bg-darkGreen h-2 rounded-full transition-all duration-300"
            style={{ width: `${voortgang}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-darkSlate/40">
          {STAP_LABELS.map((label, i) => (
            <span key={i} className={i === stap ? 'text-darkGreen font-medium' : ''}>{label}</span>
          ))}
        </div>
      </div>

      {/* Stap 0: Herkennen */}
      {stap === 0 && (
        <div className="space-y-4">
          <div className="bg-lightBg2 rounded-2xl p-4 border border-orange/20 text-sm text-darkSlate space-y-2">
            <p className="font-medium">Wat is een trauma-elastiek?</p>
            <p>Een trauma-elastiek is een onbewust patroon dat is ontstaan door oude pijn, afwijzing of tekort. Onder stress <strong>schiet je terug</strong> in dat patroon, ook als je al zoveel hebt gewerkt aan jezelf.</p>
            <p>Maar in datzelfde patroon schuilt jouw talent. Vink aan welke gedragingen of gedachten jij herkent.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PATRONEN.map((p) => {
              const actief = aangevinkt.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePatroon(p.id)}
                  className={`text-left rounded-2xl border-2 p-4 transition-all h-full flex flex-col justify-start ${
                    actief
                      ? 'border-darkRed bg-darkRed/10'
                      : 'border-lightBg bg-white hover:border-orange/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{p.emoji}</span>
                      <span className="font-salmon text-base text-darkSlate">{p.naam}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        actief ? 'bg-darkRed border-darkRed' : 'border-darkSlate/30'
                      }`}
                    >
                      {actief && <span className="text-white text-xs leading-none">✓</span>}
                    </div>
                  </div>
                  <p className="text-xs text-darkSlate/70 mb-2">{p.elastiekBeschrijving}</p>
                  <ul className="space-y-1 mt-auto pt-2">
                    {p.gedachten.map((g, i) => (
                      <li key={i} className="text-xs text-darkSlate/60 italic bg-lightBg/60 rounded-lg px-2.5 py-1.5 leading-snug">{g}</li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-darkSlate/50">
              {aangevinkt.length === 0
                ? 'Vink aan wat je herkent'
                : `${aangevinkt.length} ${aangevinkt.length === 1 ? 'patroon' : 'patronen'} herkend`}
            </span>
            <button
              onClick={() => setStap(1)}
              disabled={aangevinkt.length === 0}
              className="px-5 py-2.5 bg-darkRed text-white text-sm rounded-xl disabled:opacity-40 hover:bg-darkRed/80 transition-colors"
            >
              Bekijk je talenten →
            </button>
          </div>
        </div>
      )}

      {/* Stap 1: Van elastiek naar talent */}
      {stap === 1 && (
        <div className="space-y-4">
          <div className="bg-lightBg2 rounded-2xl p-4 border border-orange/20 text-sm text-darkSlate space-y-2">
            <p>Elk patroon heeft een positieve intentie: het heeft je ooit geholpen. Het zorgde voor veiligheid, erkenning of controle op een moment dat je dat nodig had.</p>
            <p>Hetzelfde gedrag dat je soms gevangen houdt, bevat ook je kracht. Hetzelfde patroon, een ander bewustzijn.</p>
            <p className="text-darkSlate/60 text-xs border-t border-orange/20 pt-2">Elk archetype probeert hetzelfde: veiligheid voelen. Regulatie betekent je zenuwstelsel laten ervaren dat het nu ook veilig is, zonder het oude gedrag.</p>
          </div>
          {geselecteerdePatronen.map((p) => (
            <div key={p.id} className="rounded-2xl overflow-hidden border border-lightBg shadow-sm">
              <div className="bg-darkSlate px-4 py-2.5 flex items-center gap-2">
                <span className="text-lg">{p.emoji}</span>
                <span className="font-salmon text-cream text-sm">{p.naam}</span>
              </div>
              <div className="grid grid-cols-2">
                <div className="bg-darkRed/10 border-r border-lightBg p-3">
                  <p className="text-xs font-medium text-darkRed mb-1.5 uppercase tracking-wide">Als elastiek</p>
                  <p className="text-xs text-darkSlate/80 mb-1.5">{p.elastiekBeschrijving}</p>
                  <p className="text-xs text-darkSlate/50 italic mb-2">Onbewust, vanuit angst</p>
                  <p className="text-xs text-darkSlate/60">🫀 {p.lichaamsgevoel}</p>
                </div>
                <div className="bg-darkGreen/10 p-3">
                  <p className="text-xs font-medium text-darkGreen mb-1.5 uppercase tracking-wide">Als talent</p>
                  <p className="text-xs font-semibold text-darkGreen mb-1">{p.talent}</p>
                  <p className="text-xs text-darkSlate/80 mb-1.5">{p.talentBeschrijving}</p>
                  <p className="text-xs text-darkSlate/50 italic">Bewust, vanuit kracht</p>
                </div>
              </div>
              <div className="border-t border-lightBg bg-orange/5 px-3 py-2">
                <p className="text-xs text-darkSlate/70">
                  <span className="font-medium text-darkSlate">Onderliggende behoefte: </span>
                  {p.behoefte}
                </p>
              </div>
              <div className="border-t border-lightBg">
                <button
                  onClick={() => setUitgeklapt(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-cream/40 transition-colors"
                >
                  <span className="font-medium text-darkSlate">Lees hoe dit patroon jou heeft geholpen</span>
                  <span className="text-darkSlate/40 ml-2">{uitgeklapt.includes(p.id) ? '▲' : '▼'}</span>
                </button>
                {uitgeklapt.includes(p.id) && (
                  <div className="bg-cream/60 px-3 pb-3">
                    <p className="text-xs text-darkSlate/70 leading-relaxed">{p.positieveIntentie}</p>
                  </div>
                )}
              </div>
              <div className="border-t border-lightBg">
                <button
                  onClick={() => setUitgeklaptRegulatie(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-lightBg2/60 transition-colors"
                >
                  <span className="font-medium text-darkSlate">Zenuwstelselregulatie</span>
                  <span className="text-darkSlate/40 ml-2">{uitgeklaptRegulatie.includes(p.id) ? '▲' : '▼'}</span>
                </button>
                {uitgeklaptRegulatie.includes(p.id) && (
                  <div className="bg-lightBg2/40 px-3 pb-3 space-y-2.5">
                    <p className="text-[10px] font-medium text-darkRed/70 uppercase tracking-wide pt-1">
                      Stressstand: <span className="normal-case font-normal text-darkSlate/70">{p.regulatie.stressstand}</span>
                    </p>
                    <div>
                      <p className="text-[10px] font-medium text-darkSlate/50 uppercase tracking-wide mb-1">Heeft nodig</p>
                      <ul className="space-y-0.5">
                        {p.regulatie.heeftNodig.map((n, i) => (
                          <li key={i} className="text-xs text-darkSlate/70 flex items-start gap-1.5">
                            <span className="text-midGreen mt-0.5 flex-shrink-0">·</span>{n}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-darkSlate/50 uppercase tracking-wide mb-1">Zo reguleer je</p>
                      <ul className="space-y-0.5">
                        {p.regulatie.oefeningen.map((o, i) => (
                          <li key={i} className="text-xs text-darkSlate/70 flex items-start gap-1.5">
                            <span className="text-midGreen mt-0.5 flex-shrink-0">·</span>{o}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-darkGreen/10 rounded-lg px-3 py-2">
                      <p className="text-xs text-darkGreen italic">"{p.regulatie.sleutelzin}"</p>
                    </div>
                    <div className="bg-orange/10 rounded-lg px-3 py-2">
                      <p className="text-[10px] font-medium text-orange uppercase tracking-wide mb-1">Tip: oefenen met ontvangen</p>
                      <p className="text-xs text-darkSlate/70 leading-relaxed">{p.regulatie.ontvangenTip}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="border-t border-lightBg">
                <button
                  onClick={() => setUitgeklaptFeedback(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-cream/30 transition-colors"
                >
                  <span className="font-medium text-darkSlate">Zo ga jij om met feedback</span>
                  <span className="text-darkSlate/40 ml-2">{uitgeklaptFeedback.includes(p.id) ? '▲' : '▼'}</span>
                </button>
                {uitgeklaptFeedback.includes(p.id) && (
                  <div className="bg-cream/40 px-3 pb-3 space-y-2">
                    <div className="pt-1">
                      <p className="text-[10px] font-medium text-darkGreen uppercase tracking-wide mb-1">Positieve feedback</p>
                      <p className="text-xs text-darkSlate/70 leading-relaxed">{p.feedbackPositief}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-darkRed/70 uppercase tracking-wide mb-1">Negatieve feedback</p>
                      <p className="text-xs text-darkSlate/70 leading-relaxed">{p.feedbackNegatief}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="border-t border-lightBg">
                <button
                  onClick={() => setUitgeklaptBewustwording(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-orange/5 transition-colors"
                >
                  <span className="font-medium text-darkSlate">Bewustwording: wat houdt dit elastiek in stand?</span>
                  <span className="text-darkSlate/40 ml-2">{uitgeklaptBewustwording.includes(p.id) ? '▲' : '▼'}</span>
                </button>
                {uitgeklaptBewustwording.includes(p.id) && (
                  <div className="bg-orange/5 px-3 pb-3">
                    <p className="text-xs text-darkSlate/60 italic leading-relaxed mb-2">
                      Dit patroon voelt vertrouwd omdat je zenuwstelsel het als baseline kent. Vertrouwd voelt veilig, maar betekent niet dat het je helpt.
                    </p>
                    <div className="bg-darkRed/10 rounded-lg px-3 py-2 mb-2">
                      <p className="text-[10px] font-medium text-darkRed uppercase tracking-wide mb-1">Welk gevoel ga je hiermee uit de weg?</p>
                      <p className="text-xs text-darkSlate/70 leading-relaxed">{p.bewustwording.vermedenGevoel}</p>
                    </div>
                    <div className="rounded-lg border border-orange/20 overflow-hidden">
                      <div className="grid grid-cols-2 bg-orange/10">
                        <p className="text-[10px] font-medium text-darkSlate uppercase tracking-wide px-2.5 py-1.5 border-r border-orange/20">Wat je accepteert</p>
                        <p className="text-[10px] font-medium text-darkSlate uppercase tracking-wide px-2.5 py-1.5">Eerste kleine stap</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="text-xs text-darkSlate/70 leading-relaxed px-2.5 py-2 border-r border-orange/20 bg-cream/40">{p.bewustwording.accepteer}</p>
                        <p className="text-xs text-darkSlate/70 leading-relaxed px-2.5 py-2 bg-cream/20">{p.bewustwording.eersteStap}</p>
                      </div>
                    </div>
                    <Link
                      href={`/omdenker?situatie=${encodeURIComponent(p.bewustwording.eersteStap)}&gevoel=${encodeURIComponent(p.bewustwording.vermedenGevoel)}`}
                      className="block text-center mt-2 text-xs text-orange hover:text-darkRed underline underline-offset-2"
                    >
                      ✦ Omdenk de spanning van deze stap
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="bg-lightBg2 rounded-xl p-3 border border-orange/20 text-xs text-darkSlate/70">
            <span className="font-medium text-darkSlate">Biotensor-tip:</span> Gebruik je biotensor om te voelen welk patroon nu de meeste aandacht vraagt.
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setStap(0)}
              className="text-sm text-midGreen hover:text-darkGreen underline underline-offset-2"
            >
              ← Terug
            </button>
            <button
              onClick={() => setStap(2)}
              className="px-5 py-2.5 bg-darkRed text-white text-sm rounded-xl hover:bg-darkRed/80 transition-colors"
            >
              Kies je focuspatroon →
            </button>
          </div>
        </div>
      )}

      {/* Stap 2: Kies je focuspatroon */}
      {stap === 2 && (
        <div className="space-y-4">
          <div className="bg-lightBg2 rounded-2xl p-4 border border-orange/20 text-sm text-darkSlate space-y-2">
            <p>Kies één patroon om mee verder te werken. Hiermee bouw je een persoonlijk kernkwadrant op basis van het model van Daniel Ofman.</p>
            <p>De sleutel: je hebt de onderliggende behoefte nog steeds, maar je hoeft hem niet meer op <em>déze</em> manier te vervullen.</p>
          </div>
          <div className="space-y-2">
            {geselecteerdePatronen.map((p) => {
              const actief = focusId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setFocusId(p.id)}
                  className={`w-full text-left rounded-xl border-2 px-4 py-3 flex items-center justify-between transition-all ${
                    actief
                      ? 'border-darkGreen bg-darkGreen/10'
                      : 'border-lightBg bg-white hover:border-midGreen/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{p.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-darkSlate">{p.naam}</p>
                      <p className="text-xs text-darkGreen">{p.talent}</p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
                      actief ? 'bg-darkGreen border-darkGreen' : 'border-darkSlate/30'
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <div className="bg-lightBg2 rounded-xl p-3 border border-orange/20 text-xs text-darkSlate/70">
            <span className="font-medium text-darkSlate">Biotensor-tip:</span> Vraag je biotensor welk patroon nu de meeste aandacht vraagt en kies dat.
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setStap(1)}
              className="text-sm text-midGreen hover:text-darkGreen underline underline-offset-2"
            >
              ← Terug
            </button>
            <button
              onClick={() => setStap(3)}
              disabled={!focusId}
              className="px-5 py-2.5 bg-darkRed text-white text-sm rounded-xl disabled:opacity-40 hover:bg-darkRed/80 transition-colors"
            >
              Bouw mijn kwadrant →
            </button>
          </div>
        </div>
      )}

      {/* Stap 3: Kernkwadrant */}
      {stap === 3 && focusPatroon && (
        <div className="space-y-4">
          <div className="bg-lightBg2 rounded-2xl p-4 border border-orange/20 text-sm text-darkSlate space-y-1">
            <p>Het Ofman-kernkwadrant laat zien hoe jouw kwaliteit volledig tot z'n recht komt. Kwaliteit en valkuil zijn al ingevuld op basis van je patroon.</p>
            <p>Vul uitdaging en allergie in, of laat de AI een suggestie doen.</p>
          </div>

          {/* Kwadrant: 3×3 grid met pijlen als tussenlaag */}
          <div
            className="grid"
            style={{ gridTemplateColumns: '1fr 3rem 1fr', gridTemplateRows: 'auto 3.5rem auto' }}
          >
            {/* KWALITEIT */}
            <div className="rounded-tl-xl bg-darkGreen/10 border-2 border-darkGreen p-3">
              <p className="text-xs font-medium text-darkGreen uppercase tracking-wide mb-1.5">Kwaliteit</p>
              <p className="text-sm font-semibold text-darkSlate mb-1 break-words">{focusPatroon.talent}</p>
              <p className="text-xs text-darkSlate/65 leading-relaxed break-words">{focusPatroon.talentBeschrijving}</p>
              <p className="text-xs text-darkGreen/60 mt-2 italic">Bewust, vanuit kracht</p>
            </div>

            {/* PIJL: te veel → (kwaliteit naar valkuil) */}
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-medium text-darkSlate/40 leading-none">te veel</span>
              <span className="text-base text-darkSlate/25 leading-none mt-0.5">→</span>
            </div>

            {/* VALKUIL */}
            <div className="rounded-tr-xl bg-darkRed/10 border-2 border-darkRed p-3">
              <p className="text-xs font-medium text-darkRed uppercase tracking-wide mb-1.5">Valkuil</p>
              <p className="text-sm font-semibold text-darkSlate mb-1 break-words">{focusPatroon.valkuil}</p>
              <p className="text-xs text-darkSlate/65">Te veel van de kwaliteit</p>
              <p className="text-xs text-darkRed/60 mt-2 italic">Onbewust, vanuit angst</p>
            </div>

            {/* LINKS midden: ↑ positief tegendeel (allergie → kwaliteit) */}
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-sm text-darkSlate/25 leading-none">↑</span>
                <span className="text-[9px] text-darkSlate/40 italic leading-none text-center">positief</span>
                <span className="text-[9px] text-darkSlate/40 italic leading-none text-center">tegendeel</span>
              </div>
            </div>

            {/* CENTER: leeg */}
            <div />

            {/* RECHTS midden: ↓ positief tegendeel (valkuil → uitdaging) */}
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[9px] text-darkSlate/40 italic leading-none text-center">positief</span>
                <span className="text-[9px] text-darkSlate/40 italic leading-none text-center">tegendeel</span>
                <span className="text-sm text-darkSlate/25 leading-none">↓</span>
              </div>
            </div>

            {/* ALLERGIE (linksonder) */}
            <div className={`rounded-bl-xl border-2 p-3 transition-colors ${allergie.trim() ? 'bg-orange/10 border-orange' : 'bg-white border-lightBg'}`}>
              <p className="text-xs font-medium text-orange uppercase tracking-wide mb-1.5">Allergie</p>
              <AutoTextarea
                value={allergie}
                onChange={setAllergie}
                placeholder="Vul zelf in of genereer met AI"
                className="w-full text-sm font-semibold text-darkSlate bg-transparent outline-none placeholder-darkSlate/30 leading-snug"
              />
              <p className="text-xs text-darkSlate/50 mt-2 break-words">
                {allergieToelichting || 'Wat jou irriteert in anderen'}
              </p>
            </div>

            {/* PIJL: ← te veel (uitdaging → allergie) */}
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-base text-darkSlate/25 leading-none mb-0.5">←</span>
              <span className="text-[9px] font-medium text-darkSlate/40 leading-none">te veel</span>
            </div>

            {/* UITDAGING (rechtsonder) */}
            <div className={`rounded-br-xl border-2 p-3 transition-colors ${uitdaging.trim() ? 'bg-midGreen/10 border-midGreen' : 'bg-white border-lightBg'}`}>
              <p className="text-xs font-medium text-midGreen uppercase tracking-wide mb-1.5">Uitdaging</p>
              <AutoTextarea
                value={uitdaging}
                onChange={setUitdaging}
                placeholder="Vul zelf in of genereer met AI"
                className="w-full text-sm font-semibold text-darkSlate bg-transparent outline-none placeholder-darkSlate/30 leading-snug"
              />
              <p className="text-xs text-darkSlate/50 mt-2 break-words">
                {uitdagingToelichting || 'Positieve tegenhanger van de valkuil'}
              </p>
            </div>
          </div>

          {/* AI suggestie */}
          <button
            onClick={suggereerKwadrant}
            disabled={suggestieLoading}
            className="w-full py-2.5 rounded-xl border-2 border-orange text-orange text-sm hover:bg-orange/5 transition-colors disabled:opacity-50"
          >
            {suggestieLoading ? 'AI denkt na…' : '✦ Laat AI uitdaging & allergie suggereren'}
          </button>

          {fout && <p className="text-sm text-darkRed text-center">{fout}</p>}

          <div className="bg-lightBg2 rounded-xl p-3 border border-orange/20 text-xs text-darkSlate/70">
            <span className="font-medium text-darkSlate">Goed om te weten: </span>
            je zenuwstelsel moet wennen aan iets nieuws. Ander gedrag kan onwennig voelen, zelfs als je weet dat het klopt. Dat betekent niet dat het fout gaat, maar dat je iets aan het herprogrammeren bent.
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStap(2)}
              className="text-sm text-midGreen hover:text-darkGreen underline underline-offset-2"
            >
              ← Terug
            </button>
            <button
              onClick={analyseAanvragen}
              disabled={!uitdaging.trim() || !allergie.trim()}
              className="px-5 py-2.5 bg-darkRed text-white text-sm rounded-xl disabled:opacity-40 hover:bg-darkRed/80 transition-colors"
            >
              Analyseer mijn kwadrant →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
