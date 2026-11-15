import CustomSelect from "../CustomSelect";
import { dayTypeData } from "../../utils/typeData.js";
import { useState } from "react";
import ChangeDayTypeModal from "../ChangeDayTypeModal";
import { changeDayTypeAndClear, deleteExerciseFromDay, getShouldHideWarning, handleExerciseChange, addExerciseToDay, deleteTrainingDay, dayNameChange } from "../../utils/planUtils.js";
import { parsePaceToSeconds, formatSecondsToTime } from "../../utils/timeUtils.js";
import CustomInput from "../CustomInput.jsx";
import CustomTextarea from "../CustomTextarea.jsx";
import { CirclePlus, Trash } from "lucide-react";

export default function RunningPlanEdit({ dayData, draftPlan, setDraftPlan }) {
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

    const handlePaceChange = (e, index) => {
        const seconds = parsePaceToSeconds(e.target.value);
        const newDraft = handleExerciseChange(draftPlan, dayData?.order, index, 'targetPace', seconds);
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
                                    <th className="p-3 min-w-[100px]">Distance</th>
                                    <th className="p-3 min-w-[100px]">Duration</th>
                                    <th className="p-3 min-w-[120px]">Target Pace</th>
                                    <th className="p-3 min-w-[120px]">Target BPM</th>
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
                                                labelFor={`distance-${dayData?.order}-${index}`}
                                                type="number"
                                                name={`distance-${dayData?.order}-${index}`}
                                                value={exercise?.distance || 5}
                                                onChange={(e) => handleChange(e, index, 'distance')}
                                                placeholder="e.g. 6 (in KM)"
                                                required={true}
                                            />
                                        </td>

                                        <td className="p-2">
                                            <CustomInput
                                                labelFor={`duration-${dayData?.order}-${index}`}
                                                type="number"
                                                name={`duration-${dayData?.order}-${index}`}
                                                value={exercise?.duration || 40}
                                                onChange={(e) => handleChange(e, index, 'duration')}
                                                placeholder="e.g. 50 (in minutes)"
                                            />                                            
                                        </td>

                                        <td className="p-2">
                                            <CustomInput
                                                labelFor={`targetPace-${dayData?.order}-${index}`}
                                                type="text"
                                                name={`targetPace-${dayData?.order}-${index}`}
                                                value={formatSecondsToTime(exercise?.targetPace)}
                                                onChange={(e) => handleChange(e, index, 'targetPace')}
                                                onBlur={(e) => handlePaceChange(e, index)}
                                                placeholder="e.g. 5:30 (min/km)"
                                            />                                                                  
                                        </td>

                                        <td className="p-2">
                                            <CustomInput
                                                labelFor={`targetBPM-${dayData?.order}-${index}`}
                                                name={`targetBPM-${dayData?.order}-${index}`}
                                                value={exercise?.targetBPM || 150}
                                                onChange={(e) => handleChange(e, index, 'targetBPM')}
                                                placeholder="e.g. 160"
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