import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import StepGoals from './onboarding/StepGoals';
import StepMaxes from './onboarding/StepMaxes';
import StepPersonal from './onboarding/StepPersonal';
import StepPreferences, { DETECTED_TZ } from './onboarding/StepPreferences';

const STEPS = ['Personal Info', 'Goals', 'Preferences', '1RM Maxes'];

export default function OnboardingModal() {
    const { updateProfile, updateTimezone, isUpdatingProfile } = useAuthStore();
    const [step, setStep] = useState(0);

    const [personal, setPersonal] = useState({
        age: '', weight: '', height: '', gender: '',
    });

    const [goals, setGoals] = useState({
        goal: 'maintain', experienceLevel: 'beginner',
    });

    const[pref, setPrefs] = useState({
       units: 'kg', rounding: 2.5, timezone: DETECTED_TZ, 
    });

    const [maxes, setMaxes] = useState({
        bench_press: '', squat: '', deadlift: '',
    });

    const handleFinish = async () => {
        const maxesMap = {};
        Object.entries(maxes).forEach(([key, val]) => {
            if(val) maxesMap[key.replace('_', ' ')] = Number(val);
        });

        await updateTimezone(pref.timezone);
        await updateProfile({
            age: Number(personal.age),
            weight: Number(personal.weight),
            height: Number(personal.height),
            gender: personal.gender,
            goal: goals.goal,
            experienceLevel: goals.experienceLevel,
            preferences: { units: pref.units, rounding: Number(pref.rounding) },
        });
        Cookies.set('onboarding_complete', 'true', { expires: 365 });
    };

    const progress = ((step + 1) / STEPS.length) * 100;

    return (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4'>
            <div className='bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8'>
                { /*Header*/ }
                <header className='mb-6'>
                    <p className='text-blue-400 text-xs uppercase tracking-widest mb-1'>Step { step + 1} of { STEPS.length }</p>
                    <h2 className='text-white text-xl font-semibold'>{ STEPS[step] }</h2>
                    <div className='mt-3 h-1 bg-slate-800 rounded-full'>
                        <div className='h-1 bg-blue-500 rounded-full transition-all duration-300' style={ { width: `${progress}%` } } />
                    </div>
                </header>

                {step === 0 && <StepPersonal data={personal} onChange={(key, val) => setPersonal(p => ({...p, [key]: val}))} />}
                {step === 1 && <StepGoals data={goals} onChange={(key, val) => setGoals(p => ({...p, [key]: val}))} />}
                {step === 2 && <StepPreferences data={pref} onChange={(key, val) => setPrefs(p => ({...p, [key]: val}))} />}
                {step === 3 && <StepMaxes data={maxes} onChange={(key, val) => setMaxes(p => ({...p, [key]: val}))} units={pref.units} />}

                {/*Navigation */}
                <div className='flex gap-3 mt-8'>
                    { step > 0 && (
                        <button onClick={() => setStep(s => s - 1)}
                            className='flex-1 py-2.5 rounded-lg text-sm font-medium border border-slate-700 text-slate-400 hover:border-slate-500 transition hover:cursor-pointer'>
                                Back
                        </button>
                    )}
                    
                    { step < STEPS.length - 1 ? (
                        <button onClick={() => setStep(s => s + 1)}
                            className='flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg text-sm transition hover:cursor-pointer'>
                                Next
                            </button>
                    ) : (
                        <button onClick={handleFinish} disabled={isUpdatingProfile}
                            className='flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-sm transition hover:cursor-pointer'>
                                { isUpdatingProfile ? 'Saving' : 'Finish' }
                            </button>
                    )}
                </div>
            </div>
        </div>
    );
}