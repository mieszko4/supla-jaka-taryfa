import { parseDateTime } from '../lib/parseDateTime.mjs';

const isCheapHour = (dateTime) => {
    const isSummer = ['04', '05', '06', '07', '08', '09'].includes(dateTime.month)

    const cheapHours = isSummer
        ? ['00', '01', '02', '03', '04', '05', '15', '16', '22', '23']
        : ['00', '01', '02', '03', '04', '05', '13', '14', '22', '23']

    return cheapHours.includes(dateTime.hour)
}

const isCheaper = (dateTime) => isCheapHour(dateTime)

const prices = { // Based on https://akademia-fotowoltaiki.pl/pge/
    day: 0.6212+0.4938,
    night: 0.5536+0.0941
}

export const getPrice = (time, value) => isCheaper(time) ? prices.night * value : prices.day * value


// Test plan
// About 22:00
console.assert(isCheaper(parseDateTime('2023-02-18 21:59:00')) === false, '22:00-B')
console.assert(isCheaper(parseDateTime('2023-02-18 22:00:00')) === true, '22:00-E')
console.assert(isCheaper(parseDateTime('2023-02-18 22:01:00')) === true, '22:00-A')

// About 00:00
console.assert(isCheaper(parseDateTime('2023-02-18 23:59:00')) === true, '00:00-B')
console.assert(isCheaper(parseDateTime('2023-02-18 00:00:00')) === true, '00:00-E')
console.assert(isCheaper(parseDateTime('2023-02-18 00:01:00')) === true, '00:00-A')

// About 06:00
console.assert(isCheaper(parseDateTime('2023-02-18 05:59:00')) === true, '06:00-B')
console.assert(isCheaper(parseDateTime('2023-02-18 06:00:00')) === false, '06:00-E')
console.assert(isCheaper(parseDateTime('2023-02-18 06:01:00')) === false, '06:00-A')

//  About 13:00 (winter)
console.assert(isCheaper(parseDateTime('2023-03-17 12:59:00')) === false, '13:00-WinB')
console.assert(isCheaper(parseDateTime('2023-03-17 13:00:00')) === true, '13:00-WinE')
console.assert(isCheaper(parseDateTime('2023-03-17 13:01:00')) === true, '13:00-WinA')

//  About 15:00 (winter)
console.assert(isCheaper(parseDateTime('2023-03-17 14:59:00')) === true, '15:00-WinB')
console.assert(isCheaper(parseDateTime('2023-03-17 15:00:00')) === false, '15:00-WinE')
console.assert(isCheaper(parseDateTime('2023-03-17 15:01:00')) === false, '15:00-WinA')

//  About 15:00 (summer)
console.assert(isCheaper(parseDateTime('2023-04-18 14:59:00')) === false, '15:00-SumB')
console.assert(isCheaper(parseDateTime('2023-04-18 15:00:00')) === true, '15:00-SumE')
console.assert(isCheaper(parseDateTime('2023-04-18 15:01:00')) === true, '15:00-SumA')

//  About 17:00 (summer)
console.assert(isCheaper(parseDateTime('2023-04-18 16:59:00')) === true, '17:00-SumB')
console.assert(isCheaper(parseDateTime('2023-04-18 17:00:00')) === false, '17:00-SumE')
console.assert(isCheaper(parseDateTime('2023-04-18 17:01:00')) === false, '17:00-SumA')
