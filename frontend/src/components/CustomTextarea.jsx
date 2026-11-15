export default function CustomTextarea({
    label,
    labelFor,
    name,
    value,
    onChange,
    placeholder,
    required = false,
    className = ""
}) {
    return (
        <div className="w-full">
            { label && <label htmlFor={labelFor} className="block text-slate-400 text-sm mb-1.5">{label}</label>}
            <textarea
                id={labelFor}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm resize-y focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-600 transition duration-300 ${className}`} 
            />
        </div>
    )
}