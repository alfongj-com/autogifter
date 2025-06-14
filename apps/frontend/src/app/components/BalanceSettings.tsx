"use client";

import React from "react";

interface BalanceSettingsProps {
  balance: number;
  maxGiftPrice: number;
  onMaxGiftPriceChange: (price: number) => void;
  onTopUp: () => void;
  loading?: boolean;
  error?: string | null;
}

export default function BalanceSettings({
  balance,
  maxGiftPrice,
  onMaxGiftPriceChange,
  onTopUp,
  loading = false,
  error = null,
}: BalanceSettingsProps) {
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-purple-200 h-fit">
      <h2 className="heading-font text-2xl sm:text-3xl font-bold text-purple-600 mb-6">
        💰 Balance & Settings
      </h2>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <h3 className="heading-font text-lg font-bold text-green-600 mb-2">
            💳 Current Balance
          </h3>
          {loading ? (
            <div className="text-2xl font-bold text-blue-600">
              Loading...
            </div>
          ) : error ? (
            <div className="text-2xl font-bold text-red-600">
              Error: {error}
            </div>
          ) : (
            <div className="text-3xl font-bold text-green-700">
              {formatBalance(balance)}
            </div>
          )}
          <p className="text-sm text-green-600 mt-2">
            Available for automatic gift purchases
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="heading-font text-lg font-bold text-blue-600 mb-4">
            🎯 Maximum Gift Price
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold text-blue-600 min-w-[60px]">
                $0
              </span>
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                value={maxGiftPrice}
                onChange={(e) => onMaxGiftPriceChange(Number(e.target.value))}
                className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(maxGiftPrice / 500) * 100}%, #dbeafe ${(maxGiftPrice / 500) * 100}%, #dbeafe 100%)`
                }}
              />
              <span className="text-sm font-semibold text-blue-600 min-w-[60px]">
                $500
              </span>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-blue-700">
                {formatBalance(maxGiftPrice)}
              </span>
              <p className="text-sm text-blue-600 mt-1">
                AI will not recommend gifts above this price
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onTopUp}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          💎 Top Up Balance
        </button>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
          <h3 className="heading-font text-lg font-bold text-yellow-600 mb-3">
            ⚙️ Automation Settings
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-yellow-700">
                🤖 AI Gift Selection
              </span>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                ✅ Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-yellow-700">
                📅 7-Day Advance Purchase
              </span>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                ✅ Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-yellow-700">
                📧 Purchase Notifications
              </span>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                ✅ Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
