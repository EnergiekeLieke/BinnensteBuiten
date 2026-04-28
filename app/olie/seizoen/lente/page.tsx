import Link from 'next/link';
import IframeResizer from '@/components/IframeResizer';

const insecten = [
  { naam: 'Muggen',       emoji: '🦟', olieen: ['Cedarwood', 'Cinnamon', 'Citronella', 'Clove', 'Eucalyptus', 'Geranium', 'Hyssop', 'Lavender', 'Lemongrass', 'Orange', 'Peppermint', 'Spearmint'] },
  { naam: 'Mieren',       emoji: '🐜', href: 'https://energiekelieke.kennis.shop/pay/antimierenpakket', olieen: ['Black Pepper', 'Cinnamon', 'Citrus', 'Clove', 'Peppermint', 'Spearmint', 'Tea Tree'] },
  { naam: 'Wespen',       emoji: '🐝', olieen: ['Black Pepper', 'Cinnamon', 'Clove', 'Geranium', 'Lemongrass', 'Peppermint'] },
  { naam: 'Teken',        emoji: '🕷️', olieen: ['Cedarwood', 'Citronella', 'Eucalyptus', 'Geranium', 'Lavender', 'Lemongrass', 'Orange', 'Rosemary', 'Sage', 'Tea Tree', 'Thyme'] },
  { naam: 'Vliegen',      emoji: '🪰', olieen: ['Cedarwood', 'Lavender', 'Lemongrass', 'Patchouli', 'Peppermint', 'Rosemary', 'Spearmint', 'Tea Tree'] },
  { naam: 'Spinnen',      emoji: '🕸️', olieen: ['Cedarwood', 'Cinnamon', 'Citronella', 'Clove', 'Lavender', 'Lemon', 'Orange', 'Peppermint', 'Spearmint'] },
  { naam: 'Motten',       emoji: '🦋', olieen: ['Cedarwood', 'Citronella', 'Hyssop', 'Lavender', 'Orange', 'Peppermint', 'Spearmint'] },
  { naam: 'Vlooien',      emoji: '🦗', olieen: ['Cedarwood', 'Citronella', 'Eucalyptus', 'Lavender', 'Lemongrass', 'Orange', 'Peppermint'] },
  { naam: 'Kakkerlakken', emoji: '🪳', olieen: ['Cedarwood', 'Cinnamon', 'Eucalyptus', 'Lemon', 'Orange', 'Peppermint', 'Thyme'] },
  { naam: 'Kevers',       emoji: '🪲', olieen: ['Cedarwood', 'Orange', 'Peppermint', 'Thyme'] },
  { naam: 'Bedwants',     emoji: '🐛', olieen: ['Peppermint'] },
  { naam: 'Bedmijt',      emoji: '🔬', olieen: ['Cinnamon', 'Clove', 'Eucalyptus', 'Lavender', 'Peppermint', 'Tea Tree', 'Thyme'] },
];

export default function LentePage() {
  return (
    <div>
      <IframeResizer />
      <div className="mb-2">
        <Link href="/olie" className="text-xs text-midGreen hover:underline">← Oliën</Link>
      </div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-midGreen mb-1">Seizoenstips</p>
        <h1 className="font-salmon text-3xl text-darkSlate mb-2">🌸 Lente</h1>
        <p className="text-sm text-darkSlate/70 leading-relaxed">
          De lente is een tijd van vernieuwing, energie en nieuwe groei. Deze oliën ondersteunen jou in dit seizoen.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

        {/* Pollentrio + Minerale zonnecreme naast elkaar */}
        <a href="https://energiekelieke.kennis.shop/pay/pollen" target="_blank" rel="noopener noreferrer" className="flex overflow-hidden bg-white rounded-2xl border-l-4 border-midGreen shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <div className="p-5 flex-1">
            <div className="text-2xl mb-2">🌸</div>
            <h2 className="font-salmon text-lg text-darkSlate mb-1">Pollentrio</h2>
            <p className="text-sm text-darkSlate/70 leading-relaxed">Lavender, Lemon en Peppermint samen vormen het klassieke pollentrio voor het lenteseizoen. Gebruik ze op de huid, in een sniffle stick (onderweg) of in de diffuser.</p>
          </div>
          <div className="w-28 flex-shrink-0">
            <img src="/fotos/Pollentrio.jpg" alt="Pollentrio oliën" className="w-full h-full object-cover" style={{ objectPosition: '12% 57%' }} />
          </div>
        </a>

        <a href="https://energiekelieke.kennis.shop/pay/mineralsunscreen" target="_blank" rel="noopener noreferrer" className="flex overflow-hidden bg-white rounded-2xl border-l-4 border-darkRed shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <div className="p-5 flex-1">
            <div className="text-2xl mb-2">☀️</div>
            <h2 className="font-salmon text-lg text-darkSlate mb-1">Minerale zonnecreme</h2>
            <p className="text-sm text-darkSlate/70 leading-relaxed">Bewustwordingshoekje: weet wat er in jouw zonnebescherming zit. Minerale varianten op basis van zinkoxide sluiten goed aan bij een bewuste leefstijl.</p>
          </div>
          <div className="w-28 flex-shrink-0">
            <img src="/fotos/MineralSunscreen.jpg" alt="Minerale zonnecreme" className="w-full h-full object-cover" />
          </div>
        </a>

        {/* Beestjes — volle breedte */}
        <div className="bg-white rounded-2xl border-l-4 border-orange p-5 shadow sm:col-span-2">
          <div className="text-2xl mb-2">🐝</div>
          <h2 className="font-salmon text-lg text-darkSlate mb-4">Beestjes</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {insecten.map(({ naam, emoji, href, olieen }) => {
              const cls = `bg-orange/5 rounded-xl p-4 ${href ? 'hover:bg-orange/10 transition-colors cursor-pointer' : ''}`;
              const inner = (
                <>
                  <div className="text-3xl mb-2">{emoji}</div>
                  <p className="text-xs font-bold uppercase tracking-widest text-orange mb-3">{naam}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {olieen.map((o) => (
                      <span key={o} className="text-xs bg-white border border-orange/20 text-darkSlate/80 rounded-full px-2.5 py-1">{o}</span>
                    ))}
                  </div>
                </>
              );
              return href ? (
                <a key={naam} href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
              ) : (
                <div key={naam} className={cls}>{inner}</div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 border-t border-darkSlate/10 pt-4">
            <p className="text-sm text-darkSlate/70 leading-relaxed">
              Zet een draadloze diffuser buiten op tafel om beestjes bij je vandaan te houden, bijv. de Macaron, Aroma Globe of Wanderbliss is hier geschikt voor. Super handig tijdens het eten of de BBQ. Heb je die niet? Een houten diffuserblokje met een paar druppels olie erop werkt ook best goed.
            </p>
            <p className="text-sm text-darkSlate/70 leading-relaxed">
              Spray je drempel of raamkozijn in met een spray om ongewenste indringers buiten de deur te houden.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-l-4 border-darkGreen shadow sm:col-span-2 overflow-hidden">
          <div className="relative w-full h-48">
            <img src="/fotos/ThievesSchoonmaakset.jpg" alt="Thieves schoonmaakset" className="w-full h-full object-cover" style={{ objectPosition: 'center 70%' }} />
          </div>
          <div className="p-5">
            <div className="text-2xl mb-2">🌿</div>
            <h2 className="font-salmon text-lg text-darkSlate mb-1">Voorjaarsschoonmaak thuis</h2>
            <p className="text-sm text-darkSlate/70 leading-relaxed">De Thieves-lijn is perfect voor een frisse lenteaanpak in huis, van schoonmaakmiddelen tot diffuser.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-l-4 border-midGreen shadow sm:col-span-2 overflow-hidden">
          <div className="relative w-full h-48">
            <img src="/fotos/KofferOlie.jpg" alt="Koffer met oliën" className="w-full h-full object-cover" />
          </div>
          <div className="p-5">
            <div className="text-2xl mb-2">🍋</div>
            <h2 className="font-salmon text-lg text-darkSlate mb-1">Frisse lentegeuren</h2>
            <p className="text-sm text-darkSlate/70 leading-relaxed">Diffuserblends voor lente-energie brengen een frisse geur en lichtheid in huis. Denk aan citrusoliën (Lemon, Orange, Citrus Fresh, Lime, Citronella), Peppermint, de Stress Away blend en lichte bloemige geuren (zoals Lavender of Ylang Ylang).</p>
          </div>
        </div>

      </div>

      <Link
        href="/olie/seizoen/zomer"
        className="inline-flex items-center gap-2 text-sm font-medium text-midGreen hover:underline"
      >
        Naar Zomertips ☀️ →
      </Link>
    </div>
  );
}
