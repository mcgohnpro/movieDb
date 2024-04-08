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
