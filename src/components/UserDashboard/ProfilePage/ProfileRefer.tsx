"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";


export default function ProfileRefer() {

    //  set user ID  when api is integrated
  const id = '12345';
  

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`www/xyz.com/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-900">
          Refer a Friend & Earn With us
        </h1>
      </div>

      {/* Invitation Link Section */}
      <div className="space-y-3">
        <Label
          htmlFor="invitation-link"
          className="text-sm font-medium text-gray-700"
        >
          Invitation Link
        </Label>
        <div className="relative">
          <Input
            id="invitation-link"
            type="text"
            value={`www/xyz.com/${id}`}
            readOnly
            className="pr-10 bg-gray-50"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4 text-orange-500" />
          </Button>
        </div>
      </div>

      {/* Share Button */}
      <div className="max-w-72 mx-auto">
        <Button
          className="w-full  bg-slate-800 hover:bg-slate-700 text-white py-3"
          size="lg"
        >
          Share Referral
        </Button>
      </div>

      {/* Reward Section */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">
          Invite 10 friend & get{" "}
          <span className="text-orange-500 font-semibold">15$</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          You have received a new trade offer from Alex Carter for 100 shares of
          TechCorp at $150 per share. Review the offer and respond.
        </p>
      </div>
    </div>
  );
}
