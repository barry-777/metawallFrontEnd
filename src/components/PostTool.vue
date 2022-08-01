<template>
  <div class="post-tool">
    <!-- 讚 -->
    <div>
      <i class="fa-regular fa-thumbs-up" />
      <p>100</p>
    </div>
    <!-- 留言 -->
    <div>
      <div class="user-photo-outer">
        <UserPhoto :photo="props.post.user.avatar" />
      </div>
      <div class="input-outer">
        <editor-content :editor="editor" />
        <button
          type="button"
          @click="postCommentHandle(props.post._id)"
        >
          留言
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { ref } from 'vue'
import { postOneComment } from '@/fetch/fetch'
import { useModalStore } from '@/stores/modal'
import { usePostStore } from '@/stores/post'

const modalStore = useModalStore()
const postStore = usePostStore()
const { openLoading, closeLoading, openAlert } = modalStore
const { addComment } = postStore

const props = defineProps({
  post: Object
})

// 上傳一則留言
const commentData = ref({
  content: ''
})
const postCommentHandle = async (post_id) => {
  if (commentData.value.content === '<p></p>' || commentData.value.content === '') {
    openAlert('error', '填寫內容不得為空白！')
    return false
  }
  openLoading('新增留言中')
  const { data } = await postOneComment(post_id, commentData.value)
  commentData.value.content = ''
  editor.value.commands.clearContent()
  // 暫存當前使用者
  data.data.user = {
    _id: props.post.user._id,
    avatar: props.post.user.avatar,
    name: props.post.user.name
  }
  await addComment(data.data.post, data.data)
  closeLoading()
  openAlert('success', '新增成功')
}
// 編輯器處理(留言)
const editor = useEditor({
  content: commentData.value.content,
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: '輸入留言內容 ...'
    })
  ],
  onUpdate: ({ editor }) => {
    commentData.value.content = editor.getHTML()
  }
})
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';
.user-photo-outer {
  width: 45px;
  height: 45px;
  margin-right: 12px;
  flex-shrink: 0;
  position: relative;
  border: 2px solid $c-black;
  border-radius: 50%;
  overflow: hidden;
}
.post-tool {
  width: 100%;
  margin-top: 25px;
  padding-left: 15px;
}
.post-tool > div:nth-child(1) {
  display: inline-flex;
  align-content: center;
  user-select: none;
  cursor: pointer;
  i {
    font-size: px(25);
    color: $c-first;
  }
  p {
    font-weight: $medium;
    margin-top: 5px;
    margin-left: 7px;
  }
}
.post-tool > div:nth-child(2) {
  width: 100%;
  display: flex;
  align-items: stretch;
  margin-top: 20px;
}
.input-outer {
  width: 100%;
  display: flex;
  > div {
    width: calc(100% - 130px);
  }
  button {
    width: 120px;
    height: 100%;
    font-size: px(18);
    font-weight: $medium;
    background-color: $c-first;
    color: $c-white;
    padding: 8px;
    border: 2px solid $c-black;
    border-left: none;
    user-select: none;
    flex-shrink: 0;
    transition: background-color 0.6s, color 0.2s, transform 0.4s;
    cursor: pointer;
    &:hover {
      background-color: darken($c-first, 8%);
    }
  }
}
</style>
