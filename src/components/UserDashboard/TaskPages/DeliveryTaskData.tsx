/* eslint-disable @typescript-eslint/no-explicit-any */
// components/DeliveredTaskCard.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star } from "lucide-react";
import defaultProfile from "@/assets/profiles/profile1.jpg";

interface DeliveredTaskCardProps {
  task: any; 
  onOpenReviewModal: () => void;
}

export function DeliveredTaskCard({ task, onOpenReviewModal }: DeliveredTaskCardProps) {
  const application = task.task_Application?.[0];
  const trader = application?.offerByTrader;
  const traderName = `${trader?.fastName || "Unknown"} ${trader?.lastName || ""}`.trim();

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-300">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Delivery</h2>

      <div className="flex flex-col md:flex-row md:items-start gap-5">
        <div className="flex-shrink-0">
          <Image
            src={trader?.profilePhoto || defaultProfile}
            alt={traderName}
            width={80}
            height={80}
            className="rounded-full object-cover border-2 border-gray-200"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{traderName}</p>

          <div className="mt-2">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              {task.status}
            </span>
          </div>

          {task.provide_attachments && task.provide_attachments.length > 0 && (
            <div className="mb-4 mt-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Submitted Files:</h4>
              <ul className="space-y-1">
                {task.provide_attachments.map((file: string, idx: number) => (
                  <li key={idx}>
                    <a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline text-sm"
                    >
                      📂 Submitted File {idx + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-4">
            Delivered on: {new Date(task.updatedAt).toLocaleString()}
          </p>

          <div className="mt-5">
            <Button
              onClick={onOpenReviewModal}
              className="bg-orange-100 hover:bg-orange-500 text-orange-500 hover:text-white px-6 py-2 text-sm font-medium"
            >
              Leave a Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}