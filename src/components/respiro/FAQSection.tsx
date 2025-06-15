
import React from 'react';

const FAQSection = () => {
  const faqs = [
    {
      question: "Cos'è \"Respiro del Mare\"?",
      answer: "È un'iniziativa di Mia Romagna per finanziare, attraverso donazioni, la pulizia delle spiagge e dei fondali marini della costa romagnola. L'aspetto unico del progetto è che la pulizia viene affidata a persone in difficoltà economica del nostro territorio, creando un doppio impatto: ambientale e sociale."
    },
    {
      question: "Qual è l'obiettivo del progetto?",
      answer: "Valorizzare e proteggere il nostro patrimonio costiero, rendendolo più pulito e sicuro per tutti, e allo stesso tempo offrire un'opportunità di lavoro e reinserimento a chi ne ha più bisogno."
    },
    {
      question: "Come vengono usati i fondi raccolti?",
      answer: "Il 100% delle donazioni (al netto dei costi di transazione) viene utilizzato per stipendiare le \"Sentinelle della Spiaggia\" – le persone incaricate della pulizia – e per fornire loro l'attrezzatura necessaria (guanti, sacchi, pinze, etc.)."
    },
    {
      question: "Facendo la donazione, saprò quale tratto di spiaggia ho aiutato a pulire?",
      answer: "Sì. Ogni donazione viene associata simbolicamente a un'area specifica. Riceverai via mail un attestato digitale con le coordinate del tratto di spiaggia che hai \"adottato\" e aggiornamenti periodici sui risultati delle operazioni di pulizia in quella zona."
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-8">
          FAQ - Domande e Risposte
        </h2>
        <p className="text-lg text-slate-600 text-center max-w-4xl mx-auto mb-16">
          Abbiamo raccolto le domande più frequenti sull'iniziativa 'Respiro del Mare'. 
          Il nostro obiettivo è la massima trasparenza, per farvi comprendere come ogni 
          singola donazione contribuisce a un mare più pulito e a una comunità più forte.
        </p>

        <div className="max-w-4xl mx-auto space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                {faq.question}
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
