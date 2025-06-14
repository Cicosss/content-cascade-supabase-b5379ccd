import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Twitter } from 'lucide-react';
import MiaRomagnaLogo from './MiaRomagnaLogo';

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
                <Link to="/webcams" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Webcam Live
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
            {/* Facebook */}
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:scale-105 transform transition-transform duration-300 cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            {/* Instagram */}
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-full flex items-center justify-center hover:scale-105 transform transition-transform duration-300 cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.204.013-3.583.07-4.849-.149-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            {/* YouTube */}
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:scale-105 transform transition-transform duration-300 cursor-pointer">
              <Youtube className="h-5 w-5 text-white" />
            </div>
            {/* Twitter */}
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:scale-105 transform transition-transform duration-300 cursor-pointer">
              <Twitter className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <MiaRomagnaLogo width={100} height={33} />
            <span className="text-slate-400 text-sm">– made with love</span>
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
