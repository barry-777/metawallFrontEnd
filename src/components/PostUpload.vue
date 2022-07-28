<template>
  <div class="post-upload">
    <div class="inner-top">
      <p v-if="isPatchMode">
        編輯動態中 ！
      </p>
      <p v-else>
        新增動態吧 ！
      </p>
      <div class="bg" />
    </div>
    <div class="inner-bottom">
      <div class="wrap editor-section">
        <p v-if="isPatchMode">
          編輯貼文內容
        </p>
        <p v-else>
          輸入貼文內容
        </p>
        <div class="editor-outer">
          <ul
            v-if="editor"
            class="editor-tool"
          >
            <li
              :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
              @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            >
              <i class="fa-solid fa-heading" />
            </li>
            <li
              :class="{ 'is-active': editor.isActive('paragraph') }"
              @click="editor.chain().focus().setParagraph().run()"
            >
              <i class="fa-solid fa-p" />
            </li>
            <li
              :class="{ 'is-active': editor.isActive('bold') }"
              @click="editor.chain().focus().toggleBold().run()"
            >
              <i class="fa-solid fa-bold" />
            </li>
            <li
              :class="{ 'is-active': editor.isActive('italic') }"
              @click="editor.chain().focus().toggleItalic().run()"
            >
              <i class="fa-solid fa-italic" />
            </li>
            <li
              :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
              @click="editor.chain().focus().setTextAlign('left').run()"
            >
              <i class="fa-solid fa-align-left" />
            </li>
            <li
              :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
              @click="editor.chain().focus().setTextAlign('center').run()"
            >
              <i class="fa-solid fa-align-center" />
            </li>
            <li
              :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
              @click="editor.chain().focus().setTextAlign('right').run()"
            >
              <i class="fa-solid fa-align-right" />
            </li>
            <li
              :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
              @click="editor.chain().focus().setTextAlign('justify').run()"
            >
              <i class="fa-solid fa-align-justify" />
            </li>
            <li
              :class="{ 'is-active': editor.isActive('strike') }"
              @click="editor.chain().focus().toggleStrike().run()"
            >
              <i class="fa-solid fa-strikethrough" />
            </li>
            <li
              :class="{ 'is-active': editor.isActive('highlight') }"
              @click="editor.chain().focus().toggleHighlight().run()"
            >
              <i class="fa-solid fa-highlighter" />
            </li>
          </ul>
          <editor-content :editor="editor" />
        </div>
      </div>
      <div
        v-if="sendData.images?.length"
        class="wrap patch-images-section"
      >
        <p>目前上傳的圖片</p>
        <div class="images">
          <img
            v-for="(image, index) in sendData.images"
            :key="'image' + index"
            :src="image"
            alt=""
          >
        </div>
      </div>
      <div class="wrap image-section">
        <p>上傳貼文圖片</p>
        <div class="buttons">
          <button
            class="image-add"
            type="button"
          >
            <label for="upload">
              上傳圖片
              <input
                id="upload"
                name="image"
                type="file"
                accept="image/*"
                multiple="multiple"
                @change="preloadImageHandle"
              >
            </label>
          </button>
          <button
            class="image-clear"
            type="button"
            @click="clearImageHandle"
          >
            清除所有圖片
          </button>
        </div>
        <div
          v-if="imagesPrePath.length"
          class="images"
        >
          <img
            v-for="(image, index) in imagesPrePath"
            :key="'image' + index"
            :src="image"
            alt=""
          >
        </div>
      </div>
      <div class="wrap control-section">
        <button
          v-if="isPatchMode"
          class="base-button"
          type="button"
          @click="patchSubmit"
        >
          編輯完成
        </button>
        <button
          v-else
          class="base-button"
          type="button"
          @click="postSubmit"
        >
          確認送出
        </button>
        <router-link
          v-if="isPatchMode"
          to="/posts-wall"
        >
          <button
            class="base-button simple"
            type="button"
          >
            取消編輯
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { postUploadImage, postOnePost, patchOnePost } from '@/fetch/fetch'
import router from '@/router/index'
import { useModalStore } from '@/stores/modal'
import { usePostStore } from '@/stores/post'

const sendData = ref({
  // 先宣告為陣列做判斷
  images: []
})
// store 資料
const modalStore = useModalStore()
const postStore = usePostStore()
const { openLoading, closeLoading, openAlert } = modalStore
const { patchData, resetPatchData } = postStore

// 編輯模式處理
const isPatchMode = !!patchData._id
if (isPatchMode) {
  sendData.value = patchData
}

// 編輯器處理
const editor = useEditor({
  content: sendData.value.content,
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: '輸入貼文內容 ...'
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    Highlight
  ],
  onUpdate: ({ editor }) => {
    sendData.value.content = editor.getHTML()
  }
})

// 圖片處理
const imagesPrePath = ref([])
const imagesFile = ref([])
// 預覽圖檔
const preloadImageHandle = (e) => {
  if (!e.target.files.length) return
  Array.prototype.forEach.call(e.target.files, function (file) {
    const fileSize = Math.ceil(file.size / 1024)
    if (fileSize > 200) {
      openAlert('error', '圖片檔案過大，僅限 2mb 以下檔案')
    } else {
      imagesPrePath.value.push(URL.createObjectURL(file))
      imagesFile.value.push(file)
    }
  })
}
// 清除圖片
const clearImageHandle = () => {
  imagesPrePath.value = []
  imagesFile.value = []
  if (sendData.value.images) {
    sendData.value.images = []
  }
}

// 確認送出
const postSubmit = async () => {
  if (sendData.value.content === '<p></p>' || sendData.value.content === undefined || sendData.value.content === '<h2></h2>') {
    openAlert('error', '填寫內容不得為空白！')
    return false
  }
  openLoading()
  if (imagesFile.value?.length) {
    const form = new FormData()
    imagesFile.value.forEach((file) => {
      form.append('files-upload', file)
    })
    const { data: imageData } = await postUploadImage(form)
    sendData.value.images.push(...imageData.data.images)
  }
  // console.log('上傳的資料：', sendData.value)
  await postOnePost(sendData.value)
  router.push('/posts-wall')
  closeLoading()
  openAlert('success', '上傳成功！')
}

// 編輯完成
const patchSubmit = async () => {
  if (sendData.value.content === '<p></p>' || sendData.value.content === undefined || sendData.value.content === '<h2></h2>') {
    openAlert('error', '填寫內容不得為空白！')
    return false
  }
  openLoading()
  if (imagesFile.value?.length) {
    const form = new FormData()
    imagesFile.value.forEach((file) => {
      form.append('files-upload', file)
    })
    const { data: imageData } = await postUploadImage(form)
    sendData.value.images.push(...imageData.data.images)
  }
  // console.log('編輯的資料：', sendData.value)
  await patchOnePost(sendData.value)
  await resetPatchData()
  router.push('/posts-wall')
  closeLoading()
  openAlert('success', '編輯成功！')
}
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';
.wrap {
  margin-bottom: 40px;
  &:last-child {
    margin: 0;
    padding-bottom: 15px;
    padding-top: 30px;
  }
  p {
    font-size: px(18);
    font-weight: $medium;
    margin-bottom: 20px;
  }
}
.image-section {
  .buttons {
    width: 100%;
    display: flex;
    align-content: center;
  }
}
.control-section {
  > * {
    &:not(:first-child) {
      margin-top: 15px;
    }
  }
  a {
    display: block;
  }
}
.images {
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;
  img {
    width: 150px;
    height: auto;
    margin: 5px;
  }
}
.image-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 40px;
  line-height: 1.4;
  letter-spacing: 1.5px;
  background-color: $c-success;
  color: $c-white;
  border-radius: 4px;
  border: 2px solid $c-black;
  position: relative;
  label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    user-select: none;
  }
  input {
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    user-select: none;
    opacity: 0;
  }
}
.image-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 40px;
  line-height: 1.4;
  letter-spacing: 1.5px;
  margin-left: 10px;
  background-color: $c-error;
  color: $c-white;
  border-radius: 4px;
  border: 2px solid $c-black;
  cursor: pointer;
  user-select: none;
}
</style>
