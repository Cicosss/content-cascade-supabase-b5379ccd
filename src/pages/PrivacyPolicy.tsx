
import React from 'react';
import Layout from '@/components/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">
            Informativa sulla Privacy
          </h1>
          
          <div className="prose max-w-none space-y-6">
            <p className="text-slate-600 text-lg leading-relaxed">
              La presente informativa descrive le modalità di trattamento dei dati personali 
              degli utenti che consultano il nostro sito web e utilizzano i nostri servizi.
            </p>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                1. Titolare del Trattamento
              </h3>
              <p className="text-slate-600 leading-relaxed">
                [Il contenuto sarà inserito successivamente come richiesto]
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                2. Tipi di Dati Raccolti
              </h3>
              <p className="text-slate-600 leading-relaxed">
                [Il contenuto sarà inserito successivamente come richiesto]
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                <li>Dati di navigazione</li>
                <li>Dati forniti volontariamente dall'utente</li>
                <li>Cookie e tecnologie simili</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                3. Finalità del Trattamento
              </h3>
              <p className="text-slate-600 leading-relaxed">
                [Il contenuto sarà inserito successivamente come richiesto]
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                4. Base Giuridica
              </h3>
              <p className="text-slate-600 leading-relaxed">
                [Il contenuto sarà inserito successivamente come richiesto]
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                5. Conservazione dei Dati
              </h3>
              <p className="text-slate-600 leading-relaxed">
                [Il contenuto sarà inserito successivamente come richiesto]
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                6. Diritti dell'Interessato
              </h3>
              <p className="text-slate-600 leading-relaxed">
                L'interessato ha diritto di ottenere:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                <li>Accesso ai propri dati personali</li>
                <li>Rettifica dei dati inesatti</li>
                <li>Cancellazione dei dati</li>
                <li>Limitazione del trattamento</li>
                <li>Portabilità dei dati</li>
                <li>Opposizione al trattamento</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                7. Sicurezza dei Dati
              </h3>
              <p className="text-slate-600 leading-relaxed">
                [Il contenuto sarà inserito successivamente come richiesto]
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                8. Modifiche alla Privacy Policy
              </h3>
              <p className="text-slate-600 leading-relaxed">
                [Il contenuto sarà inserito successivamente come richiesto]
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                9. Contatti
              </h3>
              <p className="text-slate-600 leading-relaxed">
                [Il contenuto sarà inserito successivamente come richiesto]
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
