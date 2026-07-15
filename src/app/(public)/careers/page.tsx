import { Heart, Zap, Users, Mail } from 'lucide-react';

export const metadata = {
  title: 'Careers — ZKR E-Commerce',
  description: 'Join the team building a premium shopping experience at ZKR E-Commerce.',
};

const values = [
  { icon: Heart, title: 'Customer Obsessed', desc: 'We sweat the details because our customers notice them.' },
  { icon: Zap, title: 'Move Fast', desc: 'We ship, learn, and iterate quickly, without cutting corners on quality.' },
  { icon: Users, title: 'Built Together', desc: 'Great products come from small, empowered teams working closely together.' },
];

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Help Us Build the Future of Shopping
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
          We're a small team obsessed with making online shopping feel premium, fast, and effortless.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-14">
        {values.map((value) => (
          <div key={value.title} className="rounded-2xl border border-border/60 bg-card p-5 text-center">
            <div className="mx-auto w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
              <value.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{value.title}</h3>
            <p className="text-sm text-muted-foreground">{value.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-border/60 bg-secondary/40 p-8 md:p-10 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">No open roles right now</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          We're not actively hiring at the moment, but we're always happy to hear from people who love what we're building. Send us your resume and what you're interested in.
        </p>
        <a
          href="mailto:careers@zkrstore.com?subject=General%20Application"
          className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
        >
          <Mail className="w-4 h-4" />
          careers@zkrstore.com
        </a>
      </div>
    </div>
  );
}
