import React from 'react'
import { useChatStore } from '../store/useChatStore'

export default function ActiveTabSwitch() {
  const {activeTab, setActiveTab} = useChatStore();
  return (
    <div className="tabs bg-transparent p-2 m-1 text-sm flex">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab flex-1  rounded  ${activeTab === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}
      >
        Chats 
      </button>
      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab flex-1 rounded ${activeTab === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}
      >
        Contacts
      </button>
    </div>
  )
}