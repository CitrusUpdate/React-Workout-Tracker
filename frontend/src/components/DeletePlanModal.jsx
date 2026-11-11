import { usePlanStore } from "../store/usePlanStore"

export default function DeletePlanModal( { setIsModalOpen, planName, planID} ) {
    const { deletePlan } = usePlanStore();
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8">
                <header className="mb-6 text-center font-bold">
                    <h2>Are you sure You want to delete this plan?</h2>
                    <p className="text-slate-400 md:text-xs text-sm uppercase tracking-widest mb-1">{ planName}</p>
                </header>

                <div className="flex gap-3 mt-6">
                    <button onClick={() => { deletePlan(planID); setIsModalOpen(false); }} className="bg-green-600 hover:bg-green-500 flex-1 rounded-lg  py-2 md:text-xs text-sm font-medium cursor-pointer transition-colors duration-200">Yes</button>
                    <button onClick={() => setIsModalOpen(false)} className="bg-red-600 hover:bg-red-500 flex-1 rounded-lg  py-2 md:text-xs text-sm font-medium cursor-pointer transition-colors duration-200">No</button>
                </div>
            </div>
        </div>
    )
}