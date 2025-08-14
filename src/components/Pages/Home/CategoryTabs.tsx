"use client"

import { useState } from "react"

const categories = ["UI/UX Design", "Web Development", "Marketing", "AI Development", "Sales Executive"]

export function CategoryTabs() {
    const [activeCategory, setActiveCategory] = useState("UI/UX Design")

    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category
                            ? "bg-orange-100 text-orange-600 border border-orange-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    )
}