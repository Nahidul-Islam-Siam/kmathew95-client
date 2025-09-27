/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Trash2 } from "lucide-react";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useGetAllContactDataQuery,
  useRemoveSingleContactMutation,
} from "@/redux/service/contactApi";

// === Types ===
interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function Contact() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // State for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  // Fetch real contact messages
  const {
    data: contacts,
    isLoading: isApiLoading,
    isError,
  } = useGetAllContactDataQuery({});
  const [removeContact] = useRemoveSingleContactMutation();

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load contact messages.");
    }
  }, [isError]);

  // Extract real data
  const allContacts = useMemo((): ContactMessage[] => {
    return (
      contacts?.data?.data?.map((item: any) => ({
        id: item.id,
        fullName: item.fullName,
        email: item.email,
        subject: item.subject,
        message: item.message,
        createdAt: item.createdAt,
      })) || []
    );
  }, [contacts]);

  // Search Filtering
  const filteredContacts = useMemo(() => {
    return allContacts.filter(
      (contact) =>
        contact.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchText.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchText.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [allContacts, searchText]);

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / pageSize);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Debounced Search
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchText(value);
        setCurrentPage(1);
      }, 400),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearch(e.target.value);
  };

  // Format Date
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle Delete Click
  const handleDeleteClick = (id: string) => {
    setContactToDelete(id);
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!contactToDelete) return;

    try {
      // Simulate API call (replace with real delete mutation later)
      const res = await removeContact(contactToDelete).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Message deleted successfully!");
      } else {
        toast.error(res?.message || "Failed to delete message.");
      }
    } catch (error) {
      toast.error("Failed to delete message.");
    } finally {
      setDeleteModalOpen(false);
      setContactToDelete(null);
    }
  };

  // Cancel Delete
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setContactToDelete(null);
  };

  const isLoading = isApiLoading;

  return (
    <div className="bg-white w-full">
      {/* Breadcrumb */}
      <div className="p-6 pb-2">
        <nav className="text-sm text-gray-500">
          <span>Contact Messages</span>
        </nav>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-6 pb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          All Contact Submissions
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search messages..."
            value={searchText}
            onChange={handleSearchChange}
            className="pl-10 w-64 border-gray-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-700 hover:bg-slate-700">
              <TableHead className="text-white font-medium">Name</TableHead>
              <TableHead className="text-white font-medium">Email</TableHead>
              <TableHead className="text-white font-medium">Subject</TableHead>
              <TableHead className="text-white font-medium">Message</TableHead>
              <TableHead className="text-white font-medium">
                Date & Time
              </TableHead>
              <TableHead className="text-white font-medium text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  Loading messages...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-red-500"
                >
                  Failed to load messages.
                </TableCell>
              </TableRow>
            ) : paginatedContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedContacts.map((contact) => (
                <TableRow key={contact.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {contact.fullName}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {contact.email}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {contact.subject}
                  </TableCell>
                  <TableCell
                    className="text-gray-600 max-w-xs truncate"
                    title={contact.message}
                  >
                    {contact.message}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {formatDateTime(contact.createdAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDeleteClick(contact.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && !isError && filteredContacts.length > 0 && (
        <div className="flex justify-center items-center py-6 border-t bg-gray-50">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8"
            >
              ‹
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const startPage = Math.max(1, currentPage - 2);
              const pageNumber = startPage + i;
              if (pageNumber > totalPages) return null;

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "ghost"}
                  size="icon"
                  className={`w-8 h-8 ${
                    currentPage === pageNumber
                      ? "bg-slate-700 text-white hover:bg-slate-800"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage >= totalPages}
              className="w-8 h-8"
            >
              ›
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this message? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
