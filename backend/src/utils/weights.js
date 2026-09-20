// round weight for real plates
export const roundToPlate = (kg, rounding = 2.5) => Math.round(kg / rounding) * rounding;

// check if there is a percent for one rep max (1RM) then count percent from 1RM round it to gym plates
export const computeWeightFromPercent = (user, exerciseName, percent) => {
    if(!percent) return null;

    const oneRM = user.profile?.maxes?.get(exerciseName) ?? user.profile?.maxes?.get(exerciseName.toLowerCase()) ?? null;

    if(!oneRM) return null;

    const rounding = user.preferences?.rounding ?? 2.5;
    return roundToPlate((oneRM * percent) / 100, rounding);
};