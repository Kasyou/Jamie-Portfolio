import ScrollReveal from '../shared/ScrollReveal';

const reasons = [
  {
    emoji: '\u{1F680}',
    title: 'Speed',
    text: 'Ship a full MVP in days, not weeks. AI-accelerated without cutting corners.',
  },
  {
    emoji: '\u{1F3AF}',
    title: 'Breadth',
    text: 'React to STM32 registers. I connect dots across the entire tech spectrum.',
  },
  {
    emoji: '\u{1F4E6}',
    title: 'Ship to Users',
    text: "I don't stop at localhost. Live demos, APKs, EXEs — real deliverables.",
  },
  {
    emoji: '\u{1F9E0}',
    title: 'Deep Understanding',
    text: 'Custom linker scripts. Custom TCP protocol. I go deep when needed — with or without AI.',
  },
];

export default function WhyMeSection() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-3">
            Why Me
          </p>
          <h2 className="text-[36px] font-light tracking-[-1px] mb-16">
            Not just a coder — a <span className="text-frontend">builder</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-4 gap-5">
          {reasons.map((reason, i) => (
            <ScrollReveal key={reason.title} delay={i * 0.1}>
              <div className="bg-surface border border-border rounded-2xl p-7 text-center">
                <p className="text-3xl mb-3">{reason.emoji}</p>
                <h3 className="text-base font-medium text-text-primary mb-2">{reason.title}</h3>
                <p className="text-text-secondary text-xs leading-relaxed">{reason.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
