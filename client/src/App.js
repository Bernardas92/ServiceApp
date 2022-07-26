import './App.css';
import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'
import Registration from './components/registration/Registration.js'
import ProfileCreate from './components/profile-create/ProfileCreate.js'
import ProfileEdit from './components/profile-edit/ProfileEdit.js'
import ProfileList from './components/profile-list/ProfileList.js'
import Profile from './components/profile/Profile.js'
import Header from './components/header/Header.js'
import Login from './components/login/Login.js'
import ServiceCreate from './components/service-create/ServiceCreate.js';
import ProfileListAdmin from './components/profile-list-admin/ProfileListAdmin.js';
import ServiceListAdmin from './components/service-list-admin/ServiceListAdmin.js';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [show, setShow] = useState(true)
  const [userId, setUserId] = useState('')

  useEffect(()=>{
    axios.get('/checkAuth', {withCredentials: true})
    .then(resp =>{
      // console.log(resp)
      if(resp.data.id){
        setIsLoggedIn(true)
        setUserId(resp.data.id)
      }
    })
  }, [])

  const handleLoginState = (value)=>{
    setIsLoggedIn(value)
    setShow(!value)
  }

  return (
    <Router>
    <Header show={show} loggedIn={isLoggedIn}/>
      <Routes>
        <Route path="/" element={<ProfileList />}/>
        {show && (<Route path="/login" element={<Login state={handleLoginState}/>}/>)}
        {show && (<Route path="/registration" element={<Registration/>}/>)}
        {isLoggedIn && (<Route path="/create-profile" element={<ProfileCreate />} />)}
        {isLoggedIn && (<Route path="/create-service" element={<ServiceCreate />} />)}
        <Route path="/profile/:id" element={<Profile />}/>
        {/* {isLoggedIn && (<Route path="/edit" element={<ProfileEdit />} />)} */}
        {isLoggedIn && (<Route path="/admin-panel" element={<ProfileListAdmin />} />)}
        {isLoggedIn && (<Route path="/services" element={<ServiceListAdmin />} />)}
        {isLoggedIn && (<Route path="/edit/:id" element={<ProfileEdit/>} />)}
      </Routes>
    </Router>
  );
}

export default App;
