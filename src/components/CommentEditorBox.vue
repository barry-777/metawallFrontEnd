<template>
  <div class="full-box">
    <div class="full-container">
      <div class="full-inner">
        <div
          class="close-button"
          @click="openCommentEditorBox(false)"
        >
          <i class="fa-solid fa-xmark" />
        </div>
        <div class="main-inner">
          <div class="info-wrap">
            <div
              v-if="showCommentEditorType === 'patchComment'"
            >
              正在編輯您的留言
            </div>
            <div
              v-else-if="showCommentEditorType === 'postReply'"
            >
              正在回覆這則留言
            </div>
            <div
              v-else-if="showCommentEditorType === 'patchReply'"
            >
              正在編輯您回覆的留言
            </div>
          </div>
          <div class="comment-box-editor">
            <editor-content :editor="editor" />
          </div>
          <div class="button-wrap">
            <button
              v-if="showCommentEditorType === 'patchComment'"
              class="base-button"
              type="button"
              @click="patchCommentHandler(tempData)"
            >
              送出
            </button>
            <button
              v-else-if="showCommentEditorType === 'postReply'"
              class="base-button"
              type="button"
              @click="postReplyHandler(tempData)"
            >
              送出
            </button>
            <button
              v-else-if="showCommentEditorType === 'patchReply'"
              class="base-button"
              type="button"
              @click="patchReplyHandler(tempData)"
            >
              送出
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useModalStore } from '@/stores/modal'
import { usePostStore } from '@/stores/post'
import { useUserStore } from '@/stores/user'
import { patchOneComment, postOneReply, patchOneReply } from '@/fetch/fetch'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

const modalStore = useModalStore()
const postStore = usePostStore()
const userStore = useUserStore()
const { openLoading, closeLoading, openAlert, openCommentEditorBox } = modalStore
const { patchCommentData, addReplyData, patchReplyData } = postStore
const { showCommentEditorType, showCommentEditorTemp } = storeToRefs(modalStore)
const { user_id, name, avatar } = storeToRefs(userStore)

const tempData = ref({})
if (showCommentEditorTemp.value.content) {
  Object.assign(tempData.value, showCommentEditorTemp.value)
}
if (showCommentEditorType.value === 'postReply') {
  tempData.value.content = ''
}

// 編輯器處理
const editor = useEditor({
  content: tempData.value.content,
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: '輸入留言內容 ...'
    })
  ],
  onUpdate: ({ editor }) => {
    tempData.value.content = editor.getHTML()
  }
})

// 編輯留言
const patchCommentHandler = async (comment) => {
  openLoading('更新留言中')
  const { data } = await patchOneComment(comment._id, {
    content: comment.content
  })
  console.log(data.data)
  await patchCommentData(comment._id, comment.post, data.data)
  closeLoading()
  openCommentEditorBox(false)
  openAlert('success', '更新留言成功！')
}

// 回覆留言
const postReplyHandler = async (comment) => {
  openLoading('回覆留言中')
  const { data } = await postOneReply(comment.post, comment._id, {
    content: tempData.value.content
  })
  // 暫存當前使用者
  data.data.user = {
    _id: user_id,
    avatar,
    name
  }
  await addReplyData(comment._id, comment.post, data.data)
  closeLoading()
  openCommentEditorBox(false)
  openAlert('success', '回覆留言成功！')
}

// 編輯回覆留言
const patchReplyHandler = async (reply) => {
  openLoading('更新回覆中')
  const { data } = await patchOneReply(reply._id, {
    content: tempData.value.content
  })
  await patchReplyData(reply._id, reply.comment, reply.post, data.data)
  closeLoading()
  openCommentEditorBox(false)
  openAlert('success', '更新回覆成功！')
}
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';
.close-button {
  margin-bottom: 30px;
}
.main-inner {
  width: 100%;
  max-width: 800px;
  padding: 50px 40px 60px;
  border: 4px solid $c-first;
  border-bottom: 6px solid $c-first;
  border-radius: 20px 20px 0 0;
  background-color: $c-white;
  box-shadow: 0 5px 8px rgba($c-black, .5);
  overflow: hidden;
}
.info-wrap {
  width: 90%;
  margin: 0 auto 40px;
  text-align: center;
  div {
    font-size: px(18);
    font-weight: $medium;
  }
}
.button-wrap {
  width: 90%;
  margin: 60px auto 0;
}
</style>
