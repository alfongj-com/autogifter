export interface Gift {
  id: string
  date: string // ISO date string
  description: string
  price: number
  status: "Sent" | "Planned" | "Error"
}

export interface Friend {
  id: string
  name: string
  birthday: Date
  conversationHistoryFile?: File | null
  conversationHistoryFileName?: string
  giftHistory?: Gift[]
}
