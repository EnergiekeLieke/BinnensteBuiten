import Link from 'next/link';

export default function HerfstPage() {
  return (
    <div>
      <div className="mb-2">
        <Link href="/olie" className="text-xs text-midGreen hover:underline">← Oliën</Link>
      </div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-midGreen mb-1">Seizoenstips</p>
        <h1 className="font-salmon text-3xl text-darkSlate mb-2">🍂 Herfst</h1>
        <p className="text-sm text-darkSlate/70 leading-relaxed">
          De herfst nodigt uit om naar binnen te keren en je weerstand op te bouwen. Deze oliën ondersteunen je daarin.
        </p>
      </div>

      <div className="bg-white rounded-2xl border-l-4 border-darkRed p-6 shadow mb-6">
        <p className="text-sm text-darkSlate/50 italic">Herfststips volgen hier, wordt binnenkort aangevuld.</p>
      </div>

      <Link
        href="/olie/seizoen/winter"
        className="inline-flex items-center gap-2 text-sm font-medium text-midGreen hover:underline"
      >
        Naar Wintertips ❄️ →
      </Link>
    </div>
  );
}
