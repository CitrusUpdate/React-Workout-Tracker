import { useState, useMemo } from 'react';

export function usePlanFilters(initialPlans = [], activePlanID) {
    const [planType, setPlanType] = useState("all");
    const [planFrequency,  setPlanFrequency]  = useState("all");

    const filteredPlans = useMemo(() => {
        if(!initialPlans || initialPlans.length === 0) return [];

        const filtered = initialPlans.filter(plan => {
            let typeMatch = true;
            if(planType !== "all") {
                typeMatch = plan.type === planType
            }

            let frequencyMatch = true;
            if(planFrequency !== "all") {
                const daysCount =  plan.days?.length || 0;

                if(planFrequency === "low") {
                    frequencyMatch = daysCount > 0 && daysCount <= 2;
                } else if(planFrequency === "medium") {
                    frequencyMatch = daysCount >= 3 && daysCount <= 4;
                } else if(planFrequency === "high") {
                    frequencyMatch = daysCount >= 5;
                }
            }

            return typeMatch && frequencyMatch;
        });

        return filtered.sort((a, b) => {
            if (a._id === activePlanID) return -1;
            if(b._id === activePlanID) return 1;
            return 0;
        });
    }, [initialPlans, planType, planFrequency, activePlanID]); 

    const clearPlanFilters = () => {
        setPlanType("all");
        setPlanFrequency("all");
    };

    return {
        planType, 
        setPlanType,
        planFrequency,
        setPlanFrequency,
        filteredPlans,
        clearPlanFilters
    };
}