import React, { useState , useEffect } from 'react';
import { Link } from"react-router-dom";
import db from '../firebase';
import firebase from "firebase";
import { Avatar } from '@material-ui/core';

import { actionTypes } from '../reducer/reducer';
import { useStateValue } from '../contexts/StateProvider';
import '../css/SidebarChat.css';


function SidebarChat({id,name,addNewChat}) {

    const [seed, setSeed] = useState('');
    const [messages,setMessages] =useState([]);
    const [{}, dispatch] = useStateValue();
    

    useEffect(() => {
        if(id){
            db.collection("rooms").doc(id).collection("messages").orderBy("timestamp","desc").onSnapshot((snapshot) => {
                setMessages(snapshot.docs.map((doc) => (
                    doc.data()
                )))
            })
        }
    },[id])

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, []) 

    const createChat = () => {
        const roomName = prompt("Please enter name for chat");

        if(roomName){
            db.collection("rooms").add({
                name: roomName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        }
    }

    const setCurrentRoomAvatar = () => {
        dispatch({
            type: actionTypes.SET_CURRENT_ROOM_AVATAR,
            currentRoomAvatar: `https://avatars.dicebear.com/api/human/${seed}.svg`
        });
    }

    return !addNewChat ? (
        <Link to={`/rooms/${id}`} onClick={setCurrentRoomAvatar}>
            <div className="sidebarChat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="sidebarChat_info">
                    <h3>{name}</h3>
                    {
                        messages.length > 0 &&
                        <p>
                            { 
                                messages[0]?.message ? 
                                    (messages[0]?.message.length > 43 ? messages[0]?.message.slice(0,43) + "..." : messages[0]?.message) : 
                                    <em>Image is send</em>
                            }
                        </p>
                    }
                    
                </div>
            </div>
        </Link>       
    ) : (  
            <div onClick={createChat} className="sidebarChat">
                <h3 className="add_new_chat">Add New Chat</h3>
            </div>
    )
}

export default SidebarChat