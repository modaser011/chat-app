import { doc, updateDoc, arrayUnion, Timestamp, serverTimestamp} from "firebase/firestore";
import React, {useContext} from 'react';
import Img from "../img/img.png";
import Attach from "../img/attach.png"
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { useState } from 'react';
import { v4 as uuid } from "uuid";
import { storage, db } from "../firebase";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";

const Input = () => {

    const {currentUser} = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const [text, setText] = useState("");
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        setText(e.target.value);
    }

    const handleSend = async () => {

        if(image){
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadTask.on(
                (error) => {
                    // setErr(true);
                    console.log(error);
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

                    await updateDoc(doc(db, "chats", data.chatId), {
                        messages: arrayUnion({
                            id: uuid(),
                            text: text ? text : "",
                            senderId: currentUser.uid,
                            date: Timestamp.now(),
                            img: downloadURL,
                        })
                    });

                });
                }
            );
        }else{
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                })
            });
        }

        await updateDoc(doc(db, "userChat", currentUser.uid), {
            [data.chatId+".lastMessage"]: {text},
            [data.chatId+".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChat", data.user.uid), {
            [data.chatId+".lastMessage"]: {text},
            [data.chatId+".date"]: serverTimestamp(),
        });

        setText("");
        setImage(null);

    }

    return (
        <div className='input'>
            <input value={text} onChange={handleChange} type="text" placeholder='Send a message' />
            <div className="send">
                <img src={Img} alt="" />
                <input value={image ? image : null} onChange={e => setImage(e.target.files[0])} type="file" style={{display: "none"}} id="file" />
                <label htmlFor="file">
                    <img src={Attach} alt="" />
                </label>
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    )
}

export default Input