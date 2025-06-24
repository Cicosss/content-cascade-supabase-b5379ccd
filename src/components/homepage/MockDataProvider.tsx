
import React from 'react';

// Mock data provider component to centralize all the static data
export const useHomepageData = () => {
  // Eventi più specifici e dettagliati basati sui documenti
  const events = [
    {
      title: "Notte Rosa 2024 - Il Rosa che Accende l'Estate",
      date: "6 Luglio 2024",
      time: "21:00 - 06:00",
      location: "Riviera Romagnola",
      category: "Festival Storico",
      image: "🌹 Notte Rosa"
    },
    {
      title: "Festival Internazionale della Piadina Romagnola IGP",
      date: "12-14 Luglio 2024",
      time: "10:00 - 24:00",
      location: "Piazza Cavour, Rimini",
      category: "Tradizione Culinaria",
      image: "🥟 Festival Piadina"
    },
    {
      title: "Vetrina delle Eccellenze del Territorio Romagnolo",
      date: "20 Luglio 2024",
      time: "18:00 - 23:00",
      location: "Centro Congressi Rimini Fiera",
      category: "Evento Mia Romagna",
      image: "🏆 Eccellenze"
    },
    {
      title: "Podcast Mia Romagna Live - Storie del Territorio",
      date: "Ogni Venerdì",
      time: "20:00 - 21:30",
      location: "Streaming + Location Esclusiva",
      category: "Cultura Digitale",
      image: "🎙️ Podcast Live"
    },
    {
      title: "Sagra del Brodetto alla Marinara",
      date: "27-29 Luglio 2024",
      time: "19:00 - 24:00",
      location: "Porto Canale, Cesenatico",
      category: "Tradizione Marinara",
      image: "🐟 Brodetto"
    }
  ];

  // Ristoranti e tradizione culinaria più approfonditi
  const restaurants = [
    {
      name: "Osteria del Borgo Antico",
      cuisine: "Tradizione Culinaria Romagnola Autentica",
      rating: 4.9,
      priceRange: "€€€",
      location: "Centro Storico di Rimini",
      image: "🍝 Borgo Antico",
      specialty: "Cappelletti in brodo di cappone della nonna Maria"
    },
    {
      name: "La Vera Piadineria Artigianale dal 1952",
      cuisine: "Street Food Romagnolo Tradizionale",
      rating: 4.8,
      priceRange: "€",
      location: "Borgo San Giuliano",
      image: "🥟 Piadineria 1952",
      specialty: "Piadina sfogliata con squacquerone DOP e rucola selvatica"
    },
    {
      name: "Il Pescatore del Porto Antico",
      cuisine: "Pesce Fresco dell'Adriatico",
      rating: 4.7,
      priceRange: "€€€€",
      location: "Porto Canale di Cesenatico",
      image: "🐟 Pescatore",
      specialty: "Brodetto di pesce secondo la ricetta marinara tradizionale"
    },
    {
      name: "Agriturismo Terre di Romagna Bio",
      cuisine: "Km Zero e Agricoltura Sostenibile",
      rating: 4.6,
      priceRange: "€€",
      location: "Colline dell'Entroterra Riminese",
      image: "🌾 Terre Bio",
      specialty: "Passatelli in brodo con erbe spontanee dell'Appennino"
    },
    {
      name: "Trattoria del Mare e Monti",
      cuisine: "Fusion Romagnola Contemporanea",
      rating: 4.8,
      priceRange: "€€€",
      location: "Santarcangelo di Romagna",
      image: "🏔️ Mare Monti",
      specialty: "Tortelloni di ricotta e spinaci con ragù di cinghiale"
    }
  ];

  // Esperienze del territorio unificate
  const territoryExperiences = [
    {
      id: 'tour-tempio-malatestiano',
      name: "Tour Guidato Tempio Malatestiano - Capolavoro Rinascimentale",
      title: "Tour Guidato Tempio Malatestiano - Capolavoro Rinascimentale",
      image: "🏛️ Tempio Malatestiano",
      rating: 4.9,
      duration: "2h",
      groupSize: "Max 15 persone",
      price: "€18",
      category: "Patrimonio UNESCO"
    },
    {
      id: 'laboratorio-ceramica-faentina',
      name: "Laboratorio di Ceramica Faentina - Arte Millenaria",
      title: "Laboratorio di Ceramica Faentina - Arte Millenaria",
      image: "🏺 Ceramica Faenza",
      rating: 4.8,
      duration: "3h",
      groupSize: "Max 8 persone",
      price: "€35",
      category: "Tradizione Artigianale"
    },
    {
      id: 'escursione-trabaccolo-storico',
      name: "Escursione in Barca Tradizionale - Trabaccolo Storico",
      title: "Escursione in Barca Tradizionale - Trabaccolo Storico",
      image: "⛵ Trabaccolo",
      rating: 4.7,
      duration: "4h",
      groupSize: "Max 12 persone",
      price: "€45",
      category: "Tradizione Marinara"
    },
    {
      id: 'corso-vela-base',
      name: "Corso di Vela Base - Scuola Nautica Certificata",
      title: "Corso di Vela Base - Scuola Nautica Certificata",
      image: "⛵ Corso Vela",
      rating: 4.9,
      duration: "6h",
      groupSize: "Max 8 persone",
      price: "€85",
      category: "Sport Acquatici"
    },
    {
      id: 'trekking-unesco-san-leo',
      name: "Trekking Patrimonio UNESCO - San Leo e San Marino",
      title: "Trekking Patrimonio UNESCO - San Leo e San Marino",
      image: "🥾 Trekking UNESCO",
      rating: 4.8,
      duration: "6h",
      groupSize: "Max 10 persone",
      price: "€40",
      category: "Natura e Storia"
    },
    {
      id: 'immersione-relitti-adriatico',
      name: "Immersione Guidata - Relitti dell'Adriatico",
      title: "Immersione Guidata - Relitti dell'Adriatico",
      image: "🤿 Diving",
      rating: 4.8,
      duration: "4h",
      groupSize: "Max 6 persone",
      price: "€65",
      category: "Subacquea"
    },
    {
      id: 'grotte-onferno',
      name: "Visita alle Grotte di Onferno - Meraviglia Sotterranea",
      title: "Visita alle Grotte di Onferno - Meraviglia Sotterranea",
      image: "🦇 Grotte Onferno",
      rating: 4.6,
      duration: "2.5h",
      groupSize: "Max 20 persone",
      price: "€22",
      category: "Natura Selvaggia"
    },
    {
      id: 'kayak-costa-adriatica',
      name: "Escursione in Kayak - Costa Adriatica",
      title: "Escursione in Kayak - Costa Adriatica",
      image: "🚣 Kayak",
      rating: 4.7,
      duration: "3h",
      groupSize: "Max 10 persone",
      price: "€35",
      category: "Eco-turismo"
    }
  ];

  // Attività per famiglie
  const familyExperiences = [
    {
      id: 'parco-avventura-famiglia-index',
      name: "Parco Avventura Famiglia - Percorsi Acrobatici",
      title: "Parco Avventura Famiglia - Percorsi Acrobatici",
      image: "🌳 Parco Avventura",
      rating: 4.8,
      duration: "4h",
      groupSize: "Famiglie (età 4+)",
      price: "€25",
      category: "Avventura Outdoor"
    },
    {
      id: 'laboratorio-ceramisti-index',
      name: "Laboratorio Didattico - Piccoli Ceramisti",
      title: "Laboratorio Didattico - Piccoli Ceramisti",
      image: "👨‍👩‍👧‍👦 Lab Ceramica",
      rating: 4.9,
      duration: "2h",
      groupSize: "Famiglie (età 5+)",
      price: "€18",
      category: "Arte e Creatività"
    },
    {
      id: 'mini-crociera-delfini',
      name: "Mini Crociera per Bambini - Alla Scoperta dei Delfini",
      title: "Mini Crociera per Bambini - Alla Scoperta dei Delfini",
      image: "🐬 Mini Crociera",
      rating: 4.7,
      duration: "2.5h",
      groupSize: "Famiglie",
      price: "€20",
      category: "Esperienza Marina"
    },
    {
      id: 'caccia-tesoro-territorio',
      name: "Caccia al Tesoro del Territorio - Avventura Educativa",
      title: "Caccia al Tesoro del Territorio - Avventura Educativa",
      image: "🗺️ Caccia Tesoro",
      rating: 4.8,
      duration: "3h",
      groupSize: "Max 6 famiglie",
      price: "€28",
      category: "Gioco Educativo"
    },
    {
      id: 'fattoria-didattica-index',
      name: "Fattoria Didattica Bio - Vita Contadina",
      title: "Fattoria Didattica Bio - Vita Contadina",
      image: "🐄 Fattoria Bio",
      rating: 4.6,
      duration: "4h",
      groupSize: "Famiglie",
      price: "€22",
      category: "Natura e Animali"
    }
  ];

  const services = [
    { icon: 'Car', label: 'Taxi', desc: 'Chiama un taxi' },
    { icon: 'Zap', label: 'Ricarica EV', desc: 'Stazioni di ricarica' },
    { icon: 'ParkingCircle', label: 'Parcheggi', desc: 'Trova parcheggio' },
  ];

  return {
    events,
    restaurants,
    territoryExperiences,
    familyExperiences,
    services
  };
};
