import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { usePlanStore } from "../store/usePlanStore.js"
import PageLoader from "../components/PageLoader.jsx";
import StrengthPlanEdit from "../components/editPlan/StrengthPlanEdit.jsx";
import RunningPlanEdit from "../components/editPlan/RunningPlanEdit.jsx";
import PlanGeneralInfo from "../components/editPlan/PlanGeneralInfo.jsx";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { parsePaceToSeconds } from "../utils/timeUtils.js";
import { addTrainingDay } from "../utils/planUtils.js";
import { CirclePlus } from "lucide-react";

export default function EditPlan() {
    const { id } = useParams();
    const { singlePlan, isUpdatingPlan, isLoadingPlan, getSinglePlan, updatePlan} = usePlanStore();
    const navigate = useNavigate();
    
    const [draftPlan, setDraftPlan] = useState(null);

    useEffect(() => {
        if(id) getSinglePlan(id);
    }, [id])

    // create copy of data from backend and work with it until user clicks save button
    useEffect(() => {
        if(singlePlan) setDraftPlan(JSON.parse(JSON.stringify(singlePlan)));
    }, [singlePlan]);

    if(isLoadingPlan || !singlePlan || !draftPlan) {
        return (
            <div className="pt-24 flex justify-center">
                <PageLoader />
            </div>
        );
    } 

    const handleSave = () => {
        const sanitizedPlan = JSON.parse(JSON.stringify(draftPlan));
        sanitizedPlan?.days.forEach(day => {
            if(day?.type === "running") {
                day?.exercises.forEach(ex => {
                    if(ex.targetPace) {
                        ex.targetPace = parsePaceToSeconds(ex.targetPace);
                    }
                });
            }
        });

        updatePlan(id, sanitizedPlan);
    }

    const handleAddTrainingDay = () => {
        const newDraft = addTrainingDay(draftPlan);
        setDraftPlan(newDraft);
    }

    return (
        <div className="pt-24 px-4 text-white max-w-7xl w-full mx-auto flex flex-col gap-6 pr-20">
            <Navbar />
            <Sidebar />
            <PlanGeneralInfo draftPlan={draftPlan} setDraftPlan={setDraftPlan} />


            { draftPlan?.days?.map(day => (
                day?.type === "running" ? (
                    <RunningPlanEdit key={day.order}  dayData={day} draftPlan={draftPlan} setDraftPlan={setDraftPlan}/> 
                ) : ( 
                    <StrengthPlanEdit key={day.order} dayData={day} draftPlan={draftPlan} setDraftPlan={setDraftPlan} /> 
                )
            ))}

            <button 
                        onClick={handleAddTrainingDay}
                        className="w-full py-4 mt-6 border-2 border-dashed border-slate-700 hover:border-blue-500 text-slate-400 hover:text-blue-500 rounded-xl transition-colors flex items-center justify-center gap-2 font-semibold cursor-pointer"
                    >
                        <CirclePlus className="md:w-8 w-6 cursor-pointer" /> Add Training Day
            </button>

            <div className="w-full flex md:flex-row flex-col justify-between items-center gap-4">
                <button onClick={handleSave} className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-500 w-32 py-2 rounded-md transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" disabled={isUpdatingPlan}>
                    Save
                </button>

                <button onClick={() => navigate("/trainings")} className="flex-1 flex items-center justify-center bg-slate-600 hover:bg-slate-500 w-32 py-2 rounded-md transition-colors duration-300 cursor-pointer">
                    Back
                </button>
            </div>
        </div>
    )
}