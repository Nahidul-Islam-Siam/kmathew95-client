import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



export function SearchBar() {
    return (
        <div className="max-w-2xl flex flex-col sm:flex-row gap-4 items-center bg-white p-2 border border-gray-200 rounded-lg">
            <div className="flex-1">
                <Input
                    placeholder="What are you looking for?"
                    className="h-12 bg-white border-0 text-gray-900 placeholder:text-gray-500"
                />
            </div>

            {/* Divider for larger screens */}
            <div className="hidden sm:block w-px bg-gray-200" />

            <div className="w-full sm:w-48">
                <Select>
                    <SelectTrigger className="h-12 bg-white  text-gray-500">
                        <SelectValue placeholder="Choose Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="writing">Writing</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white text-md cursor-pointer">
                Search
            </Button>
        </div>
    )
}