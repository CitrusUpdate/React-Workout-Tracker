import { ChevronDown } from "lucide-react";

export default function CustomSelect({
    label,
    labelFor,
    name,
    value,
    onChange,
    required = false,
    options,
    className = ""
}) {
    return (
        <div className="w-full ">
            { label && <label htmlFor={labelFor} className="block text-slate-400 text-sm mb-1.5">{label}</label>}
            <div className="relative w-full">
            <select 
                id={labelFor}
                name={name} 
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 pr-10 text-white placeholder-slate-500 text-sm appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-600 transition duration-300 ${className}`} 
            >
                { options.map((opt, index) => (
                    <option key={index} value={opt.value}>{opt.label}</option>
                ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                <ChevronDown className="md:w-6 md:h-6 w-4 h-4"/>
            </div>
            </div>
        </div>
    )
}