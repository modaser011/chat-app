import { signOut } from 'firebase/auth';
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../firebase';
// import {useNavigate} from "react-router-dom"

const Navbar = () => {

    // const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext);

    return (
        <div className='navbar'>
            <span className='logo'>Lama Chat</span>
            <div className="user">
                <img src={currentUser.photoURL} alt="user pic" />
                <span>{currentUser.displayName}</span>
                <button onClick={() =>{signOut(auth)}}>logout</button>
            </div>
        </div>
    )
}

export default Navbar