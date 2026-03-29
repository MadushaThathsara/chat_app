import React, { useState } from 'react'
import {useAuthStore} from '../store/useAuthStore'
import BorderAnimatedContainer from '../components/BorderAnimatedContainer'
import { Link } from 'react-router-dom'
import { Mail, Lock, Loader, MessageCircle } from 'lucide-react'

export default function LoginPage() {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    })
    const {login, isLoggingIn} = useAuthStore();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      await login(formData);
    }
  return (
        <div className='max-w-4xl mx-auto w-full flex items-center justify-center p-4 bg-slate-900'>
      <div className="relative w-full max-w-6xl md:h-[550px] h-[460px]">

      <BorderAnimatedContainer>

        <div className='w-full flex flex-col md:flex-row'>
      
          {/* FORM COLUMN - LEFT SIDE */}
          <div className='md:w-1/2 p-8 flex flex-col items-center justify-center md:border-r border-slate-600/30'>

        {/* HEADING TEXT */}
        <div className='text-center mb-3'>
          <MessageCircle className='w-8 h-8 md:w-12 md:h-12 mx-auto text-slate-400 md:mb-4 mb-2'/>
          <h2 className='md:text-2xl text-xl font-bold text-slate-200 md:mb-1 '>Welcome Back</h2>
          <p className='text-slate-400'>Login to access to your account</p>
        </div>

        {/* FORM */}
          <form onSubmit={handleSubmit} className="md:space-y-3 space-y-2">

            {/* EMAIL INPUT */}
            <div>
              <label className="auth-input-label">Email</label>
              <div className='relative'>
                <Mail className="auth-input-icon" />
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className="input" 
                  placeholder="johndoe@gmail.com"
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label className="auth-input-label">Password</label>
                <div className="relative">
                  <Lock className="auth-input-icon" />

                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input"
                    placeholder="Enter your password"
                  />
                </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button className="auth-btn " type="submit" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <Loader className="size-5 animate-spin mx-auto" />
                ) : (
                  "Login"
                )}
            </button>

            <div className="md:mt-4 mt-2 text-center">
              <Link to="/signup" className="auth-link">
                Don't have an account? Sign Up
              </Link>
            </div>

          </form>
          </div>

          {/* FORM ILLUSTRATION - RIGHT SIDE */}
          <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
        <div>
          <img
            src="/login.png"
            alt="People using mobile devices"
            className="w-full h-auto object-contain"
          />
          <div className="mt-6 text-center">
            <h3 className="text-xl font-medium text-cyan-400">Connect anytime, anywhere</h3>

            <div className="mt-4 flex justify-center gap-4">
              <span className="auth-badge">Free</span>
              <span className="auth-badge">Easy Setup</span>
              <span className="auth-badge">Private</span>
            </div>
          </div>
        </div>
          </div>
        </div>
      </BorderAnimatedContainer>  
      </div>
    </div>
  )
}
