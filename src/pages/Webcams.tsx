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
      name: "Milano Marittima - Cervia",
      location: "Spiaggia di Milano Marittima",
      description: "Veduta della spiaggia di Milano Marittima",
      category: "Spiaggia",
      isLive: true,
      viewers: 278,
      htmlCode: `<div class="webcam-placeholder bg-gradient-to-br from-yellow-400 to-yellow-600 h-full w-full flex items-center justify-center text-white">Webcam Cervia</div>`
    },
    {
      id: 5,
      name: "Parco acquatico di Rimini",
      location: "Rimini",
      description: "Veduta della spiaggia e del mare di Rimini",
      category: "Mare",
      isLive: true,
      viewers: 156,
      htmlCode: `<div class="webcam-placeholder bg-gradient-to-br from-purple-400 to-purple-600 h-full w-full flex items-center justify-center text-white">Webcam Parco</div>`
    },
    {
      id: 6,
      name: "Miramare di Rimini",
      location: "Rimini",
      description: "Veduta sulla spiaggia di Miramare di Rimini",
      category: "Spiaggia",
      isLive: true,
      viewers: 203,
      htmlCode: `<div class="webcam-placeholder bg-gradient-to-br from-indigo-400 to-indigo-600 h-full w-full flex items-center justify-center text-white">Webcam Miramare</div>`
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
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Webcam Live della Romagna
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Esplora la bellezza della Romagna in tempo reale attraverso le nostre webcam live. 
                Dalle spiagge alle città d'arte, scopri cosa succede ora nei luoghi più belli della regione.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Category Filter */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap gap-2 bg-white/60 backdrop-blur-sm p-2 rounded-xl border border-slate-200/60 shadow-sm">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
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
                  
                  {/* Live Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>

                  {/* Category Badge */}
                  <Badge className="absolute top-3 right-3 bg-white/90 text-slate-700 border-0">
                    {webcam.category}
                  </Badge>

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
                    <div className="text-2xl font-bold text-blue-600 mb-1">6</div>
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
