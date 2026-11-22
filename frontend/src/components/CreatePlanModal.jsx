import { useState } from "react";
import { usePlanStore } from "../store/usePlanStore"
import { useNavigate } from 'react-router';
import CustomInput from "./CustomInput";
import CustomTextarea from "./CustomTextarea";
import CustomSelect from "./CustomSelect";
import { planTypeData } from "../utils/typeData.js";
export default function CreatePlanModal({ setIsModalOpen }) {
    const { isCreatingPlan, createPlan } = usePlanStore();
    const [planName, setPlanName] = useState("");
    const [planDescription, setPlanDescription] = useState("");
    const [planType, setPlanType] = useState("strength");
    const navigate = useNavigate();

    const handleCreateBtn = async () => {
        const planData = {
            name: planName || "Created plan",
            description: planDescription || "",
            type: planType || "strength"
        };

        const createdPlan = await createPlan(planData);

        if(createdPlan?._id) {
            setIsModalOpen(false);
            navigate(`/trainings/plans/edit/${createdPlan?._id}`);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md md:p-8 p-5 overflow-y-auto max-h-[90vh]">
                <header className="mb-6 text-center font-bold">
                    <h2>Create Plan</h2>
                </header>

                <div className="md:space-y-4 space-y-2">
                    <CustomInput 
                        label="Plan Name: "
                        labelFor="planName"
                        name="planName"
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
                        placeholder="Your Plan Name"
                    />

                    <CustomTextarea 
                        label="Plan Description: "
                        labelFor="planDescription"
                        name="planDescription"
                        value={planDescription}
                        onChange={(e) => setPlanDescription(e.target.value)}
                        placeholder="Description of your plan"
                    />

                    <CustomSelect 
                        label="Plan Type: "
                        labelFor="planType"
                        name="planType"
                        value={planType}
                        onChange={(e) => setPlanType(e.target.value)}
                        options={planTypeData}
                    />
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={handleCreateBtn} className="bg-blue-600 hover:bg-blue-500 flex-1 rounded-lg  py-2 md:text-sm text-xs font-medium cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isCreatingPlan}>Create</button>
                    <button onClick={() => setIsModalOpen(false)} className="bg-slate-600 hover:bg-slate-500 flex-1 rounded-lg  py-2 md:text-sm text-xs font-medium cursor-pointer transition-colors duration-200">Back</button>
                </div>
            </div>
        </div>
    )
}