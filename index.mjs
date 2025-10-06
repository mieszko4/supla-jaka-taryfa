import * as csv from "csv"
import * as fs from 'node:fs';
import { parseDateTime } from './lib/parseDateTime.mjs';
import { getPrice as getG11Price } from "./tariff/g11.mjs";
import { getPrice as getG12Price } from "./tariff/g12.mjs";
import { getPrice as getG12wPrice } from "./tariff/g12w.mjs";
import { getPrice as getG12nPrice } from "./tariff/g12n.mjs";

const path = "ID10313_2025-05-10_12-05-28_measurements.csv"

// 2023->2024 (365 days)
//const overrideStart = '2023-10-05 12:01:21'
//const overrideEnd = '2024-10-05 12:00:29'

// 2024->2025 (365 days)
const overrideStart = '2024-10-05 12:00:29'
const overrideEnd = '2025-10-05 12:01:48'

const processFile = async (filename) => {
    const records = [];
    const parser = fs
      .createReadStream(filename)
      .pipe(csv.parse({
        delimiter: ",",
        encoding: "utf-8"
        }));
    for await (const record of parser) {
      records.push(record);
    }
    return records;
  };


const getValueDiff = (rows, idx, headerIndex) => {
  const valueBefore = Number(rows[idx-1].at(headerIndex))
  const valueNow = Number(rows[idx].at(headerIndex))
  
  const value = valueNow - valueBefore

  console.assert(Math.abs(value) < 10, `Unexpected value over 10kWh for: ${rows[idx][0]}`)
  console.assert(value >= 0, `Unexpected negative value: ${rows[idx][0]}`)

  return value
}

// Measurement resolution: every 10min
const processData = (data) => {
    const [headerRaw, ...allRows] = data

    const header = headerRaw.map(r => r.trim())

    const dateTimeIndex = header.indexOf('Date and time'); // Use local date and time
    console.assert(dateTimeIndex !== -1, 'dateTimeIndex not found')

    // Exclude obviously faulty mesurements
    const rows = allRows.filter(r => !r[dateTimeIndex].includes(
      '2025-09-28 13:31:49' // It is very small value, the diff is over 10kWh
    ))

    // Note that we do not use hourly balance here which would be more accurate!
    const totalVectorIndex = header.indexOf('Forward active Energy kWh - Vector balance');
    console.assert(totalVectorIndex !== -1, 'totalVectorIndex not found')

    const firstRowIndex = rows.findIndex(r => r.at(dateTimeIndex) === overrideStart)
    console.assert(firstRowIndex !== -1, 'Invalid overrideStart')
    const lastRowIndex = rows.findIndex(r => r.at(dateTimeIndex) === overrideEnd)
    console.assert(lastRowIndex !== -1, 'Invalid lastRowIndex')

    const rows2 = rows.slice(firstRowIndex, lastRowIndex)

    console.info({
      Start: rows2.at(0).at(dateTimeIndex),
      End: rows2.at(-1).at(dateTimeIndex),
    })

    // Ignore first row because all is stored cumulative so we need diff
    // And first row constains sum until now (i.e not 0)
    const [firstRow, ...otherRows] = rows2
    return otherRows.map((row, idx) => {
        const dateTime = row.at(dateTimeIndex)

        // Pass all rows, and pass increased idx so that diff can be calculated
        const rowsIdx = idx + 1
        const total = getValueDiff(rows2, rowsIdx, totalVectorIndex)
        
        return {dateTime: parseDateTime(dateTime), total }
    })
}


const data = await processFile(path)
const rows = processData(data)

// Total kWh
const totalKWh = rows.reduce((prev, cur) => prev + cur.total, 0)
// G11: Daily always
const priceG11 = rows.reduce((prev, cur) => prev + getG11Price(cur.dateTime, cur.total), 0)
// G12: Normal Day/Night
const priceG12 = rows.reduce((prev, cur) => prev + getG12Price(cur.dateTime, cur.total), 0)
// G12w: Weekend Day/Night
const priceG12w = rows.reduce((prev, cur) => prev + getG12wPrice(cur.dateTime, cur.total), 0)
// G12w: Sunday Day/Night
const priceG12n = rows.reduce((prev, cur) => prev + getG12nPrice(cur.dateTime, cur.total), 0)

console.log({
  totalKWh,
  priceG11,
  priceG12,
  priceG12w,
  priceG12n,
  howMuchWouldItBeCheaperWithG12Sum: priceG11 - priceG12,
  howMuchWouldItBeCheaperWithG12Pct: (priceG11 - priceG12) / priceG11 * 100,
  howMuchWouldItBeCheaperWithG12wSum: priceG11 - priceG12w,
  howMuchWouldItBeCheaperWithG12wPct: (priceG11 - priceG12w) / priceG11 * 100,
  howMuchWouldItBeCheaperWithG12nSum: priceG11 - priceG12n,
  howMuchWouldItBeCheaperWithG12nPct: (priceG11 - priceG12n) / priceG11 * 100,
})

