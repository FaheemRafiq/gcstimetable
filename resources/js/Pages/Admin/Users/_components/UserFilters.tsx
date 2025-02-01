import { useEffect, useState } from "react";
import { format } from "date-fns";
import { router } from "@inertiajs/react";
import { XIcon } from "lucide-react";
import { FilterManager } from '@/classes/FilterManager';
import FilterModal from "@/components/filter-modal";
import InputLabel from "@/Components/InputLabel";
import DatePicker from "@/components/inputs/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SearchInput from "@/components/inputs/search-input";

// Define the filter configuration
const filterConfig = [
    { name: 's', defaultValue: '', label: 'Search' },
    { name: 'start_date', defaultValue: '', label: 'Start Date' },
    { name: 'end_date', defaultValue: '', label: 'End Date' },
    { name: 'verified', defaultValue: true, label: 'Verified' },
    { name: 'unverified', defaultValue: true, label: 'Unverified' }
];

function UserFilters() {
    // Initialize FilterManager with the route
    const [filterManager] = useState(() =>
        new FilterManager(filterConfig, route("users.index"))
    );

    // Track filter values in React state
    const [filters, setFilters] = useState(filterManager.getAllFilters());

    // Update filters and UI
    const updateFilters = (newFilters: typeof filters) => {
        Object.entries(newFilters).forEach(([key, value]) => {
            filterManager.setFilter(key, value);
        });
        setFilters(filterManager.getAllFilters());
    };

    // Handle search logic
    const handleSearch = () => {
        const queryParams: Record<string, any> = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== filterConfig.find(f => f.name === key)?.defaultValue) {
                queryParams[key] = value;
            }
        });
        router.get(route("users.index"), queryParams);
    };

    // Handle date changes
    const handleDateChange = (name: string, date: Date | null) => {
        updateFilters({
            ...filters,
            [name]: date ? format(date, "yyyy-MM-dd") : ""
        });
    };

    // Clear all filters
    const handleClearFilters = () => {
        filterManager.clearAllFilters();
        setFilters(filterManager.getAllFilters());
        router.get(route("users.index"));
    };

    // Remove a specific filter
    const removeFilter = (filterName: string) => {
        filterManager.clearFilter(filterName);
        setFilters(filterManager.getAllFilters());
    };

    // Initialize state from URL query parameters
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const newFilters = {
            start_date: searchParams.get("start_date") || "",
            end_date: searchParams.get("end_date") || "",
            verified: searchParams.get("verified") === "false" ? false : true,
            unverified: searchParams.get("unverified") === "false" ? false : true,
        };
        updateFilters(newFilters);
    }, []);

    // Generate active filter badges
    const activeFilters = filterManager.getActiveFilters();
    const filterBadges = activeFilters.map(filter => (
        <Badge
            variant="secondary"
            className="!text-sm cursor-pointer hover:bg-secondary/80 transition-colors"
            key={filter.name}
            onClick={() => removeFilter(filter.name)}
        >
            {filter.label}: {typeof filter.value === 'boolean' ? (filter.value ? 'Yes' : 'No') : filter.value}
            <XIcon size={12} className="ml-1 inline" />
        </Badge>
    ));

    return (
        <div className="flex justify-between items-center gap-5">
            <div className="flex-1">
                <SearchInput
                    value={filters.s?.toString()}
                    setValue={(value) => updateFilters({ ...filters, s: value })}
                    onSearch={handleSearch}
                    placeholder="Search user by name, email..."
                />
            </div>
            <div className="self-end">
                <FilterModal
                    title="User Filters"
                    description="Adjust your filters to find the perfect user."
                    onSearch={handleSearch}
                    hasFiltersApplied={filterManager.hasActiveFilters()}
                >
                    {/* Active Filters Section */}
                    {filterManager.hasActiveFilters() && (
                        <>
                            <div className="space-y-2">
                                <div className="text-sm font-medium">Active Filters</div>
                                <div className="flex flex-wrap gap-2">
                                    {filterBadges}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClearFilters}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    >
                                        Clear All
                                    </Button>
                                </div>
                            </div>
                            <Separator className="my-4" />
                        </>
                    )}

                    {/* Date Filters Section */}
                    <div className="space-y-4">
                        <div className="text-sm font-medium">Date Range</div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="start_date" value="Start Date" />
                                <DatePicker
                                    className="w-full"
                                    id="start_date"
                                    value={filters.start_date ? new Date(filters.start_date.toString()) : null}
                                    onChange={(date) => handleDateChange("start_date", date)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="end_date" value="End Date" />
                                <DatePicker
                                    className="w-full"
                                    id="end_date"
                                    value={filters.end_date ? new Date(filters.end_date.toString()) : null}
                                    onChange={(date) => handleDateChange("end_date", date)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status Filters Section */}
                    <div className="space-y-4 mt-4">
                        <div className="text-sm font-medium">User Status</div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="verified"
                                    checked={Boolean(filters.verified)}
                                    onCheckedChange={(checked) =>
                                        updateFilters({ ...filters, verified: !!checked })
                                    }
                                />
                                <Label htmlFor="verified">Verified Users</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="unverified"
                                    checked={Boolean(filters?.unverified)}
                                    onCheckedChange={(checked) =>
                                        updateFilters({ ...filters, unverified: !!checked })
                                    }
                                />
                                <Label htmlFor="unverified">Unverified Users</Label>
                            </div>
                        </div>
                    </div>
                </FilterModal>
            </div>
        </div>
    );
}

export default UserFilters;