// Types for filter configuration and values
type FilterValue = string | number | boolean | null;
type FilterConfig = {
    name: string;
    defaultValue: FilterValue;
    label: string;
};

export class FilterManager {
    private filters: Map<string, FilterValue>;
    private defaultValues: Map<string, FilterValue>;
    private filterConfigs: FilterConfig[];
    private baseUrl: string;

    constructor(filterConfigs: FilterConfig[], baseUrl: string = window.location.pathname) {
        this.filters = new Map();
        this.defaultValues = new Map();
        this.filterConfigs = filterConfigs;
        this.baseUrl = baseUrl;

        // Initialize default values
        filterConfigs.forEach(config => {
            this.defaultValues.set(config.name, config.defaultValue);
            this.filters.set(config.name, config.defaultValue);
        });

        // Load values from URL if present
        this.loadFromUrl();
    }

    // Load filter values from URL query parameters
    private loadFromUrl(): void {
        const urlParams = new URLSearchParams(window.location.search);
        this.filterConfigs.forEach(config => {
            const urlValue = urlParams.get(config.name);
            if (urlValue !== null) {
                this.setFilter(config.name, this.parseUrlValue(urlValue));
            }
        });
    }

    // Parse URL string value to appropriate type
    private parseUrlValue(value: string): FilterValue {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (!isNaN(Number(value))) return Number(value);
        return value;
    }

    // Set individual filter value
    setFilter(name: string, value: FilterValue): void {
        if (!this.defaultValues.has(name)) {
            throw new Error(`Filter "${name}" is not configured`);
        }
        this.filters.set(name, value);
        this.updateUrl();
    }

    // Get individual filter value
    getFilter(name: string): FilterValue {
        return this.filters.get(name) ?? null;
    }

    // Get all active filters (non-default values)
    getActiveFilters(): { name: string; value: FilterValue; label: string }[] {
        const activeFilters : any = [];
        this.filters.forEach((value, name) => {
            const defaultValue = this.defaultValues.get(name);
            if (value !== defaultValue) {
                const config = this.filterConfigs.find(c => c.name === name);
                activeFilters.push({
                    name,
                    value,
                    label: config?.label ?? name
                });
            }
        });
        return activeFilters;
    }

    // Check if any filters are active (different from default)
    hasActiveFilters(): boolean {
        return this.getActiveFilters().length > 0;
    }

    // Clear individual filter to default value
    clearFilter(name: string): void {
        const defaultValue = this.defaultValues.get(name);
        if (defaultValue !== undefined) {
            this.filters.set(name, defaultValue);
            this.updateUrl();
        }
    }

    // Clear all filters to default values
    clearAllFilters(): void {
        this.filterConfigs.forEach(config => {
            this.filters.set(config.name, config.defaultValue);
        });
        this.updateUrl();
    }

    // Get query string for current filter values
    getQueryString(): string {
        const params = new URLSearchParams();
        this.filters.forEach((value, name) => {
            const defaultValue = this.defaultValues.get(name);
            if (value !== defaultValue && value !== null) {
                params.append(name, String(value));
            }
        });
        return params.toString();
    }

    // Update URL with current filter values
    private updateUrl(): void {
        const queryString = this.getQueryString();
        const newUrl = queryString
            ? `${this.baseUrl}?${queryString}`
            : this.baseUrl;
        window.history.pushState({}, '', newUrl);
    }

    // Get all filter values (for React state)
    getAllFilters(): Record<string, FilterValue> {
        return Object.fromEntries(this.filters);
    }
}