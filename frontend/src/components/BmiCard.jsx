import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export default function BmiCard({ bmi }) {
    if (!bmi) return null;

    let status = "";
    let colorClass = "";
    let suggestion = "";

    if (bmi < 18.5) {
        status = "Underweight";
        colorClass = "text-blue-400"; 
        suggestion = "Think about bulk";
    } else if (bmi <= 24.9) {
        status = "Correct weight";
        colorClass = "text-green-400";
        suggestion = "Think about maintain or bulk";
    } else if (bmi <= 29.9) {
        status = "Overweight";
        colorClass = "text-yellow-400";
        suggestion = "Think about cut or maintain";
    } else {
        status = "Obesity";
        colorClass = "text-red-500";
        suggestion = "Think about cut";
    }

    return (
        <div className="flex flex-col justify-between h-full">
            <div>
                <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">BMI</h2>
                
                <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="text-4xl font-bold text-white">{bmi}</h3>
                    <span className={`text-lg font-medium ${colorClass}`}>{status}</span>
                </div>

                <p className="text-slate-500 text-xs italic leading-relaxed">*BMI doesn't account for muscle mass. If you train hard, you might be heavier!</p>
            </div>

            <Link 
                to="/settings" 
                className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm font-semibold transition"
            >
                {suggestion} <ArrowRight size={20} className="inline-block"/>
            </Link>
        </div>
    );
}