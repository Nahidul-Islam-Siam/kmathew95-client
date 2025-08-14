/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Corrected import path: 'UI' to 'ui'
import {
  Download,
  MoreHorizontal,
  Search,
  Star,
  Trash2,
  Eye,
} from "lucide-react";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import TradeDetailsSheet from "./TradeDetailsSheet";

type TradeStatus = "Processing" | "Trade Done" | "Cancel";

interface Trade {
  id: string;
  deadline: string;
  trader: string;
  amount: number;
  status: TradeStatus;
  review: number;
  // New fields for modal details
  image?: string;
  title?: string;
  description?: string;
  popular?: boolean;
  price?: number;
  days?: number;
  reviewsCount?: number;
  attachedFiles?: { name: string; type: string; url: string }[];
}

export default function RecentTradesTable() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [tradesData, setTradesData] = useState<{
    data: Trade[];
    total: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  // Fake API
  useEffect(() => {
    const fetchTrades = async () => {
      setIsLoading(true);
      await new Promise((res) => setTimeout(res, 500));
      const allTrades: Trade[] = [
        {
          id: "1001",
          deadline: "2025-05-19T03:55:00Z",
          trader: "Wilson Levin",
          amount: 1234,
          status: "Processing" as TradeStatus,
          review: 5,
          image: "/placeholder.svg?height=96&width=96",
          title: "bespoke Logo+OneDay+Unlimited Rev+Favicon+Source files",
          popular: true,
          price: 50.0,
          days: 2,
          reviewsCount: 73,
          description:
            "Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment. Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.\n\nCapitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line.",
          attachedFiles: [
            { name: "Company logo", type: "pdf", url: "/placeholder.pdf" },
            { name: "Company brief", type: "pdf", url: "/placeholder.pdf" },
          ],
        },
        {
          id: "1002",
          deadline: "2025-05-18T03:55:00Z",
          trader: "Kadin Gouse",
          amount: 1234,
          status: "Trade Done" as TradeStatus,
          review: 5,
        },
        {
          id: "1003",
          deadline: "2025-05-17T03:55:00Z",
          trader: "Justin Workman",
          amount: 1234,
          status: "Trade Done" as TradeStatus,
          review: 5,
        },
        {
          id: "1004",
          deadline: "2025-05-17T01:00:00Z",
          trader: "Roger Lubin",
          amount: 1234,
          status: "Trade Done" as TradeStatus,
          review: 5,
        },
        {
          id: "1005",
          deadline: "2025-05-16T23:30:00Z",
          trader: "Ashlynn Rosser",
          amount: 1234,
          status: "Cancel" as TradeStatus,
          review: 5,
        },
        {
          id: "1006",
          deadline: "2025-05-15T20:20:00Z",
          trader: "Passaquindici Arcand",
          amount: 1234,
          status: "Processing" as TradeStatus,
          review: 5,
        },
        {
          id: "1007",
          deadline: "2025-05-14T03:55:00Z",
          trader: "Jordyn Curtis",
          amount: 1234,
          status: "Processing" as TradeStatus,
          review: 5,
        },
        {
          id: "1008",
          deadline: "2025-05-13T03:55:00Z",
          trader: "Angel Septimus",
          amount: 1234,
          status: "Cancel" as TradeStatus,
          review: 5,
        },
        {
          id: "1009",
          deadline: "2025-05-12T03:55:00Z",
          trader: "Skylar Calzoni",
          amount: 1234,
          status: "Processing" as TradeStatus,
          review: 5,
        },
        {
          id: "1010",
          deadline: "2025-05-11T03:55:00Z",
          trader: "John Doe",
          amount: 1234,
          status: "Trade Done" as TradeStatus,
          review: 4.5,
        },
        {
          id: "1011",
          deadline: "2025-05-10T03:55:00Z",
          trader: "Jane Smith",
          amount: 2000,
          status: "Processing" as TradeStatus,
          review: 3,
        },
        {
          id: "1012",
          deadline: "2025-05-09T03:55:00Z",
          trader: "Bob Johnson",
          amount: 500,
          status: "Cancel" as TradeStatus,
          review: 2.5,
        },
      ].sort(
        (a, b) =>
          new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
      );
      const filtered = allTrades.filter(
        (t) =>
          t.id.includes(debouncedSearch) ||
          t.trader.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          t.status.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      const paginated = filtered.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );
      setTradesData({ data: paginated, total: filtered.length });
      setIsLoading(false);
    };
    fetchTrades();
  }, [debouncedSearch, currentPage, pageSize]); // Added pageSize to dependency array

  const debouncedSetSearch = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedSearch(val);
      }, 400),
    []
  );
  useEffect(() => {
    debouncedSetSearch(searchText);
  }, [searchText, debouncedSetSearch]); // Added debouncedSetSearch to dependency array

  const trades = tradesData?.data || [];
  const total = tradesData?.total || 0;

  const statusColors: Record<TradeStatus, string> = {
    Processing: "bg-blue-100 text-blue-800",
    "Trade Done": "bg-green-100 text-green-800",
    Cancel: "bg-orange-100 text-orange-800",
  };

  const handleAction = (action: string, id: string) => {
    toast.info(`Action: ${action} on ${id}`);
  };

  type Column = {
    title: string;
    dataIndex?: keyof Trade;
    render?: (value: any, record: Trade) => React.ReactNode;
  };

  const columns: Column[] = [
    { title: "Trades ID", dataIndex: "id" },
    {
      title: "Trades Deadline",
      dataIndex: "deadline",
      render: (deadline: string) =>
        new Date(deadline).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
    },
    { title: "Assign Traders", dataIndex: "trader" },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount: number) => `$${amount.toLocaleString()}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: TradeStatus) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Documents",
      render: () => (
        <Button
          size="sm"
          variant="default"
          className="gap-1 bg-gray-800 text-white hover:bg-gray-700"
        >
          Documents <Download className="w-4 h-4" />
        </Button>
      ),
    },
    {
      title: "Review",
      dataIndex: "review",
      render: (review: number) => (
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          {review.toFixed(1)}
        </div>
      ),
    },
    {
      title: "Actions",
      render: (_: any, record: Trade) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleAction("Remove", record.id)}>
              <Trash2 className="w-4 h-4 mr-2" /> Remove
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedTrade(record);
                setIsDetailsSheetOpen(true);
              }}
            >
              <Eye className="w-4 h-4 mr-2" /> Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h4 className="text-xl font-semibold text-gray-800">Recent Trades</h4>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trades..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8 sm:w-64"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              {columns.map((col, i) => (
                <TableHead
                  key={col.title || i}
                  className="text-gray-700 font-semibold"
                >
                  {col.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : trades.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24"
                >
                  No trades found.
                </TableCell>
              </TableRow>
            ) : (
              trades.map((trade) => (
                <TableRow key={trade.id}>
                  {columns.map((col, i) => (
                    <TableCell key={col.title || i} className="text-gray-700">
                      {col.render
                        ? col.render(
                            (col.dataIndex
                              ? trade[col.dataIndex as keyof Trade]
                              : undefined) as any,
                            trade
                          )
                        : col.dataIndex
                        ? (trade[col.dataIndex as keyof Trade] as any)
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-600">
        <p>
          Showing {(currentPage - 1) * pageSize + 1} -{" "}
          {(currentPage - 1) * pageSize + trades.length} of {total}
        </p>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from(
            { length: Math.ceil(total / pageSize) || 1 },
            (_, i) => i + 1
          ).map((pageNumber) => (
            <Button
              key={pageNumber}
              size="sm"
              variant={currentPage === pageNumber ? "default" : "outline"}
              className={
                currentPage === pageNumber ? "bg-gray-800 text-white" : ""
              }
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage * pageSize >= total}
          >
            Next
          </Button>
        </div>
      </div>
      <TradeDetailsSheet
        isOpen={isDetailsSheetOpen}
        onClose={() => setIsDetailsSheetOpen(false)}
        trade={selectedTrade}
      />
    </div>
  );
}
