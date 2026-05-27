import { useState, useMemo } from 'react';

export function useWorkoutFilters(initialItems = []) {
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateRange, setDateRange] = useState({ from: "", to: "" });

    const filteredItems = useMemo(() => {
        if(!initialItems || initialItems.length === 0) return [];

        return initialItems.filter(item => {
            let statusMatch = true;
            if(statusFilter === "completed") {
                statusMatch = item.exercises?.every(ex => ex.sets?.every(set => set.completed));
            } else if(statusFilter === "pending") {
                statusMatch = !item.exercises?.every(ex => ex.sets?.every(set => set.completed));
            }

            let dateMatch = true;
            const itemDate = new Date(item.date).getTime();
            if(dateRange.from) {
                const fromDate = new Date(dateRange.from).getTime();
                if(itemDate < fromDate) dateMatch = false;
            } 

            if(dateRange.to) {
                const toDate = new Date(dateRange.to);
                toDate.setHours(23, 59, 59, 999);
                if(itemDate > toDate.getTime()) dateMatch = false;
            }

            return statusMatch && dateMatch;
        });
    }, [initialItems, statusFilter, dateRange]);

    const clearFilters = () => {
        setStatusFilter("all");
        setDateRange({ from: "", to: "" });
    };

    return {
        statusFilter, 
        setStatusFilter,
        dateRange,
        setDateRange,
        filteredItems,
        clearFilters
    };
}