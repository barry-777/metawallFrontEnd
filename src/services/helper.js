export const checkConsole = (text, response) => {
  const isShowConsole = import.meta.env.VITE_APP_ISSHOWCONSOLE
  if (isShowConsole === 'true') {
    console.log(text, response)
  } else {
    return false
  }
}
