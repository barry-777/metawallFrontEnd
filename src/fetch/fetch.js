import useReq from '../services/useReq'

const apiPath = import.meta.env.VITE_APP_API

// 登入
export function postLogin(data) {
  return useReq({
    url: `${apiPath}/api/auth/login`,
    method: 'post',
    data
  })
}

// 註冊
export function postSignUp(data) {
  return useReq({
    url: `${apiPath}/api/auth/signup`,
    method: 'post',
    data
  })
}

// 取得個人資料
export function getCurrentUser() {
  return useReq({
    url: `${apiPath}/api/users/current_user`,
    method: 'get'
  })
}
