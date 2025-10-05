import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";

// types
import { Status } from "@/types/task";

type SearchFilterProps = {
  searchQuery: string;
  statusFilter: string;
  onSearch: (query: string) => void;
  onStatusFilter: (status: Status | "All") => void;
};

const SearchFilter = ({
  onSearch,
  searchQuery,
  statusFilter,
  onStatusFilter,
}: SearchFilterProps) => {
  const statusOptions = [
    { value: "All", label: "All" },
    { value: Status.PENDING, label: Status.PENDING },
    { value: Status.IN_PROGRESS, label: Status.IN_PROGRESS },
    { value: Status.COMPLETED, label: Status.COMPLETED },
  ];

  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(localQuery);
    }, 500);

    return () => clearTimeout(timeout);
  }, [localQuery]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1 sm:flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={localQuery}
          placeholder="Search tasks..."
          onChange={(e) => setLocalQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="relative flex-1 sm:flex-1">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilter(e.target.value as Status)}
          className="w-full pl-10 pr-8 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;
