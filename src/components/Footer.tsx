
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* STAGIONI */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-200">STAGIONI</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/primavera" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Vacanze in primavera
                </Link>
              </li>
              <li>
                <Link to="/estate" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Vacanze in estate
                </Link>
              </li>
              <li>
                <Link to="/inverno" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Vacanze in inverno
                </Link>
              </li>
            </ul>
          </div>

          {/* INFO & SERVIZI */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-200">INFO & SERVIZI</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/stampa" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Sezione stampa
                </Link>
              </li>
              <li>
                <Link to="/uffici-turistici" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Uffici turistici
                </Link>
              </li>
              <li>
                <Link to="/meeting" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Meeting
                </Link>
              </li>
              <li>
                <Link to="/romagna-for-trade" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Romagna for trade
                </Link>
              </li>
              <li>
                <Link to="/chi-siamo" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Chi siamo
                </Link>
              </li>
              <li>
                <Link to="/operatori" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Operatori
                </Link>
              </li>
              <li>
                <a href="mailto:info@miaromagna.it" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Scrivi al webmaster
                </a>
              </li>
              <li>
                <Link to="/promotore-territorio" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Promotore del Territorio
                </Link>
              </li>
            </ul>
          </div>

          {/* ALTRI SITI / LINK UTILI */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-200">ALTRI SITI / LINK UTILI</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  I Suoni delle Dolomiti
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Il Festival dell'Economia
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Romagnadoc Festival
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Il Festival dello Sport
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Webcam Romagna
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Booking Romagna
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Romagna Tree Agreement
                </a>
              </li>
              <li>
                <Link to="/archivio" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Archivio articoli
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media e Logo */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-700">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.013C24.007 5.367 18.641.001.017 0z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Youtube className="h-6 w-6" />
            </a>
          </div>

          <div className="flex items-center">
            <div className="text-lg font-semibold text-white">
              Mia Romagna – made with love
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-slate-500 text-xs mt-6 pt-4 border-t border-slate-700">
          © 2024 Mia Romagna. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
