import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore.js'
import { useAuthStore } from '../store/useAuthStore.js'
import UsersLoadingSkeleton from './UsersLoadingSkeleton.jsx'
import NoChatsFound from './NoChatsFound.jsx'

export default function ChatsList() {
  const {getChatContacts, chatContacts, isUsersLoading, setSelectedUser} = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getChatContacts();
  }, [getChatContacts]);

  if(isUsersLoading) return <UsersLoadingSkeleton />;

  if(chatContacts.length === 0) return <NoChatsFound />;

  return (
    <>
      {chatContacts.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-2 sm:p-3 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors flex items-center justify-between"
          onClick={() => setSelectedUser(chat)}
        >
          
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Profile Image & Online Status */}
            <div className={`avatar avatar-${onlineUsers.includes(chat._id) ? "online" : "offline"}`}>
              <div className="size-7 sm:size-9 rounded-full">
                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
              </div>
            </div>

            {/* Name & Last Message */}
            <div className='flex-col gap-0.2 sm:gap-0.3'>
              <h4 className="text-slate-200 font-medium text-[12px] sm:text-sm truncate">{chat.fullName}</h4>
              <p className= {` text-xs truncate ${chat.unreadCount > 0 ? "text-cyan-400 font-bold" : "text-slate-400"}`}>{chat.lastMessage || "No messages yet"}</p>
            </div>

          </div>

          {/* Unread Count */}
          {chat.unreadCount > 0 && (
            <div className="bg-cyan-500 text-white text-[10px] flex items-center justify-center font-bold size-4 rounded-full px-2 py-1">
              {chat.unreadCount}
            </div>
          )}

        </div>
      ))}
    </>
  )
}
