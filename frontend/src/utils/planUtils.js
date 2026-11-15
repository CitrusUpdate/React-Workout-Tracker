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
    // find day
    const updatedDays = draftPlan?.days.map(day => {
        if(day?.order == dayOrder) {
            // find exercise we want to delete and remove it from array
            const updatedExercises = day?.exercises.filter((_, index) => index !== exerciseIndex);
            return { ...day, exercises: updatedExercises };
        }
        return day;
    });

    // return updated arr
    return { ...draftPlan, days: updatedDays };
}

export const addExerciseToDay = (draftPlan, dayOrder, dayType) => {
    const updatedDays = draftPlan?.days.map(day => {
        if(day?.order === dayOrder) {
            // create an new obj same as exercises schema
            let newExercises = {};
            if(dayType === "strength") {
                newExercises = {
                    name: "",
                    setsCount: 3,
                    targetReps: 10,
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

            // push it to exercises array in schema to add new exercise
            const exercises = [ ...(day?.exercises || []), newExercises ];

            return { ...day, exercises };
        }

        return day;
    });

    return { ...draftPlan, days: updatedDays };
}

export const addTrainingDay = (draftPlan) => {
    // make new order
    const newOrder = (draftPlan?.days?.length || 0) + 1;
    // create an object same to schema in db
    let newDay = {
        name: "New Day",
        order: newOrder,
        type: "strength",
        exercises: []
    };

    const updatedDays = [ ...(draftPlan?.days || []), newDay];
    return { ...draftPlan, days: updatedDays };
}

export const deleteTrainingDay = (draftPlan, dayOrder) => {
    // delete day with the same order from arr
    const updatedDays = draftPlan?.days.filter(day => day?.order !== dayOrder);
    return { ...draftPlan, days: updatedDays};
}

export const dayNameChange = (draftPlan, dayOrder, newName) => {
    const updatedDays = draftPlan?.days.map(day => {
        if(day?.order === dayOrder) {
            return { ...day, name: newName };
        }

        return day;
    });

    return { ...draftPlan, days: updatedDays };
}