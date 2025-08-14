import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Star, TrendingUp } from "lucide-react"

export default function Component() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">Boost Your Success</h1>
          <p className="text-gray-600 text-sm md:text-base">
            One-time purchases to enhance your SkillSwitch experience
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border">
            <Button variant="outline" className="px-8 py-2 text-gray-600 bg-white border-0 hover:bg-gray-50">
              Plans
            </Button>
            <Button className="px-8 py-2 bg-slate-700 hover:bg-slate-800 text-white">Boosts</Button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Boost Post Card */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Boost Post</h3>
              <p className="text-xs text-gray-500 mb-4">Feature your listing at the top of search for 7 days</p>
              <div className="text-2xl font-bold text-gray-900 mb-6">$4.99</div>
              <Button className="w-full bg-slate-700 hover:bg-slate-800 text-white mb-3">Purchase now</Button>
              <p className="text-xs text-gray-400">Available when viewing a specific listing</p>
            </CardContent>
          </Card>

          {/* Verified Badge Card */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Badge</h3>
              <p className="text-xs text-gray-500 mb-4">Feature your listing at the top of search for 7 days</p>
              <div className="text-2xl font-bold text-gray-900 mb-6">$7.99</div>
              <Button className="w-full bg-slate-700 hover:bg-slate-800 text-white mb-3">Purchase now</Button>
              <p className="text-xs text-gray-400">Available when viewing a specific listing</p>
            </CardContent>
          </Card>
        </div>

        {/* Chat Support Button */}
        <div className="fixed bottom-6 right-6">
          <Button size="icon" className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>
    </div>
  )
}
