export const calculateUserStats = (user) => {
    const { weight, height, age, goal, gender } = user.profile || {};

    if(!weight || !height || !age || !gender) return null;

    const bmi = weight / ((height / 100) ** 2);

    let bmr;
    if(gender === "male") bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    else bmr = 10 * weight + 6.25 * height - 5 * age - 161;

    let calories = bmr * 1.5

    if(goal === "cut") calories -= 300;
    if(goal === "bulk") calories += 300;

    const protein = weight * 2;
    const fat = weight * 1;
    const remainingCalories = calories - (protein * 4 + fat * 9);
    const carbs = Math.max(0, remainingCalories / 4);

    return {
        bmi: Number(bmi.toFixed(1)),
        calories: Math.round(calories),
        macros: {
            protein: Math.round(protein),
            fat: Math.round(fat),
            carbs: Math.round(carbs),
        },
    };
};