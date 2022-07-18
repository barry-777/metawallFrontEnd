export const checkConsole = (text, ...response) => {
  const isShowConsole = import.meta.env.VITE_ENV
  if (isShowConsole === 'true') {
    console.log(text, ...response)
  } else {
    return false
  }
}

export const dateFormat = date => {
  const timeDiff = {
    day: 86400000,
    hour: 3600000,
    minute: 60000
  }
  const now = new Date()
  const time = new Date(date)
  const diff = now.getTime() - time.getTime()
  if (diff >= timeDiff.day) {
    const yyyy = time.getFullYear()
    const mm = String(time.getMonth() + 1).padStart(2, '0')
    const dd = String(time.getDate()).padStart(2, '0')
    return `${yyyy}/${mm}/${dd}`
  } else if (diff < timeDiff.day && diff >= timeDiff.hour) {
    const hours = parseInt(diff / timeDiff.hour)
    return `${hours} 小時前`
  } else if (diff < timeDiff.hour && diff >= timeDiff.minute) {
    const mins = parseInt(diff / timeDiff.minute)
    return `${mins} 分鐘前`
  } else {
    const secs = parseInt(diff / 1000)
    return `${secs} 秒前`
  }
}
