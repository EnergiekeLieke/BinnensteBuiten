import Link from 'next/link';

export default function ZomerPage() {
  return (
    <div>
      <div className="mb-2">
        <Link href="/olie" className="text-xs text-midGreen hover:underline">← Oliën</Link>
      </div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-midGreen mb-1">Seizoenstips</p>
        <h1 className="font-salmon text-3xl text-darkSlate mb-2">☀️ Zomer</h1>
        <p className="text-sm text-darkSlate/70 leading-relaxed">
          De zomer vraagt om verkoeling, bescherming en energie. Deze oliën zijn jouw zomerse bondgenoten.
        </p>
      </div>

      <div className="bg-white rounded-2xl border-l-4 border-orange p-6 shadow mb-6">
        <p className="text-sm text-darkSlate/50 italic">Zomertips volgen hier, wordt binnenkort aangevuld.</p>
      </div>

      <Link
        href="/olie/seizoen/herfst"
        className="inline-flex items-center gap-2 text-sm font-medium text-midGreen hover:underline"
      >
        Naar Herfststips 🍂 →
      </Link>
    </div>
  );
}
