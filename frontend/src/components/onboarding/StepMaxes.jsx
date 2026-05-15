const DEFAULT_MAXES = [
    { name: 'Bench Press', key: 'bench_press' },
    { name: 'Squat', key: 'squat' },
    { name: 'Deadlift', key: 'deadlift' },
];

export default function StepMaxes({ data, onChange, units }) {
    return (
        <div className='space-y-4'>
            <p className='text-slate-400 text-sm'>Optional - used to auto-calculate weights from %1 rep max in your plans</p>
                { DEFAULT_MAXES.map(ex => (
                    <div key={ex.key}>
                        <label className='block text-slate-400 text-sm mb-1.5'>{ex.name}({units})</label>
                        <input type='number'
                            value={data[ex.key]}
                            onChange={e => onChange(ex.key, e.target.value)}
                            placeholder='Optional'
                            className='input-dark w-full' />
                    </div>
            )) }
        </div>
    );
}