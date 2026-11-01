# README

Questo repository contiene un sito chat semplice, pronto per essere pubblicato su GitHub Pages.

## Funzionalità
- pagina iniziale con inserimento del nome utente
- chat in tempo reale
- supporto Firebase per sincronizzazione reale tra utenti
- fallback locale per test rapido in più schede del browser

## Come usare
1. Apri il repo su GitHub.
2. Vai in Settings > Pages.
3. Scegli "Deploy from a branch" e seleziona `main` / `/root`.
4. Salva.
5. Il sito verrà pubblicato su un URL tipo:
   `https://<tuo-username>.github.io/<nome-repo>/`

## Configurazione Firebase (opzionale ma consigliata)
Per far funzionare la chat anche tra utenti reali, sostituisci i valori in `script.js`:

```js
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  databaseURL: 'https://YOUR_PROJECT-default-rtdb.firebaseio.com',
  projectId: 'YOUR_PROJECT_ID',
};
```

Puoi ottenere questi dati da Firebase Console > Progetto > Impostazioni > Configurazione app.

## Nota
Se non configuri Firebase, la chat funziona in modalità locale e sincronizza i messaggi tra schede del browser sullo stesso dispositivo.
