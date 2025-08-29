import { auth, db, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, collection, addDoc, onSnapshot, serverTimestamp } from './firebase-config.js';

const chatBox = document.getElementById('chat');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Mesaj gönder
sendButton.addEventListener('click', async () => {
  const msg = messageInput.value;
  if (msg.trim() === '') return;

  await addDoc(collection(db, 'messages'), {
    text: msg,
    uid: auth.currentUser.uid,
    createdAt: serverTimestamp()
  });
  messageInput.value = '';
});

// Mesajları dinle
onSnapshot(collection(db, 'messages'), (snapshot) => {
  chatBox.innerHTML = '';
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const div = document.createElement('div');
    div.textContent = data.text;
    div.style.color = data.uid === auth.currentUser?.uid ? 'blue' : 'green';
    chatBox.appendChild(div);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Kullanıcı durumu (giriş yapmış mı?)
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('chat-area').style.display = 'block';
  } else {
    document.getElementById('auth').style.display = 'block';
    document.getElementById('chat-area').style.display = 'none';
  }
});
