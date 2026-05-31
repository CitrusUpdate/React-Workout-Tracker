import { useState, useMemo } from 'react';

export function usePlanFilters(initialPlans = []) {
    const [planType, setPlanType] = useState("all");
    const [planFrequency,  setPlanFrequency]  = useState("all");

    const filteredPlans = useMemo(() => {
        if(!initialPlans || initialPlans.length === 0) return [];

        return initialPlans.filter(plan => {
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
    }, [initialPlans, planType, planFrequency]);

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