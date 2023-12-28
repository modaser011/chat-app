import React from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({message}) => {

    const {currentUser} = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({behavior: "smooth"})
    }, [message])

    const d = new Date();
    let seconds = d.getTime() / 1000;
    let time = (seconds - message.date.seconds)/60 ;

    var flag = false;
    var flag2 = false;
    let quantityMinutes = time > 1 ? 'minutes': 'minute';
    let quantityHours = time > 120 ? 'hours': 'hour';
    let quantityDays = time > 7200 ? 'days': 'day';

    if(time > 60){
        time = time / 60;
        flag = true;
    }

    if(time > 60){
        time = time / 60;
        flag2 = true;
    }

    return (
        <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"} `}>
            <div className="messageInfo">
                <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
                <span className='messageStatus'>{`${Math.floor(time)} ${!flag ? quantityMinutes : (flag2 ? quantityDays : quantityHours)} ago`}</span>
            </div>
            <div className="messageContent">
                {message.text !== "" && <div className='paragraphContainer'>
                    <p>{message.text}</p> 
                </div>}
                <img src={message.img || message.image} alt="" />
            </div>
        </div>
    )
}

export default Message