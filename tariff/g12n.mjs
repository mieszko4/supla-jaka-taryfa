import { parseDateTime } from '../lib/parseDateTime.mjs';
import { isWeekDay, SUNDAY } from '../lib/isWeekDay.mjs';
import { isFreeDay } from '../lib/isFreeDay.mjs';

const isSunday = (dateTime) => isWeekDay(dateTime, SUNDAY)

const isCheapHour = (dateTime) => {
    const cheapHours = ['01', '02', '03', '04']

    return cheapHours.includes(dateTime.hour)
}

const isCheaper = (dateTime) => isSunday(dateTime) || isFreeDay(dateTime) || isCheapHour(dateTime)

const prices = { // Based on https://akademia-fotowoltaiki.pl/pge/
    day: 0.6212+0.4278,
    night: 0.5903+0.0428
}

export const getPrice = (time, value) => isCheaper(time) ? prices.night * value : prices.day * value


// Test plan
// 1. Not weekend
// About 01:00
console.assert(isCheaper(parseDateTime('2023-04-18 00:59:00')) === false, '01:00-B')
console.assert(isCheaper(parseDateTime('2023-04-18 01:00:00')) === true, '01:00-E')
console.assert(isCheaper(parseDateTime('2023-04-18 01:01:00')) === true, '01:00-A')

// About 02:00
console.assert(isCheaper(parseDateTime('2023-04-18 01:59:00')) === true, '02:00-B')
console.assert(isCheaper(parseDateTime('2023-04-18 01:00:00')) === true, '02:00-E')
console.assert(isCheaper(parseDateTime('2023-04-18 01:01:00')) === true, '02:00-A')

// About 05:00
console.assert(isCheaper(parseDateTime('2023-04-18 04:59:00')) === true, '05:00-B')
console.assert(isCheaper(parseDateTime('2023-04-18 05:00:00')) === false, '05:00-E')
console.assert(isCheaper(parseDateTime('2023-04-18 05:01:00')) === false, '05:00-A')

// 2. Saturday (18th Feb 2023)
// About 00:00 (Start)
console.assert(isCheaper(parseDateTime('2023-02-18 23:59:00')) === false, '00:00-SatB')
console.assert(isCheaper(parseDateTime('2023-02-18 00:00:00')) === false, '00:00-SatE')
console.assert(isCheaper(parseDateTime('2023-02-18 00:01:00')) === false, '00:00-SatA')

// 3. Sunday (19th Feb 2023)
// About 00:00 (End)
console.assert(isCheaper(parseDateTime('2023-02-19 23:59:00')) === true, '00:00-SunB')
console.assert(isCheaper(parseDateTime('2023-02-19 00:00:00')) === true, '00:00-SunE')
console.assert(isCheaper(parseDateTime('2023-02-19 00:01:00')) === true, '00:00-SunA')

// 4. Free day (6th Jan 2023)
console.assert(isCheaper(parseDateTime('2023-01-06 08:00:00')) === true, '08:00-FE')
