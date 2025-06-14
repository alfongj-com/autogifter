"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import type { Friend } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, UploadCloud } from "lucide-react"
import { format } from "date-fns"

interface AddFriendFormProps {
  onSave: (friend: Friend) => void
  onCancel: () => void
}

export function AddFriendForm({ onSave, onCancel }: AddFriendFormProps) {
  const [name, setName] = useState("")
  const [birthday, setBirthday] = useState<Date | undefined>()
  const [conversationHistoryFile, setConversationHistoryFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>("")

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setConversationHistoryFile(file)
      setFileName(file.name)
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!name || !birthday) {
      alert("Please fill in name and birthday!")
      return
    }
    const newFriend: Friend = {
      id: Date.now().toString(), // Simple ID generation for stub
      name,
      birthday,
      conversationHistoryFile: conversationHistoryFile || undefined,
      conversationHistoryFileName: fileName || undefined,
      giftHistory: [],
    }
    onSave(newFriend)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <div>
        <Label htmlFor="name" className="text-md font-semibold text-slate-700">
          Friend's Name
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="E.g., Alex Doe"
          required
          className="mt-1 border-brand-blue focus:ring-brand-blue"
        />
      </div>

      <div>
        <Label className="text-md font-semibold text-slate-700">Birthday</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal mt-1 border-brand-blue hover:bg-blue-50",
                !birthday && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-brand-blue" />
              {birthday ? format(birthday, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white">
            <Calendar
              mode="single"
              selected={birthday}
              onSelect={setBirthday}
              initialFocus
              captionLayout="dropdown" // Changed from "dropdown-buttons"
              fromYear={1900}
              toYear={new Date().getFullYear()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="conversation-history" className="text-md font-semibold text-slate-700">
          Conversation History (.txt, .csv)
        </Label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-green border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-brand-green" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="conversation-history"
                className="relative cursor-pointer bg-white rounded-md font-medium text-brand-pink hover:text-pink-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-pink"
              >
                <span>Upload a file</span>
                <Input
                  id="conversation-history"
                  name="conversation-history"
                  type="file"
                  className="sr-only"
                  accept=".txt,.csv"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            {fileName ? (
              <p className="text-xs text-gray-500">{fileName}</p>
            ) : (
              <p className="text-xs text-gray-500">TXT, CSV up to 10MB</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-slate-400 text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-brand-green hover:bg-green-600 text-white">
          Save Friend
        </Button>
      </div>
    </form>
  )
}
