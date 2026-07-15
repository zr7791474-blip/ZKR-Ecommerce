import { LegalLayout } from '@/components/legal/legal-layout';

export const metadata = {
  title: 'Cookie Policy — ZKR E-Commerce',
  description: 'How ZKR E-Commerce uses cookies and similar technologies.',
};

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      updated="July 2026"
      intro="This Cookie Policy explains what cookies are, how ZKR E-Commerce uses them, and how you can control them."
      sections={[
        {
          heading: '1. What Are Cookies',
          body: (
            <p>Cookies are small text files stored on your device when you visit a website. They help the site remember information about your visit, like your preferences and login status.</p>
          ),
        },
        {
          heading: '2. Types of Cookies We Use',
          body: (
            <ul className="list-disc pl-5 space-y-1.5">
              <li><span className="text-foreground font-medium">Essential cookies</span> — required for core functionality like staying signed in and keeping items in your cart.</li>
              <li><span className="text-foreground font-medium">Preference cookies</span> — remember settings like your theme (light/dark) and currency.</li>
              <li><span className="text-foreground font-medium">Analytics cookies</span> — help us understand how visitors use our site so we can improve it.</li>
            </ul>
          ),
        },
        {
          heading: '3. Managing Cookies',
          body: (
            <p>Most browsers let you control cookies through their settings, including blocking or deleting them. Note that disabling essential cookies may affect core features like staying signed in or checking out.</p>
          ),
        },
        {
          heading: '4. Third-Party Cookies',
          body: (
            <p>Some cookies are set by third-party services we use, such as our payment processor (Stripe), to support secure checkout and fraud prevention.</p>
          ),
        },
        {
          heading: '5. Contact Us',
          body: (
            <p>If you have questions about our use of cookies, please <a href="/contact" className="text-primary hover:underline">contact our support team</a>.</p>
          ),
        },
      ]}
    />
  );
}
