import { Link } from "react-router";

export default function RecommendedMacros({ calories, protein, fat, carbs }) {
    return (
        <div className="flex flex-col justify-between h-full" >
            <div>
                <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Recommended macros</h2>
                <p className="text-slate-500 text-xs italic leading-relaxed">*Good diet will make your progress better</p>
            </div>

            <div className="mt-4">
                <p className="md:text-3xl  font-bold">Calories: {calories} <span className="text-slate-500 text-sm">kcal</span></p>
                <p className="md:text-2xl font-bold text-amber-400">Fat: {fat} <span className="text-slate-500 text-sm">g</span></p>
                <p className="md:text-2xl font-bold text-rose-400">Protein: {protein} <span className="text-slate-500 text-sm">g</span></p>
                <p className="md:text-2xl font-bold text-indigo-400">Carbs: {carbs} <span className="text-slate-500 text-sm">g</span></p>
            </div>

            <Link 
                to="/settings" 
                className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm font-semibold transition"
            >
                Change my goal ➔
            </Link>
        </div>
    );
}