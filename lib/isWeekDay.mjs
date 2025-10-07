const SATURDAY = 6
const SUNDAY = 0

const isWeekDay = (dateTime, weekDay) => {
    const date = new Date(`${dateTime.year}-${dateTime.month}-${dateTime.day}`)
    const day = date.getDay()
    
    return day === weekDay
}

export const isSaturday = (dateTime) => isWeekDay(dateTime, SATURDAY)
export const isSunday = (dateTime) => isWeekDay(dateTime, SUNDAY)
