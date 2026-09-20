import Papa from "papaparse";
import { formatTimeToSeconds } from "./time.js";
import { parse } from "path";

const parseNumberField = (value) => {
    if(value === undefined || value === null || value === "" || value.toString().trim() === "N/A") {
        return null;
    }

    if(typeof(value) === "string" && value.includes("%")) {
        value = value.replace("%", "").trim();
    }

    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
}

export const parsePlanCsv = (csvString) => {
    const lines = csvString.split(/\r?\n/);
    const daysMap = new Map();
    let currentDay = null;
    let currentCsvLines = [];
    
    const processCurrentDay = () => {
        if(currentDay && currentCsvLines.length > 0) {
            const parsed = Papa.parse(currentCsvLines.join("\n"), { header: true, skipEmptyLines: true });

            parsed.data.forEach(row => {
                const exerciseName = row["Exercise"] || row["name"];
                if(!exerciseName) return;

                const ex = {
                    name: exerciseName,
                    order: daysMap.get(currentDay.name).exercises.length,
                    notes: row["Notes"] || row["notes"] || ""
                };

                if(currentDay.type === "running") {
                    ex.distance = parseNumberField(row["Distance"]);
                    ex.duration =  (!row["Duration"] || row["Duration"] === "N/A") ? null : formatTimeToSeconds(row["Duration"]);
                    ex.targetPace = (!row["Target Pace"] || row["Target Pace"] === "N/A") ? null : formatTimeToSeconds(row["Target Pace"]);
                    ex.targetBPM = parseNumberField(row["Target BPM"]);
                } else {
                    ex.setsCount = parseNumberField(row["Sets"]) || 0;
                    ex.targetRir = parseNumberField(row["Target RIR"]);
                    ex.targetPercent1RM = parseNumberField(row["%1RM"]);
                    ex.targetTempo = (!row["Target Tempo"] || row["Target Tempo"] === "N/A") ? null : row["Target Tempo"];
                }

                daysMap.get(currentDay.name).exercises.push(ex);
            });
        }
    };

    for(let line of lines) {
        if(line.startsWith("--- Day")) {
            processCurrentDay();

            const match = line.match(/--- Day \d+: (.*?) \| Type: (.*?) ---/);
            if(match) {
                currentDay = { name: match[1].trim(), type: match[2].trim().toLowerCase() };
                if(!daysMap.has(currentDay.name)) {
                    daysMap.set(currentDay.name, { name: currentDay.name, type: currentDay.type, exercises: [] });
                }

                currentCsvLines = [];
            } 
        } else if(line.startsWith("===") || line.startsWith("Description:") || line.trim() === "") {
                continue;
            } else {
                if(currentDay) currentCsvLines.push(line);
            }
    }

    processCurrentDay();

    return Array.from(daysMap.values());
}