import React from 'react'
import { Route , BrowserRouter , Routes } from "react-router-dom"
import SignUp from '../components/SignUp'
import Home from '../components/Home'

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/register" element = {<SignUp/>}/>
            <Route path="/home" element = {<Home/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes