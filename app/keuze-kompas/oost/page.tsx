import Link from 'next/link';

export default function OostPagina() {
  return (
    <div className="space-y-6 max-w-lg mx-auto">

      <div className="flex items-center gap-3 mb-1">
        <Link href="/keuze-kompas" className="text-xs text-midGreen hover:text-darkGreen underline underline-offset-2">
          ← Keuze Kompas
        </Link>
      </div>

      <div className="text-center">
        <div className="w-14 h-14 rounded-full border-2 border-darkRed bg-darkRed/10 flex items-center justify-center mx-auto mb-3">
          <span className="font-bold text-2xl text-darkRed">O</span>
        </div>
        <h1 className="font-salmon text-2xl text-darkSlate mb-1">Richting Oost</h1>
        <p className="text-darkRed text-sm font-medium">Loyaliteit</p>
      </div>

      <div className="bg-lightBg2 rounded-2xl p-4 border border-orange/20 text-sm text-darkSlate space-y-2">
        <p>Oost gaat over loyaliteit: aan wie ben je nog verbonden, en draag je hen mee op een manier die jou kleinhoudt?</p>
        <p>Soms groeien we voorbij de versie van onszelf die onze omgeving van ons verwacht. Niet iedereen kan mee naar dat volgende level, ook al houd je van ze.</p>
        <p className="text-darkSlate/60 text-xs border-t border-orange/20 pt-2">De vraag is niet of je van ze houdt. De vraag is: wie mag er echt met jou mee?</p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-darkSlate/50">Tools in Richting Oost</p>

        <Link
          href="/keuze-kompas/oost/loyaliteitsbrief"
          className="block bg-white rounded-2xl border-l-4 border-darkRed p-5 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform"
        >
          <div className="text-2xl mb-2">✉️</div>
          <h2 className="font-salmon text-lg text-darkSlate mb-1">Loyaliteitsbrief</h2>
          <p className="text-xs text-darkRed italic mb-2">Schrijf een brief aan wie jij draagt</p>
          <p className="text-sm text-darkSlate/70 leading-relaxed">Erken wat je van hen hebt meegekregen, benoem wat je jezelf daardoor ontzegt, en geef jezelf toestemming om verder te gaan.</p>
        </Link>
      </div>

    </div>
  );
}
