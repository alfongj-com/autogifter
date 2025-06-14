"use client"

import type { Friend } from "@/lib/types"
import { Button } from "@/components/ui/button" // Import Button
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FriendList } from "./friend-list"
import { UserPlus, Gift } from "lucide-react" // Import UserPlus

interface FriendsDashboardProps {
  friends: Friend[]
  onAddFriend: () => void // Prop to handle opening the modal
  onViewDetails: (friend: Friend) => void
  onDeleteFriend: (friendId: string) => void
}

export function FriendsDashboard({ friends, onAddFriend, onViewDetails, onDeleteFriend }: FriendsDashboardProps) {
  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm shadow-lg border-brand-pink">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <CardTitle className="flex items-center gap-2 text-2xl font-comic text-brand-purple">
            <Gift className="h-6 w-6 text-brand-pink" />
            Friends Dashboard
          </CardTitle>
          <CardDescription className="text-slate-600">Your list of amazing friends to auto-gift!</CardDescription>
        </div>
        {/* "Add New Friend" button is back here and styled for visibility */}
        <Button
          onClick={onAddFriend}
          className="mt-4 sm:mt-0 bg-brand-pink hover:bg-pink-700 text-white text-lg py-2 px-4 shadow-md"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Add New Friend
        </Button>
      </CardHeader>
      <CardContent>
        <FriendList friends={friends} onViewDetails={onViewDetails} onDelete={onDeleteFriend} />
      </CardContent>
    </Card>
  )
}
