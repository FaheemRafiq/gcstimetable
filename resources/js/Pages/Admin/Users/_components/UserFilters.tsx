import FilterModal from "@/components/filter-modal";
import InputLabel from "@/Components/InputLabel";
import DatePicker from "@/components/inputs/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function UserFilters() {
    const [data, setData] = useState({
        start_date: "",
        end_date: "",
        verified: true,
        unverified: true,
    });

    // Handle search logic
    const handleSearch = () => {
        let queryParams: Record<string, string | boolean> = {};
        if (data.start_date) queryParams.start_date = data.start_date;
        if (data.end_date) queryParams.end_date = data.end_date;
        if (data.verified == false) queryParams.verified = false;
        if (data.unverified == false) queryParams.unverified = false;

        router.get(route("users.index", queryParams));
    };

    // Handle date changes
    const handleDateChange = (name: string, date: Date | null) => {
        setData((prev) => ({
            ...prev,
            [name]: date ? format(date, "yyyy-MM-dd") : "",
        }));
    };

    // Clear all filters
    const handleClearFilters = () => {
        setData({ start_date: "", end_date: "", verified: false, unverified: false });
        router.get(route("users.index"));
    };

    // Remove a specific filter
    const removeFilter = (filterName: string) => {
        setData((prev) => {
            if (filterName === "start_date" || filterName === "end_date") {
                return { ...prev, [filterName]: "" };
            }
            if (filterName === "verified" || filterName === "unverified") {
                return { ...prev, [filterName]: false };
            }
            return prev;
        });
    };

    // Initialize state from URL query parameters
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        setData({
            start_date: searchParams.get("start_date") || "",
            end_date: searchParams.get("end_date") || "",
            verified: searchParams.get("verified") == "1" || searchParams.get('verified') == null,
            unverified: searchParams.get("unverified") == "1" || searchParams.get('unverified') == null,
        });
    }, []);

    // Check if any filter is applied
    const hasFiltersApplied =
        data.start_date ||
        data.end_date ||
        data.verified ||
        data.unverified;

    // Generate filter badges
    const filterBadges = [];
    if (data.start_date) {
        filterBadges.push(
            <Badge variant='secondary' className="text-sm" key="start_date" onClick={() => removeFilter("start_date")}>
                Start Date: {data.start_date} <XIcon size={12} className="ml-1" />
            </Badge>
        );
    }
    if (data.end_date) {
        filterBadges.push(
            <Badge variant='secondary' className="text-sm" key="end_date" onClick={() => removeFilter("end_date")}>
                End Date: {data.end_date} <XIcon size={12} className="ml-1" />
            </Badge>
        );
    }
    if (data.verified) {
        filterBadges.push(
            <Badge variant='secondary' className="text-sm" key="verified" onClick={() => removeFilter("verified")}>
                Verified <XIcon size={12} className="ml-1" />
            </Badge>
        );
    }
    if (data.unverified) {
        filterBadges.push(
            <Badge variant='secondary' className="text-sm" key="unverified" onClick={() => removeFilter("unverified")}>
                Unverified <XIcon size={12} className="ml-1" />
            </Badge>
        );
    }

    return (
        <FilterModal
            title="User Filters"
            description="Adjust your filters to find the perfect user."
            onSearch={handleSearch}
            hasFiltersApplied={!!hasFiltersApplied}
        >
            {/* Filter Badges */}
            {hasFiltersApplied && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {filterBadges}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-red-500 hover:text-red-600"
                    >
                        Clear All Filters
                    </Button>
                </div>
            )}

            {/* Start Date */}
            <div key="start_date">
                <InputLabel htmlFor="start_date" value="Start Date" />
                <DatePicker
                    className="w-full"
                    id="start_date"
                    value={data.start_date ? new Date(data.start_date) : null}
                    onChange={(date) => handleDateChange("start_date", date)}
                />
            </div>

            {/* End Date */}
            <div key="end_date">
                <InputLabel htmlFor="end_date" value="End Date" />
                <DatePicker
                    className="w-full"
                    id="end_date"
                    value={data.end_date ? new Date(data.end_date) : null}
                    onChange={(date) => handleDateChange("end_date", date)}
                />
            </div>

            {/* Verified Checkbox */}
            <div key="verified" className="flex items-center gap-2">
                <Checkbox
                    id="verified"
                    checked={data.verified}
                    onCheckedChange={(checked) =>
                        setData((prev) => ({ ...prev, verified: !!checked }))
                    }
                />
                <Label htmlFor="verified">Verified</Label>
            </div>

            {/* Unverified Checkbox */}
            <div key="unverified" className="flex items-center gap-2">
                <Checkbox
                    id="unverified"
                    checked={data.unverified}
                    onCheckedChange={(checked) =>
                        setData((prev) => ({ ...prev, unverified: !!checked }))
                    }
                />
                <Label htmlFor="unverified">Unverified</Label>
            </div>
        </FilterModal>
    );
}

export default UserFilters;