# Chat Live con Firebase

Questo repository contiene una web app chat con:
- login con nome utente
- chat pubblica in tempo reale
- fallback locale se Firebase non è ancora configurato
- compatibilità con GitHub Pages

## 1) Configura Firebase

1. Apri https://console.firebase.google.com/
2. Clicca "Aggiungi progetto" e crea un nuovo progetto Google Firebase
3. Una volta creato, vai su "Project settings" (icona dell'ingranaggio)
4. Nella sezione "Your apps", aggiungi una Web app
5. Firebase ti mostrerà un blocco di configurazione simile a questo:

```js
const firebaseConfig = {
  apiKey: "AIz...",
  authDomain: "tuo-progetto.firebaseapp.com",
  databaseURL: "https://tuo-progetto-default-rtdb.firebaseio.com",
  projectId: "tuo-progetto",
  storageBucket: "tuo-progetto.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
};
```

6. Copia questi valori e incollali nel file `script.js` nella variabile `firebaseConfig`.
7. Salva il file e fai commit.

## 2) Crea il database Realtime Database

1. Nel menu Firebase, vai su "Realtime Database"
2. Clicca "Crea database"
3. Scegli la regione più vicina a te
4. Avvia il database in modalità test per poterlo usare subito

### Regole di accesso (modalità test/temporanea)

Se vuoi testarlo velocemente, usa queste regole:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

> Le regole di lettura/scrittura aperte sono utili per test iniziali. In produzione va usato un controllo più rigido.

## 3) Pubblica il sito

Se vuoi usarlo come sito Web pubblico:

1. Vai su GitHub
2. Apri il repo `Zedda-10/zedda`
3. Vai in `Settings` > `Pages`
4. Scegli `Deploy from a branch`
5. Seleziona `main` e cartella `/root`
6. Salva

Dopodiché il sito sarà disponibile a un URL del tipo:

```text
https://<tuo-username>.github.io/zedda/
```

## 4) Nota importante su Firebase e GitHub Pages

GitHub Pages serve file statici. Firebase viene usato come backend per la chat in tempo reale. Quindi:
- il frontend (HTML/CSS/JS) è sul repo GitHub Pages
- il database live è su Firebase

## 5) Se vuoi usare il sito davvero multi-utente

Per far sì che più persone da più dispositivi vedano gli stessi messaggi:
- il file `script.js` deve contenere il `firebaseConfig` corretto
- il database Firebase deve essere attivo
- i browser devono poter raggiungere Firebase tramite HTTPS

## 6) Modalità fallback

Se non hai ancora configurato Firebase, l'app funziona comunque in locale usando `BroadcastChannel` e `localStorage`, così puoi testare la chat all'interno del browser.

## 7) Prossimo passo

Se vuoi, posso continuare subito e preparare il file `script.js` con i valori esatti del tuo progetto Firebase non appena mi mandi:
- `apiKey`
- `authDomain`
- `databaseURL`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

In alternativa, ti posso anche aiutare a creare il progetto Firebase passo per passo durante la configurazione.
