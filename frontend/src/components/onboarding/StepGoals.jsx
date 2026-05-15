export default function StepGoals({ data, onChange }) {
    return (
        <div className='space-y-5'>
            <div>
                <label className='label-onboarding'>Goal</label>
                <div className='grid grid-cols-3 gap-3'>
                    { ['cut', 'maintain', 'bulk'].map(g => (
                        <button key={g} type='button' onClick={() => onChange('goal', g)}
                            className={`py-2.5 rounded-lg text-sm font-medium border transition capitalize hover:cursor-pointer
                            ${data.goal === g
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                            }`}>
                            {g}
                        </button>
                        )) }
                </div>
                </div>

                <div>
                    <label className='label-onboarding'>Experience level</label>
                        <div className='grid grid-cols-3 gap-3'>
                            { ['beginner', 'intermediate', 'advanced'].map(l => (
                                <button key={l} type='button' onClick={() => onChange('goal', l)}
                                    className={`py-2.5 rounded-lg text-sm font-medium border transition capitalize hover:cursor-pointer
                                    ${data.experienceLevel === l
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                    }`}>
                                    {l}
                                </button>
                                )) }
                        </div>
                    </div>
        </div>
    )
}