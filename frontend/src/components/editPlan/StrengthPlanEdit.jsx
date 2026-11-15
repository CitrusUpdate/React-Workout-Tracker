import CustomSelect from "../CustomSelect";
import { dayTypeData } from "../../utils/typeData.js";
import { useState } from "react";
import ChangeDayTypeModal from "../ChangeDayTypeModal";
import { addExerciseToDay, changeDayTypeAndClear, deleteExerciseFromDay, deleteTrainingDay, getShouldHideWarning, handleExerciseChange, dayNameChange } from "../../utils/planUtils.js";
import CustomInput from "../CustomInput.jsx";
import { CirclePlus, Trash } from "lucide-react";
import CustomTextarea from "../CustomTextarea.jsx";

export default function StrengthPlanEdit({ dayData, draftPlan, setDraftPlan }) {
    // TODO: Add training day functionality, drag and drop


    if(!dayData || !draftPlan) return null;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingDayType, setPendingDayType] = useState(null);

    const handleConfirmDayChange = () => {
        const newDraft = changeDayTypeAndClear(draftPlan, dayData?.order, pendingDayType);
        setDraftPlan(newDraft);
        setIsModalOpen(false);
    }

    const handleSelectChange = (e) => {
        const newType = e.target.value;
        if(getShouldHideWarning()) {
            const newDraft = changeDayTypeAndClear(draftPlan, dayData?.order, newType);
            setDraftPlan(newDraft);
        } else {
            setPendingDayType(newType);
            setIsModalOpen(true);
        }
    }

    const handleChange = (e, index, field) => {
            const newDraft = handleExerciseChange(draftPlan, dayData?.order, index, field, e.target.value);
            setDraftPlan(newDraft);
    }

    const handleDeleteExercise = (index) => {
            const newDraft = deleteExerciseFromDay(draftPlan, dayData?.order, index);
            setDraftPlan(newDraft);
    }

    const handleAddExercise = () => {
        const newDraft = addExerciseToDay(draftPlan, dayData?.order, dayData?.type);
        setDraftPlan(newDraft);
    }

    const handleDeleteTrainingDay = () => {
            const newDraft = deleteTrainingDay(draftPlan, dayData?.order);
            setDraftPlan(newDraft);
    }

    const handleDayNameChange = (e) => {
        const newDraft = dayNameChange(draftPlan, dayData?.order, e.target.value);
        setDraftPlan(newDraft);
    }

    return (
        <div className="w-full">
            { isModalOpen && (
                <ChangeDayTypeModal setIsModalOpen={setIsModalOpen} dayData={dayData} onConfirm={handleConfirmDayChange}/>
            ) }

            <div className="flex justify-between items-center mb-2">
                <CustomInput 
                    labelFor={`dayName-${dayData?.order}`}
                    name={`dayName-${dayData?.order}`}
                    value={dayData?.name || ""}
                    onChange={handleDayNameChange}
                    placeholder="Your training day name"
                    className="md:text-xl text-lg font-semibold text-white bg-transparent border-none outline-none focus:ring-0 p-0 m-0 placeholder-slate-500 w-full"
                />
                <Trash className="md:w-8 w-6 text-slate-500 hover:text-red-500 cursor-pointer transition-colors" 
                    onClick={handleDeleteTrainingDay}
                />
            </div>

            <CustomSelect 
                label="Type:"
                labelFor={`dayType-${dayData?.order}`}
                name={`dayType-${dayData?.order}`}
                value={dayData?.type}
                onChange={handleSelectChange}
                options={dayTypeData}
            />

            <div className="w-full mt-6">
                <div className="w-full overflow-x-auto bg-slate-800/40 rounded-lg border border-slate-700/50 shadow-inner">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-slate-700/50 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="p-3 sticky left-0 z-10 bg-slate-800 border-r border-slate-700/50 shadow-[2px_0_5px_-2px_rgba(0, 0, 0, 0.3)] min-w-[200px]">Exercise</th>
                                <th className="p-3 min-w-[100px]">Sets</th>
                                <th className="p-3 min-w-[100px]">Reps</th>
                                <th className="p-3 min-w-[100px]">RIR</th>
                                <th className="p-3 min-w-[120px]">%1 RM</th>
                                <th className="p-3 min-w-[120px]">Tempo</th>
                                <th className="p-3 min-w-[120px]">Notes</th>
                                <th className="p-3 min-w-[60px] text-center"></th>
                            </tr>
                        </thead>

                        <tbody>
                            { dayData?.exercises?.map((exercise, index) => (
                                <tr key={index} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                                    <td className="p-2 sticky left-0 z-10 bg-slate-800 border-r border-slate-700/50 shadow-[2px_0_5px_-2px_rgba(0, 0, 0, 0.3)]">
                                        <CustomInput
                                            labelFor={`exerciseName-${dayData?.order}-${index}`}
                                            name={`exerciseName-${dayData?.order}-${index}`}
                                            value={exercise?.name || `exercise ${index}`}
                                            onChange={(e) => handleChange(e, index, 'name')}
                                            placeholder="Your exercise name"
                                            required={true}
                                        />
                                    </td>

                                    <td className="p-2">
                                        <CustomInput
                                            labelFor={`setsCount-${dayData?.order}-${index}`}
                                            type="number"
                                            name={`setsCount-${dayData?.order}-${index}`}
                                            value={exercise?.setsCount || 3}
                                            onChange={(e) => handleChange(e, index, 'setsCount')}
                                            placeholder="e.g. 3"
                                            required={true}
                                        />
                                    </td>

                                    <td className="p-2">
                                        <CustomInput
                                            labelFor={`reps-${dayData?.order}-${index}`}
                                            name={`reps-${dayData?.order}-${index}`}
                                            value={exercise?.targetReps || 12}
                                            onChange={(e) => handleChange(e, index, 'targetReps')}
                                            placeholder="e.g. 8-12"
                                            required={true}
                                        />
                                    </td>

                                    <td className="p-2">
                                        <CustomInput
                                            labelFor={`rir-${dayData?.order}-${index}`}
                                            type="number"
                                            name={`rir-${dayData?.order}-${index}`}
                                            value={exercise?.targetRir || 3}
                                            onChange={(e) => handleChange(e, index, 'targetRir')}
                                            placeholder="e.g. 2"
                                        />                                            
                                    </td>

                                    <td className="p-2">
                                        <CustomInput
                                            labelFor={`1RM-${dayData?.order}-${index}`}
                                            type="number"
                                            name={`1RM-${dayData?.order}-${index}`}
                                            value={exercise?.targetPercent1RM || ""}
                                            onChange={(e) => handleChange(e, index, 'targetPercent1RM')}
                                            placeholder="e.g. 80"
                                        />                                                                  
                                    </td>

                                    <td className="p-2">
                                        <CustomInput
                                            labelFor={`tempo-${dayData?.order}-${index}`}
                                            name={`tempo-${dayData?.order}-${index}`}
                                            value={exercise?.targetTempo || ""}
                                            onChange={(e) => handleChange(e, index, 'targetTempo')}
                                            placeholder="e.g. 3-1-1-0"
                                        />                                            
                                    </td>

                                    <td className="p-2">
                                        <CustomTextarea 
                                            labelFor={`notes-${dayData?.order}-${index}`}
                                            name={`notes-${dayData?.order}-${index}`}
                                            value={exercise?.notes || ""}
                                            onChange={(e) => handleChange(e, index, 'notes')}
                                            placeholder="Your exercise notes"
                                        />
                                    </td>

                                    <td className="p-2 text-center">
                                            <Trash className="md:w-8 w-6 cursor-pointer text-slate-400 hover:text-red-500 transition-colors" 
                                                onClick={() => handleDeleteExercise(index)}
                                            />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={100}>
                                        <button 
                                            onClick={handleAddExercise}
                                            className="mt-3 flex items-center justify-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-semibold transition cursor-pointer w-full p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg"
                                        >
                                            <CirclePlus className="md:w-8 w-6 cursor-pointer"/>
                                        </button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
    )
}