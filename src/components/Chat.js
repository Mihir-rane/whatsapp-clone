import React, { useState, useEffect} from 'react';
import { useParams } from"react-router-dom";
import db from '../firebase';
import firebase from "firebase";
import { Picker } from 'emoji-mart';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, MoreVert, SearchOutlined} from '@material-ui/icons';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';

import { useStateValue } from '../contexts/StateProvider';
import PreviewWindow from './PreviewWindow';
import 'emoji-mart/css/emoji-mart.css';
import '../css/Chat.css';


function Chat() {

    const { roomId } = useParams("");
    const [roomName, setRoomName] = useState("");
    const [fileReceived , setFileReceived] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState(null);
    const [previewImageName, setPreviewImageName] = useState(null);
    const [images, setImages] = useState([])/**/
    const [input,setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [emojiToggler , setEmojiToggler] = useState(false);
    const [{user, currentRoomAvatar}] = useStateValue(); 
    
    useEffect(() => {
        db.collection("rooms").doc(roomId).onSnapshot((snapshot) =>
            setRoomName(snapshot.data().name)     
        )

        db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp","asc")
        .onSnapshot((snapshot) =>
            setMessages(snapshot.docs.map((doc) => 
                doc.data()    
            ))
        );
        
        setInput("")
        setFileReceived(false)
        setImages([])
        setEmojiToggler(false);
       
    },[roomId])
    
    const sendMessage = e => {
        e.preventDefault();
        console.log("You typed >> ", input);

        db.collection("rooms").doc(roomId).collection("messages").add({
            message: input,
            name: user.displayName,
            url: null,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        db.collection("rooms").doc(roomId).update({
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        setInput("");

        setEmojiToggler(false);
    }

    const handleImageChange = (e)=>{

        for (let i = 0; i < e.target.files.length; i++) {
            const newFile = e.target.files[i];

            newFile["id"] = Math.random();
            newFile["previewUrl"] = URL.createObjectURL(newFile)

            if(i===0){
                setPreviewImageUrl(newFile.previewUrl)
                setPreviewImageName(newFile.name)
            }

            setImages(prevState => [...prevState, newFile]);
        }

        Array.from(e.target.files).map(
            (file) => URL.revokeObjectURL(file) // avoid memory leak
        );

    };

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar style={{margin: "4px"}} src={currentRoomAvatar}/>
                <div className="chat__headerInfo">
                    <h4>{roomName}</h4>
                    <p>
                        Last seen at {new Date(messages[messages.length-1]?.timestamp?.toDate()).toUTCString()}
                    </p>
                </div>
                <div>
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>   
                </div>
            </div>
            { 
                !fileReceived ? 
                <>
                    <div id="chat-body" className={`chat__body ${ emojiToggler && 'chat_bodyReducedHeight'}`}>
                        {
                            messages.map(message => (
                                    <p className={`chat__message ${message.name === user.displayName && 'chat__receiver'}`}>
                                        <span className="chat__name">{message.name}</span>
                                        {
                                            message.url ? 
                                                <span><img className="chat__image" src={message.url} alt={message.fileName}></img></span> 
                                                : null 
                                        }
                                        <span className="chat__text">{message.message}</span>
                                        <span className="chat__timestamp">{new Date(message.timestamp?.toDate()).toUTCString()}</span>
                                    </p>   
                            ))
                        }
                    
                    </div>

                    {
                        emojiToggler && 
                        <Picker style={{"width":"100%", "overflow":"hidden","height":"43.7vh"}} 
                            onSelect={(e)=>{
                                let sym = e.unified.split('-')
                                let codesArray = []
                                sym.forEach(el => codesArray.push('0x' + el))
                                let emoji = String.fromCodePoint(...codesArray)
                                
                                setInput(input + emoji);
                            }}
                            color="#009688"
                            emojiSize={32}
                        />
                    }

                    
                
                    <div className="chat__footer">
                        <IconButton onClick={()=>setEmojiToggler(!emojiToggler)}>
                            <InsertEmoticonIcon />
                        </IconButton>

                        <IconButton >
                            {/*<input type="file" id="fileInput" accept="image/*" onChange={(e)=>{sendFile(e.target.files[0])}}/>*/}
                            <input type="file" id="fileInput" multiple accept="image/*" onChange={(e)=>{setFileReceived(true);handleImageChange(e);}}/>
                            <label htmlFor="fileInput"><AttachFile  /></label>
                        </IconButton>
                        
                        <form >
                            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message" type="text" />
                            <IconButton>
                                <button type="submit" id="messageSubmit" onClick={sendMessage}>Send a message</button>
                                {input ? <label htmlFor="messageSubmit"><SendIcon /></label> : <MicIcon />}      
                            </IconButton>
                        </form>
                    </div>
                </> : 
                <PreviewWindow 
                    roomId={roomId} 
                    images={images} 
                    setImages={setImages} 
                    handleImageChange={handleImageChange} 
                    previewImageUrl={previewImageUrl} 
                    setPreviewImageUrl={setPreviewImageUrl} 
                    previewImageName={previewImageName} 
                    setPreviewImageName={setPreviewImageName} 
                    setFileReceived={setFileReceived} 
                />
            }                                                                                                                                                                                                                                               
                                                                                                                                                                                                                      
        </div>                                                                                                                                                                                 
    )
}

export default Chat
