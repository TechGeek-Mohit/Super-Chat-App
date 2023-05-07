import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/database';
import React, { useState, useRef } from 'react';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData  } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  //your config
  apiKey: "AIzaSyC02syeoZ-fQ0AZBU16K8D-cO_ZsRFyq4A",
  authDomain: "chat-app-49c48.firebaseapp.com",
  projectId: "chat-app-49c48",
  storageBucket: "chat-app-49c48.appspot.com",
  messagingSenderId: "413985058336",
  appId: "1:413985058336:web:e98deb873d803b80669645",
  measurementId: "G-KBR0G0FDVT"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const[user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}




function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatMessage(props){
  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return(<>
      <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
    </>
  )

}

function ChatRoom(){
  const dummy = useRef();
  const messagesRef = firestore.collection('message');
  const query = messagesRef.orderBy('createAt').limit(25);
  const [messages] = useCollectionData(query, {idField : 'id'});
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const {uid, photoURL} = auth.currentUser;

    await messagesRef.add({
        text : formValue,
        createdAt : firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  return (<>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
        <button type="submit">🕊️</button>
      </form>
    </>)
  }






export default App;
