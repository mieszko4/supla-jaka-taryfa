const prices = { // Based on https://akademia-fotowoltaiki.pl/pge/
    always: 0.6212+0.4267
}

export const getPrice = (dateTime, value) => prices.always * value
