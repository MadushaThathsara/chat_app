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
          className="bg-cyan-500/10 p-3 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar`}>
              <div className="size-9 rounded-full">
                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium text-sm truncate mb-2">{chat.fullName}</h4>
            {/* <p className="text-slate-400 text-xs truncate">{chat.lastMessage}</p> */}
          </div>
        </div>
      ))}
    </>
  )
}
