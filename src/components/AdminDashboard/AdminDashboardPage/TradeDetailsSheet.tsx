"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Star } from "lucide-react";
import Image from "next/image";

interface AttachedFile {
  name: string;
  type: string;
  url: string;
}

interface TradeDetails {
  id: string;
  image?: string;
  title?: string; // Made optional
  popular?: boolean;
  status?: string; // Made optional
  days?: number; // Made optional
  price?: number; // Made optional
  trader?: string; // Made optional
  rating?: number; // Made optional
  reviewsCount?: number; // Made optional
  description?: string; // Made optional
  attachedFiles?: AttachedFile[]; // Made optional
}

interface TradeDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  trade: TradeDetails | null;
}

export default function TradeDetailsSheet({
  isOpen,
  onClose,
  trade,
}: TradeDetailsSheetProps) {
  if (!trade) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto p-0"
      >
        <SheetHeader className="p-6 border-b border-gray-100">
          <SheetTitle className="text-2xl font-semibold text-gray-800">
            Trade Details
          </SheetTitle>
        </SheetHeader>
        <div className="p-6 space-y-6">
          {/* Top Card Section */}
          <Card className="shadow-none border border-gray-200 rounded-xl overflow-hidden">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start gap-4">
              <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={
                    trade.image ||
                    "/placeholder.svg?height=96&width=96&query=tesla logo"
                  }
                  alt="Trade Logo"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  {trade.popular && (
                    <Badge className="bg-orange-100 text-orange-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      Popular
                    </Badge>
                  )}
                  {trade.status && ( // Conditionally render status badge
                    <Badge className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      {trade.status}
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 leading-tight">
                  {trade.title || "N/A"}
                </h3>
                <p className="text-sm text-gray-600">
                  Assign by {trade.trader || "N/A"}
                </p>
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-gray-800">
                    {trade.days ?? 0} Day / ${(trade.price ?? 0).toFixed(2)}
                  </span>
                  {trade.rating !== undefined &&
                    trade.reviewsCount !== undefined && ( // Conditionally render rating
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span>
                          {trade.rating.toFixed(1)} ({trade.reviewsCount})
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Job Description
            </h4>
            <p className="text-gray-700 leading-relaxed text-sm">
              {trade.description || "No description available."}
            </p>
          </div>

          {/* Attached Files */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Attached Files
            </h4>
            <div className="space-y-3">
              {(trade.attachedFiles || []).map(
                (
                  file,
                  index // Use || [] for safe map
                ) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {file.type.toUpperCase()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-orange-500 hover:text-orange-600"
                    >
                      <Download className="h-5 w-5" />
                      <span className="sr-only">Download {file.name}</span>
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Delete Button */}
          <div className="pt-4 border-t border-gray-100">
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg">
              Delete Trade
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export type { TradeDetails };
