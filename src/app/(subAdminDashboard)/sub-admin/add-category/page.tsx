"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Category {
    id: number
    name: string
    subcategories: Subcategory[]
}

interface Subcategory {
    id: number
    name: string
    categoryId: number
}

export default function CategoryManagement() {
    const [categories, setCategories] = useState<Category[]>([
        {
            id: 1,
            name: "UI/UX Design",
            subcategories: [{ id: 1, name: "Writing & Translation", categoryId: 1 }],
        },
        {
            id: 2,
            name: "Web Development",
            subcategories: [{ id: 2, name: "Technology & Programming", categoryId: 2 }],
        },
        {
            id: 3,
            name: "Marketing",
            subcategories: [{ id: 3, name: "Video, Photo & Image", categoryId: 3 }],
        },
        {
            id: 4,
            name: "AI Development",
            subcategories: [{ id: 4, name: "Business", categoryId: 4 }],
        },
    ])

    const [newCategory, setNewCategory] = useState("")
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
    const [newSubcategory, setNewSubcategory] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            const newId = Math.max(...categories.map((c) => c.id)) + 1
            setCategories([
                ...categories,
                {
                    id: newId,
                    name: newCategory,
                    subcategories: [],
                },
            ])
            setNewCategory("")
        }
    }

    const handleAddSubcategory = () => {
        if (newSubcategory.trim() && selectedCategoryId) {
            const categoryId = Number.parseInt(selectedCategoryId)
            const newSubId = Math.max(...categories.flatMap((c) => c.subcategories.map((s) => s.id))) + 1

            setCategories(
                categories.map((category) =>
                    category.id === categoryId
                        ? {
                            ...category,
                            subcategories: [
                                ...category.subcategories,
                                {
                                    id: newSubId,
                                    name: newSubcategory,
                                    categoryId,
                                },
                            ],
                        }
                        : category,
                ),
            )
            setNewSubcategory("")
            setSelectedCategoryId("")
        }
    }

    const handleRemove = (categoryId: number, subcategoryId: number) => {
        setCategories(
            categories.map((category) =>
                category.id === categoryId
                    ? {
                        ...category,
                        subcategories: category.subcategories.filter((sub) => sub.id !== subcategoryId),
                    }
                    : category,
            ),
        )
    }

    // Flatten categories and subcategories for table display
    const tableData = categories.flatMap((category) =>
        category.subcategories.map((subcategory) => ({
            categoryName: category.name,
            subcategoryName: subcategory.name,
            categoryId: category.id,
            subcategoryId: subcategory.id,
        })),
    )

    const totalPages = 5
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Add Category Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-center text-lg font-medium">Add Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium">
                            Add Category
                        </Label>
                        <Input
                            id="category"
                            placeholder="Mr..."
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="h-10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Category Image</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                            <div className="flex flex-col items-center space-y-2">
                                <div className="w-8 h-8 text-gray-400">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M7 18a4.6 4.4 0 0 1 0-9 5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-12z" />
                                        <path d="M9 15l3-3 3 3" />
                                        <path d="M12 12v9" />
                                    </svg>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Drop file or browse</span>
                                </div>
                                <div className="text-xs text-gray-400">Format: jpeg, png, gif, webp, Max file size: 25 MB</div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 bg-teal-600 text-white hover:bg-teal-700 border-teal-600"
                                >
                                    Browse Files
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button onClick={handleAddCategory} className="bg-slate-800 hover:bg-slate-700 px-6">
                            Done
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Add Subcategory Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-center text-lg font-medium">Add Subcategory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="select-category" className="text-sm font-medium">
                            Select Category
                        </Label>
                        <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder="LAKFCDFGHswegh" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subcategory" className="text-sm font-medium">
                            Add Subcategory
                        </Label>
                        <Input
                            id="subcategory"
                            placeholder="Mr..."
                            value={newSubcategory}
                            onChange={(e) => setNewSubcategory(e.target.value)}
                            className="h-10"
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button onClick={handleAddSubcategory} className="bg-slate-800 hover:bg-slate-700 px-6">
                            Done
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Categories Table */}
            <div className="space-y-4">
                <div className="text-center">
                    <h2 className="text-lg font-medium mb-4">All Category</h2>
                </div>

                <div className="rounded-lg overflow-hidden border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-800">
                                <TableHead className="text-white">Category Name</TableHead>
                                <TableHead className="text-white">Subcategory Name</TableHead>
                                <TableHead className="text-white">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tableData.map((row, index) => (
                                <TableRow key={index} className="border-b">
                                    <TableCell>{row.categoryName}</TableCell>
                                    <TableCell>{row.subcategoryName}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="w-8 h-8">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                    >
                                                        <Button
                                                            variant="link"
                                                            className="text-red-500 hover:text-red-700 p-0"
                                                            onClick={() => handleRemove(row.categoryId, row.subcategoryId)}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" /> Remove
                                                        </Button>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center space-x-1 pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {pageNumbers.map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={`h-8 w-8 p-0 ${currentPage === page ? "bg-slate-800 text-white hover:bg-slate-700" : ""}`}
                        >
                            {page}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
