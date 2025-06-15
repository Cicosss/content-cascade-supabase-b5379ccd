import React from 'react';
import { Link } from 'react-router-dom';
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
                <Link to="/partner" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Sei un'attività?
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
          <div className="flex space-x-3 mb-4 md:mb-0">
            <img 
              src="https://i.ibb.co/Lbvqk8V/Progetto-senza-titolo-5.png" 
              alt="Instagram" 
              className="w-10 h-10 object-cover cursor-pointer hover:scale-105 transition-transform duration-300" 
            />
            <img 
              src="https://i.ibb.co/3ythJs2P/Progetto-senza-titolo-4.png" 
              alt="Progetto-senza-titolo-4" 
              className="w-10 h-10 object-cover cursor-pointer hover:scale-105 transition-transform duration-300" 
            />
            <img 
              src="https://i.ibb.co/BHdw3VJd/Progetto-senza-titolo.png" 
              alt="LinkedIn" 
              className="w-10 h-10 object-cover cursor-pointer hover:scale-105 transition-transform duration-300" 
            />
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
