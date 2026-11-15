export const changeDayTypeAndClear = (draftPlan, dayOrder, newType) => {
    const updatedDays = draftPlan?.days.map(day => {
        if(day?.order === dayOrder) {
            return { ...day, type: newType, exercises: [] };
        }

        return day;
    });

    return { ...draftPlan, days: updatedDays};
}

export const setShouldHideWarning = (shouldHide) => {
    localStorage.setItem('hideChangeTypeModal', shouldHide);
}

export const getShouldHideWarning = () => {
    return localStorage.getItem('hideChangeTypeModal') === 'true';
}

export const handleExerciseChange = (draftPlan, dayOrder, exerciseIndex, field, newValue) => {
    //find day to edit
    const updatedDays = draftPlan?.days.map(day => {
        if(day?.order === dayOrder) {
            //map for exercises in this day
            const updatedExercises = day?.exercises.map((ex, index) => {
                // find exercise we want to edit
                if(index === exerciseIndex) {
                    // edit key dynamically
                    return { ...ex, [field]: newValue };
                }

                // return other exercises without changes
                return ex;
            });

            // day with changed exercises array
            return { ...day, exercises: updatedExercises};
        }

        // return other days without changes
        return day;
    });

    // return our plan with updated array days
    return { ...draftPlan, days: updatedDays };
}

export const deleteExerciseFromDay = (draftPlan, dayOrder, exerciseIndex) => {
    const updatedDays = draftPlan?.days.map(day => {
        if(day?.order == dayOrder) {
            const updatedExercises = day?.exercises.filter((_, index) => index !== exerciseIndex);
            return { ...day, exercises: updatedExercises };
        }
        return day;
    });

    return { ...draftPlan, days: updatedDays };
}

export const addExerciseToDay = (draftPlan, dayOrder, dayType) => {
    const updatedDays = draftPlan?.days.map(day => {
        if(day?.order === dayOrder) {
            let newExercises = {};
            if(dayType === "strength") {
                newExercises = {
                    name: "",
                    setsCount: 3,
                    targetRir: "",
                    targetPercent1RM: "",
                    targetTempo: "",
                    notes: ""
                }
            } else {
                newExercises = {
                    name: "",
                    distance: "",
                    duration: "",
                    targetPace: "",
                    targetBPM: "",
                    notes: ""
                }
            }

            const exercises = [ ...(day?.exercises || []), newExercises ];

            return { ...day, exercises };
        }

        return day;
    });

    return { ...draftPlan, days: updatedDays };
}