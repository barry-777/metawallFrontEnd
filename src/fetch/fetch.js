import useReq from '../services/useReq'

const apiPath = import.meta.env.VITE_APP_API

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

// 刪除圖片 to imgur
export function deleteUploadImage (hash) {
  return useReq({
    url: `${apiPath}/api/delete_upload/${hash}`,
    method: 'delete'
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

// 驗證 token
export function checkToken () {
  return useReq({
    url: `${apiPath}/api/auth/check`,
    method: 'get'
  })
}

// 取得個人資料
export function getUserInfo (user_id) {
  return useReq({
    url: `${apiPath}/api/users/${user_id}`,
    method: 'get'
  })
}

// 編輯個人資料
export function patchUserInfo (user_id) {
  return useReq({
    url: `${apiPath}/api/users/${user_id}`,
    method: 'patch'
  })
}

// 取得追蹤列表
export function getFollowsList (user_id) {
  return useReq({
    url: `${apiPath}/api/follows_list?user_id=${user_id}`,
    method: 'get'
  })
}

// 追蹤 與 取消追蹤
export function patchFollows (user_id, mode) {
  // follow_mode: follow / unfollow
  return useReq({
    url: `${apiPath}/api/follows?user_id=${user_id}&follow_mode=${mode}`,
    method: 'patch'
  })
}

// 取得收藏貼文的使用者
export function getPostLikesList (post_id) {
  return useReq({
    url: `${apiPath}/api/likes?post_id=${post_id}`,
    method: 'get'
  })
}

// 收藏 與 取消收藏
export function patchPostLikes (post_id, mode) {
  // like_mode: add / remove
  return useReq({
    url: `${apiPath}/api/likes?post_id=${post_id}&like_mode=${mode}`,
    method: 'patch'
  })
}

// 取得使用者收藏的貼文
export function getLikePosts (user_id) {
  return useReq({
    url: `${apiPath}/api/posts/likes/${user_id}`,
    method: 'get'
  })
}

// 取得單一貼文
export function getPostOnly (post_id) {
  return useReq({
    url: `${apiPath}/api/post/1/${post_id}`,
    method: 'get'
  })
}

// 取得使用者貼文 -> user_id
export function getPostsById (user_id, query) {
  // q => 搜尋項目
  // s => 資料排序
  // p => 限制則數
  let sendUrl = `${apiPath}/api/posts/user/${user_id}`
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

// 取得所有貼文 -> route query
export function getPostsByRoute (query) {
  // q => 搜尋項目
  // s => 資料排序
  // p => 限制則數
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

// 新增貼文
export function postOnePost (data) {
  return useReq({
    url: `${apiPath}/api/post/1`,
    method: 'post',
    data
  })
}

// 編輯貼文
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
export function deleteOnePost (post_id) {
  return useReq({
    url: `${apiPath}/api/post/1/${post_id}`,
    method: 'delete'
  })
}

// 新增留言
export function postOneComment (post_id, data) {
  return useReq({
    url: `${apiPath}/api/comment/1/${post_id}`,
    method: 'post',
    data
  })
}

// 編輯留言
export function patchOneComment (comment_id, data) {
  return useReq({
    url: `${apiPath}/api/comment/1/${comment_id}`,
    method: 'patch',
    data
  })
}

// 刪除留言
export function deleteOneComment (comment_id) {
  return useReq({
    url: `${apiPath}/api/comment/1/${comment_id}`,
    method: 'delete'
  })
}

// 新增回覆留言
export function postOneReply (post_id, comment_id, data) {
  return useReq({
    url: `${apiPath}/api/comment/reply/1/${post_id}/${comment_id}`,
    method: 'post',
    data
  })
}

// 編輯回覆留言
export function patchOneReply (reply_id, data) {
  return useReq({
    url: `${apiPath}/api/comment/reply/1/${reply_id}`,
    method: 'patch',
    data
  })
}

// 刪除回覆留言
export function deleteOneReply (reply_id, data) {
  return useReq({
    url: `${apiPath}/api/comment/reply/1/${reply_id}`,
    method: 'delete',
    data
  })
}
