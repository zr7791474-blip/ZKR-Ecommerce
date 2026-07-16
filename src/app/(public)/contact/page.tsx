'use client';

import { useState } from 'react';
import { Mail, Send, Loader2, MessageCircle } from 'lucide-react';
import { SiX, SiWhatsapp, SiGithub } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const socialContacts = [
  {
    label: 'X (Twitter)',
    href: 'https://x.com/zkr_ad',
    icon: SiX,
    value: '@zkr_ad',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/212657516301',
    icon: SiWhatsapp,
    value: '+212 657 516 301',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/zr7791474-blip',
    icon: SiGithub,
    value: 'zr7791474-blip',
  },
  {
    label: 'Email',
    href: 'mailto:zr7791474@gmail.com?subject=Project%20Inquiry&body=Hello%20Zakaria,%0A%0AI%20would%20like%20to%20contact%20you%20regarding...',
    icon: Mail,
    value: 'zr7791474@gmail.com',
  },
];

const inputClass =
  'w-full h-11 px-4 rounded-xl bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary/40 transition-all text-sm';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Could not send your message. Please try again.');
        return;
      }

      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch {
      setError('Could not send your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative container mx-auto px-4 py-16 md:py-20 overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-primary/[0.06] blur-[120px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto text-center mb-14">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
          <MessageCircle className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
          Get in Touch
        </h1>
        <p className="text-lg text-muted-foreground">
          Have a question or feedback? We'd love to hear from you — reach out however's easiest.
        </p>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {/* Contact Info */}
        <div className="lg:col-span-1">
          <Card className="border-border/60 h-full">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-1">Contact Us Directly</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Pick whichever works best for you.
              </p>

              <div className="space-y-1.5">
                {socialContacts.map((contact) => (
                  <a
                    key={contact.label}
                    href={contact.href}
                    target={contact.label !== 'Email' ? '_blank' : undefined}
                    rel={contact.label !== 'Email' ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-glow">
                      <contact.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{contact.label}</p>
                      <p className="text-sm text-muted-foreground truncate">{contact.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="border-border/60">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {isSuccess && (
                  <div className="p-4 rounded-xl bg-success/10 text-success border border-success/20 text-sm">
                    Message sent successfully! We'll get back to you soon.
                  </div>
                )}
                {error && (
                  <div className="p-4 rounded-xl bg-accent/10 text-accent border border-accent/20 text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputClass}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClass}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={inputClass}
                    placeholder="How can we help?"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary/40 transition-all resize-none text-sm"
                    placeholder="Tell us more..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
