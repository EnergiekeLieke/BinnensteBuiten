import Link from 'next/link';

function Bullet() {
  return <span className="w-1.5 h-1.5 rounded-full bg-midGreen flex-shrink-0 mt-1.5" />;
}

function SubBullet() {
  return <span className="w-1 h-1 rounded-full bg-darkSlate/30 flex-shrink-0 mt-1.5" />;
}

export default function BiotensorPage() {
  return (
    <div>
      <div className="mb-2">
        <Link href="/olie" className="text-xs text-midGreen hover:underline">← Oliën</Link>
      </div>
      <div className="mb-8">
        <h1 className="font-salmon text-3xl text-darkSlate mb-2">🎯 Biotensor-stappenplan</h1>
        <p className="text-sm text-darkSlate/70 leading-relaxed">
          Zo test je vanuit je onderbewustzijn welke olie jij op dit moment nodig hebt.
        </p>
      </div>

      <div className="flex flex-col gap-5">

        {/* Stap 1 */}
        <div className="flex overflow-hidden bg-white rounded-2xl border-l-4 border-darkRed shadow">
          <div className="flex-1 p-5">
          <div className="flex items-start gap-4 mb-4">
            <span className="font-salmon text-3xl text-darkRed/20 leading-none select-none flex-shrink-0">1</span>
            <h2 className="font-salmon text-xl text-darkSlate">Kies de juiste hulpvraag</h2>
          </div>
          <div className="flex flex-col gap-3 ml-1">
            <div className="flex items-start gap-2">
              <Bullet />
              <span className="text-sm text-darkSlate/80">Itovi als startpunt?</span>
            </div>
            <div className="flex items-start gap-2">
              <Bullet />
              <span className="text-sm text-darkSlate font-semibold">Welke olie heeft mijn lichaam op dit moment nodig?</span>
            </div>
            <div className="flex items-start gap-2">
              <Bullet />
              <div className="flex flex-col gap-1.5">
                <span className="text-sm text-darkSlate/80">Welke olie ondersteunt mij bij:</span>
                <div className="flex flex-col gap-1 ml-3 mt-1">
                  <div className="flex items-start gap-2"><SubBullet /><span className="text-sm text-darkSlate/70">het loslaten van ......... (onprettig gevoel)</span></div>
                  <div className="flex items-start gap-2"><SubBullet /><span className="text-sm text-darkSlate/70">het doorbreken van een patroon van ...... (gedrag)</span></div>
                  <div className="flex items-start gap-2"><SubBullet /><span className="text-sm text-darkSlate/70">mijn fysieke klacht: ......?</span></div>
                  <div className="flex items-start gap-2"><SubBullet /><span className="text-sm text-darkSlate/70">op basis van je Human Design chart?</span></div>
                </div>
              </div>
            </div>
          </div>
          </div>
          <div className="w-1/4 flex-shrink-0">
            <img src="/fotos/LiekeTestOlieBT.jpg" alt="Lieke test olie met biotensor" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Stap 2 */}
        <div className="flex overflow-hidden bg-white rounded-2xl border-l-4 border-darkRed shadow">
          <div className="flex-1 p-5">
          <div className="flex items-start gap-4 mb-4">
            <span className="font-salmon text-3xl text-darkRed/20 leading-none select-none flex-shrink-0">2</span>
            <h2 className="font-salmon text-xl text-darkSlate">Zoek de juiste olie</h2>
          </div>
          <div className="flex flex-col gap-3 ml-1">
            <div className="flex items-start gap-2">
              <Bullet />
              <span className="text-sm text-darkSlate/80">Gebruik de Young Living Product Guide (Catalogus)</span>
            </div>
            <div className="flex items-start gap-2">
              <Bullet />
              <span className="text-sm text-darkSlate/80">Hoeveel oliën / producten heb ik nodig?</span>
            </div>
            <div className="flex items-start gap-2">
              <Bullet />
              <div className="flex flex-col gap-1.5">
                <span className="text-sm text-darkSlate/80">Zoek de juiste olie bij jouw hulpvraag:</span>
                <div className="flex flex-col gap-1 ml-3 mt-1">
                  <div className="flex items-start gap-2"><SubBullet /><span className="text-sm text-darkSlate/70">Combineren in een blend?</span></div>
                  <div className="flex items-start gap-2"><SubBullet /><span className="text-sm text-darkSlate/70">Los gebruiken?</span></div>
                  <div className="flex items-start gap-2"><SubBullet /><span className="text-sm text-darkSlate/70">TOP 3 op basis van prioriteit?</span></div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Bullet />
              <div className="flex flex-col gap-1.5">
                <span className="text-sm text-darkSlate/80">Vraag dan per olie / product:</span>
                <div className="flex flex-col gap-1 ml-3 mt-1">
                  <div className="flex items-start gap-2"><SubBullet /><span className="text-sm text-darkSlate/70">Categorie: Single · Blend · Plusolie?</span></div>
                  <div className="flex items-start gap-2"><SubBullet /><span className="text-sm text-darkSlate/70">Zoek per 2 blz. in de juiste categorie</span></div>
                  <div className="flex items-start gap-2"><SubBullet /><span className="text-sm text-darkSlate/70">Links of rechts?</span></div>
                  <div className="flex items-start gap-2"><SubBullet /><span className="text-sm text-darkSlate/70">Daarna per olie testen welke het is</span></div>
                </div>
              </div>
            </div>
          </div>
          </div>
          <div className="w-1/4 flex-shrink-0">
            <img src="/fotos/KofferOlie.jpg" alt="Koffer met oliën" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Stap 3 */}
        <div className="flex overflow-hidden bg-white rounded-2xl border-l-4 border-darkRed shadow">
          <div className="flex-1 p-5">
          <div className="flex items-start gap-4 mb-4">
            <span className="font-salmon text-3xl text-darkRed/20 leading-none select-none flex-shrink-0">3</span>
            <h2 className="font-salmon text-xl text-darkSlate">Hoe te gebruiken?</h2>
          </div>
          <div className="flex flex-col gap-4 ml-2">
            <div>
              <p className="text-sm font-semibold text-darkSlate mb-1">Inademen</p>
              <ul className="flex flex-col gap-1 ml-2">
                <li className="text-sm text-darkSlate/70">Diffuser, op welke stand?</li>
                <li className="text-sm text-darkSlate/70">Cuppen</li>
                <li className="text-sm text-darkSlate/70">1 druppel op je handen wrijven en inademen</li>
                <li className="text-sm text-darkSlate/70">Sniffle stick, hoeveel druppels?</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-darkSlate mb-1">Op de huid</p>
              <ul className="flex flex-col gap-1 ml-2">
                <li className="text-sm text-darkSlate/70">Roller maken (zie stap 4a)</li>
                <li className="text-sm text-darkSlate/70">Spray maken (zie stap 4b)</li>
                <li className="text-sm text-darkSlate/70">Massage?</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-darkSlate mb-1">Innemen (plusolie)</p>
              <ul className="flex flex-col gap-1 ml-2">
                <li className="text-sm text-darkSlate/70">Hoeveel druppels?</li>
                <li className="text-sm text-darkSlate/70">In water · thee · capsule · NingXia</li>
                <li className="text-sm text-darkSlate/70">Druppel onder tong smeren</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-darkSlate mb-1">Indraaien</p>
              <ul className="flex flex-col gap-1 ml-2">
                <li className="text-sm text-darkSlate/70">Energetisch indraaien</li>
              </ul>
            </div>
          </div>
          </div>
          <div className="w-1/4 flex-shrink-0">
            <img src="/fotos/AromaGlobeDiffuser.jpg" alt="Aroma Globe Diffuser" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Stap 4a + 4b */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Stap 4a */}
          <div className="bg-white rounded-2xl border-l-4 border-darkRed p-5 shadow">
            <div className="flex items-start gap-4 mb-4">
              <span className="font-salmon text-3xl text-darkRed/20 leading-none select-none flex-shrink-0">4a</span>
              <h2 className="font-salmon text-xl text-darkSlate">Roller dosering</h2>
            </div>
            <div className="flex flex-col gap-4 ml-2">
              <div>
                <p className="text-sm font-semibold text-darkSlate mb-1">1 olie of een combinatie?</p>
                <div className="flex flex-col gap-2 ml-1">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-midGreen flex-shrink-0 mt-1.5" />
                    <span className="text-sm text-darkSlate/70">Puur gebruiken? (bijv. Lavender, PPP...) · klik een rollerdopje op het flesje</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-midGreen flex-shrink-0 mt-1.5" />
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-darkSlate/70">Verdunnen met:</span>
                      <div className="flex flex-col gap-1 ml-3 mt-0.5">
                        {['V-6', 'Druivenpitolie', 'Zoete amandelolie', 'Kokosolie', 'Of anders'].map((item) => (
                          <div key={item} className="flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-darkSlate/30 flex-shrink-0 mt-1.5" />
                            <span className="text-sm text-darkSlate/60">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-darkSlate mb-2">Hoeveel druppels per 10 ml?</p>
                <div className="bg-midGreen/10 rounded-xl p-4">
                  <p className="text-xs text-darkSlate/60 italic">Testresultaat biotensor invullen</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-darkSlate mb-2">Waar aanbrengen?</p>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-darkSlate/50 mb-2">Voet / reflexpunt</p>
                    <ul className="flex flex-col gap-1">
                      {['Schildklier', 'Long', 'Hart', 'Maag', 'Lever', 'Galblaas', 'Nier', 'Milt', 'Darmen', 'Baarmoeder / Prostaat', 'Eierstokken / Testikels', 'Blaas'].map((p) => (
                        <li key={p} className="text-sm text-darkSlate/70 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-midGreen flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-darkSlate/50 mb-2">Op lichaamsdeel</p>
                    <ul className="flex flex-col gap-1">
                      {['Nek / hals / achter oren', 'Polsen / onderarm', 'Op de (onder)buik', 'Langs ruggengraat', 'Op het stuitje', 'Onder de voeten'].map((p) => (
                        <li key={p} className="text-sm text-darkSlate/70 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-midGreen flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stap 4b */}
          <div className="relative bg-white rounded-2xl border-l-4 border-darkRed p-5 shadow">
            <div className="flex items-start gap-4 mb-4">
              <span className="font-salmon text-3xl text-darkRed/20 leading-none select-none flex-shrink-0">4b</span>
              <h2 className="font-salmon text-xl text-darkSlate">Spray dosering</h2>
            </div>
            <div className="flex flex-col gap-4 ml-2">
              <div>
                <p className="text-sm font-semibold text-darkSlate mb-1">1 olie of een combinatie?</p>
                <ul className="flex flex-col gap-1 ml-2">
                  <li className="text-sm text-darkSlate/70">Basis: water met wat toverhazelaar, of (indien niet op de huid gebruikt) alcohol/vodka.</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-darkSlate mb-2">Hoeveel druppels per 100 ml?</p>
                <div className="bg-midGreen/10 rounded-xl p-4">
                  <p className="text-xs text-darkSlate/60 italic">Testresultaat biotensor invullen</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-darkSlate mb-2">Waarvoor gebruiken?</p>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-darkSlate/50 mb-2">Als roomspray</p>
                    <ul className="flex flex-col gap-1">
                      {['Slaapkamer', 'Werkplek', 'Badkamer', 'Woonkamer', 'Auto'].map((p) => (
                        <li key={p} className="text-sm text-darkSlate/70 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-midGreen flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-darkSlate/50 mb-2">Op het lichaam / textiel</p>
                    <ul className="flex flex-col gap-1">
                      {['Kussen / beddengoed', 'Kleding', 'Haar', 'Huid (gezicht / lichaam)', 'Voeten', 'Om je heen (aura spray)'].map((p) => (
                        <li key={p} className="text-sm text-darkSlate/70 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-midGreen flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <img src="/fotos/SprayflesYL.png" alt="Sprayfles Young Living" className="absolute bottom-3 right-3 hidden sm:block w-[15%] object-cover rounded-lg" />
          </div>

        </div>

        {/* Stap 5 */}
        <div className="bg-white rounded-2xl border-l-4 border-darkRed p-5 shadow">
          <div className="flex items-start gap-4 mb-4">
            <span className="font-salmon text-3xl text-darkRed/20 leading-none select-none flex-shrink-0">5</span>
            <h2 className="font-salmon text-xl text-darkSlate">Hoe vaak per dag?</h2>
          </div>
          <ul className="flex flex-col gap-2 ml-2">
            <li className="text-sm text-darkSlate/80">1, 2, 3, 4 keer per dag. Welk dagdeel?</li>
            <ul className="ml-4 flex flex-col gap-1 mt-1">
              <li className="text-sm text-darkSlate/70">Ochtend, hoe laat?</li>
              <li className="text-sm text-darkSlate/70">Middag, hoe laat?</li>
              <li className="text-sm text-darkSlate/70">Avond, hoe laat? Tot hoe laat maximaal?</li>
              <li className="text-sm text-darkSlate/70">Vlak voor bedtijd?</li>
            </ul>
          </ul>
          <div className="mt-4 bg-orange/10 rounded-xl px-4 py-3">
            <p className="text-xs text-darkSlate/80 leading-relaxed">
              <strong>Let op:</strong> Sommige oliën hebben een effect op je nachtrust, zowel positief (bijv. Cedarwood, Lavender) als negatief (bijv. Peppermint).
            </p>
          </div>
        </div>

        {/* Stap 6 */}
        <div className="bg-white rounded-2xl border-l-4 border-darkRed p-5 shadow">
          <div className="flex items-start gap-4 mb-4">
            <span className="font-salmon text-3xl text-darkRed/20 leading-none select-none flex-shrink-0">6</span>
            <h2 className="font-salmon text-xl text-darkSlate">Nog iets anders nodig?</h2>
          </div>
          <div className="flex flex-col gap-4 ml-2">
            <div>
              <p className="text-sm font-semibold text-darkSlate mb-1">Andere olie nodig?</p>
              <p className="text-sm text-darkSlate/70">Ga terug naar stap 1</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-darkSlate mb-1">Supplement?</p>
              <p className="text-sm text-darkSlate/70">Zie andere vragenlijst</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-darkSlate mb-1">Verdere ondersteuning</p>
              <ul className="flex flex-col gap-1 ml-2">
                {['Affirmatie?', 'Kaartje trekken?', 'Human Design?', 'Biotensor?', 'Vitaliteitstest?', 'Bodyscan?'].map((item) => (
                  <li key={item} className="text-sm text-darkSlate/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-midGreen flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-darkSlate mb-1">Overigen</p>
              <ul className="flex flex-col gap-1 ml-2">
                {['NEI-consult?', 'Human Design sessie?', 'Anders, nl...'].map((item) => (
                  <li key={item} className="text-sm text-darkSlate/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-midGreen flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-8 bg-midGreen/10 rounded-2xl p-5">
        <p className="text-sm text-darkSlate/80 leading-relaxed italic">
          💡 <strong>Tip:</strong> Weet je nog niet welke oliën je hebt of wilt proberen? Bekijk eerst{' '}
          <Link href="/olie/zoek" className="text-midGreen underline">welke olie past bij wat jij zoekt</Link>.
        </p>
      </div>
    </div>
  );
}
