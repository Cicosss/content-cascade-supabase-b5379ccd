
import React from 'react';
import Layout from '@/components/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">
            Informativa sulla Privacy (Privacy Policy) di Mia Romagna
          </h1>
          
          <div className="prose max-w-none space-y-6">
            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-4">
                Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                Benvenuto su Mia Romagna. La tua privacy è di fondamentale importanza per noi. 
                Questa informativa sulla privacy descrive quali dati personali raccogliamo, come li 
                utilizziamo e quali sono i tuoi diritti in merito, in conformità con il Regolamento 
                Generale sulla Protezione dei Dati (GDPR - Regolamento UE 2016/679).
              </p>
            </div>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                1. Titolare del Trattamento dei Dati
              </h3>
              <div className="text-slate-600 leading-relaxed space-y-2">
                <p>Miaromagna.it</p>
                <p>Via Raffaello, 11</p>
                <p>47838 Riccione (RN)</p>
                <p>Email di contatto per la privacy: privacy@miaromagna.it</p>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                2. Tipi di Dati Raccolti
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Raccogliamo diversi tipi di dati per fornire e migliorare il nostro servizio.
              </p>
              
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-slate-700">
                  Dati forniti volontariamente dall'utente:
                </h4>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>
                    <strong>Dati di Registrazione:</strong> Quando crei un account, raccogliamo il tuo nome, 
                    cognome e indirizzo email. Se ti registri tramite provider social (Google, Facebook), 
                    riceviamo le informazioni di base del tuo profilo pubblico (nome, email, immagine del profilo) 
                    in base alle tue impostazioni di privacy su tali piattaforme. Non raccogliamo mai la tua 
                    password dei servizi social.
                  </li>
                  <li>
                    <strong>Contenuti Generati dall'Utente:</strong> Raccogliamo le informazioni che fornisci 
                    volontariamente, come le recensioni, i commenti, i Punti di Interesse (POI) proposti tramite 
                    il "Panel di Moderazione" e le "visite" registrate tramite la funzione "Ci sono stato!".
                  </li>
                </ul>

                <h4 className="text-lg font-medium text-slate-700">
                  Dati raccolti automaticamente (Dati di Utilizzo):
                </h4>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>
                    <strong>Dati di Navigazione:</strong> Informazioni su come utilizzi il nostro sito e la 
                    nostra app, come le pagine visitate, i filtri utilizzati e le interazioni con i contenuti, 
                    per migliorare l'esperienza e fornire suggerimenti personalizzati.
                  </li>
                  <li>
                    <strong>Dati di Geolocalizzazione (con il tuo consenso esplicito):</strong> Se attivi la 
                    funzionalità del meteo basato su GPS, raccogliamo le coordinate approssimative della tua 
                    posizione per fornirti previsioni pertinenti. Questi dati non vengono memorizzati a lungo 
                    termine né associati permanentemente al tuo profilo.
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                3. Finalità del Trattamento dei Dati
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Utilizziamo i tuoi dati per le seguenti finalità:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                <li>
                  <strong>Per fornire e mantenere il nostro Servizio:</strong> Creare e gestire il tuo account, 
                  personalizzare la tua esperienza (es. "Ciao, Luca!"), mostrarti contenuti pertinenti.
                </li>
                <li>
                  <strong>Per la funzionalità di Gamification:</strong> Tracciare le tue "visite" per aggiornare 
                  i progressi nel tuo "Passaporto" e sbloccare i badge.
                </li>
                <li>
                  <strong>Per comunicare con te:</strong> Inviarti comunicazioni di servizio relative al tuo 
                  account o notifiche importanti.
                </li>
                <li>
                  <strong>Per migliorare la Piattaforma:</strong> Analizzare i dati di utilizzo in forma aggregata 
                  e anonima per capire come viene usato il nostro servizio e come possiamo migliorarlo.
                </li>
                <li>
                  <strong>Per garantire la sicurezza:</strong> Prevenire e individuare frodi o attività non autorizzate.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                4. Base Giuridica del Trattamento
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Trattiamo i tuoi dati personali sulla base di:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                <li>
                  <strong>Consenso:</strong> Per specifiche attività come l'uso del GPS o l'invio di 
                  newsletter (se applicabile).
                </li>
                <li>
                  <strong>Esecuzione di un contratto:</strong> Per fornirti i servizi legati alla creazione 
                  e gestione del tuo account.
                </li>
                <li>
                  <strong>Legittimo interesse:</strong> Per migliorare la nostra piattaforma e garantire la sicurezza.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                5. Condivisione dei Dati e Terze Parti
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Non vendiamo né cediamo i tuoi dati personali a terzi per scopi di marketing. 
                Potremmo condividere i dati con:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                <li>
                  <strong>Provider di servizi tecnici:</strong> Come Supabase (il nostro fornitore di backend 
                  e database) o provider di servizi di hosting, che agiscono come responsabili del trattamento 
                  per nostro conto.
                </li>
                <li>
                  <strong>Provider di autenticazione social (Google, Facebook):</strong> Se scegli di utilizzare 
                  il login social.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                6. Trasferimento dei Dati all'Estero
              </h3>
              <p className="text-slate-600 leading-relaxed">
                I tuoi dati potrebbero essere trattati su server situati al di fuori dello Spazio Economico 
                Europeo (SEE). In tal caso, ci assicuriamo che il trasferimento avvenga in conformità con le 
                normative vigenti e che siano in atto adeguate garanzie di protezione (es. Clausole Contrattuali Standard).
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                7. Periodo di Conservazione dei Dati
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Conserviamo i tuoi dati personali solo per il tempo strettamente necessario a raggiungere le 
                finalità per cui sono stati raccolti. Puoi richiedere la cancellazione del tuo account e dei 
                dati associati in qualsiasi momento.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                8. I Tuoi Diritti (Diritti dell'Interessato)
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                In base al GDPR, hai il diritto di:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                <li>Accedere ai tuoi dati personali</li>
                <li>Rettificare i dati inesatti</li>
                <li>Cancellare i tuoi dati ("diritto all'oblio")</li>
                <li>Limitare il trattamento dei tuoi dati</li>
                <li>Opporti al trattamento</li>
                <li>Richiedere la portabilità dei tuoi dati</li>
                <li>Revocare il consenso in qualsiasi momento</li>
                <li>Proporre reclamo a un'autorità di controllo (Garante per la Protezione dei Dati Personali)</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                Per esercitare i tuoi diritti, puoi contattarci all'indirizzo email: privacy@miaromagna.it
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                9. Cookie Policy
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Per informazioni dettagliate sull'uso dei cookie, consulta la nostra Cookie Policy 
                [Crea un link a una futura pagina di Cookie Policy].
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                10. Modifiche a questa Informativa sulla Privacy
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Ci riserviamo il diritto di modificare questa informativa sulla privacy in qualsiasi momento. 
                Qualsiasi modifica sarà pubblicata su questa pagina.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
