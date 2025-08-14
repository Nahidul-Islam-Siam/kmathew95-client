"use client"

import { DollarSign } from "lucide-react"
import { convertDate } from "@/utils/dateConverter"

interface Alert {
  id: string
  type: string
  shortDescription: string
  fullDescription: string
  timestamp: string
}

interface AlertListItemProps {
  alert: Alert
  onSelectAlert: (alert: Alert) => void
  isSelected: boolean
}

export default function AlertListItem({ alert, onSelectAlert, isSelected }: AlertListItemProps) {
  return (
    <div
      className={`flex items-center space-x-3 py-3 px-3 rounded-xl cursor-pointer transition-colors duration-200
        ${
          isSelected
            ? "bg-blue-50 text-figma-dark-blue" // Selected state from Figma
            : "bg-transparent hover:bg-gray-100 text-figma-text-dark"
        }`}
      onClick={() => onSelectAlert(alert)}
    >
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-figma-text-dark">
        <DollarSign className="h-5 w-5" />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-semibold text-base truncate">{alert.type}</span>
        <span className="text-sm text-figma-text-gray truncate">Received {convertDate(alert.timestamp, "time")}</span>
      </div>
    </div>
  )
}
