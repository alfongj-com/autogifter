"use client";

import React, { useState, useRef } from "react";
import { Friend } from "../page";

interface FriendsDashboardProps {
  friends: Friend[];
  onAddFriend: (friend: Omit<Friend, "id" | "giftHistory">) => void;
  onDeleteFriend: (friendId: string) => void;
  onViewFriend: (friend: Friend) => void;
}

export default function FriendsDashboard({
  friends,
  onAddFriend,
  onDeleteFriend,
  onViewFriend,
}: FriendsDashboardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFriend, setNewFriend] = useState({
    name: "",
    birthday: "",
    conversationFile: null as File | null,
  });
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateValue = dateInputRef.current?.value || "";
    if (newFriend.name && dateValue) {
      const friendData = {
        name: newFriend.name,
        birthday: dateValue,
        conversationFile: newFriend.conversationFile ? {
          name: newFriend.conversationFile.name,
          size: newFriend.conversationFile.size,
          type: newFriend.conversationFile.type,
        } : undefined,
      };
      onAddFriend(friendData);
      setNewFriend({ name: "", birthday: "", conversationFile: null });
      if (dateInputRef.current) {
        dateInputRef.current.value = "";
      }
      setShowAddForm(false);
    }
  };

  const formatBirthday = (birthday: string) => {
    const [year, month, day] = birthday.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-font text-2xl sm:text-3xl font-bold text-purple-600">
          👥 Friends Dashboard
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {showAddForm ? "Cancel" : "Add Friend"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border border-purple-200">
          <h3 className="heading-font text-xl font-bold text-purple-600 mb-4">
            ✨ Add New Friend
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-purple-600 mb-2">
                Name
              </label>
              <input
                type="text"
                value={newFriend.name}
                onChange={(e) => setNewFriend({ ...newFriend, name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                placeholder="Enter friend's name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-purple-600 mb-2">
                Birthday
              </label>
              <input
                ref={dateInputRef}
                type="date"
                className="w-full px-4 py-2 rounded-xl border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-purple-600 mb-2">
                Conversation History (Optional)
              </label>
              <input
                type="file"
                accept=".txt,.csv"
                onChange={(e) => setNewFriend({ ...newFriend, conversationFile: e.target.files?.[0] || null })}
                className="w-full px-4 py-2 rounded-xl border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              <p className="text-xs text-purple-500 mt-1">
                Upload .txt or .csv files with your conversation history
              </p>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              💾 Save Friend
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {friends.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎈</div>
            <p className="text-purple-500 text-lg font-medium">
              No friends added yet! Add your first friend to get started.
            </p>
          </div>
        ) : (
          friends.map((friend) => (
            <div
              key={friend.id}
              className="bg-gradient-to-r from-white to-purple-50 rounded-2xl p-4 border border-purple-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-purple-700">
                    {friend.name}
                  </h3>
                  <p className="text-purple-500 font-medium">
                    🎂 Birthday: {formatBirthday(friend.birthday)}
                  </p>
                  <p className="text-sm text-purple-400">
                    {friend.giftHistory.length} gifts sent
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewFriend(friend)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => onDeleteFriend(friend.id)}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
