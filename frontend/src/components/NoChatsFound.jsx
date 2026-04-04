import React from 'react'
import { useChatStore } from '../store/useChatStore.js'
import { MessageCircleIcon } from 'lucide-react'

export default function NoChatsFound() {
    const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
      <div className="w-14 h-14 bg-cyan-500/10 rounded-full flex items-center justify-center">
        <MessageCircleIcon className="w-7 h-7 text-cyan-400" />
      </div>
      <div>
        <h4 className="text-slate-200 font-sm mb-1">No conversations yet</h4>
        <p className="text-slate-400 text-xs px-6">
          Start a new chat by selecting a contact from the contacts tab
        </p>
      </div>
      <button
        onClick={() => setActiveTab("contacts")}
        className="px-4 py-2 text-xs text-cyan-400 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20 transition-colors"
      >
        Find contacts
      </button>
    </div>
  )
}
