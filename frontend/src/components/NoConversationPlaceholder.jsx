import React from 'react'
import { MessageCircleIcon } from 'lucide-react'

export default function NoConversationPlaceholder() {
  return (
     <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="size-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
        <MessageCircleIcon className="size-8 text-cyan-400" />
      </div>
      <h3 className="text-md font-semibold text-slate-200 mb-1">Select a conversation</h3>
      <p className="text-sm text-slate-400 max-w-md">
        Choose a contact from the sidebar to start chatting or continue a previous conversation.
      </p>
    </div>
  )
}
