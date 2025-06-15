import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Eye, Clock } from 'lucide-react';

const Webcams = () => {
  // Dati placeholder per le webcam - sostituiremo con i tuoi codici HTML
  const webcams = [
    {
      id: 1,
      name: "Rimini",
      location: "Viserbella di Rimini",
      description: "Veduta sulla spiaggia e sul lungomare di Viserbella di Rimini",
      category: "Spiaggia",
      isLive: true,
      viewers: 245,
      // Qui inseriremo il tuo codice HTML per ogni webcam
      htmlCode: `<a href="https://www.skylinewebcams.com/it/webcam/italia/emilia-romagna/rimini/rimini.html" target="_blank"><img src="https://embed.skylinewebcams.com/img/598.jpg" alt="【LIVE】 Rimini | SkylineWebcams"></a>`
    },
    {
      id: 2,
      name: "Bellaria-Igea Marina",
      location: "Lidi",
      description: "Veduta della spiaggia e del mare di Rimini",
      category: "Spiaggia",
      isLive: true,
      viewers: 312,
      htmlCode: `<a href="https://www.skylinewebcams.com/it/webcam/italia/emilia-romagna/rimini/bellaria-igea-marina.html" target="_blank"><img src="https://embed.skylinewebcams.com/img/1058.jpg" alt="【LIVE】 Bellaria-Igea Marina | SkylineWebcams"></a>`
    },
    {
      id: 3,
      name: "Parco acquatico di Rimini",
      location: "Parco acquatico",
      description: "Veduta della località turistica di Bellaria-Igea Marina",
      category: "Spiaggia",
      isLive: true,
      viewers: 189,
      htmlCode: `<a href="https://www.skylinewebcams.com/it/webcam/italia/emilia-romagna/rimini/parco-acquatico-rimini.html" target="_blank"><img src="https://embed.skylinewebcams.com/img/704.jpg" alt="【LIVE】 Parco acquatico di Rimini | SkylineWebcams"></a>`
    },
    {
      id: 4,
      name: "Miramare di Rimini",
      location: "spiaggia di Miramare di Rimini",
      description: "Veduta sulla spiaggia di Miramare di Rimini",
      category: "Spiaggia",
      isLive: true,
      viewers: 278,
      htmlCode: `<a href="https://www.skylinewebcams.com/it/webcam/italia/emilia-romagna/rimini/miramare-di-rimini.html" target="_blank"><img src="https://embed.skylinewebcams.com/img/2886.jpg" alt="【LIVE】 Miramare di Rimini | SkylineWebcams"></a>`
    },
    {
      id: 5,
      name: "Rimini - Torre Pedrera",
      location: "Rimini",
      description: "Rimini, veduta sulla spiaggia del borgo marinaro di Torre Pedrera",
      category: "Mare",
      isLive: true,
      viewers: 156,
      htmlCode: `<a href="https://www.skylinewebcams.com/it/webcam/italia/emilia-romagna/rimini/torre-pedrera.html" target="_blank"><img src="https://embed.skylinewebcams.com/img/3668.jpg" alt="【LIVE】 Rimini - Torre Pedrera | SkylineWebcams"></a>`
    },
    {
      id: 6,
      name: "Riccione - MaranoBeach Live webcam",
      location: "Riccione",
      description: "Vista sulla Spiaggia dei Bimbi Allegri",
      category: "Spiaggia",
      isLive: true,
      viewers: 203,
      htmlCode: `<a href="https://www.skylinewebcams.com/it/webcam/italia/emilia-romagna/rimini/riccione-maranobeach.html" target="_blank"><img src="https://embed.skylinewebcams.com/img/446.jpg" alt="【LIVE】 Riccione - MaranoBeach | SkylineWebcams"></a>`
    },
    {
      id: 7,
      name: "Cattolica",
      location: "Centro di Cattolica",
      description: "Veduta della Fontana delle Sirene a Cattolica",
      category: "Centro Storico",
      isLive: true,
      viewers: 198,
      htmlCode: `<a href="https://www.skylinewebcams.com/it/webcam/italia/emilia-romagna/rimini/cattolica.html" target="_blank"><img src="https://embed.skylinewebcams.com/img/1375.jpg" alt="【LIVE】 Cattolica | SkylineWebcams"></a>`
    },
    {
      id: 8,
      name: "Misano Adriatico",
      location: "Spiaggia Misano Adriatico",
      description: "Veduta della spiaggia nella zona centrale di Misano Adriatico",
      category: "Spiaggia",
      isLive: true,
      viewers: 267,
      htmlCode: `<a href="https://www.skylinewebcams.com/it/webcam/italia/emilia-romagna/rimini/misano-adriatico-rimini.html" target="_blank"><img src="https://embed.skylinewebcams.com/img/2975.jpg" alt="【LIVE】 Misano Adriatico - Rimini | SkylineWebcams"></a>`
    },
    {
      id: 9,
      name: "Misano Adriatico",
      location: "piaggia nella zona sud",
      description: "Misano Adriatico, veduta della spiaggia nella zona sud, sullo sfondo Gabicce Monte",
      category: "Spiaggia",
      isLive: true,
      viewers: 342,
      htmlCode: `<a href="https://www.skylinewebcams.com/it/webcam/italia/emilia-romagna/rimini/misano-adriatico.html" target="_blank"><img src="https://embed.skylinewebcams.com/img/2976.jpg" alt="【LIVE】 Rimini - Misano Adriatico | SkylineWebcams"></a>`
    },
    {
      id: 10,
      name: "Spiaggia di Riccione",
      location: "Spiaggia di Riccione",
      description: "Veduta sulla spiaggia di Riccione",
      category: "Spiaggia",
      isLive: true,
      viewers: 156,
      htmlCode: `<a href="https://www.skylinewebcams.com/it/webcam/italia/emilia-romagna/rimini/spiaggia-di-riccione-rimini.html" target="_blank"><img src="https://embed.skylinewebcams.com/img/2380.jpg" alt="【LIVE】 Spiaggia di Riccione - Rimini | SkylineWebcams"></a>`
    },
    {
      id: 11,
      name: "Spiaggia di Cattolica",
      location: "Spiaggia di Cattolica",
      description: "Veduta panoramica sulla spiaggia centrale di Cattolica",
      category: "Mare",
      isLive: true,
      viewers: 89,
      htmlCode: `<a href="https://www.skylinewebcams.com/it/webcam/italia/emilia-romagna/rimini/spiaggia-di-cattolica.html" target="_blank"><img src="https://embed.skylinewebcams.com/img/1703.jpg" alt="【LIVE】 Spiaggia di Cattolica | SkylineWebcams"></a>`
    },
    {
      id: 12,
      name: "Cattolica",
      location: "Piazza I Maggio",
      description: "Veduta su Piazza I Maggio con le Fontane Danzanti, sullo sfondo Viale Bovio, ideale per lo shopping",
      category: "Centro Storico",
      isLive: true,
      viewers: 134,
      htmlCode: `<a href="https://www.skylinewebcams.com/it/webcam/italia/emilia-romagna/rimini/cattolica-rimini.html" target="_blank"><img src="https://embed.skylinewebcams.com/img/2900.jpg" alt="【LIVE】 Cattolica - Rimini | SkylineWebcams"></a>`
    },
    {
      id: 13,
      name: "Porto di Cattolica",
      location: "Porto Storico",
      description: "Veduta della darsena e della zona porto di Cattolica",
      category: "Centro Storico",
      isLive: true,
      viewers: 167,
      htmlCode: `<a href="https://www.skylinewebcams.com/it/webcam/italia/emilia-romagna/rimini/porto-di-cattolica.html" target="_blank"><img src="https://embed.skylinewebcams.com/img/1732.jpg" alt="【LIVE】 Porto di Cattolica | SkylineWebcams"></a>`
    },
    {
      id: 14,
      name: "Riccione",
      location: "Piazzale San Martino",
      description: "Veduta di Piazzale San Martino e della spiaggia di Riccione",
      category: "Spiaggia",
      isLive: true,
      viewers: 223,
      htmlCode: `<a href="https://www.skylinewebcams.com/it/webcam/italia/emilia-romagna/rimini/piazzale-san-martino-riccione.html" target="_blank"><img src="https://embed.skylinewebcams.com/img/1678.jpg" alt="【LIVE】 Piazzale San Martino - Riccione | SkylineWebcams"></a>`
    },
    {
      id: 15,
      name: "Cattolica",
      location: "Spiaggia di Cattolica",
      description: "Veduta della spiaggia nella zona centrale di Cattolica, Misano Adriatico e Riccione sullo sfondo",
      category: "Centro Storico",
      isLive: true,
      viewers: 145,
      htmlCode: `<a href="https://www.skylinewebcams.com/it/webcam/italia/emilia-romagna/rimini/spiaggia-di-cattolica-rimini.html" target="_blank"><img src="https://embed.skylinewebcams.com/img/2901.jpg" alt="【LIVE】 Spiaggia di Cattolica - Rimini | SkylineWebcams"></a>`
    }
  ];

  const categories = ["Tutti", "Spiaggia", "Centro Storico", "Mare"];
  const [selectedCategory, setSelectedCategory] = React.useState("Tutti");

  const filteredWebcams = selectedCategory === "Tutti" 
    ? webcams 
    : webcams.filter(webcam => webcam.category === selectedCategory);

  return (
    <Layout showSidebar>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        {/* Hero Section */}
        <div 
          className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
          style={{
            backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(30, 58, 138, 0.8)), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="container mx-auto px-6 text-center text-white relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Webcam Live della Romagna
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light leading-relaxed opacity-90">
                Esplora la bellezza della Romagna in tempo reale attraverso le nostre webcam live. 
                Dalle spiagge alle città d'arte, scopri cosa succede ora nei luoghi più belli della regione.
              </p>
              
              {/* Powered By Section nella Hero - Aligned Right */}
              <div className="flex justify-end">
                <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-2xl">
                  <img 
                    src="https://i.ibb.co/t6p6c0F/Powered-by.png" 
                    alt="Powered-by" 
                    className="h-14 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          {/* Category Filter */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap gap-2 bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-slate-300/70 shadow-sm">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 border-2 ${
                    selectedCategory === category
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg hover:bg-slate-800'
                      : 'text-slate-700 bg-white/80 border-slate-400 hover:bg-white hover:border-slate-500 hover:text-slate-900'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">{filteredWebcams.length} webcam live attive</span>
            </div>
          </div>

          {/* Webcams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {filteredWebcams.map((webcam) => (
              <Card key={webcam.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-slate-200/60 group">
                {/* Webcam Video Container */}
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  {/* Placeholder for HTML code - sostituirai questo con il tuo codice */}
                  <div 
                    dangerouslySetInnerHTML={{ __html: webcam.htmlCode }}
                    className="w-full h-full"
                  />
                  
                  {/* Live Badge - Unified Style */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-lg">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>

                  {/* Category Badge - Unified Style with Brand Colors */}
                  <div className="absolute top-3 right-3 bg-slate-900 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-lg">
                    {webcam.category}
                  </div>

                  {/* Viewers Count */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-md text-xs backdrop-blur-sm">
                    <Eye className="h-3 w-3" />
                    {webcam.viewers}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {webcam.name}
                  </h3>
                  
                  <div className="flex items-start gap-2 text-sm text-slate-600 mb-3">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-400" />
                    <span className="leading-relaxed">{webcam.location}</span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {webcam.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      Aggiornato ora
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Eye className="h-3 w-3" />
                      {webcam.viewers} spettatori
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/60">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Webcam Live 24/7
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Le nostre webcam sono attive 24 ore su 24, 7 giorni su 7. Puoi vedere in tempo reale 
                  le condizioni meteorologiche, l'affluenza nelle spiagge e la bellezza dei paesaggi romagnoli. 
                  Perfetto per pianificare la tua visita o semplicemente per ammirare la Romagna da casa.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">16</div>
                    <div className="text-sm text-slate-600">Webcam Attive</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
                    <div className="text-sm text-slate-600">Streaming Live</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">HD</div>
                    <div className="text-sm text-slate-600">Qualità Video</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Webcams;
