export const formatRunningSplits = (splits) => {
    if (!splits || splits.length === 0) {
        return "";
    }

    const splitNotes = splits.map((split, index) => {
        return `KM ${index + 1}: ${split.pace} (${split.bpm} BPM)`;
    }).join(" | ");

    return splitNotes;
}