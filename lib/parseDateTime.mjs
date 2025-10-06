export const parseDateTime = (value) => {
  const res = value.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/)

  console.assert(res !== null, 'dateTime is null')
  
  const [,year, month, day, hour, minute, second] = res

  return {year, month, day, hour, minute, second}
}