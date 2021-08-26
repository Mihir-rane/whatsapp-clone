import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './components/Login';
import { useStateValue } from './contexts/StateProvider';
import { InitialChatComponent } from './components/InitialChatComponent';
import { auth } from './firebase';
import { actionTypes } from './reducer/reducer';

function App() {

  const [{user}, dispatch] = useStateValue();
  const [ authenticted, setAuthenticted ] = useState(false)

  useEffect(()=>{
    var ismounted = true;

    ismounted &&  auth.onAuthStateChanged((user)=> {
     
      if (user) {
        // User is signed in.
        dispatch({
          type: actionTypes.SET_USER,
          user: user,
         })
        }
      else
      {
        dispatch({
          type: actionTypes.SET_USER,
          user: null,
         })
 
      }

      setAuthenticted(true)
     
    });
    return ()=>{
      
      ismounted=false;
      
    }
    
    

  },[dispatch]);

  return (
    <div className="App">
      {
        (!user && authenticted ) ? (
          <Login />
        ):(
          <div>
            <div className="green_background">
          
            </div>
            <div className="app_body">
              <Router>
                <Sidebar/>
                <Switch> 
                  <Route path="/rooms/:roomId">
                    <Chat/>
                  </Route>  
                  <Route path="/">
                    <InitialChatComponent />
                  </Route>           
                </Switch>           
              </Router>
            </div>
          </div>
        )
      }
      
    </div>
  );
}

export default App;
