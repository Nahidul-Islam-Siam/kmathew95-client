import { Button } from "@/components/ui/button";
import img from "@/assets/CardImage/Frame 2147225319.png";
import Image from "next/image";

const servicesData = [
  {
    id: 1,
    title: "Bespoke Logo+OneDay+Unlimited Revs+Favicon+Source files",
    price: "2 Day / $50.00",
    status: "Cancel",
    statusColor: "orange",
  },
  {
    id: 2,
    title: "Bespoke Logo+OneDay+Unlimited Revs+Favicon+Source files",
    price: "2 Day / $50.00",
    status: "Completed",
    statusColor: "green",
  },
  {
    id: 3,
    title: "Bespoke Logo+OneDay+Unlimited Revs+Favicon+Source files",
    price: "2 Day / $50.00",
    status: "Cancel",
    statusColor: "orange",
  },
  {
    id: 4,
    title: "Bespoke Logo+OneDay+Unlimited Revs+Favicon+Source files",
    price: "2 Day / $50.00",
    status: "Completed",
    statusColor: "green",
  },
  {
    id: 5,
    title: "Bespoke Logo+OneDay+Unlimited Revs+Favicon+Source files",
    price: "2 Day / $50.00",
    status: "Cancel",
    statusColor: "orange",
  },
];

export default function AllTradesHistory() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      {servicesData.map((service) => (
        <div
          key={service.id}
          className="flex items-center gap-4 p-4 py-6 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          {/* Tesla Logo */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 
            rounded-lg flex items-center justify-center">
              <Image src={img} alt="Logo" width={400} height={400} 
              className="w-20 h-20 object-cover rounded-lg" />
            </div>
          </div>

          {/* Service Details */}
          <div className="flex-1">
            <div className="text-sm text-gray-700 mb-2">{service.title}</div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-transparent"
            >
              View Details
            </Button>
          </div>

          {/* Price and Status */}
          <div className="flex flex-col items-end gap-2">
            <div className="text-sm font-medium text-gray-900">
              {service.price}
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                service.statusColor === "orange"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {service.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
