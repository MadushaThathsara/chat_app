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
    <div className='flex justify-between items-center py-2 px-4 sm:py-4  bg-slate-800/50 border-b border-slate-700/50'>

      <div className="flex items-center space-x-3">

        <div className={`avatar avatar-${isOnline ? "online" : "offline"}`}>
          <div className="sm:w-10 w-8  rounded-full">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-sm md:text-sm text-[12px]">{selectedUser.fullName}</h3>
          <p className="text-slate-400 md:text-xs text-[11px]">{isOnline ? "online" : "offline"}</p>
        </div>

      </div>

      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="md:w-4 md:h-4 w-3 h-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>

    </div>
  )
}
    