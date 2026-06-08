import { SectionHeading } from "@/components/site/SectionHeading";
import { SignalLine } from "@/components/site/SignalLine";
import { PillButton } from "@/components/site/PillButton";
import { Reveal } from "@/components/site/Reveal";

const swatches = [
  ["ink", "#000000"],
  ["surface-1", "#0b0b0c"],
  ["surface-2", "#151517"],
  ["surface-3", "#202023"],
  ["line", "#272727"],
  ["cream", "#f5f5f0"],
  ["bone", "#cfcfc9"],
  ["smoke", "#9a9a93"],
];

export default function Styleguide() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone">
        Sistema de diseño · VBT
      </p>

      <h1 className="mt-6 font-serif text-[clamp(2.5rem,8vw,6rem)] font-normal leading-[0.98] tracking-[-0.03em]">
        Estrategia, cumplimiento <span className="italic text-bone">y crecimiento.</span>
      </h1>

      <SignalLine className="mt-10 w-40" />

      <section className="mt-20">
        <SectionHeading
          eyebrow="Tipografía"
          index="01"
          title="Serif Playfair para titulares, Inter para cuerpo"
          lead="Jerarquía por escala y contraste, no por color. Achromático estricto sobre negro."
        />
        <div className="mt-10 space-y-3 text-bone">
          <p className="font-serif text-3xl text-chalk">Playfair Display · titular display</p>
          <p className="text-lg text-bone">Inter regular · cuerpo de texto legible y neutro.</p>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-smoke">
            IBM Plex Mono · eyebrow / labels
          </p>
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading eyebrow="Botones" index="02" title="Acciones" rule={false} />
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <PillButton href="#" variant="primary" arrow>
            Agendar consulta
          </PillButton>
          <PillButton href="#" variant="ghost" arrow>
            Conocer servicios
          </PillButton>
          <PillButton href="#" variant="inverted">
            Secundario
          </PillButton>
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading eyebrow="Color" index="03" title="Paleta achromática" rule={false} />
        <Reveal className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {swatches.map(([name, hex]) => (
            <div key={name} className="card-elev rounded-xl p-4">
              <div
                className="h-16 w-full rounded-lg border border-line"
                style={{ background: hex }}
              />
              <p className="mt-3 font-mono text-xs text-chalk">{name}</p>
              <p className="font-mono text-[10px] text-smoke">{hex}</p>
            </div>
          ))}
        </Reveal>
      </section>
    </main>
  );
}
