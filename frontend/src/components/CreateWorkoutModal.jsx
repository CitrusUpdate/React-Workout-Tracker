export default function CreateWorkoutModal({ setIsModalOpen }) {
    // TODO: Add createWorkout functionality
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md md:p-8 p-5 overflow-y-auto max-h-[90vh]">
                <header className="mb-6 text-center font-bold">
                    <h2>Create Workout</h2>
                    <p className="text-slate-400 md:text-sm text-xs uppercase tracking-widest mb-1">exercises</p>
                    <p className="text-slate-400 md:text-sm text-xs uppercase tracking-widest mb-1">notes</p>   
                    <p className="text-slate-400 md:text-sm text-xs uppercase tracking-widest mb-1">type</p>
                    <p className="text-slate-400 md:text-sm text-xs uppercase tracking-widest mb-1">Manual workout creator (use it to add additional workout in this week)</p>
                </header>

                <div className="flex gap-3 mt-6">
                    <button onClick={() => { setIsModalOpen(false); }} className="bg-blue-600 hover:bg-blue-500 flex-1 rounded-lg  py-2 md:text-sm text-xs font-medium cursor-pointer transition-colors duration-200">Create</button>
                    <button onClick={() => setIsModalOpen(false)} className="bg-slate-600 hover:bg-slate-500 flex-1 rounded-lg  py-2 md:text-sm text-xs font-medium cursor-pointer transition-colors duration-200">Back</button>
                </div>
            </div>
        </div>
    )
}