export default function WorkouiCardSkeleton() {
    return (
        <div className="space-y-3 w-full">
            { [1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between bg-slate-800/40 p-4 rounded-lg animate-pulse border border-slate-800">
                    { /* left side */ }
                    <div className="flex items-center space-x-4" >
                        <div className="w-12 h-12 bg-slate-700/50 rounded-lg"></div> { /*icon */ }
                        <div className="space-y-2">
                            <div className="h-4 bg-slate-700/50 rounded w-40 md:w-56"></div> { /*plan title */ }
                            <div className="h-3 bg-slate-700/40 rounded w-24"></div> { /* date */ }
                        </div> 
                    </div>

                    { /* right side */ }
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block h-3 bg-slate-700/50 rounded w-20 "></div> { /* status*/ }
                        <div className="w-8 h-8 bg-slate-700/50 rounded-full"></div> { /* button */ }
                    </div>
                </div>
            )) }
        </div>
    );
}