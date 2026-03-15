// helper for drawing table in pdf
import { rgb } from "pdf-lib";

export const drawTable = ({
    pdfDoc,
    page,
    headers,
    rows,
    font,
    title = "",
    meta = []
}) => {
    const margin = 40;
    const rowHeight = 22;
    const headerHeight = 24;

    let { width, height } = page.getSize();
    let y = height - margin;

    const drawHeader = () => {
        if(title) {
            page.drawText(title, {
                x: margin,
                y,
                size: 10,
                font
            });

            y -= 28;
        }

        meta.forEach(line => {
            page.drawText(line, {
                x: margin,
                y,
                size: 10,
                font
            });

            y -= 14;
        });

        y -= 10;
    };

    drawHeader();

    const colWidths = headers.map((_, i) => {
        let maxLength = headers[i].length;

        rows.forEach(r => {
            const cell = String(r[i] ?? "");
            if(cell.length > maxLength) maxLength = cell.length;
        });

        return maxLength;
    });

    const totalChars = colWidths.reduce((a, b) => a + b, 0);
    const tableWidth = width - margin * 2;

    const finalWidths = colWidths.map(c => (c / totalChars) * tableWidth);

    const drawTableHeader = () => {
        let x = margin;

        headers.forEach((h, i) => {
            page.drawRectangle({
                x,
                y: y - headerHeight + 4,
                width: finalWidths[i],
                height: headerHeight,
                borderWidth: 1,
                borderColor: rgb(0.95, 0.95, 0.95),
                color: rgb(0.95, 0.95, 0.95)
            });

            page.drawText(h, {
                x: x + 4,
                y: y - 14,
                size: 10,
                font
            });

            x += finalWidths[i];
        });

        y -= headerHeight;
    };

    drawTableHeader();

    rows.forEach(row => {
        if(y < margin + rowHeight) {
            page = pdfDoc.addPage();

            ({ width, height } = page.getSize());
            y = height - margin;

            drawTableHeader();
        }

        let x = margin;

        row.forEach((cell, i) => {
            page.drawRectangle({
                x,
                y: y - rowHeight + 4,
                width: finalWidths[i],
                height: rowHeight,
                borderWidth: 0.5,
                borderColor: rgb(0.7, 0.7, 0.7)
            });

            page.drawText(String(cell ?? ""), {
                x: x + 4,
                y: y - 14,
                size: 9,
                font
            });

            x += finalWidths[i];
        });

        y -= rowHeight;
    });

    return page;
};