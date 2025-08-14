
import React from 'react';
import { Link } from 'react-router-dom';
import MiaRomagnaLogo from './MiaRomagnaLogo';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white py-16 mt-16 overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-orange-400 rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-orange-500/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-blue-400 rotate-12"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* STAGIONI */}
          <div className="group">
            <h3 className="text-xl font-bold mb-6 text-white tracking-wide">
              STAGIONI
              <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-red-500 mt-2 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/primavera" className="text-slate-300 hover:text-orange-400 transition-all duration-300 text-sm font-medium hover:pl-2 block group/link">
                  <span className="relative">
                    Vacanze in primavera
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-orange-400 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/estate" className="text-slate-300 hover:text-orange-400 transition-all duration-300 text-sm font-medium hover:pl-2 block group/link">
                  <span className="relative">
                    Vacanze in estate
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-orange-400 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/inverno" className="text-slate-300 hover:text-orange-400 transition-all duration-300 text-sm font-medium hover:pl-2 block group/link">
                  <span className="relative">
                    Vacanze in inverno
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-orange-400 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/respiro-del-mare" className="text-slate-300 hover:text-orange-400 transition-all duration-300 text-sm font-medium hover:pl-2 block group/link">
                  <span className="relative">
                    Respiro del Mare
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-orange-400 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* INFO & SERVIZI */}
          <div className="group">
            <h3 className="text-xl font-bold mb-6 text-white tracking-wide">
              INFO & SERVIZI
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mt-2 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/stampa" className="text-slate-300 hover:text-blue-400 transition-all duration-300 text-sm font-medium hover:pl-2 block group/link">
                  <span className="relative">
                    Sezione stampa
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-blue-400 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/uffici-turistici" className="text-slate-300 hover:text-blue-400 transition-all duration-300 text-sm font-medium hover:pl-2 block group/link">
                  <span className="relative">
                    Uffici turistici
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-blue-400 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/chi-siamo" className="text-slate-300 hover:text-blue-400 transition-all duration-300 text-sm font-medium hover:pl-2 block group/link">
                  <span className="relative">
                    Chi siamo
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-blue-400 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/partner" className="text-slate-300 hover:text-blue-400 transition-all duration-300 text-sm font-medium hover:pl-2 block group/link">
                  <span className="relative">
                    Sei un'attività?
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-blue-400 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/webcams" className="text-slate-300 hover:text-blue-400 transition-all duration-300 text-sm font-medium hover:pl-2 block group/link">
                  <span className="relative">
                    Webcam Live
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-blue-400 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/promotore-territorio" className="text-slate-300 hover:text-blue-400 transition-all duration-300 text-sm font-medium hover:pl-2 block group/link">
                  <span className="relative">
                    Promotore del Territorio
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-blue-400 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* ALTRI SITI / LINK UTILI */}
          <div className="group">
            <h3 className="text-xl font-bold mb-6 text-white tracking-wide">
              ALTRI SITI / LINK UTILI
              <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mt-2 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-300 hover:text-green-400 transition-all duration-300 text-sm font-medium hover:pl-2 block group/link">
                  <span className="relative">
                    Booking Romagna
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-green-400 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-green-400 transition-all duration-300 text-sm font-medium hover:pl-2 block group/link">
                  <span className="relative">
                    Romagna Tree Agreement
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-green-400 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </a>
              </li>
              <li>
                <Link to="/archivio" className="text-slate-300 hover:text-green-400 transition-all duration-300 text-sm font-medium hover:pl-2 block group/link">
                  <span className="relative">
                    Archivio articoli
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-green-400 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media e Logo */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-slate-600/50">
          <div className="flex space-x-4 mb-6 md:mb-0">
            <div className="group relative">
              <img 
                src="https://i.ibb.co/Lbvqk8V/Progetto-senza-titolo-5.png" 
                alt="Instagram" 
                className="w-12 h-12 object-cover cursor-pointer transition-all duration-300 group-hover:scale-110 group-hover:brightness-125 rounded-lg" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
            </div>
            <div className="group relative">
              <img 
                src="https://i.ibb.co/3ythJs2P/Progetto-senza-titolo-4.png" 
                alt="Facebook" 
                className="w-12 h-12 object-cover cursor-pointer transition-all duration-300 group-hover:scale-110 group-hover:brightness-125 rounded-lg" 
              />
              <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
            </div>
            <div className="group relative">
              <img 
                src="https://i.ibb.co/BHdw3VJd/Progetto-senza-titolo.png" 
                alt="LinkedIn" 
                className="w-12 h-12 object-cover cursor-pointer transition-all duration-300 group-hover:scale-110 group-hover:brightness-125 rounded-lg" 
              />
              <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
            </div>
          </div>

          <div className="flex items-center space-x-3 group">
            <MiaRomagnaLogo width={120} height={40} />
            <span className="text-slate-300 text-base font-medium tracking-wide group-hover:text-orange-400 transition-colors duration-300">– made with love</span>
          </div>
        </div>

        {/* Copyright con Privacy Policy */}
        <div className="text-center text-slate-400 text-sm mt-8 pt-6 border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="font-medium">© 2024 Mia Romagna. Tutti i diritti riservati.</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <Link 
              to="/privacy-policy" 
              className="text-slate-300 hover:text-orange-400 transition-all duration-300 font-medium underline decoration-orange-400/0 hover:decoration-orange-400/100 underline-offset-4 decoration-2"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
