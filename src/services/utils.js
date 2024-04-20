export function trimStr(str, length = 100) {
  if (str.length <= length) return str
  let subStr = str.substring(0, length)
  subStr = subStr.split(' ')
  subStr.pop()
  if (subStr[subStr.length - 1].endsWith(',')) {
    subStr[subStr.length - 1] = subStr[subStr.length - 1].slice(0, -1)
  }
  return `${subStr.join(' ')}...`
}

export function roundToNearestHalf(number) {
  return Math.ceil(number * 2) / 2
}

export function colorizeVote(value) {
  if (value <= 3) return '#E90000'
  if (value <= 5) return '#E97E00'
  if (value <= 7) return '#E9D100'
  return '#66E900'
}

export function getRatings(movies = []) {
  return movies.reduce((acc, movie) => {
    acc[movie.id] = movie.rating
    return acc
  }, {})
}
