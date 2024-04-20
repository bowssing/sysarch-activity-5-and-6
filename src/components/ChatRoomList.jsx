import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { db, storage } from '../configs/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function ChatRoomList() {
  const [list, setList] = useState([]) // State to store the chat room list
  const [title, setTitle] = useState('') // State to store the input field value
  const [chatRoomId, setChatRoomId] = useState(''); // State to store chatRoomId, assuming it's available in your component

  const listCollection = collection(db, 'chat_room') // Reference to the 'chat_room' collection in Firestore

  useEffect(() => {
    getList() // Fetch the chat room list on component mount
  }, [])

  const getList = async () => {
    try {
      // Subscribe to real-time updates on the chat room collection, ordered by timestamp in descending order
      const unsubscribe = onSnapshot(query(listCollection, orderBy('timestamp', 'desc')), (snapshot) => {
        // Map the document data and add an 'id' property to each document
        const updatedList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setList(updatedList) // Update the chat room list state with the updated data
      })
      return () => unsubscribe() // Unsubscribe from real-time updates when the component unmounts
    } catch (error) {
      console.error(error)
    }
  }

  const save = async () => {
    try {
      if (title.trim() === '') {
        return // If the title is empty or contains only whitespace, do not save
      }

      // Add a new document to the chat room collection with the provided title and server timestamp
      const docRef = await addDoc(listCollection, {
        title,
        timestamp: serverTimestamp()
      });
      
      setChatRoomId(docRef.id); // Set the chatRoomId after saving
      setTitle('') // Clear the input field after saving
    } catch (error) {
      console.error(error)
    }
  }

  // Function to upload a file
  const fileUpload = async (file, chatRoomId) => {
    if (!file || !chatRoomId) {
      return;
    }

    const storageRef = ref(storage, `chatroom/${chatRoomId}/${Date.parse(new Date())}_${file.name}`);
    const result = await uploadBytes(storageRef, file);
    console.log('result ', result);
    const downloadURL = await getDownloadURL(storageRef);
    console.log('downloadURL', downloadURL);

    // Add a new message with the uploaded image to the chat room
    await addDoc(listCollection, {
      // Assuming you have 'message' and 'user' defined somewhere in your component
      message: 'Your message here',
      senderName: user.displayName ?? user.email,
      senderId: user.uid,
      chatRoomId: chatRoomId,
      image: downloadURL,
      timestamp: serverTimestamp()
    });
  };

  return (
    <>
      <h1>POSTS</h1>
      <input
        type='text'
        placeholder='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={save}>POST</button>
      <input type='file' onChange={(e) => fileUpload(e.target.files[0], chatRoomId)} />
      {
        list.map((item, index) => (
          item.timestamp ? <div key={index}>
            <Link to={`/chat/${item.id}`}>
              <h3>{item.title}</h3>
            </Link>
            <p>{item.timestamp?.toDate().toLocaleString()}</p>
          </div> : null
        ))
      }
    </>
  )
}

export default ChatRoomList;
