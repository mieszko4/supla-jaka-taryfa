import { parseDateTime } from '../lib/parseDateTime.mjs';

const isCheapHour = (dateTime) => {
    const cheapHours = ['00', '01', '02', '03', '04', '05', '22', '23']
    return cheapHours.includes(dateTime.hour)
}

const isCheaper = (dateTime) => isCheapHour(dateTime)

const prices = { // Based on https://akademia-fotowoltaiki.pl/pge/
    day: 0.6212+0.4267,
    night: (0.6212+0.4267)*0.6 // Assume 60% cheaper during night
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
