import Papa from "papaparse";
import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { drawTable } from "./pdfTable.js";
import { formatRunningSplits } from "./splits.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fontPath = path.join(__dirname, "../fonts/NotoSans-Regular.ttf");

export const generateCsvForSessions = (sessions) => {
    let finalCsv = "";

    if (sessions.length === 0) {
        return "No data available";
    }

    sessions.forEach(session => {
        const sessionType = session.type || "strength";
        const sessionDate = session.date.toISOString().split("T")[0];
        
        finalCsv += `--- Date: ${sessionDate} | Type: ${sessionType.toUpperCase()} ---\n`;
        if (session.notes) {
            finalCsv += `Session Notes: ${session.notes}\n`;
        }

        const rows = [];
        session.exercises.forEach(ex => {
            ex.sets.forEach((set, i) => {
                const baseData = {
                    exercise: ex.name,
                    type: session.type,
                    exerciseNotes: ex.notes || "Not provided",
                    setNumber: i + 1,
                };

                const splitsText = formatRunningSplits(set.splits);
                const userNotes = set.notes || ex.notes || "";
                const finalNotes = [splitsText, userNotes].filter(Boolean).join(" || ") || "Not provided";

                if (sessionType === "running") {
                    rows.push({
                        ...baseData,
                        distanceKm: set.distance || "N/A",
                        durationSec: set.duration || "N/A",
                        pace: set.pace || "N/A",
                        avgBPM: set.avgHeartRate,
                        completed: set.completed ? "Yes" : "No",
                        setNotes: finalNotes
                    });
                } else {
                    rows.push({
                        ...baseData,
                        weight: set.weight || "N/A",
                        reps: set.reps || "N/A",
                        rir: set.rir || "N/A",
                        completed: set.completed ? "Yes" : "No",
                        setNotes: finalNotes
                    });
                }
            });
        });

        finalCsv += Papa.unparse(rows) + "\n\n";
    });

    return "\uFEFF" + finalCsv; 
};

export const generatePdfForSessions = async (sessions) => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = readFileSync(fontPath);
    const font = await pdfDoc.embedFont(fontBytes);

    if (sessions.length === 0) {
        let page = pdfDoc.addPage();
        page.drawText("No data available for selected period.", { x: 50, y: 700, size: 15, font });
    }

    sessions.forEach(session => {
        let page = pdfDoc.addPage();
        const sessionType = session.type || "strength";
        const sessionDate = session.date.toISOString().split("T")[0];

        let headers = [];
        if (sessionType === "running") {
            headers = ["Exercise", "Set", "Distance", "Duration", "Pace", "Completed", "Notes"];
        } else {
            headers = ["Exercise", "Set", "Weight", "Reps", "RIR", "Completed", "Notes"];
        }

        const rows = [];
        
        session.exercises.forEach(ex => {
            ex.sets.forEach((set, i) => {
                const splitsText = formatRunningSplits(set.splits);
                const userNotes = set.notes || ex.notes || "";
                const finalNotes = [splitsText, userNotes].filter(Boolean).join(" || ") || "Not provided";
                
                if (sessionType === "running") {
                    rows.push([
                        ex.name,
                        i + 1,
                        set.distance ? `${set.distance} km` : "N/A",
                        set.duration ? `${set.duration} s` : "N/A",
                        set.pace || "N/A",
                        set.completed ? "Yes" : "No",
                        finalNotes
                    ]);
                } else {
                    rows.push([
                        ex.name,
                        i + 1,
                        set.weight || "N/A",
                        set.reps || "N/A",
                        set.rir || "N/A",
                        set.completed ? "Yes" : "No",
                        finalNotes
                    ]);
                }
            });
        });

        drawTable({
            pdfDoc,
            page,
            headers,
            rows,
            font,
            title: `Date: ${sessionDate} | Type: ${sessionType.toUpperCase()}`,
            meta: [
                `Session Notes: ${session.notes || "Not provided"}`,
                `Exercises: ${session.exercises.length}`
            ]
        });
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
};