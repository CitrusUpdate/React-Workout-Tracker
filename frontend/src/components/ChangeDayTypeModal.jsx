import { setShouldHideWarning } from "../utils/planUtils"

export default function ChangeDayTypeModal({ setIsModalOpen, dayData, onConfirm }) {
    const handleShowAgainChangeDayType = (e) => {
        setShouldHideWarning(e.target.checked);
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md md:p-8 p-5 overflow-y-auto max-h-[90vh]">
                <header className="mb-6 text-center font-bold">
                    <h2>Are you sure you want to change day type?</h2>
                    <p className="text-slate-400 md:text-xs text-sm uppercase tracking-widest mb-1">{dayData?.name} | {dayData?.type}</p>
                </header>

                <div className="flex gap-3 mt-6">
                    <button onClick={onConfirm } className="bg-green-600 hover:bg-green-500 flex-1 rounded-lg  py-2 md:text-xs text-sm font-medium cursor-pointer transition-colors duration-200">Yes</button>
                    <button onClick={() => setIsModalOpen(false)} className="bg-red-600 hover:bg-red-500 flex-1 rounded-lg  py-2 md:text-xs text-sm font-medium cursor-pointer transition-colors duration-200">No</button>
                </div>

                <div className="flex justify-center items-center mt-2 gap-3">
                        <label htmlFor="showAgain" className="block text-slate-400 text-sm mb-1.5">Don't show this message again</label>
                        <input type="checkbox" id="showAgain" onChange={handleShowAgainChangeDayType} className="w-4 h-4 accent-blue-600 cursor-pointer rounded"/>
                </div>
            </div>
        </div>
    )
}