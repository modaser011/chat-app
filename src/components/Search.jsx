import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Search = () => {

const [userName, setUserName] = useState("");
const [user, setUser] = useState(null);
const [err, setError] = useState(false);

const { currentUser } = useContext(AuthContext);
const { dispatch } = useContext(ChatContext);

const handleSearch = async () => {
    const q = query(collection(db, "users"), where("username", "==", userName));
    try{
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        setUser(doc.data());
    });

    }catch(err){
        setError(true);
        console.log(err);
    }
}

const handleKey = (e) =>{
    e.code === "Enter" && handleSearch();
}

const handleChange = (e) =>{
    setUserName(e.target.value)
}

const handleSelect = async (u) => {
    //check for the chat in the database, if not then create one
    const combinedID = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid ;
    try{
        const res = await getDoc(doc(db, "chats", combinedID));

        console.log(currentUser.displayName);
        console.log(user);

        if(!res.exists()){
            //create chat in chats collection
            await setDoc(doc(db, "chats", combinedID), { messages: [] });

            //create user chats
            await updateDoc(doc(db, "userChat", currentUser.uid), {
                [combinedID+".userInfo"]: {
                    uid: user.uid,
                    username: user.username,
                    photoURL: user.photoURL,
                },
                [combinedID+".date"]: serverTimestamp(),
            });

            await updateDoc(doc(db, "userChat", user.uid), {
                [combinedID+".userInfo"]: {
                    uid: currentUser.uid,
                    username: currentUser.displayName,
                    photoURL: currentUser.photoURL,
                },
                [combinedID+".date"]: serverTimestamp(),
            });
        }
        dispatch({type: "CHANGE_USER", payload: u});
    }catch(err){
        console.log(err);
    }

    setUser(null);
    setUserName("");

    //create user chats
}
    return (
        <div className='search'>
            <div className="searchForm">
                <input type="text" placeholder='Search' onKeyDown={handleKey} onChange={handleChange} value={userName} />
            </div>
            {err && <span>User is not found</span>}
            {user && <div onClick={() => handleSelect(user)} className="userChat">
                <img src= {user.photoURL} alt="" />
                <div className="userChatInfo">
                    <span>{user.username}</span>
                </div>
            </div>}
        </div>
    )
}

export default Search