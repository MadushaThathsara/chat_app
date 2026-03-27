import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ChatPage from './Page/ChatPage'
import LoginPage from './Page/LoginPage'
import SignUpPage from './Page/SignUpPage'
import { useAuthStore } from './store/useAuthStore'



export default function App() {
  const { isAuthenticated } = useAuthStore();


  return (
    <div className='min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden'>
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className='absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]'/>
      <div className='absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]'/>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </div>
  )
}
