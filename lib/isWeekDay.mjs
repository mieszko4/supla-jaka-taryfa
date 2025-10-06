export const SATURDAY = 6
export const SUNDAY = 0

export const isWeekDay = (dateTime, weekDay) => {
    const date = new Date(`${dateTime.year}-${dateTime.month}-${dateTime.day}`)
    const day = date.getDay()
    
    return day === weekDay
}