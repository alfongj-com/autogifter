"use client";

import { useState, useEffect } from "react";
import FriendsDashboard from "./components/FriendsDashboard";
import FriendDetail from "./components/FriendDetail";
import BalanceSettings from "./components/BalanceSettings";
import { useWalletBalance } from "../hooks/useWalletBalance";

export type Friend = {
  id: string;
  name: string;
  birthday: string;
  conversationFile?: {
    name: string;
    size: number;
    type: string;
  };
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
  const [friends, setFriends] = useState<Friend[]>([]);
  const [maxGiftPrice, setMaxGiftPrice] = useState(100);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { balance, loading: balanceLoading, error: balanceError } = useWalletBalance(
    process.env.NEXT_PUBLIC_WALLET_ADDRESS || "0x930F513c4C10ce9B4A5858Bf7472d475CeD96380",
    process.env.NEXT_PUBLIC_CHAIN || "base-sepolia", 
    process.env.NEXT_PUBLIC_TOKEN || "usdxm"
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [friendsResponse, settingsResponse] = await Promise.all([
        fetch('/api/friends'),
        fetch('/api/settings')
      ]);

      if (!friendsResponse.ok || !settingsResponse.ok) {
        throw new Error('Failed to load data');
      }

      const friendsData = await friendsResponse.json();
      const settingsData = await settingsResponse.json();

      setFriends(friendsData);
      setMaxGiftPrice(settingsData.maxGiftPrice);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addFriend = async (friend: Omit<Friend, "id" | "giftHistory">) => {
    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(friend),
      });

      if (!response.ok) {
        throw new Error('Failed to add friend');
      }

      const newFriend = await response.json();
      setFriends([...friends, newFriend]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add friend');
    }
  };

  const deleteFriend = async (friendId: string) => {
    try {
      const response = await fetch(`/api/friends?id=${friendId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete friend');
      }

      setFriends(friends.filter(f => f.id !== friendId));
      if (selectedFriend?.id === friendId) {
        setSelectedFriend(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete friend');
    }
  };

  const updateMaxGiftPrice = async (newMaxGiftPrice: number) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ maxGiftPrice: newMaxGiftPrice }),
      });

      if (!response.ok) {
        throw new Error('Failed to update max gift price');
      }

      setMaxGiftPrice(newMaxGiftPrice);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update max gift price');
    }
  };

  const handleTopUp = () => {
    alert("Top up functionality coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎁</div>
          <p className="text-purple-500 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              onMaxGiftPriceChange={updateMaxGiftPrice}
              onTopUp={handleTopUp}
              loading={balanceLoading}
              error={balanceError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
