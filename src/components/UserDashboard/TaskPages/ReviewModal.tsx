// components/ReviewModal.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    taskId: string;
    rating: number;
    comment: string;
    reviewReceiverId: string;
  }) => void;
  loading?: boolean;
}

export default function ReviewModal({
  open,
  onClose,
  onSubmit,
  loading,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please provide a rating.");
      return;
    }
    if (!comment.trim()) {
      alert("Please write a comment.");
      return;
    }

    onSubmit({
      taskId: "TODO_TASK_ID", // Will be passed from parent
      rating,
      comment: `${title ? title + " - " : ""}${comment}`,
      reviewReceiverId: "TODO_RECEIVER_ID", // Also passed from parent
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Leave a Review</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${
                    (hoverRating || rating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-300 text-gray-300"
                  }`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <div>
            <Input
              placeholder="Review Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Textarea
              placeholder="Write your detailed feedback..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-32"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              className="bg-gray-500 hover:bg-gray-600"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}