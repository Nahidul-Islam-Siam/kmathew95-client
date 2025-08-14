"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download } from "lucide-react"

type TransactionType = "withdraw" | "receive" | "pending"

interface Transaction {
  id: string
  title: string
  amount: number
  type: TransactionType
  name: string
  bankName: string
  accountNumber: string
  transactionId: string
}

const allTransactions: Transaction[] = [
  {
    id: "1",
    title: "Build A Dashboard",
    amount: 22,
    type: "withdraw",
    name: "John Smith",
    bankName: "Chase Bank",
    accountNumber: "011545*******",
    transactionId: "174sTER524Tbe3",
  },
  {
    id: "2",
    title: "Website Redesign Project",
    amount: 50,
    type: "receive",
    name: "Sarah Johnson",
    bankName: "Bank of America",
    accountNumber: "022456*******",
    transactionId: "285uFGH635Cdf4",
  },
  {
    id: "3",
    title: "Mobile App Development",
    amount: 120,
    type: "pending",
    name: "Mike Wilson",
    bankName: "Wells Fargo",
    accountNumber: "033567*******",
    transactionId: "396vHIJ746Deg5",
  },
  {
    id: "4",
    title: "SEO Optimization Service",
    amount: 30,
    type: "withdraw",
    name: "Emily Davis",
    bankName: "Citibank",
    accountNumber: "044678*******",
    transactionId: "407wJKL857Efh6",
  },
  {
    id: "5",
    title: "Content Creation Fee",
    amount: 15,
    type: "receive",
    name: "David Brown",
    bankName: "US Bank",
    accountNumber: "055789*******",
    transactionId: "518xMNO968Fgi7",
  },
  {
    id: "6",
    title: "Cloud Migration Setup",
    amount: 80,
    type: "pending",
    name: "Lisa Anderson",
    bankName: "PNC Bank",
    accountNumber: "066890*******",
    transactionId: "629yPQR079Ghj8",
  },
  {
    id: "7",
    title: "Database Management Service",
    amount: 25,
    type: "withdraw",
    name: "Robert Taylor",
    bankName: "TD Bank",
    accountNumber: "077901*******",
    transactionId: "730zSTU180Hik9",
  },
  {
    id: "8",
    title: "Marketing Campaign Launch",
    amount: 45,
    type: "receive",
    name: "Jennifer White",
    bankName: "Capital One",
    accountNumber: "088012*******",
    transactionId: "841aVWX291Ijl0",
  },
  {
    id: "9",
    title: "Software License Renewal",
    amount: 60,
    type: "pending",
    name: "Christopher Lee",
    bankName: "Regions Bank",
    accountNumber: "099123*******",
    transactionId: "952bYZA402Jkm1",
  },
  {
    id: "10",
    title: "Graphic Design Work",
    amount: 35,
    type: "withdraw",
    name: "Amanda Garcia",
    bankName: "Fifth Third Bank",
    accountNumber: "100234*******",
    transactionId: "063cBCD513Kln2",
  },
]

export default function PaymentHistory() {
  const [activeFilter, setActiveFilter] = useState<TransactionType>("withdraw")
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const filtered = allTransactions.filter((transaction) => transaction.type === activeFilter)
    setFilteredTransactions(filtered)
  }, [activeFilter])

  const getButtonClass = (filter: TransactionType) => {
    return activeFilter === filter
      ? "bg-slate-900 text-white hover:bg-slate-800"
      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
  }

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTransaction(null)
  }

  return (
    <div className="my-10 bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-5">
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            className={`px-6 py-2 rounded-full transition-colors duration-200 ${getButtonClass("withdraw")}`}
            onClick={() => setActiveFilter("withdraw")}
          >
            Withdraw History
          </Button>
          <Button
            className={`px-6 py-2 rounded-full transition-colors duration-200 ${getButtonClass("receive")}`}
            onClick={() => setActiveFilter("receive")}
          >
            Receive History
          </Button>
          <Button
            className={`px-6 py-2 rounded-full transition-colors duration-200 ${getButtonClass("pending")}`}
            onClick={() => setActiveFilter("pending")}
          >
            Pending Status
          </Button>
        </div>

        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="rounded-lg shadow-sm">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-gray-800">{transaction.title}</h3>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-900">${transaction.amount}</span>
                    <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                      <Download className="h-5 w-5" />
                      <span className="sr-only">Download</span>
                    </Button>
                    <Button
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm"
                      onClick={() => handleViewDetails(transaction)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">No transactions found for this filter.</div>
          )}
        </div>
      </div>

      {/* Transaction Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-orange-50 border-none rounded-3xl p-8">
          <DialogHeader className="relative">
           
            <DialogTitle className="text-center text-xl font-semibold text-gray-900 mb-8">
              Transaction details
            </DialogTitle>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-6">
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-700 font-medium">Amount</span>
                <span className="text-gray-900 font-semibold">${selectedTransaction.amount}</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-700 font-medium">Name</span>
                <span className="text-gray-900 font-semibold">{selectedTransaction.name}</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-700 font-medium">Bank name</span>
                <span className="text-gray-900 font-semibold">{selectedTransaction.bankName}</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-700 font-medium">Account number</span>
                <span className="text-gray-900 font-semibold">{selectedTransaction.accountNumber}</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-700 font-medium">Transaction ID</span>
                <span className="text-gray-900 font-semibold">{selectedTransaction.transactionId}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
