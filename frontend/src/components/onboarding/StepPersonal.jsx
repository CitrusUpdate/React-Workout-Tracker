export default function StepPersonal({ data, onChange }) {
    return (
        <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <label className='label-onboarding'>Age</label>
                    <input type='number' value={ data.age } onChange={e => onChange('age', e.target.value)} placeholder='25' className='input-dark w-full'/>
                </div>

                <div>
                    <label className='label-onboarding'>Weight (kg)</label>
                    <input type='number' value={ data.weight } onChange={e => onChange('weight', e.target.value)} placeholder='80' className='input-dark w-full'/>
                </div>

                <div>
                    <label className='label-onboarding'>Height (cm)</label>
                    <input type='number' value={ data.height } onChange={e => onChange('height', e.target.value)} placeholder='180' className='input-dark w-full'/>
                </div>
            </div>

            <div>
                <label className='label-onboarding'>Gender</label>
                <div className='grid grid-cols-2 gap-3'>
                    { ['male', 'female'].map(g => (
                    <button key={g} type='button' onClick={() => onChange('gender', g)}
                        className={`py-2.5 rounded-lg text-sm font-medium border transition capitalize hover:cursor-pointer
                        ${data.gender === g 
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                        }
                        `}>{g}
                    </button>
                    )) }
                </div>
            </div>
        </div>
    );
}