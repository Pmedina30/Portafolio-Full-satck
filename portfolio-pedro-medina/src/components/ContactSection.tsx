import React, { useState } from 'react';
import { SpotlightCard } from './SpotlightCard';
import { PERSONAL_INFO, SOCIAL_LINKS } from '../data/portfolioData';
import { Mail, Phone, MapPin, Send, Check, Copy, ExternalLink, Github, Linkedin, Layers, MessageSquare } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
    // Open default email client with prepopulated body
    const mailto = `mailto:${PERSONAL_INFO.email}?subject=Contact%20from%20Portfolio%20-%20${encodeURIComponent(formData.name)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailto;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const getSocialIcon = (name: string) => {
    switch (name) {
      case 'GitHub':
        return <Github className="w-4 h-4" />;
      case 'LinkedIn':
        return <Linkedin className="w-4 h-4" />;
      case 'Behance':
        return <Layers className="w-4 h-4" />;
      case 'Email':
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <section id="contact" className="py-24 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Get in Touch</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
          Let's Build Something Exceptional
        </h2>
        <p className="text-sm text-neutral-400">
          Interested in discussing a full stack project, data analytics opportunity, or engineering consultation? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Contact Info & Direct Links (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <SpotlightCard glowColor="purple" className="p-6 h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Contact Information</h3>
                <p className="text-xs text-neutral-400">
                  Direct channels for recruitment and engineering collaboration.
                </p>
              </div>

              <div className="space-y-4">
                {/* Email with copy button */}
                <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] text-neutral-500 uppercase font-bold block">Email</span>
                      <a href={`mailto:${PERSONAL_INFO.email}`} className="text-xs font-mono text-neutral-200 hover:text-white truncate block">
                        {PERSONAL_INFO.email}
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition flex-shrink-0"
                    title="Copiar email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Phone */}
                <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Phone / WhatsApp</span>
                    <a href="tel:+18292760195" className="text-xs font-mono text-neutral-200 hover:text-white">
                      {PERSONAL_INFO.phone}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Location</span>
                    <span className="text-xs text-neutral-200">
                      {PERSONAL_INFO.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Row */}
            <div className="pt-6 border-t border-neutral-800/80 mt-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                Professional Networks
              </span>
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition shadow-xs"
                    title={link.name}
                  >
                    {getSocialIcon(link.name)}
                  </a>
                ))}
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Right: Functional Message Form (7 cols) */}
        <div className="md:col-span-7">
          <SpotlightCard glowColor="blue" className="p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white mb-2">Send a Direct Message</h3>
            <p className="text-xs text-neutral-400 mb-6">
              Fill out the details below and I'll respond within 24 business hours.
            </p>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Message Ready to Send!</h4>
                <p className="text-xs text-neutral-300 max-w-md mx-auto">
                  Your mail client has been opened with your message. If it didn't open automatically, feel free to email directly at <strong className="text-white font-mono">{PERSONAL_INFO.email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs font-semibold text-emerald-400 underline pt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full text-xs bg-neutral-900/90 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="s.jenkins@company.com"
                    className="w-full text-xs bg-neutral-900/90 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Project Scope / Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Describe your inquiry, project requirements, or opportunity..."
                    className="w-full text-xs bg-neutral-900/90 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 transition shadow-lg shadow-white/10 active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message via Email Client</span>
                </button>
              </form>
            )}
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};

