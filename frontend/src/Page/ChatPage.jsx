import React from 'react'
import { useAuthStore } from '../store/useAuthStore';

export default function ChatPage() {
  const {logout} = useAuthStore();

  return (
    <div>
      ChatPage
      <br />
      <button onClick={logout}>logout</button>
    </div>
  )
}
