"use client"

import type { Friend } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Cake } from "lucide-react"
import { format } from "date-fns"

interface FriendListProps {
  friends: Friend[]
  onViewDetails: (friend: Friend) => void
  onDelete: (friendId: string) => void
}

export function FriendList({ friends, onViewDetails, onDelete }: FriendListProps) {
  if (friends.length === 0) {
    return <p className="text-center text-slate-500 py-8 text-lg">No friends added yet. Let's add some! 🎉</p>
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="bg-brand-blue/10">
            <TableHead className="font-comic text-brand-blue text-lg">Name</TableHead>
            <TableHead className="font-comic text-brand-blue text-lg">Birthday</TableHead>
            <TableHead className="font-comic text-brand-blue text-lg text-right">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {friends.map((friend) => (
            <TableRow
              key={friend.id}
              onClick={() => onViewDetails(friend)}
              className="hover:bg-pink-100 transition-colors cursor-pointer" // Added cursor-pointer and adjusted hover color
            >
              <TableCell className="font-medium text-slate-800 text-md py-4">{friend.name}</TableCell>
              <TableCell className="text-slate-600 text-md py-4">
                <div className="flex items-center gap-2">
                  <Cake className="h-5 w-5 text-brand-pink" />
                  {format(new Date(friend.birthday), "MMMM do")}
                </div>
              </TableCell>
              <TableCell className="text-right py-4">
                {/* Stop propagation to prevent row click when delete button is clicked */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(friend.id)
                  }}
                  title="Delete Friend"
                  className="text-red-500 hover:bg-red-100"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
