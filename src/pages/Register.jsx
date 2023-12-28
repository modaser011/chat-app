import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "../firebase";
import React from 'react';
import Add from "../img/addAvatar.png";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {

    const [err, setErr] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const storageRef = ref(storage, username);

            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                (error) => {
                    setErr(true);
                    console.log(error);
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    await updateProfile(res.user, {
                        displayName: username,
                        photoURL: downloadURL,
                    });
                    await setDoc(doc(db, "users", res.user.uid),{
                        uid: res.user.uid,
                        username,
                        email,
                        photoURL: downloadURL,
                    });

                    await setDoc(doc(db, "userChat", res.user.uid), {});

                    navigate("/")

                });
                }
            );
        } catch (error) {
            setErr(true);
            console.log(error);
        }

    }

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>Lama Chat</span>
                <span className='title'>Register</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='Your name' />
                    <input type="email" placeholder='Your email' />
                    <input type="password" placeholder='Your password' />
                    <input style={{display: "none"}} type="file" id="file" />
                    <label htmlFor="file">
                        <img src={Add} alt="add" />
                        <span>Add an avatar</span>
                    </label>
                    <button>Sign up</button>
                    {err && "Something went Wrong"}
                </form>
                <p>Have an acoount already? <Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}

/**

 */

export default Register