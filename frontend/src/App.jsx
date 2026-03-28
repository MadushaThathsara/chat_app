import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ChatPage from './Page/ChatPage'
import LoginPage from './Page/LoginPage'
import SignUpPage from './Page/SignUpPage'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import PageLoader from './components/PageLoader.jsx'
import { Toaster } from 'react-hot-toast'



export default function App() {
  const {checkAuth, isCheckingAuth, authUser} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);

  if(isCheckingAuth) return <PageLoader />

  return (
    <div className='min-h-screen bg-slate-900 relative flex items-center justify-center py-4 px-10 overflow-hidden'>
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className='absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]'/>
      <div className='absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]'/>
      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster/>
    </div>
  )
}
