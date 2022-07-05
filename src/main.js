import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import { createPinia } from 'pinia'
import './assets/scss/main.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(VueAxios, axios)
app.use(router)
app.use(pinia)

app.mount('#app')
