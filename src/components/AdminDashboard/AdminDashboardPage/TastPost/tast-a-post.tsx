/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import TradeDetailsSheet from "@/components/AdminDashboard/AdminDashboardPage/TradeDetailsSheet";
import { useGetTaskManagementQuery } from "@/redux/service/admin/taskManagemant";
import { Spin } from "antd";


type TradeStatus = "Processing" | "Trade Done" | "Cancel";

interface Trade {
  id: string;
  deadline: string;
  trader: string;
  amount: number;
  status: TradeStatus;
  review: number;
  title?: string;
  description?: string;
  image?: string;
  attachedFiles?: { name: string; type: string; url: string }[];
}

export default function RecentTradesTable() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [filteredData, setFilteredData] = useState<Trade[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const { data: taskManagementData, isLoading: apiLoading } =
    useGetTaskManagementQuery();

  const mapStatus = (status: string): TradeStatus => {
    switch (status) {
      case "ORDER_ACTIVE":
      case "DELIVERED":
        return "Processing";
      case "COMPLETED":
      case "PAID":
        return "Trade Done";
      default:
        return "Cancel";
    }
  };

  useEffect(() => {
    if (apiLoading) {
      setIsLoading(true);
      return;
    }




    if (!taskManagementData?.data?.data) {
      setAllTrades([]);
      setFilteredData([]);
      setTotal(0);
      setIsLoading(false);
      return;
    }

    const trades: Trade[] = taskManagementData.data.data.map((task: any) => ({
      id: task.id,
      title: task.title,
      deadline: task.deadline,
      trader:
        `${task.trader?.fastName || ""} ${task.trader?.lastName || ""}`.trim() ||
        "Unknown Trader",
      amount: task.max_salary || 0,
      status: mapStatus(task.status),
      review: 5,
      description: task.description,
      image:
        task.provide_attachments?.[0] ||
        "/placeholder.svg?height=96&width=96",
      attachedFiles:
        task.provide_attachments?.map((url: string) => ({
          name: url.split("/").pop() || "attachment",
          type: "file",
          url,
        })) || [],
    }));

    const sorted = trades.sort(
      (a, b) =>
        new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
    );

    setAllTrades(sorted);
    setIsLoading(false);
  }, [taskManagementData, apiLoading]);

  useEffect(() => {
    const filtered = allTrades.filter(
      (t) =>
        t.id.includes(debouncedSearch) ||
        t.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        t.trader.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        t.status.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    setFilteredData(filtered);
    setTotal(filtered.length);
    setCurrentPage(1);
  }, [debouncedSearch, allTrades]);

  const debouncedSetSearch = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedSearch(val);
      }, 400),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchText);
  }, [searchText, debouncedSetSearch]);

  const paginatedTrades = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const statusColors: Record<TradeStatus, string> = {
    Processing: "bg-blue-100 text-blue-800",
    "Trade Done": "bg-green-100 text-green-800",
    Cancel: "bg-orange-100 text-orange-800",
  };

  const handleAction = (action: string, id: string) => {
    if (action === "Remove") {
      Swal.fire({
        title: "Are you sure?",
        text: `You are about to remove task ID: ${id}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, remove it!",
      }).then((result) => {
        if (result.isConfirmed) {
          toast.success(`Task ${id} removed successfully`);
          // TODO: Call delete API
        }
      });
    } else if (action === "Details") {
      const trade = filteredData.find((t) => t.id === id) || null;
      setSelectedTrade(trade);
      setIsDetailsSheetOpen(true);
    }
  };

  type Column = {
    title: string;
    dataIndex?: keyof Trade;
    render?: (value: any, record: Trade) => React.ReactNode;
  };

  const columns: Column[] = [
    { title: "Title", dataIndex: "title" },
    {
      title: "Deadline",
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
      // ❌ no dataIndex here, always render explicitly
      render: (_: any, record: Trade) =>
        record.attachedFiles && record.attachedFiles.length > 0 ? (
          <Button
            size="sm"
            variant="default"
            className="gap-1 bg-gray-800 text-white hover:bg-gray-700"
            asChild
          >
            <a
              href={record.attachedFiles[0].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download <Download className="w-4 h-4" />
            </a>
          </Button>
        ) : (
          "—"
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
      render: (_: unknown, record: Trade) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleAction("Remove", record.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Remove
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction("Details", record.id)}
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
        <h4 className="text-xl font-semibold text-gray-800">
          Recent Trades
        </h4>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trades..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
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
                  <Spin size="large" />
                </TableCell>
              </TableRow>
            ) : paginatedTrades.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24"
                >
                  No trades found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTrades.map((trade) => (
                <TableRow key={trade.id}>
                  {columns.map((col, i) => (
                    <TableCell
                      key={col.title || i}
                      className="text-gray-700"
                    >
                      {col.render
                        ? col.render(
                            col.dataIndex
                              ? trade[col.dataIndex]
                              : undefined,
                            trade
                          )
                        : col.dataIndex
                        ? String(trade[col.dataIndex] ?? "")
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
          {Math.min(currentPage * pageSize, total)} of {total}
        </p>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.max(1, prev - 1))
            }
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
              variant={
                currentPage === pageNumber ? "default" : "outline"
              }
              className={
                currentPage === pageNumber
                  ? "bg-gray-800 text-white"
                  : ""
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
