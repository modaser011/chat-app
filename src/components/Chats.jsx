import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Chats = () => {

    const [chats, setChats] = useState([]);
    const [property, setProperty] = useState([]);
    const { data } = useContext(ChatContext);

    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChat", currentUser.uid), (doc) => {
                setChats(doc.data());
            });
    
            return () => {
                unsub();
            };
        }

        const getProperty = () => {
            const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
                doc.exists() && setProperty(doc.data().messages);
            })

            return () => {
                unSub();
            };
        }



        currentUser.uid && getChats();
        getProperty();
    }, [currentUser.uid, data.chatId]);

    if(property.length !== 0){
        console.log(property[property.length - 1].senderId)
    }

    const handleSelect = (u) => {
        dispatch({type: "CHANGE_USER", payload: u})
    }
    return (
            <div className="chats">
        {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
            <div
            className="userChat"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
            >
            <img src={chat[1]?.userInfo?.photoURL} alt="" />
            <div className="userChatInfo">
                <span>{chat[1]?.userInfo?.username}</span>
                <p>{property[property.length - 1]?.senderId === currentUser.uid ? "You: " + chat[1].lastMessage?.text : chat[1].lastMessage?.text}</p>
            </div>
            </div>
        ))}
        </div>
    )
}

export default Chats