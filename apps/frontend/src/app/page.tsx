"use client"

import { useState, useEffect } from "react"
import type { Friend } from "@/lib/types"
import { BalanceSettingsPanel } from "@/components/auto-gifter/balance-settings-panel"
import { FriendsDashboard } from "@/components/auto-gifter/friends-dashboard"
import { AddFriendForm } from "@/components/auto-gifter/add-friend-form"
import { FriendDetailView } from "@/components/auto-gifter/friend-detail-view"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { PartyPopper } from "lucide-react"
// Removed UserPlus and Button import from here as it's handled in FriendsDashboard

// Mock Data
const initialFriendsData: Friend[] = [
  {
    id: "1",
    name: "Alice Wonderland",
    birthday: new Date(new Date().getFullYear(), 2, 15), // March 15
    conversationHistoryFileName: "alice_chat.txt",
    giftHistory: [
      { id: "g1", date: "2024-03-15", description: "Mad Hatter Tea Set", price: 45.99, status: "Sent" },
      { id: "g2", date: "2023-12-25", description: "Cheshire Cat Plush", price: 22.5, status: "Sent" },
    ],
  },
  {
    id: "2",
    name: "Bob The Builder",
    birthday: new Date(new Date().getFullYear(), 6, 28), // July 28
    conversationHistoryFileName: "bob_notes.csv",
    giftHistory: [{ id: "g3", date: "2024-07-28", description: "Deluxe Toolbelt", price: 75.0, status: "Planned" }],
  },
  {
    id: "3",
    name: "Charlie Brown",
    birthday: new Date(new Date().getFullYear(), 9, 30), // October 30
    giftHistory: [
      { id: "g4", date: "2023-10-30", description: "A Good Grief T-Shirt (Size M)", price: 19.99, status: "Error" },
    ],
  },
]

export default function AutoGifterPage() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [showAddFriendModal, setShowAddFriendModal] = useState(false)

  useEffect(() => {
    setFriends(initialFriendsData)
  }, [])

  const handleAddFriend = (newFriend: Friend) => {
    setFriends((prevFriends) => [...prevFriends, newFriend])
    setShowAddFriendModal(false)
    console.log("Added friend:", newFriend)
  }

  const handleDeleteFriend = (friendId: string) => {
    if (window.confirm("Are you sure you want to delete this friend? This is a very sad action! 😢")) {
      setFriends((prevFriends) => prevFriends.filter((f) => f.id !== friendId))
      console.log("Deleted friend ID:", friendId)
    }
  }

  const handleViewDetails = (friend: Friend) => {
    setSelectedFriend(friend)
    console.log("Viewing details for:", friend.name)
  }

  const handleBackToDashboard = () => {
    setSelectedFriend(null)
  }

  return (
    <div className="min-h-screen container mx-auto p-4 md:p-8 space-y-8">
      <header className="text-center py-6">
        <h1 className="text-5xl md:text-6xl font-comic text-brand-pink flex items-center justify-center gap-3">
          <PartyPopper className="h-12 w-12 animate-bounce" />
          AutoGifter
          <PartyPopper className="h-12 w-12 animate-bounce" />
        </h1>
        <p className="text-slate-600 text-lg mt-2">The fun & easy way to never miss a special occasion! 🥳</p>
      </header>

      {selectedFriend ? (
        <FriendDetailView friend={selectedFriend} onBack={handleBackToDashboard} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            {/* "Add New Friend" button is now part of FriendsDashboard component */}
            <FriendsDashboard
              friends={friends}
              onAddFriend={() => setShowAddFriendModal(true)} // Prop to open modal
              onViewDetails={handleViewDetails}
              onDeleteFriend={handleDeleteFriend}
            />
          </div>
          <div className="lg:col-span-1">
            <BalanceSettingsPanel />
          </div>
        </div>
      )}

      <Dialog open={showAddFriendModal} onOpenChange={setShowAddFriendModal}>
        <DialogContent className="sm:max-w-[525px] bg-white/90 backdrop-blur-md border-brand-purple">
          <DialogHeader>
            <DialogTitle className="font-comic text-3xl text-brand-purple">Add a Super Friend!</DialogTitle>
            <DialogDescription className="text-slate-600">
              Fill in the details below to add a new friend to your AutoGifter list.
            </DialogDescription>
          </DialogHeader>
          <AddFriendForm onSave={handleAddFriend} onCancel={() => setShowAddFriendModal(false)} />
        </DialogContent>
      </Dialog>

      <footer className="text-center py-8 mt-12 border-t border-brand-blue/30">
        <p className="text-slate-500 font-comic">
          Made with lots of <span className="text-brand-pink">❤</span> and a sprinkle of AI magic!
        </p>
      </footer>
    </div>
  )
}
