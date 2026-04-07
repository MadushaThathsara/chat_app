import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import {XIcon} from "lucide-react";
import { useAuthStore } from '../store/useAuthStore';

export default function ChatHeader() {
    const {selectedUser, setSelectedUser} = useChatStore();
    const { onlineUsers } = useAuthStore();
    const isOnline = onlineUsers.includes(selectedUser._id);

    useEffect(() => {
        const handleEscKey = (e) => {
            if(e.key === "Escape") setSelectedUser(null);
        };

        window.addEventListener("keydown", handleEscKey);
        return () => window.removeEventListener("keydown", handleEscKey);
    }, [setSelectedUser]);

  return (
    <div className='flex justify-between items-center p-4 bg-slate-800/50 border-b border-slate-700/50'>

      <div className="flex items-center space-x-3">

        <div className={`avatar avatar-${isOnline ? "online" : "offline"}`}>
          <div className="w-10 rounded-full">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-sm">{selectedUser.fullName}</h3>
          <p className="text-slate-400 text-xs">{isOnline ? "online" : "offline"}</p>
        </div>

      </div>

      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-4 h-4 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>

    </div>
  )
}
    