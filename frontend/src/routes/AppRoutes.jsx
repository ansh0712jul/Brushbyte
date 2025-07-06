import React from 'react'
import { Route , BrowserRouter , Routes } from "react-router-dom"
import SignUp from '../components/SignUp'
import Home from '../components/Home'
import Login from '../components/Login'
import MainLayout from '../components/MainLayout'
import Profile from '../components/Profile'

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/register" element = {<SignUp/>}/>
            <Route path="/login" element = {<Login/>}/>
            

            {/* main layout route with nested children */}
            <Route path= "/" element={<MainLayout/>} >
                <Route path="/home" element={<Home/>}/>
                <Route path='/profile' element={<Profile/>}/>
            </Route>

        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes