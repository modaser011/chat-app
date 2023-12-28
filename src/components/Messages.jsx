import React, { useContext } from 'react';
import Message from "./Message";
import { ChatContext } from '../context/ChatContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { doc } from 'firebase/firestore';

const Messages = () => {

    const [messages, setMessages] = useState([]);
    const { data } = useContext(ChatContext);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        })

        return () => {
            unSub();
        }
    },[data.chatId]);

    console.log(messages);

    return (
        <div className='messages'>
            {messages?.map((message) => (
                <Message message={message} key={message.id} />
                ))}
        </div>
    )
}

export default Messages