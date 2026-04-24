'use client';

import { useState } from 'react';

// Overzicht van alle HD-affirmaties per centrum en staat.
// Dit bestand is bedoeld om te inspecteren en aan te vullen.
// Wijzigingen hier worden NIET automatisch overgenomen in HumanDesignAffirmaties.tsx —
// kopieer aangepaste affirmaties handmatig naar AFFIRMATIES_ONGEDEFINIEERD (en de prompttekst).

type CentrumData = {
  label: string;
  gedefinieerd:        string[];
  gedefinieerd_groei:  string[];
  gedefinieerd_gave:   string[];
  ongedefinieerd:      string[];
  ongedefinieerd_groei: string[];
  ongedefinieerd_gave: string[];
  compleetOpen:        string[];
  compleetOpen_groei:  string[];
  compleetOpen_gave:   string[];
};

const CENTRA: CentrumData[] = [
  {
    label: 'Hoofd',
    gedefinieerd: [
      'Mijn inspiratie is mijn kracht. Ik mag het delen.',
      'Ik mag mijn inspiratie volledig delen, zonder bang te zijn dat ik anderen daarmee overweldig.',
      'Ik zit van nature vol inspiratie en dat is een gave, geen last.',
      'Mijn ideeën zijn welkom in de wereld.',
      'Inspiratie is een uitnodiging, geen verplichting.',
    ],
    gedefinieerd_groei: [
      'Ik leer mezelf toestemming te geven mijn inspiratie te delen.',
      'Elke dag vertrouw ik er een beetje meer op dat mijn inspiratie welkom is.',
      'Ik oefen met delen, ook als ik nog niet zeker weet hoe het ontvangen wordt.',
    ],
    gedefinieerd_gave: [
      'Ik ben een constante bron van inspiratie en visie. Dat is mijn gave voor de wereld.',
      'Mijn vermogen om te inspireren is onuitputtelijk en authentiek.',
    ],
    ongedefinieerd: [
      'Ik laat alle vragen los die voor anderen bedoeld zijn.',
      'De mentale druk die ik voel mag ik loslaten, want die is niet altijd van mij.',
      'Ik mag denken zonder conclusies te hoeven trekken.',
      'Mijn waarde is er, los van wat ik weet of begrijp.',
      'Ik mag nieuwsgierig zijn zonder overal een antwoord op te hebben.',
    ],
    ongedefinieerd_groei: [
      'Ik leer herkennen welke vragen echt van mij zijn.',
      'Elke dag laat ik een beetje makkelijker de mentale druk los.',
      'Ik oefen met denken zonder het te hoeven oplossen.',
    ],
    ongedefinieerd_gave: [
      'Ik ben een bron van frisse, ongebonden nieuwsgierigheid.',
      'Juist omdat ik zoveel vragen ken, weet ik hoe bevrijdend het is er geen antwoord op te hoeven hebben.',
    ],
    compleetOpen: [
      'Ik hoef helemaal niets te weten.',
      'Ik ben niet mijn gedachten.',
      'De mentale onrust die ik voel hoort niet bij mij thuis.',
      'Ik herken wanneer ik mezelf verlies in andermans denkwereld.',
      'De identificatie met "ik ben nou eenmaal een denker/piekeraar" laat ik los.',
      'Ik projecteer mijn mentale druk niet op anderen door hen te verwijten dat ze niet genoeg nadenken.',
    ],
    compleetOpen_groei: [
      'Ik leer herkennen wanneer de mentale drukte niet van mij is.',
      'Elke keer dat ik een gedachte loslaat die niet van mij is, word ik helderder.',
      'Ik oefen met stilte in mijn hoofd.',
    ],
    compleetOpen_gave: [
      'Ik ben een spiegel van alle mogelijke denkstijlen. Daardoor begrijp ik mensen diep.',
      'Mijn open hoofd is mijn grootste wijsheidspotentieel. Ik hoef niets vast te houden om wijs te zijn.',
    ],
  },
  {
    label: 'Ajna',
    gedefinieerd: [
      'Mijn perspectief is waardevol.',
      'Ik mag denken zoals ik denk, zonder me aan te passen aan wat anderen denken.',
      'Ik ben conceptueel sterk en dat mag ik laten zien.',
      'Ik sta stevig in mijn eigen perspectief. Dat is mijn kracht.',
      'Mijn overtuigingen zijn een kracht, geen last.',
      'Mijn manier van denken is consistent. Dat is mijn gave.',
    ],
    gedefinieerd_groei: [
      'Ik leer vertrouwen op mijn eigen perspectief.',
      'Elke dag sta ik een beetje steviger in mijn eigen denkwereld.',
      'Ik oefen met open blijven, ook als ik het ergens mee oneens ben.',
    ],
    gedefinieerd_gave: [
      'Mijn vaste denkstijl en perspectief zijn een anker voor de mensen om mij heen.',
      'Ik breng helderheid en standvastigheid in een wereld vol twijfel.',
    ],
    ongedefinieerd: [
      'Ik mag twijfelen en van gedachten veranderen. Ieder heeft zijn eigen overtuiging.',
      'Ik hoef niets zeker te weten. Ik hoef niemand te overtuigen.',
      'Mijn open mind is mijn kracht, geen zwakte.',
      'Ik kan goed out-of-the-box denken.',
      'De twijfel die ik voel mag ik loslaten als die van buiten komt.',
      'Mijn kracht ligt in het zien van meerdere perspectieven tegelijk.',
    ],
    ongedefinieerd_groei: [
      'Ik leer onderscheid maken tussen mijn eigen twijfel en die van anderen.',
      'Elke dag vertrouw ik er een beetje meer op dat mijn open mind een kracht is.',
      'Ik oefen met loslaten van de drang om overal zeker van te zijn.',
    ],
    ongedefinieerd_gave: [
      'Mijn vermogen om meerdere perspectieven te zien is een gave.',
      'Juist omdat ik zoveel denkstijlen ken, word ik wijs van alles wat ik leer kennen.',
      'Ik ben een brug tussen verschillende wereldbeelden.',
    ],
    compleetOpen: [
      'Ik hoef geen vaste overtuigingen te hebben.',
      'Ik ben niet mijn meningen.',
      'Ik herken wanneer ik mezelf identificeer met ideeën die eigenlijk niet van mij zijn.',
      'Ik hoef me niet te identificeren met "ik ben nou eenmaal iemand met sterke overtuigingen."',
      'Ik projecteer mijn onzekerheid niet op anderen door hen te verwijten dat ze niet overtuigend genoeg zijn.',
    ],
    compleetOpen_groei: [
      'Ik leer herkennen welke overtuigingen echt van mij zijn.',
      'Elke keer dat ik een idee loslaat dat niet van mij is, word ik vrijer.',
      'Ik oefen met ruimte houden in mijn denkwereld.',
    ],
    compleetOpen_gave: [
      'Ik ben een spiegel van alle mogelijke overtuigingen. Dat maakt mij wijs voorbij alle dogma\'s.',
      'Mijn open Ajna is het grootste potentieel voor ongebonden wijsheid.',
    ],
  },
  {
    label: 'Keel',
    gedefinieerd: [
      'Mijn stem is krachtig en welkom.',
      'Ik hoef me niet in te houden om te voorkomen dat ik anderen overweldig.',
      'Ik spreek vanuit mijn eigen kracht en authenticiteit.',
      'Mijn woorden doen ertoe.',
      'Ik mag zichtbaar zijn.',
    ],
    gedefinieerd_groei: [
      'Ik leer vertrouwen dat mijn woorden welkom zijn.',
      'Elke keer dat ik spreek vanuit mijn kracht, groeit mijn vertrouwen.',
      'Ik oefen met zichtbaar zijn, stap voor stap.',
    ],
    gedefinieerd_gave: [
      'Mijn stem heeft autoriteit en consistentie. Ik ben hier om gehoord te worden.',
      'Ik breng woorden tot leven die anderen niet kunnen of durven uitspreken.',
    ],
    ongedefinieerd: [
      'Op het juiste moment weet ik altijd wat ik moet zeggen. Ik voel me op mijn gemak met stilte.',
      'Mijn waarde is er, ook als ik op de achtergrond ben.',
      'Ik spreek op het juiste moment, vanuit rust.',
      'De drang om gezien te worden mag ik loslaten.',
      'Mijn woorden hebben meer impact als ik spreek op het juiste moment, of wanneer ik uitgenodigd word.',
      'Stilte voelt vertrouwd. Ik weet van nature wanneer het mijn moment is om te spreken.',
    ],
    ongedefinieerd_groei: [
      'Ik leer comfortabeler worden met stilte.',
      'Elke keer dat ik wacht op het juiste moment, merk ik hoe krachtig dat is.',
      'Ik oefen met spreken vanuit uitnodiging in plaats van druk.',
    ],
    ongedefinieerd_gave: [
      'Ik weet als geen ander hoe krachtig het juiste woord op het juiste moment is.',
      'Mijn gevoel voor timing in communicatie is een gave.',
      'Juist omdat ik niet altijd spreek, heeft mijn stem impact als ik dat doe.',
    ],
    compleetOpen: [
      'Ik hoef helemaal niets te zeggen.',
      'Ik ben meer dan wat ik zeg of uitstraal.',
      'Ik herken wanneer ik mezelf verlies in de behoefte om altijd zichtbaar te zijn.',
      'Ik hoef me niet te identificeren met "ik ben nou eenmaal iemand die veel praat."',
      'De identificatie met "ik ben nou eenmaal iemand die slecht is met woorden" laat ik los.',
      'Stilte is kracht. Ik mag er gewoon zijn.',
      'Ik weet van nature wanneer het mijn moment is om te spreken.',
      'Ik projecteer mijn communicatiedruk niet op anderen door hen te verwijten dat ze niet genoeg communiceren.',
      'De overtuiging dat anderen beter moeten communiceren laat ik los.',
    ],
    compleetOpen_groei: [
      'Ik leer herkennen wanneer de drang om te spreken van buiten komt.',
      'Elke keer dat ik bewust kies voor stilte, voel ik me vrijer.',
      'Ik oefen met aanwezig zijn zonder iets te hoeven zeggen.',
    ],
    compleetOpen_gave: [
      'Ik ben een spiegel van alle vormen van expressie. Daardoor begrijp ik communicatie als geen ander.',
      'Mijn open Keel maakt mij wijs in wanneer woorden doen en wanneer stilte spreekt.',
    ],
  },
  {
    label: 'Identiteit (G)',
    gedefinieerd: [
      'Ik weet wie ik ben, ook als de wereld om me heen verandert.',
      'Mijn identiteit is solide. Ik hoef het niet te bewijzen.',
      'Ik ben een bron van liefde voor mezelf en anderen.',
      'Ik vertrouw op mijn levenspad, ook als de weg niet altijd duidelijk is.',
      'Ik mag volledig mezelf zijn.',
    ],
    gedefinieerd_groei: [
      'Ik leer vertrouwen dat ik weet wie ik ben, ook in onzekere tijden.',
      'Elke dag voel ik mezelf een beetje meer thuis in wie ik ben.',
      'Ik oefen met volledig aanwezig zijn als mijzelf.',
    ],
    gedefinieerd_gave: [
      'Mijn stabiele identiteit is een anker voor de mensen om mij heen.',
      'Ik breng richting en liefdevolle aanwezigheid in elk systeem waar ik deel van uitmaak.',
    ],
    ongedefinieerd: [
      'Ik hoef nooit op zoek naar wie ik ben, of welke richting ik op ga. Ik ben wie ik ben. Mijn richting ontvouwt zich vanzelf.',
      'Mijn identiteit is vloeiend en dat is mijn kracht.',
      'Ik mag mijn richting bijstellen. Dat is groei.',
      'De zoektocht naar wie ik ben hoeft niet constant en urgent te zijn.',
      'Ik volg wat mooi en liefdevol aanvoelt. Dat brengt mij op de juiste plek.',
      'Ik bepaal in het moment wie ik wil zijn en wat bij mij past. Dat is mijn vrijheid.',
      'Ik pas me aan mijn omgeving aan als een kameleon. Dat is een gave, geen gebrek aan identiteit.',
      'Ik kies omgevingen die goed voor mij voelen. Mijn omgeving bepaalt mee wie ik kan zijn.',
    ],
    ongedefinieerd_groei: [
      'Ik leer vertrouwen dat mijn richting zich vanzelf ontvouwt.',
      'Elke dag ontdek ik een beetje meer wie ik ben en wat bij mij past.',
      'Ik oefen met loslaten van de vraag "wie ben ik eigenlijk?"',
    ],
    ongedefinieerd_gave: [
      'Mijn vloeiende identiteit maakt mij veelzijdig en aanpasbaar. Dat is een gave.',
      'Ik ben een kameleon, en dat geeft mij toegang tot werelden die anderen niet kennen.',
      'Juist omdat ik zoveel kanten van mezelf ken, begrijp ik anderen van binnenuit.',
    ],
    compleetOpen: [
      'Ik hoef geen vaste identiteit te hebben.',
      'Ik ben niemand anders\' definitie van wie ik moet zijn.',
      'Ik herken wanneer ik mezelf verlies in de identiteit of het levensverhaal van een ander.',
      'Ik hoef me niet te identificeren met "ik ben nou eenmaal iemand zonder richting."',
      'Het is veilig om niet te weten waar ik naartoe ga.',
      'Ik mag in het moment voelen wat goed voelt en bij mij past.',
      'Mijn omgeving voelt goed. Ik mag kiezen voor mensen en plekken die mij helpen oplichten.',
      'Ik projecteer mijn richtingloosheid niet op anderen door te verwijten dat zij niet weten wat ze willen.',
    ],
    compleetOpen_groei: [
      'Ik leer herkennen wanneer ik mezelf verlies in iemand anders\' verhaal.',
      'Elke keer dat ik terugkeer naar mezelf, groeit mijn zelfkennis.',
      'Ik oefen met bewust kiezen in welke omgeving ik wil zijn.',
    ],
    compleetOpen_gave: [
      'Ik ben een spiegel van alle mogelijke identiteiten. Daardoor begrijp ik de menselijke zoektocht als geen ander.',
      'Mijn open G-centrum maakt mij wijs in liefde, richting en wat het betekent om mens te zijn.',
    ],
  },
  {
    label: 'Hart / Ego',
    gedefinieerd: [
      'Mijn wilskracht is een gave.',
      'Ik ben waardevol, ongeacht wat ik doe of bereik.',
      'Als ik iets toezeg, kom ik het na, en dat is mijn kracht.',
      'Ik mag willen wat ik wil, zonder dat te verstoppen.',
      'Ik mag eigenwaarde hebben en dat laten zien.',
    ],
    gedefinieerd_groei: [
      'Ik leer voelen wat ik echt wil, zonder het te hoeven bewijzen.',
      'Elke dag is het een beetje makkelijker om mijn eigen wil te volgen.',
      'Ik oefen met toezeggingen die echt van mij komen.',
    ],
    gedefinieerd_gave: [
      'Mijn consistente wilskracht is een bron van zekerheid voor mijzelf en anderen.',
      'Ik weet wat ik waard ben en ik weet wat ik wil. Dat is een zeldzame gave.',
    ],
    ongedefinieerd: [
      'Ik hoef nooit te bewijzen dat ik waardevol ben. Dat ben ik al.',
      'Mijn waarde is er altijd, los van wat ik presteer of bereik.',
      'Het is veilig om te rusten, ook als ik nog niet alles heb bereikt. Mijn waarde verandert daar niet door.',
      'Ik ben genoeg, precies zoals ik nu ben.',
      'Ik maak alleen toezeggingen die echt van mij komen.',
    ],
    ongedefinieerd_groei: [
      'Ik leer voelen wanneer iets echt van mij komt en wanneer ik mezelf iets opleg.',
      'Elke dag is het een beetje makkelijker om te rusten zonder schuldgevoel.',
      'Ik oefen met "nee" zeggen als iets niet van mij is.',
    ],
    ongedefinieerd_gave: [
      'Ik weet als geen ander wat echte, gezonde wilskracht is.',
      'Juist omdat eigenwaarde mij niet vanzelf gegeven is, begrijp ik hoe kostbaar het is.',
      'Ik ben een wijs kompas voor anderen die worstelen met zelfwaarde.',
    ],
    compleetOpen: [
      'Ik hoef helemaal niets te bewijzen aan niemand.',
      'Ik ben niet mijn prestaties of mijn succes.',
      'Ik herken wanneer ik mezelf overbelast vanuit de angst niet genoeg te zijn.',
      'Ik hoef me niet te identificeren met "ik ben nou eenmaal iemand die hard moet werken voor eigenwaarde."',
      'De prestatiedruk die ik voel is niet altijd van mij.',
      'Ik projecteer mijn eigenwaardekwesties niet op anderen door te verwijten dat zij lui zijn of niet genoeg hun best doen.',
    ],
    compleetOpen_groei: [
      'Ik leer herkennen wanneer de prestatiedrang van buiten komt.',
      'Elke keer dat ik rust zonder schuldgevoel, bevestig ik mijn eigen waarde.',
      'Ik oefen met klein beginnen: één kleine toezegging die echt van mij is.',
    ],
    compleetOpen_gave: [
      'Ik ben een spiegel van alle vormen van wilskracht en eigenwaarde. Daardoor begrijp ik mensen diep.',
      'Mijn open Hart maakt mij wijs in wat echte waarde betekent, voorbij prestatie en status.',
    ],
  },
  {
    label: 'Sacraal',
    gedefinieerd: [
      'Mijn levensenergie is een gave en een kracht.',
      'Ik mag doen wat mij echt blij maakt.',
      'Mijn energie is er om te volgen en te genieten.',
      'Ik ben een bron van creatieve energie voor mezelf en anderen.',
      'Ik mag volledig genieten van wat mij vitaliteit geeft.',
      'Ik vertrouw op mijn sacrale ja of nee. Mijn lijf weet het.',
      // Sacraalautoriteit (van toepassing als emotiecentrum ongedefinieerd/open is)
      'Mijn lichaam weet het meteen. Ik vertrouw die eerste reactie.',
      'Mijn sacraal antwoordt direct als ik opties krijg voorgelegd.',
      'Gesloten vragen helpen mij. Ik mag vragen: "Mag ik je iets voorleggen, ja of nee?"',
    ],
    gedefinieerd_groei: [
      'Ik leer mijn eigen energieritme kennen en volgen.',
      'Elke dag luister ik een beetje beter naar wat mijn lichaam zegt.',
      'Ik oefen met ja zeggen op wat mij echt energie geeft.',
    ],
    gedefinieerd_gave: [
      'Mijn levensenergie is een geschenk voor alles en iedereen waar ik mijn ja aan geef.',
      'Ik breng vitaliteit en doorzettingsvermogen in wat ik doe. Dat is mijn gave.',
    ],
    ongedefinieerd: [
      'Alle druk van de wereld om hard te werken, laat ik los. Ik laat me leiden door mijn eigen energie. Genoeg is genoeg.',
      'Ik mag stoppen als mijn energie op is.',
      'Mijn waarde is er, los van hoeveel ik produceer.',
      'Het is veilig om te rusten zonder schuldgevoel.',
      'Mijn lichaam vertelt mij wanneer het genoeg is. Ik luister ernaar.',
    ],
    ongedefinieerd_groei: [
      'Ik leer stoppen voordat ik leeg ben.',
      'Elke dag herken ik een beetje beter wanneer mijn energie op is.',
      'Ik oefen met rust nemen zonder dat er een reden voor nodig is.',
    ],
    ongedefinieerd_gave: [
      'Ik weet als geen ander hoe echte, duurzame levenskracht eruitziet.',
      'Mijn gevoeligheid voor energie maakt mij een wijs kompas voor anderen.',
      'Juist omdat ik weet hoe het voelt om leeg te lopen, weet ik ook hoe kostbaar energie is.',
    ],
    compleetOpen: [
      'Ik ben niet de bron van eindeloze energie.',
      'Ik herken wanneer ik mezelf identificeer met "ik kan echt keihard werken hoor!" terwijl ik eigenlijk uitgeput ben.',
      'De productiviteitsdruk die ik voel is niet altijd van mij.',
      'Het is veilig om mijn grenzen te kennen en te respecteren.',
      'Ik projecteer mijn energieproblemen niet op anderen door te verwijten dat zij niet hard genoeg werken.',
    ],
    compleetOpen_groei: [
      'Ik leer mijn eigen energieritme kennen, los van de energie om mij heen.',
      'Elke keer dat ik stop als ik moe ben, vertrouw ik meer op mijn eigen ritme.',
      'Ik oefen met het verschil voelen tussen mijn energie en die van anderen.',
    ],
    compleetOpen_gave: [
      'Ik ben een spiegel van alle vormen van levenskracht. Daardoor weet ik wat duurzame energie echt is.',
      'Mijn open Sacraal is mijn grootste potentieel voor wijsheid over energie, werk en vitaliteit.',
    ],
  },
  {
    label: 'Emotiecentrum',
    gedefinieerd: [
      'Mijn emoties zijn mijn innerlijke intelligentie.',
      'Ik erken en herken mijn gevoelens zonder er in te verdrinken.',
      'Mijn gevoeligheid is een kracht, geen zwakte.',
      'Ik mag voelen wat ik voel.',
      'Mijn emotionele helderheid is een gave voor mezelf en mijn omgeving.',
      'Ik wacht op emotionele helderheid voordat ik grote beslissingen neem.',
      'Ik mag een nachtje over een beslissing slapen. Of langer.',
      'Ik laat de emotionele golf z\'n werk doen. Helderheid komt vanzelf.',
      'Mijn go-to zin: "Mag ik daar later op terugkomen?"',
    ],
    gedefinieerd_groei: [
      'Ik leer geduld hebben met mijn eigen emotionele proces.',
      'Elke dag vertrouw ik er een beetje meer op dat helderheid vanzelf komt.',
      'Ik oefen met vragen om bedenktijd, ook als dat ongemakkelijk voelt.',
    ],
    gedefinieerd_gave: [
      'Mijn emotionele diepgang is een gave die anderen raakt en verbindt.',
      'Ik breng warmte, gevoel en menselijkheid in alles wat ik doe.',
    ],
    ongedefinieerd: [
      'Ik durf conflicten en emotionele gesprekken aan te gaan. Ik praat op een kalme manier over (mijn) emoties.',
      'Ik mag observeren zonder meteen te reageren.',
      'Het is veilig om ruimte te nemen voordat ik een beslissing neem.',
      'De gevoelens van mensen om me heen zijn van hen. Zodra ik me daar verantwoordelijk voor begin te voelen, mag ik dat direct weer loslaten.',
      'Ik mag vertrekken uit situaties die mij emotioneel overspoelen.',
    ],
    ongedefinieerd_groei: [
      'Ik leer mijn eigen emoties onderscheiden van die van anderen.',
      'Elke dag word ik een beetje beter in observeren zonder meteen te reageren.',
      'Ik oefen met ruimte nemen voordat ik reageer of beslis.',
    ],
    ongedefinieerd_gave: [
      'Ik ben een fijngevoelig waarnemer van emotionele sferen. Dat is een gave.',
      'Juist omdat ik zoveel emoties van anderen heb meegedragen, begrijp ik het menselijk gevoel van binnenuit.',
      'Mijn kalmte in emotionele situaties is een geschenk voor de mensen om mij heen.',
    ],
    compleetOpen: [
      'Ik hoef emotionele intensiteit niet op te vangen of op te lossen.',
      'Ik ben niet mijn emoties en niet die van anderen.',
      'Ik herken wanneer ik mezelf verlies in de emotionele wereld van een ander.',
      'Ik hoef me niet te identificeren met "ik ben nou eenmaal heel gevoelig" of juist "ik ben slecht met emoties."',
      'De intense gevoelens die ik soms ervaar zijn niet altijd de mijne.',
      'Ik projecteer mijn emotionele overbelasting niet op anderen door hen te verwijten dat zij te emotioneel zijn of juist te weinig voelen.',
    ],
    compleetOpen_groei: [
      'Ik leer herkennen wanneer emoties van buiten komen.',
      'Elke keer dat ik mezelf terugvind na een emotionele golf, word ik wijzer.',
      'Ik oefen met bij mezelf blijven in emotioneel geladen situaties.',
    ],
    compleetOpen_gave: [
      'Ik ben een spiegel van alle emotionele ervaringen. Daardoor begrijp ik mensen op een diepe, empathische manier.',
      'Mijn open Emotiecentrum is mijn grootste potentieel voor emotionele wijsheid en menselijk begrip.',
    ],
  },
  {
    label: 'Milt',
    gedefinieerd: [
      'Mijn intuïtie is mijn kompas.',
      'Ik vertrouw op wat goed en veilig voelt in dit moment.',
      'Mijn lichaam weet het, ook als mijn hoofd twijfelt.',
      'Ik mag luisteren naar mijn instinct, ook zonder rationele verklaring.',
      'Mijn gevoel voor veiligheid en gezondheid is een gave.',
      'Mijn intuïtie spreekt in het moment. Ik vertrouw die eerste indruk.',
      // Miltautoriteit (van toepassing als emotie én sacraal ongedefinieerd/open zijn)
      'Mijn intuïtie spreekt zacht en eenmalig. Ik leer haar stem te herkennen en te vertrouwen.',
      'In het moment weet ik het al. Ik hoef er niet over na te denken.',
      'Mijn lichaam weet de weg. Ik volg mijn intuïtie, ook als mijn hoofd twijfelt.',
    ],
    gedefinieerd_groei: [
      'Ik leer de zachte stem van mijn intuïtie herkennen.',
      'Elke dag vertrouw ik mijn eerste indruk een beetje meer.',
      'Ik oefen met handelen op mijn instinct, ook zonder bewijs.',
    ],
    gedefinieerd_gave: [
      'Mijn consistente intuïtie is een gave die mij en anderen beschermt en leidt.',
      'Ik voel feilloos aan wat gezond en veilig is. Dat is een kostbaar kompas.',
    ],
    ongedefinieerd: [
      'Ik kies mensen en omgevingen die gezond voor mij zijn. Ik laat hierin los wat mij niet langer dient.',
      'Ik mag loslaten wat zijn tijd heeft gehad, ook als dat spannend voelt.',
      'Het is veilig om los te laten.',
      'Mijn lichaam weet wat goed voor mij is.',
      'Ik vertrouw mijn gevoel voor wat veilig en gezond aanvoelt.',
    ],
    ongedefinieerd_groei: [
      'Ik leer mijn gevoel voor veiligheid vertrouwen, ook zonder rationele verklaring.',
      'Elke dag herken ik een beetje beter wat echt van mij is en wat ik overneem.',
      'Ik oefen met loslaten, stap voor stap.',
    ],
    ongedefinieerd_gave: [
      'Juist omdat ik zoveel varianten van veiligheid en angst ken, weet ik wat werkelijk gezond is.',
      'Mijn openheid voor intuïtie en veiligheid maakt mij wijs en opmerkzaam op dit thema.',
    ],
    compleetOpen: [
      'Ik ben niet mijn angsten.',
      'Ik herken wanneer ik me vastklem aan gewoontes, mensen of situaties uit angst.',
      'Ik hoef me niet te identificeren met "ik ben nou eenmaal iemand die zekerheid nodig heeft."',
      'De onzekerheid die ik soms voel is niet altijd van mij.',
      'Het is veilig om te veranderen.',
      'Ik projecteer mijn angsten niet op anderen door te verwijten dat zij te roekeloos of onverantwoordelijk zijn.',
    ],
    compleetOpen_groei: [
      'Ik leer herkennen wanneer angst van buiten komt en wanneer ze van mij is.',
      'Elke keer dat ik loslaat wat niet van mij is, voel ik me lichter.',
      'Ik oefen met kleine stappen richting verandering.',
    ],
    compleetOpen_gave: [
      'Ik ben een spiegel van alle vormen van angst en veiligheid. Daardoor begrijp ik de menselijke behoefte aan zekerheid van binnenuit.',
      'Mijn open Milt is mijn grootste potentieel voor wijsheid over gezondheid, intuïtie en wat werkelijk veilig is.',
    ],
  },
  {
    label: 'Wortel',
    gedefinieerd: [
      'Ik kan goed omgaan met druk. Dat is mijn kracht.',
      'Ik mag in beweging komen op mijn eigen tempo.',
      'Ik gebruik mijn adrenalinkracht bewust en gericht.',
      'Ik mag starten én stoppen wanneer dat goed voelt.',
      'Stress is een signaal, geen bestemming. Ik beweeg erdoorheen.',
      'Ik zet druk om in gerichte actie, op mijn eigen moment.',
    ],
    gedefinieerd_groei: [
      'Ik leer mijn eigen tempo en ritme in druk kennen.',
      'Elke dag gebruik ik mijn energie een beetje bewuster.',
      'Ik oefen met starten én stoppen op het moment dat goed voelt.',
    ],
    gedefinieerd_gave: [
      'Mijn vermogen om druk om te zetten in beweging is een kracht voor mijzelf en anderen.',
      'Ik breng energie, adrenaline en actie in wat ik aanpak. Dat is mijn gave.',
    ],
    ongedefinieerd: [
      'Ik heb altijd alle tijd. Haast en stress van de ander laat ik bij hen.',
      'Ik mag mijn eigen tempo volgen.',
      'Het is veilig om te vertragen, ook als de wereld om me heen snel gaat.',
      'De druk van anderen laat ik bij hen.',
    ],
    ongedefinieerd_groei: [
      'Ik leer omgaan met druk op mijn eigen manier.',
      'Elke dag herken ik een beetje beter welke stress van mij is en welke van anderen.',
      'Ik oefen met vertragen, ook als de wereld om me heen snel gaat.',
    ],
    ongedefinieerd_gave: [
      'Ik weet als geen ander hoe bevrijdend het is om zonder haast te leven.',
      'Mijn rust en kalmte zijn een geschenk voor iedereen om me heen.',
      'Juist omdat ik zoveel stress van anderen heb meegedragen, weet ik hoe kostbaar rust is.',
    ],
    compleetOpen: [
      'Ik ben niet mijn haast.',
      'Ik herken wanneer ik mezelf identificeer met "ik ben nou eenmaal iemand die altijd haast heeft."',
      'De identificatie met "ik ben nou eenmaal iemand die veel stress heeft" laat ik los.',
      'De stress en urgentie die ik voel is niet van mij, ik neem die van anderen over.',
      'Het is veilig om stil te staan en niets te doen.',
      'Ik projecteer mijn stresspatronen niet op anderen door te verwijten dat zij niet snel genoeg werken of niet genoeg doen.',
    ],
    compleetOpen_groei: [
      'Ik leer herkennen wanneer de haast en druk niet van mij zijn.',
      'Elke keer dat ik bewust vertraag, word ik vrijer.',
      'Ik oefen met stilstaan, ook als alles om me heen beweegt.',
    ],
    compleetOpen_gave: [
      'Ik ben een spiegel van alle vormen van druk en urgentie. Daardoor begrijp ik stress en haast als geen ander.',
      'Mijn open Wortel is mijn grootste potentieel voor wijsheid over rust, ritme en wat werkelijk dringend is.',
    ],
  },
];

const SECTIES: { key: keyof CentrumData; label: string; kleur: string }[] = [
  { key: 'gedefinieerd',        label: 'Gedefinieerd · omarmen wat van jou is',        kleur: 'bg-darkGreen text-white' },
  { key: 'gedefinieerd_groei',  label: 'Gedefinieerd · groei',                         kleur: 'bg-orange text-white' },
  { key: 'gedefinieerd_gave',   label: 'Gedefinieerd · gave',                          kleur: 'bg-midGreen text-white' },
  { key: 'ongedefinieerd',      label: 'Ongedefinieerd · loslaten wat niet van jou is', kleur: 'bg-white border border-darkGreen text-darkGreen' },
  { key: 'ongedefinieerd_groei', label: 'Ongedefinieerd · groei',                      kleur: 'bg-orange text-white' },
  { key: 'ongedefinieerd_gave', label: 'Ongedefinieerd · gave',                        kleur: 'bg-midGreen text-white' },
  { key: 'compleetOpen',        label: 'Compleet open · diepste loslaten (drie lagen)', kleur: 'bg-cream border border-dashed border-gray-400 text-darkSlate' },
  { key: 'compleetOpen_groei',  label: 'Compleet open · groei',                        kleur: 'bg-orange text-white' },
  { key: 'compleetOpen_gave',   label: 'Compleet open · gave',                         kleur: 'bg-midGreen text-white' },
];

export default function HDAffirmatiesOverzicht() {
  const [toelichtingOpen, setToelichtingOpen] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-darkGreen uppercase mb-1">Human Design · Intern overzicht</p>
        <h1 className="font-salmon text-3xl text-darkSlate mb-1">Affirmaties overzicht</h1>
        <p className="text-sm text-midGreen italic">Alle affirmaties per centrum en staat, ter inzage en aanvulling</p>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="bg-white border border-lightBg rounded-2xl overflow-hidden">
          <button
            onClick={() => setToelichtingOpen(s => !s)}
            className="w-full flex justify-between items-center px-5 py-3 text-left cursor-pointer bg-white"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-darkGreen">Toelichting</span>
            <span className={`text-darkGreen text-sm opacity-70 transition-transform duration-200 ${toelichtingOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${toelichtingOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
          <div className="px-5 pb-5 flex flex-col gap-4 text-sm text-darkSlate leading-relaxed">

            <div>
              <span className="inline-block bg-darkGreen text-white text-[10px] font-bold uppercase tracking-wide rounded px-2 py-0.5 mb-2">Gedefinieerd</span>
              <p className="m-0 mb-2">Een gedefinieerd centrum heeft constante, betrouwbare energie. Jij bent de <strong>zender</strong> op dit thema: je straalt het uit naar je omgeving.</p>
              <p className="m-0 mb-2">De valkuil is tweeledig:</p>
              <ul className="m-0 pl-0 list-none flex flex-col gap-1.5 mb-2">
                <li className="flex gap-2"><span className="text-darkGreen shrink-0">·</span><span>De omgeving reageert soms overweldigd of ongemakkelijk, waardoor je de druk kunt voelen om jezelf in te houden. "Ik ben te veel."</span></li>
                <li className="flex gap-2"><span className="text-darkGreen shrink-0">·</span><span>Tegelijk kun je ook de druk (projectie) voelen dat anderen van jou verwachten dat je deze energie blijft leveren, altijd en overal.</span></li>
              </ul>
              <p className="m-0">De affirmaties helpen je beide los te laten en je energie te omarmen als gave, op jouw voorwaarden.</p>
            </div>

            <div>
              <span className="inline-block bg-white border border-darkGreen text-darkGreen text-[10px] font-bold uppercase tracking-wide rounded px-2 py-0.5 mb-2">Ongedefinieerd</span>
              <p className="m-0 mb-2">Een ongedefinieerd centrum is open en gevoelig voor energie van buitenaf. Jij bent de <strong>ontvanger en versterker</strong>: je absorbeert en vergroot wat anderen op dit thema meebrengen.</p>
              <p className="m-0">De valkuil is dat je geraakt en geconditioneerd raakt door die omgevingsenergie en hard je best gaat doen om dit thema te leveren. "Ik ben anders niet goed genoeg." De affirmaties helpen je loslaten wat niet van jou is.</p>
            </div>

            <div>
              <span className="inline-block bg-cream border border-dashed border-gray-400 text-darkSlate text-[10px] font-bold uppercase tracking-wide rounded px-2 py-0.5 mb-2">Compleet open</span>
              <p className="m-0 mb-2">Een compleet open centrum heeft geen enkele vaste poort of kanaal. Jij bent een <strong>spiegel van alle smaakjes</strong>: je kunt alle varianten van dit thema ervaren en vertegenwoordigt daardoor het grootste wijsheidspotentieel, maar ook de diepste conditionering.</p>
              <p className="m-0 mb-3">De valkuil is de diepste conditionering van alle drie. Die uit zich op drie manieren:</p>
              <ul className="m-0 pl-0 list-none flex flex-col gap-1.5">
                <li className="flex gap-2"><span className="text-darkGreen shrink-0">1.</span><span><strong>Ongedefinieerd gedrag:</strong> dezelfde patronen als bij een ongedefinieerd centrum. Energie van anderen overnemen en hard werken om dit thema te leveren, om te bewijzen dat je 'goed genoeg' bent.</span></li>
                <li className="flex gap-2"><span className="text-darkGreen shrink-0">2.</span><span><strong>Blinde vlek / volledige identificatie:</strong> je herkent jezelf volledig in de not-self gedachte, zonder dat je doorhebt dat het conditionering is. Bijv. open Wortel: "Ik ben nou eenmaal iemand die altijd haast heeft." Open Sacraal: "Ik kan echt keihard werken hoor!"</span></li>
                <li className="flex gap-2"><span className="text-darkGreen shrink-0">3.</span><span><strong>Transpersoonlijke conditionering:</strong> je projecteert het thema op anderen en verwijt hen het gedrag dat eigenlijk jouw conditionering weerspiegelt. Bijv. open Sacraal: "Anderen werken niet hard genoeg." Open Wortel: "Waarom heeft niemand hier haast?"</span></li>
              </ul>
            </div>

            <div>
              <span className="inline-block bg-orange text-white text-[10px] font-bold uppercase tracking-wide rounded px-2 py-0.5 mb-2">Groei</span>
              <p className="m-0">De groei-affirmaties zijn kleinere, haalbaardere versies van de declaratieve affirmaties. Voor wanneer de grote versie nog te groots voelt. Denk aan: "Ik leer...", "Elke dag een beetje meer...", "Ik oefen met..."</p>
            </div>

            <div>
              <span className="inline-block bg-midGreen text-white text-[10px] font-bold uppercase tracking-wide rounded px-2 py-0.5 mb-2">Gave</span>
              <p className="m-0">De gave-affirmaties benoemen de unieke wijsheid die voortkomt uit dit centrum. Voor gedefinieerde centra: jouw constante gave voor de wereld. Voor open/ongedefinieerde centra: de diepte die je hebt opgebouwd door dit thema in alle varianten te kennen.</p>
            </div>

          </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {CENTRA.map(c => (
          <div key={c.label} className="bg-white border border-lightBg rounded-2xl overflow-hidden">
            <div className="bg-darkGreen px-5 py-3">
              <h2 className="font-salmon text-xl text-white m-0">{c.label}</h2>
            </div>
            <div className="p-5 flex flex-col gap-5">
              {SECTIES.map(({ key, label, kleur }) => (
                <div key={key}>
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wide rounded px-2 py-0.5 mb-2 ${kleur}`}>
                    {label}
                  </span>
                  <ul className="flex flex-col gap-1 m-0 pl-0 list-none">
                    {(c[key] as string[]).map((a, i) => (
                      <li key={i} className="text-sm text-darkSlate leading-relaxed flex gap-2">
                        <span className="text-darkGreen shrink-0 mt-0.5">·</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
