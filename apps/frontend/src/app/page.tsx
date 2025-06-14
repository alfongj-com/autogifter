"use client";

import { useState } from "react";
import FriendsDashboard from "./components/FriendsDashboard";
import FriendDetail from "./components/FriendDetail";
import BalanceSettings from "./components/BalanceSettings";
import { useWalletBalance } from "../hooks/useWalletBalance";

export type Friend = {
  id: string;
  name: string;
  birthday: string;
  conversationFile?: File;
  giftHistory: GiftHistoryItem[];
};

export type GiftHistoryItem = {
  id: string;
  date: string;
  description: string;
  price: number;
};

export default function Home() {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      birthday: "1995-03-15",
      giftHistory: [
        { id: "1", date: "2024-03-15", description: "Wireless Headphones", price: 89.99 },
        { id: "2", date: "2023-03-15", description: "Coffee Subscription", price: 45.00 },
      ],
    },
    {
      id: "2", 
      name: "Mike Chen",
      birthday: "1992-07-22",
      giftHistory: [
        { id: "3", date: "2024-07-22", description: "Gaming Mouse", price: 65.50 },
      ],
    },
  ]);

  const { balance, loading: balanceLoading, error: balanceError } = useWalletBalance(
    "0x930F513c4C10ce9B4A5858Bf7472d475CeD96380",
    "base-sepolia", 
    "usdxm"
  );
  const [maxGiftPrice, setMaxGiftPrice] = useState(100);

  const addFriend = (friend: Omit<Friend, "id" | "giftHistory">) => {
    const newFriend: Friend = {
      ...friend,
      id: Date.now().toString(),
      giftHistory: [],
    };
    setFriends([...friends, newFriend]);
  };

  const deleteFriend = (friendId: string) => {
    setFriends(friends.filter(f => f.id !== friendId));
    if (selectedFriend?.id === friendId) {
      setSelectedFriend(null);
    }
  };

  if (selectedFriend) {
    return (
      <FriendDetail
        friend={selectedFriend}
        onBack={() => setSelectedFriend(null)}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="heading-font text-4xl sm:text-5xl lg:text-6xl font-bold text-purple-600 mb-2">
            🎁 AutoGifter
          </h1>
          <p className="text-lg sm:text-xl text-purple-500 font-medium">
            AI-powered gift automation for your loved ones
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FriendsDashboard
              friends={friends}
              onAddFriend={addFriend}
              onDeleteFriend={deleteFriend}
              onViewFriend={setSelectedFriend}
            />
          </div>
          
          <div className="lg:col-span-1">
            <BalanceSettings
              balance={balance}
              maxGiftPrice={maxGiftPrice}
              onMaxGiftPriceChange={setMaxGiftPrice}
              onTopUp={() => alert("Top up functionality coming soon!")}
              loading={balanceLoading}
              error={balanceError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
