"use client"

import type { Friend, Gift } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, CalendarDays, Tag, AlertTriangle, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

interface FriendDetailViewProps {
  friend: Friend
  onBack: () => void
}

export function FriendDetailView({ friend, onBack }: FriendDetailViewProps) {
  const getStatusIcon = (status: Gift["status"]) => {
    switch (status) {
      case "Sent":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "Planned":
        return <CalendarDays className="h-5 w-5 text-blue-500" />
      case "Error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="outline" className="border-slate-400 text-slate-700 hover:bg-slate-100">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card className="w-full bg-white/80 backdrop-blur-sm shadow-lg border-brand-green">
        <CardHeader>
          <CardTitle className="font-comic text-brand-green text-3xl">{friend.name}</CardTitle>
          <CardDescription className="text-slate-600 text-lg">
            Birthday: {format(new Date(friend.birthday), "MMMM do, yyyy")}
          </CardDescription>
          {friend.conversationHistoryFileName && (
            <CardDescription className="text-slate-500 text-sm">
              Conversation History: {friend.conversationHistoryFileName}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <h3 className="font-comic text-2xl text-brand-purple mb-4">Gift History</h3>
          {friend.giftHistory && friend.giftHistory.length > 0 ? (
            <ul className="space-y-4">
              {friend.giftHistory.map((gift) => (
                <li key={gift.id} className="p-4 border border-brand-yellow rounded-lg bg-yellow-50/50 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg text-slate-800">{gift.description}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-brand-blue" /> {format(new Date(gift.date), "PPP")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-brand-green flex items-center gap-1 justify-end">
                        <Tag className="h-5 w-5" /> ${gift.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
                        {getStatusIcon(gift.status)}
                        <span>{gift.status}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-slate-500 py-6 text-lg">
              No gifts sent or planned yet for {friend.name}. 🎁
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
