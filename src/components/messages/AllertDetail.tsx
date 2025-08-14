import { DollarSign } from "lucide-react"
import { convertDate } from "@/utils/dateConverter"

interface Alert {
  id: string
  type: string
  shortDescription: string
  fullDescription: string
  timestamp: string
}

interface AlertDetailProps {
  alert: Alert
}

export default function AlertDetail({ alert }: AlertDetailProps) {
  return (
    <div className="p-6 bg-figma-bg h-full flex flex-col">
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 text-figma-text-dark mr-4">
          <DollarSign className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-figma-text-dark">{alert.type}</h2>
      </div>
      <p className="text-figma-text-dark text-lg mb-2">{alert.fullDescription}</p>
      <span className="text-sm text-figma-text-gray">Received {convertDate(alert.timestamp, "time")}</span>
    </div>
  )
}
