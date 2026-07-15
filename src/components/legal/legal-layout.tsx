type Section = { heading: string; body: React.ReactNode };

export function LegalLayout({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro?: string;
  sections: Section[];
}) {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
        {intro && <p className="text-muted-foreground mt-4 leading-relaxed">{intro}</p>}
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-semibold text-foreground mb-2">{section.heading}</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">{section.body}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
