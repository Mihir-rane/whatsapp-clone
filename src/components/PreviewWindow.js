import React, { useState } from 'react'
import db from '../firebase';
import firebase from "firebase";
import { Picker } from 'emoji-mart';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import SendIcon from '@material-ui/icons/Send';
import AddIcon from '@material-ui/icons/Add';

import { useStateValue } from '../contexts/StateProvider';
import PreviewImage from "./PreviewImage";
import 'emoji-mart/css/emoji-mart.css';
import '../css/PreviewWindow.css';


function PreviewWindow({roomId, images, setImages, handleImageChange, previewImageUrl, setPreviewImageUrl, previewImageName, setPreviewImageName, setFileReceived}) {

    const [input,setInput] = useState("");
    const [emojiToggler , setEmojiToggler] = useState(false);
    
    const [{user}] = useStateValue(); 

    const closePreviewWindow = () => {
        setFileReceived(false)
        setPreviewImageUrl(null)
        setPreviewImageName(null)
        setImages([])
    }

    const sendMessage = e => {
        e.preventDefault();

        console.log("You typed >> ", input);

        const promises = [];

        images.forEach ((file,index) => {

            var imagerandomname = "image"+Math.floor(Math.random() * 5000);

            const uploadTask = firebase.storage().ref().child(`images/${imagerandomname}`).put(file);
            promises.push(uploadTask);
            uploadTask.on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                snapshot => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (snapshot.state === firebase.storage.TaskState.RUNNING) {
                        console.log(`Progress: ${progress}%`);
                    }
                },
                error => console.log(error.code),
                async () => {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    db.collection("rooms").doc(roomId).collection("messages").add({
                        message: index===0 ? input: null,
                        url: downloadURL,
                        fileName: file.name,
                        name: user.displayName,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    });
                }
            );
        });

        Promise.all(promises)
            .then(() => {
                alert('All images uploaded')
            })
            .catch(err => console.log(err.code));

        db.collection("rooms").doc(roomId).update({
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        setFileReceived(false)
        setPreviewImageUrl(null)
        setPreviewImageName(null)
        setImages([])
        setInput("");
        setEmojiToggler(false);
    }

    return (
        <div className="previewWindow">
            <div className="preview__header">
                <IconButton style={{color: "#B2ECE4",padding:"0"}} onClick={closePreviewWindow}>
                    <CloseIcon />
                </IconButton>
                <h3 className="preview__heading">Preview</h3>
            </div>

            <div className="preview__body">

                <img src={previewImageUrl} alt={previewImageName} className="preview__image"/>

                {
                    emojiToggler && 
                    <Picker style={{"width":"30%", "overflow":"hidden","height":"46%", position: "absolute",zIndex:"1",right:"9%",top: "22%"}} 
                        onSelect={(e)=>{
                            let sym = e.unified.split('-')
                            let codesArray = []
                            sym.forEach(el => codesArray.push('0x' + el))
                            let emoji = String.fromCodePoint(...codesArray)
                            
                            setInput(input + emoji);
                        }}
                        color="#009688"
                    />
                }
                <div className="captionAndEmoji">
                    <form >
                        <input type="text" className="caption" placeholder="Add a caption..." value={input} onChange={e => setInput(e.target.value)}/>
                        <IconButton onClick={()=>setEmojiToggler(!emojiToggler)} >
                            <InsertEmoticonIcon style={{fontSize:"21px", color: "#919191"}} />
                        </IconButton>
                        <SendIcon onClick={sendMessage} style={{background: "#09E85E",borderRadius: "100%",color:"white",padding:"16px",height: "28px", width: "28px", position: "absolute", zIndex:"1",right:"2.5vw", bottom:"calc(94.6vh - 42vh - 302px + 20px)"}}/>
                    </form>
                </div>

            </div>

            <div className="preview__footer">
                {
                    images.map(image => (
                        <PreviewImage 
                            key={image.id} 
                            setInput={setInput} 
                            previewImage={image} 
                            images={images} 
                            setImages={setImages} 
                            previewImageUrl={previewImageUrl}
                            setPreviewImageUrl={setPreviewImageUrl} 
                            setPreviewImageName={setPreviewImageName} 
                            closePreviewWindow={closePreviewWindow}
                        />
                    ))
                }
            
                <input type="file" id="fileInput" multiple accept="image/*" onChange={handleImageChange}/>
                <label htmlFor="fileInput">
                    <div className="addFile">
                        <AddIcon style={{color: "#00A5F4",display:"block",margin:"0 auto"}}/>
                        <h6 className="addFileText">ADD FILE</h6>
                    </div>
                </label>
            </div>
            
        </div>
    )
}

export default PreviewWindow;
