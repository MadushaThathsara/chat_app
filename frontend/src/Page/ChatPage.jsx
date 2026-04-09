import React, { useState, useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import BorderAnimatedContainer from '../components/BorderAnimatedContainer';
import ProfileHeader from '../components/ProfileHeader';
import ActiveTabSwitch from '../components/ActiveTabSwitch';
import ChatsList from '../components/ChatsList';
import ContactList from '../components/ContactList';
import ChatContainer from '../components/ChatContainer';
import NoConversationPlaceholder from '../components/NoConversationPlaceholder';

export default function ChatPage() {
  const {activeTab, selectedUser} = useChatStore();
  const [showSidebar, setShowSidebar] = useState(true);
  
  useEffect(() => {
    if (selectedUser) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [selectedUser]);

  return (
    <div className='relative w-full max-w-6xl md:h-[550px] h-[460px]'>
      <BorderAnimatedContainer>
       {/* LEFT SIDE */}
        <div className={`${showSidebar ? "flex-1" : "w-0"} bg-slate-800/50 backdrop-blur-sm flex flex-col
          transition-all duration-500 ease-in-out overflow-hidden min-[750px]:w-80 `}
        >
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className={`${showSidebar ? "w-0" : "flex-1"} flex flex-col bg-slate-900/50 backdrop-blur-sm
          transition-all duration-500 ease-in-out overflow-hidden min-[750px]:flex-1 `}
        >
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  )
}
