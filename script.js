const usernameKey = 'chat-room-user';
const messageStoreKey = 'chat-room-messages';
const roomKey = 'chat-room-global';

// Inserisci qui la configurazione del tuo progetto Firebase.
// La chat funzionerà anche senza Firebase grazie al fallback locale.
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  databaseURL: 'https://YOUR_PROJECT-default-rtdb.firebaseio.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abcdef123456',
};

const loginForm = document.getElementById('loginForm');
const nameInput = document.getElementById('nameInput');
const logoutBtn = document.getElementById('logoutBtn');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const messagesEl = document.getElementById('messages');
const connectionText = document.getElementById('connectionText');
const connectionDot = document.getElementById('connectionDot');
const onlineCount = document.getElementById('onlineCount');

let currentUser = localStorage.getItem(usernameKey) || '';
let firebaseDb = null;
let localChannel = null;
let isFirebaseEnabled = false;

function setConnectionState(isOnline, label) {
  connectionDot.classList.toggle('online', isOnline);
  connectionText.textContent = label;
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStoredMessages() {
  try {
    const raw = localStorage.getItem(messageStoreKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredMessages(messages) {
  localStorage.setItem(messageStoreKey, JSON.stringify(messages.slice(-100)));
}

function renderMessage(message) {
  const item = document.createElement('article');
  const isMine = message.user === currentUser;
  item.className = `message ${isMine ? 'me' : ''}`;

  const time = formatTime(message.createdAt);
  item.innerHTML = `
    <div class="message-header">
      <span class="message-author">${message.user}</span>
      <span>${time}</span>
    </div>
    <div class="message-body">${message.text}</div>
  `;

  messagesEl.appendChild(item);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function loadMessages(messages) {
  messagesEl.innerHTML = '';
  messages.forEach(renderMessage);
}

function appendLocalMessage(message) {
  const list = getStoredMessages();
  const next = [...list, message].slice(-100);
  saveStoredMessages(next);
  loadMessages(next);

  if ('BroadcastChannel' in window && localChannel) {
    localChannel.postMessage({ type: 'new-message', payload: message });
  }
}

function registerFallbackRealtime() {
  if ('BroadcastChannel' in window) {
    localChannel = new BroadcastChannel(roomKey);
    localChannel.onmessage = (event) => {
      if (event.data?.type === 'new-message' && event.data.payload) {
        const list = getStoredMessages();
        const alreadyExists = list.some((msg) => msg.id === event.data.payload.id);
        if (!alreadyExists) {
          const next = [...list, event.data.payload].slice(-100);
          saveStoredMessages(next);
          loadMessages(next);
        }
      }
    };
  }

  const saved = getStoredMessages();
  loadMessages(saved);
  setConnectionState(true, 'Modalità locale attiva');
}

function initFirebase() {
  const isConfigured =
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== 'YOUR_PROJECT_ID';

  if (!isConfigured) {
    registerFallbackRealtime();
    return;
  }

  try {
    const app = firebase.apps.length ? firebase.apps[0] : firebase.initializeApp(firebaseConfig);
    firebaseDb = app.database();
    isFirebaseEnabled = true;

    const messagesRef = firebaseDb.ref('chat/messages');
    messagesRef.on('value', (snapshot) => {
      const data = snapshot.val() || {};
      const messages = Object.values(data)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .slice(-100);

      saveStoredMessages(messages);
      loadMessages(messages);
      setConnectionState(true, 'Connesso a Firebase');
    });

    const presenceRef = firebaseDb.ref('.info/connected');
    presenceRef.on('value', (snapshot) => {
      if (snapshot.val() === true) {
        setConnectionState(true, 'Connesso in tempo reale');
      }
    });
  } catch (error) {
    console.error('Firebase init error:', error);
    registerFallbackRealtime();
  }
}

function loginUser(event) {
  event.preventDefault();

  const username = nameInput.value.trim();
  if (!username) {
    nameInput.focus();
    return;
  }

  currentUser = username;
  localStorage.setItem(usernameKey, username);

  const profile = document.querySelector('.login-card');
  profile.classList.add('hidden');
  logoutBtn.classList.remove('hidden');
  nameInput.value = '';

  const statusText = isFirebaseEnabled ? 'Connesso' : 'Modalità locale';
  setConnectionState(true, statusText);
}

function logoutUser() {
  currentUser = '';
  localStorage.removeItem(usernameKey);
  document.querySelector('.login-card').classList.remove('hidden');
  logoutBtn.classList.add('hidden');
  nameInput.focus();
  setConnectionState(false, 'Nome non impostato');
}

function sendMessageToFirebase(text) {
  const messageRef = firebaseDb.ref('chat/messages');
  const payload = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    user: currentUser,
    text,
    createdAt: new Date().toISOString(),
  };

  messageRef.push(payload);
}

function sendMessage(event) {
  event.preventDefault();

  const text = messageInput.value.trim();
  if (!text || !currentUser) {
    if (!currentUser) {
      nameInput.focus();
    }
    return;
  }

  const payload = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    user: currentUser,
    text,
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseEnabled && firebaseDb) {
    sendMessageToFirebase(text);
  } else {
    appendLocalMessage(payload);
  }

  messageInput.value = '';
  messageInput.focus();
}

function updatePresence() {
  const count = getStoredMessages().length;
  onlineCount.textContent = `${Math.min(count, 99)} online`;
}

loginForm.addEventListener('submit', loginUser);
chatForm.addEventListener('submit', sendMessage);
logoutBtn.addEventListener('click', logoutUser);

if (currentUser) {
  document.querySelector('.login-card').classList.add('hidden');
  logoutBtn.classList.remove('hidden');
  nameInput.value = currentUser;
}

onlineCount.textContent = '0 online';
updatePresence();
initFirebase();

if (!currentUser) {
  setConnectionState(false, 'Aspettando nome utente');
}
