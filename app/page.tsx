import Link from 'next/link';

const tools = [
  {
    href: '/levenswiel',
    title: 'Levenswiel Analyse',
    desc: 'Het spinnenweb maakt zichtbaar hoe tevreden jij bewust en onbewust bent over 8 levensgebieden. De analyse toont welke patronen je te doorbreken hebt én geeft je concrete tips over wat je nu kunt doen.',
    icon: '🌐',
    color: 'border-darkRed',
  },
  {
    href: '/basisverlangens',
    title: 'Basisverlangens Werkblad',
    desc: 'Ontdek welke basisverlangens jou drijven per levensgebied en wat dat onthult over jouw patronen.',
    icon: '💡',
    color: 'border-orange',
  },
  {
    href: '/geldgedoe',
    title: 'Flauwekul Filter: Geld Gedoe',
    desc: 'Meet je geldenergie, herken blokkerende strategieën en overtuigingen, en sluit af met krachtige affirmaties.',
    icon: '💸',
    color: 'border-midGreen',
  },
  {
    href: '/business-scan',
    title: 'Business Scan',
    desc: 'Snel overzicht van 12 bedrijfscategorieën met bewust/onbewust scores en het ONE THING om nu op te focussen.',
    icon: '📊',
    color: 'border-darkGreen',
  },
  {
    href: '/business-scan-gedetailleerd',
    title: 'Business Scan Gedetailleerd',
    desc: 'Diepgaande versie met scores per subonderdeel, uitklapbare categorieën en WHAT/WHY/HOW/WHEN oefening.',
    icon: '🔍',
    color: 'border-darkSlate',
  },
];

export default function Home() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="font-salmon text-4xl text-darkSlate mb-3">BinnensteBuiten Spel</h1>
        <p className="text-midGreen text-lg">Kom los van die innerlijke stemmetjes die je laten geloven dat er geen ruimte is voor wat jou écht blij maakt. Met rake vragen, praktische tools en speelse experimenten breng je jezelf stap voor stap terug in contact met wat jij nodig hebt. Kies een tool en begin met inzicht krijgen</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`block bg-white rounded-2xl border-l-4 ${t.color} p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform`}
          >
            <div className="text-4xl mb-3">{t.icon}</div>
            <h2 className="font-salmon text-xl text-darkSlate mb-2">{t.title}</h2>
            <p className="text-sm text-darkSlate/70 leading-relaxed">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
