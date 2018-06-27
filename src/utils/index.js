export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

export function MillisecondToDate(val) {
  let hour
  let minute
  let second
  var thisVal = val
  if (thisVal > 60) {
    if (thisVal > 3600) {
      hour = parseInt(thisVal / 3600)
      const defminute = parseInt((thisVal % 3600))
      if (defminute > 60) {
        minute = parseInt(defminute / 60)
      } else {
        minute = 0
      }
      second = parseInt((defminute % 60))
    } else {
      hour = 0
      minute = parseInt(thisVal / 60)
      second = parseInt((thisVal % 60))
    }
  } else {
    hour = 0
    minute = 0
    second = thisVal
  }
  return hour + '时' + (minute < 10 ? '0' + minute : minute) + '分' + (second < 10 ? '0' + second : second) + '秒'
}

