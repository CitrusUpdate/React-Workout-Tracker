import CustomInput from "../CustomInput";
import CustomTextarea from "../CustomTextarea";

export default function PlanGeneralInfo({ draftPlan, setDraftPlan}) {
    if(!draftPlan) return null;

    return (
        <div className="flex flex-col gap-4 bg-slate-800/40 p-6 rounded-lg border border-slate-700/50 w-full mt-2">
            <h2 className="md:text-xl text-lg font-bold text-white mb-2">Edit Plan</h2>

            <CustomInput 
                label="Plan Name"
                labelFor="planName"
                name="planName"
                value={draftPlan.name || ""}
                onChange={(e) => setDraftPlan({ ...draftPlan, name: e.target.value })}
                placeholder="e.g. Hybrid Athlete Training Plan"
            />

            <CustomTextarea
                label="Description"
                labelFor="description"
                name="description"
                value={draftPlan.description || ""}
                onChange={(e) => setDraftPlan({ ...draftPlan, description: e.target.value})}
                placeholder="Short description of your plan"
            />

            <div className="w-full justify-center items-center text-center">
                <h3 className="md:text-xl text-lg font-semibold text-white mb-2">Plan type: <span className="capitalize">{draftPlan.type}</span></h3>
                <p className="text-slate-500 md:text-sm text-xs italic leading-relaxed">*Plan type is detected automatically</p>
                <h4 className="md:text-xl text-lg font-medium text-white mt-2">Plan days: {draftPlan.days.length}</h4>
            </div>
        </div>
    )
}