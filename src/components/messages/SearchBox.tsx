"use client"
import { useMemo, useState, useEffect, useCallback, useRef } from "react"
import type React from "react"

import debounce from "lodash.debounce"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, X, Search } from "lucide-react"

interface User {
  // Re-using the User interface from SupportPage
  id: string
  unReadCount: number
  user: {
    id: string
    firstName: string
    lastName: string
    avatar: string
  }
}

export default function SearchBoxAdmin({
  allChatUsers, // Now receives the full list of chat users
  onSearchSelect, // Callback when a user is selected from search results
}: {
  allChatUsers: User[]
  onSearchSelect: (user: User) => void
}) {
  const [inputValue, setInputValue] = useState("")
  const [options, setOptions] = useState<User[]>([]) // Options are now User objects
  const [loading, setLoading] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Function to filter existing chat users
  const filterChatUsers = useCallback(
    async (searchTerm: string) => {
      setLoading(true)
      return new Promise<User[]>((resolve) => {
        setTimeout(() => {
          const filtered = allChatUsers.filter(
            (user) =>
              user.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
          )
          setLoading(false)
          resolve(filtered)
        }, 300) // Simulate API call delay
      })
    },
    [allChatUsers],
  )

  const doSearch = useMemo(
    () =>
      debounce((q: string) => {
        const trimmed = q.trim()
        if (trimmed) {
          filterChatUsers(trimmed).then((result) => {
            setOptions(result)
            setShowOptions(result.length > 0)
          })
        } else {
          setOptions([])
          setShowOptions(false)
        }
      }, 400),
    [filterChatUsers],
  )

  useEffect(() => {
    return () => doSearch.cancel()
  }, [doSearch])

  // Close options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowOptions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    doSearch(value)
  }

  const handleOptionSelect = (user: User) => {
    onSearchSelect(user) // Call the parent callback
    setInputValue("") // Clear input after selection
    setOptions([]) // Clear options after selection
    setShowOptions(false) // Hide options
  }

  const handleClearInput = () => {
    setInputValue("")
    setOptions([])
    setShowOptions(false)
    doSearch.cancel() // Cancel any pending search
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-figma-text-gray" />
        <Input
          type="text"
          placeholder="Search chats"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.trim() && options.length > 0 && setShowOptions(true)}
          className="pl-9 pr-10 bg-figma-sidebar-bg border border-figma-light-gray text-figma-text-dark placeholder:text-figma-text-gray focus:ring-0 focus:border-figma-light-gray rounded-xl transition-colors"
        />
        {loading && <Loader2 className="absolute right-3 h-5 w-5 animate-spin text-figma-text-gray" />}
        {!loading && inputValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 h-8 w-8 text-figma-text-gray hover:text-figma-dark-blue"
            onClick={handleClearInput}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showOptions && options.length > 0 && (
        <div className="absolute z-10 w-full bg-figma-bg border border-figma-light-gray rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto">
          <ul className="py-1">
            {options.map((option) => (
              <li key={option.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-left text-figma-text-dark hover:bg-gray-100 transition-colors"
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.user.firstName} {option.user.lastName}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
