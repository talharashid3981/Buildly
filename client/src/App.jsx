import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import Dashboard from './pages/Dashboard'
import Generate from './pages/Generate'
import WebsiteEditor from './pages/Editor'
import Livesite from './pages/Livesite'
export const serverUrl = "https://buildly-ohex.onrender.com"

const App = () => {
  useGetCurrentUser()
  const {userData} = useSelector(state=>state.user)
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/> } />
        <Route path='/site/:id' element={<Livesite/> } />
        <Route path='/dashboard' element={userData ? <Dashboard /> :  <Home /> } />
        <Route path='/generate' element={userData ? <Generate /> : <Home /> } />
        <Route path='/editor/:id' element={userData ? <WebsiteEditor /> : <Home /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
