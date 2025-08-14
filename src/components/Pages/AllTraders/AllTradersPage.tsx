"use client"
import { useState } from "react"
import Image from "next/image"
import { Search, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import img from "@/assets/profiles/profile3.jpg";

type TeamMember = {
  id: number
  name: string
  title: string
  department: string
  status: {
    flying: string
    ethics: string
    performance: string
  }
  metrics: {
    completion: number
    quality: number
    rate: number
  }
  rating: number
  reviewCount: number
  location: string
  isOnline: boolean
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Alice Johnson",
    title: "Senior Trader",
    department: "Equities",
    status: {
      flying: "Flying",
      ethics: "Ethical",
      performance: "Excellent",
    },
    metrics: {
      completion: 98,
      quality: 95,
      rate: 120,
    },
    rating: 4.8,
    reviewCount: 234,
    location: "New York",
    isOnline: true,
  },
 
  {
    id: 3,
    name: "Carol Davis",
    title: "Senior Analyst",
    department: "Fixed Income",
    status: {
      flying: "Flying",
      ethics: "Ethical",
      performance: "Excellent",
    },
    metrics: {
      completion: 92,
      quality: 94,
      rate: 110,
    },
    rating: 4.6,
    reviewCount: 189,
    location: "Tokyo",
    isOnline: true,
  },
  {
    id: 4,
    name: "David Wilson",
    title: "Risk Manager",
    department: "Risk Management",
    status: {
      flying: "Flying",
      ethics: "Ethical",
      performance: "Good",
    },
    metrics: {
      completion: 88,
      quality: 91,
      rate: 95,
    },
    rating: 4.4,
    reviewCount: 167,
    location: "Singapore",
    isOnline: true,
  },
  {
    id: 5,
    name: "Emma Brown",
    title: "Portfolio Manager",
    department: "Asset Management",
    status: {
      flying: "Flying",
      ethics: "Ethical",
      performance: "Excellent",
    },
    metrics: {
      completion: 96,
      quality: 97,
      rate: 140,
    },
    rating: 4.9,
    reviewCount: 312,
    location: "Frankfurt",
    isOnline: false,
  },
  {
    id: 6,
    name: "Frank Miller",
    title: "Quantitative Analyst",
    department: "Quantitative Research",
    status: {
      flying: "Grounded",
      ethics: "Ethical",
      performance: "Good",
    },
    metrics: {
      completion: 83,
      quality: 86,
      rate: 75,
    },
    rating: 4.1,
    reviewCount: 98,
    location: "Hong Kong",
    isOnline: true,
  },

   {
    id: 6,
    name: "Frank Miller",
    title: "Quantitative Analyst",
    department: "Quantitative Research",
    status: {
      flying: "Grounded",
      ethics: "Ethical",
      performance: "Good",
    },
    metrics: {
      completion: 83,
      quality: 86,
      rate: 75,
    },
    rating: 4.1,
    reviewCount: 98,
    location: "Hong Kong",
    isOnline: true,
  },
   {
    id: 6,
    name: "Frank Miller",
    title: "Quantitative Analyst",
    department: "Quantitative Research",
    status: {
      flying: "Grounded",
      ethics: "Ethical",
      performance: "Good",
    },
    metrics: {
      completion: 83,
      quality: 86,
      rate: 75,
    },
    rating: 4.1,
    reviewCount: 98,
    location: "Hong Kong",
    isOnline: true,
  },
]

export default function AllTradersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 my-6 p-6">
      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <div className="relative max-w-xl w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedMembers.map((member) => (
          <div
            key={member.id}
            className="flex flex-col justify-between h-[420px] rounded-2xl bg-white p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Top Content */}
            <div>
              <div className="flex flex-col items-center mb-5">
                <div className="relative mb-4">
                  <Image
                    // src="/placeholder.svg?height=80&width=80"
                    src={img}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-gray-100"
                  />
                  <span
                    className={`absolute bottom-1 right-1 block w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                      member.isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.title}</p>

                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-sm">{member.rating}</span>
                  <span className="text-gray-500 text-xs">({member.reviewCount})</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center mb-5">
                <Badge className="bg-blue-100 text-blue-800 text-xs">{member.status.flying}</Badge>
                <Badge className="bg-green-100 text-green-800 text-xs">{member.status.ethics}</Badge>
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">{member.status.performance}</Badge>
              </div>

              <div className="grid grid-cols-3 text-center mb-4">
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-sm">{member.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rate</p>
                  <p className="font-medium text-sm">${member.metrics.rate}/hr</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Success</p>
                  <p className="font-medium text-sm">{member.metrics.completion}%</p>
                </div>
              </div>
            </div>

            {/* Button */}
            <Link href={`/all-traders/${member.id}`}>
              <Button className="w-full rounded-full text-[#E57931] bg-[#FCF2EA] hover:bg-orange-600 hover:text-white  py-6 text-[14px] font-semibold transition-colors duration-300">
                View Profile
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No team members found matching your search.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-xl"
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? "default" : "outline"}
              onClick={() => handlePageChange(index + 1)}
              className="rounded-xl"
            >
              {index + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-xl"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
