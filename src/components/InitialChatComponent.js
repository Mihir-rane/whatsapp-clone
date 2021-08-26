import React from 'react';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';

import Whatsapp from "../WhatsappStart.png";
import '../css/InitialChatComponent.css' 


export const InitialChatComponent = () => {
    return (
        <div className="initialChatComponent" >
            <img src={Whatsapp} alt="Whatsapp beginning pic" />
            <h1>WhatsApp</h1>
            <hr />
            <div>
                <LaptopMacIcon />
                <div>
                    WhatsApp is available for Windows. 
                    <a className="download-link" target="_blank" href="https://www.whatsapp.com/download">Get it here</a>
                </div>
            </div>
        </div>
    )
}

