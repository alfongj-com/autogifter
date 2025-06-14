"use client";

import React from "react";
import { Friend } from "../page";

interface FriendDetailProps {
  friend: Friend;
  onBack: () => void;
}

export default function FriendDetail({ friend, onBack }: FriendDetailProps) {
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-purple-200">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-full font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ← Back to Dashboard
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="heading-font text-3xl sm:text-4xl font-bold text-purple-600 mb-2">
              🎁 {friend.name}&apos;s Gift History
            </h1>
            <p className="text-lg text-purple-500 font-medium">
              🎂 Birthday: {formatDate(friend.birthday)}
            </p>
          </div>

          <div className="space-y-6">
            {friend.giftHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎈</div>
                <p className="text-purple-500 text-lg font-medium">
                  No gifts sent yet! The AI will start recommending gifts soon.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="heading-font text-2xl font-bold text-purple-600 mb-4">
                  📅 Gift Timeline
                </h2>
                
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 to-pink-400"></div>
                  
                  {friend.giftHistory
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((gift) => (
                      <div key={gift.id} className="relative flex items-start space-x-6 pb-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                          🎁
                        </div>
                        
                        <div className="flex-1 bg-gradient-to-r from-white to-purple-50 rounded-2xl p-6 border border-purple-200 shadow-md">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg text-purple-700">
                              {gift.description}
                            </h3>
                            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              {formatPrice(gift.price)}
                            </span>
                          </div>
                          
                          <p className="text-purple-500 font-medium">
                            📅 {formatDate(gift.date)}
                          </p>
                          
                          <div className="mt-3 flex items-center space-x-2">
                            <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-semibold">
                              ✅ Delivered
                            </span>
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">
                              🤖 AI Selected
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="heading-font text-xl font-bold text-purple-600 mb-3">
              📊 Gift Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {friend.giftHistory.length}
                </div>
                <div className="text-sm text-purple-500 font-medium">
                  Total Gifts
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(
                    friend.giftHistory.reduce((sum, gift) => sum + gift.price, 0)
                  )}
                </div>
                <div className="text-sm text-purple-500 font-medium">
                  Total Spent
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {friend.giftHistory.length > 0
                    ? formatPrice(
                        friend.giftHistory.reduce((sum, gift) => sum + gift.price, 0) /
                          friend.giftHistory.length
                      )
                    : "$0.00"}
                </div>
                <div className="text-sm text-purple-500 font-medium">
                  Average Gift
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
