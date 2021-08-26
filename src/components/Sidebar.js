import React,{ useState, useEffect} from 'react';
import db from '../firebase.js';
import firebase from "firebase";
import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';

import { useStateValue } from '../contexts/StateProvider';
import SidebarChat from './SidebarChat';
import '../css/Sidebar.css';


function Sidebar() {

    const [rooms, setRooms] = useState([]);
    const [{user} , dispatch ] = useStateValue();
    const [anchorEl, setAnchorEl] = useState(null);
    const [ searchTerm, setSearchTerm ] = useState("");

    const handleClick = (event) => {      
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const createChat = () => {
        const roomName = prompt("Please enter name for chat");

        if(roomName){
            db.collection("rooms").add({
                name: roomName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        }
    }

    const logOut = ()=>{

        firebase.auth().signOut().then(()=>{
            handleClose();
            console.log("sign out successfully");
        }).catch(err=>console.log(err));
    
    }

    useEffect(() => {
        db.collection('rooms').orderBy("timestamp","desc").onSnapshot(snapshot => 
            (
                setRooms(snapshot.docs.map(doc => 
                    (
                        {
                            id: doc.id,
                            data: doc.data()
                        }
                    )
                ))
            ))
    },[])

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar style={{margin: "4px"}} src={user?.photoURL}/>
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton onClick={handleClick} aria-controls="simple-menu">
                        <MoreVertIcon />
                    </IconButton>

                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={createChat}>New Chat</MenuItem>
                        <MenuItem onClick={logOut}>Log Out</MenuItem>
                    </Menu>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchIcon />
                    <input type="text" placeholder="Search or start new chat" onChange={(e) => {setSearchTerm(e.target.value)}}/>
                </div>
            </div>
            <div className="sidebar__chats">
                <SidebarChat addNewChat />
                {
                    rooms.filter((room) => {
                        if(searchTerm === ""){
                            return room
                        }else if(room.data.name.toLowerCase().includes(searchTerm.toLowerCase())){
                            return room
                        }
                    }).map(room => (
                        <SidebarChat key={room.id} id={room.id} name={room.data.name}/>
                    ))
                }
    
            </div>
        </div>
    )
}

export default Sidebar;

