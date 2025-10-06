/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ActiveTaskCard.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star } from "lucide-react";
import defaultProfile from "@/assets/profiles/profile1.jpg";

interface ActiveTaskCardProps {
  task: any;
  onOpenSubmitModal: () => void;
  onOpenReviewModal: () => void;
}

export function ActiveTaskCard({
  task,
  onOpenSubmitModal,
  onOpenReviewModal,
}: ActiveTaskCardProps) {
  const application = task.task_Application?.[0];
  const trader = application?.offerByTrader;
  const traderName = `${trader?.fastName || "Unknown"} ${trader?.lastName || ""}`.trim();
  const isDelivered = ["DELIVERED", "COMPLETED"].includes(task.status);

  const getTimeLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diffInHours = Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60));
    if (diffInHours <= 0) return "Expired";
    if (diffInHours < 24) return `${diffInHours}h left`;
    return `${Math.floor(diffInHours / 24)}d left`;
  };

  const timeLeft = getTimeLeft(task.deadline);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-300 mb-8">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{task.title}</h1>
        <div className="flex items-center gap-2 text-lg text-gray-700">
          <span className="font-semibold">${task.min_salary} - ${task.max_salary}</span>
          <span className="text-gray-400">|</span>
          <span className="font-medium">{timeLeft}</span>
        </div>
      </div>

      <p className="text-gray-700 mb-5 leading-relaxed">{task.description}</p>

      {task.files?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Task Attachments:</h3>
          <ul className="space-y-1">
            {task.files.map((file: string, idx: number) => (
              <li key={idx}>
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  📎 Task File {idx + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-gray-200 my-6"></div>

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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{traderName}</h2>
              <p className="text-sm text-gray-500 mt-1">Employer</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-600">4.8</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-orange-400 text-orange-400" />
                  ))}
                  <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
                </div>
              </div>
            </div>

            <div className="text-right md:ml-auto mt-4 md:mt-0">
              <div className="text-sm text-gray-700">
                <span className="font-semibold">${task.min_salary} - ${task.max_salary}</span>
                <br />
                <span className="text-gray-500">
                  Due: {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-2">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                    ${isDelivered ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                  `}
                >
                  {task.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            {!isDelivered ? (
              <Button
                onClick={onOpenSubmitModal}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 text-sm font-medium"
              >
                Submit Work
              </Button>
            ) : (
              <Button disabled className="bg-gray-300 text-gray-500 px-6 py-2 text-sm">
                Work Delivered
              </Button>
            )}

            <Link href={`/all-traders/${trader?.id}`}>
              <Button variant="outline" className="px-6 py-2 text-sm border-gray-300">
                View Profile
              </Button>
            </Link>
            <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 text-sm">
              Send Message
            </Button>

            {isDelivered && (
              <Button
                onClick={onOpenReviewModal}
                className="bg-orange-100 hover:bg-orange-500 text-orange-500 hover:text-white px-6 py-2 text-sm font-medium"
              >
                Review
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}