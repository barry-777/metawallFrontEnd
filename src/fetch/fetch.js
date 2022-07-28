import useReq from '../services/useReq'

const apiPath = import.meta.env.VITE_APP_API

// "https://i.imgur.com/We83yRK.jpg"
// "https://i.imgur.com/KzdqVQh.jpg"
// "https://i.imgur.com/YTdDDuo.png"

// 上傳圖片 to imgur
export function postUploadImage (data) {
  return useReq({
    url: `${apiPath}/api/upload`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

// 登入
export function postLogin (data) {
  return useReq({
    url: `${apiPath}/api/auth/login`,
    method: 'post',
    data
  })
}

// 註冊
export function postSignUp (data) {
  return useReq({
    url: `${apiPath}/api/auth/signup`,
    method: 'post',
    data
  })
}

// 取得個人資料
export function getCurrentUser () {
  return useReq({
    url: `${apiPath}/api/users/current_user`,
    method: 'get'
  })
}

// 取得使用者貼文 -> user_id
export function getPostsById (user_id) {
  return useReq({
    url: `${apiPath}/api/posts/user/${user_id}`,
    method: 'get'
  })
}

// 取得所有貼文 -> route query
export function getPostsByRoute (query) {
  // q => 搜尋項目
  // s => 資料排序
  let sendUrl = `${apiPath}/api/posts`
  const keys = Object.keys(query)
  keys.forEach((key, i) => {
    if (i === 0) sendUrl += `?${key}=${query[key]}`
    else sendUrl += `&${key}=${query[key]}`
  })
  return useReq({
    url: sendUrl,
    method: 'get'
  })
}

// 上傳一則貼文
export function postOnePost (data) {
  return useReq({
    url: `${apiPath}/api/post/1`,
    method: 'post',
    data
  })
}

// 編輯一則貼文
export function patchOnePost (data) {
  const { _id, content, images } = data
  return useReq({
    url: `${apiPath}/api/post/1/${_id}`,
    method: 'patch',
    data: {
      content,
      images
    }
  })
}

// 刪除貼文
export function deleteOnePost (id) {
  return useReq({
    url: `${apiPath}/api/post/1/${id}`,
    method: 'delete'
  })
}
