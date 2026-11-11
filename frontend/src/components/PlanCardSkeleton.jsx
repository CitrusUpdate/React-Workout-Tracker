export default function PlanCardSkeleton() {
    return (
        <div className="space-y-4 w-full">
            { [1, 2, 3].map((item) => (
                <div 
                    key={item} 
                    className="bg-slate-800/40 border border-slate-700/50 rounded-lg overflow-hidden flex flex-col relative animate-pulse"
                >
                    <div className="flex items-center justify-between p-4">
                        { /* Left side - Text placeholders */ }
                        <div className="space-y-3 w-3/4">
                            { /* Plan Title */ }
                            <div className="h-6 bg-slate-700/50 rounded w-1/2 md:w-1/3"></div>
                            { /* Plan Description */ }
                            <div className="h-4 bg-slate-700/40 rounded w-3/4 md:w-2/3"></div>
                            { /* Plan Meta (Type, Days, etc.) */ }
                            <div className="h-4 bg-slate-700/40 rounded w-2/3 md:w-1/2"></div>
                        </div>

                        { /* Right side - Chevron icon placeholder */ }
                        <div className="md:mr-14 mr-7 w-10 h-10 rounded-full bg-slate-700/50 shrink-0"></div>
                    </div>
                </div>
            )) }
        </div>
    );
}