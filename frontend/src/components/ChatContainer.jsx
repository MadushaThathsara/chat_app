import { useEffect, useRef } from "react";
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder.jsx';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton.jsx';
import MessageInput from './MessageInput.jsx';

export default function ChatContainer() {
  const {getMessages, selectedUser, messages, isMessagesLoading, subscribeToMessages, unsubscribeFromMessages,} = useChatStore();
  const {authUser} = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    // subscribeToMessages();

    // // clean up
    // return () => unsubscribeFromMessages();

  }, [selectedUser, getMessages]);

  useEffect(() => {
  if (messageEndRef.current && messages) {

    const timeoutId = setTimeout(() => {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100); 
    
    return () => clearTimeout(timeoutId);
  }
}, [messages]);

  return (
    <>
    <ChatHeader />
    <div className='flex-1 px-6 overflow-y-auto py-8'>

      {messages.length <= 0 || isMessagesLoading ? (

        isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )

      ):(
        <div className='max-w-3xl mx-auto space-y-6'>
          {messages.map((message) => (
            <div 
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            >
              <div className={`chat-bubble p-2 ${message.senderId === authUser._id ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"}`}>

                {message.image && (
                  <img src={message.image} alt="Shared Image" className='md:max-w-[200px] sm:max-w-[150px] max-w-[100px] object-cover rounded-lg' />
                )}
                {message.text && (
                  <p className={`text-xs sm:text-sm  ${message.image ? "mt-2" : ""}`}>{message.text}</p>
                )}

                <p className="text-[8px] sm:text-xs mt-1 opacity-75 flex items-center gap-1">
                  {new Date(message.createdAt).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

              </div>
            </div>
          ))}
          {/* 👇 scroll target */}
          <div ref={messageEndRef} />
        </div>
      )}
    </div>

    <MessageInput />

    </>
  )
}
