"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DollarSign, Settings } from "lucide-react"

export function BalanceSettingsPanel() {
  const [currentBalance, setCurrentBalance] = useState<number>(123.45)
  const [maxGiftPrice, setMaxGiftPrice] = useState<string>("50.00")

  const handleTopUp = () => {
    console.log("Top Up button clicked! (Non-functional for now)")
    alert("Topping up is not implemented in this demo. Imagine your balance increased!")
  }

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm shadow-lg border-brand-blue">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-comic text-brand-purple">
          <Settings className="h-6 w-6 text-brand-blue" />
          Balance & Settings
        </CardTitle>
        <CardDescription className="text-slate-600">Manage your gifting budget and preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="current-balance" className="text-lg font-semibold text-slate-700">
            Current Balance
          </Label>
          <div className="flex items-center gap-2 p-3 bg-lime-100 border border-brand-green rounded-md">
            <DollarSign className="h-6 w-6 text-brand-green" />
            <span id="current-balance" className="text-2xl font-bold text-brand-green">
              {currentBalance.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-gift-price" className="text-lg font-semibold text-slate-700">
            Maximum Gift Price ($)
          </Label>
          <Input
            id="max-gift-price"
            type="number"
            value={maxGiftPrice}
            onChange={(e) => setMaxGiftPrice(e.target.value)}
            placeholder="e.g., 50.00"
            className="text-lg border-brand-purple focus:ring-brand-purple"
          />
        </div>

        {/* "Top Up Balance" button styled for visibility */}
        <Button
          onClick={handleTopUp}
          className="w-full bg-brand-pink hover:bg-pink-700 text-white text-lg py-3 shadow-md"
          size="lg"
        >
          Top Up Balance
        </Button>
      </CardContent>
    </Card>
  )
}
