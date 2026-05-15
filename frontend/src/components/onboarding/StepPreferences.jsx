const TIMEZONES = Intl.supportedValuesOf('timeZone');
export const DETECTED_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function StepPreferences({ data, onChange }) {
    return (
        <div className='space-y-4'>
            <div>
                <label className='label-onboarding'>Weight units</label>
                <div className='grid grid-cols-2 gap-3'>
                    { ['kg', 'lbs'].map(u => (
                    <button key={u} type='button' onClick={() => onChange('units', u)}
                        className={`py-2.5 rounded-lg text-sm font-medium border transition uppercase hover:cursor-pointer
                            ${data.units === u
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                            }`}>
                            {u}
                    </button>
                )) }
            </div>
            </div>

            <div>
                <label className='label-onboarding'>Plate rounding</label>
                <div className='grid grid-cols-2 gap-3'>
                    { [0.5, 1.25, 2.5, 5].map(r => (
                    <button key={r} type='button' onClick={() => onChange('rounding', r)}
                        className={`py-2.5 rounded-lg text-sm font-medium border transition hover:cursor-pointer
                        ${data.rounding === r
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                        }`}>
                        {r} kg
                    </button>
                    )) }
                </div>
                </div>

                <div>
                    <label className='label-onboarding'>Timezone</label>
                    <select value={data.timezone} onChange={e => onChange('timezone', e.target.value)}
                        className='w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition'>
                        { TIMEZONES.map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
                        ))}
                    </select>
                    <p className='text-slate-500 text-xs mt-1'>Auto-detected: {DETECTED_TZ}</p>
                </div>
                </div>
    );
}