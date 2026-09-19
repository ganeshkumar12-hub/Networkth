import React from 'react';
import { Sparkles, Twitter, Github, Linkedin, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold tracking-wider text-xl font-mono text-white">
                NETWORKTH
              </span>
            </div>
            <p className="text-slate-300 font-medium text-sm leading-relaxed max-w-sm mb-4">
              “Discover the right people.
              <br />
              Build meaningful connections.
              <br />
              Create real opportunities.”
            </p>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-6">
              Networkth solves the fragmented discovery problem across LinkedIn, Instagram, WhatsApp groups, college clubs, events, and personal networks.
            </p>
            <div className="flex items-center space-x-3 text-slate-400">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://networkth.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Website"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links Column 1 */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('discover')}
                  className="hover:text-white transition-colors"
                >
                  Discover Directory
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('communities')}
                  className="hover:text-white transition-colors"
                >
                  Communities
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-white transition-colors"
                >
                  User Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Core Networks Column */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Core Networks
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('students')}
                  className="hover:text-white transition-colors"
                >
                  For Students
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('startups')}
                  className="hover:text-white transition-colors"
                >
                  For Startups & Founders
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('creators')}
                  className="hover:text-white transition-colors"
                >
                  For Creators & Brands
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('discover')}
                  className="hover:text-white transition-colors"
                >
                  Mentorship Network
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About Networkth
                </button>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Contact Networkth Team: partnerships@networkth.com');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Contact & Support
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Networkth Privacy Policy: We prioritize member privacy and verifiable discovery.');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Networkth Terms of Service: Collaborative and respectful professional networking.');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Networkth. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for meaningful professional discovery without the noise.
          </p>
        </div>
      </div>
    </footer>
  );
};
