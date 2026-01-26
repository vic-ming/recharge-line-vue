import { createApp } from 'vue'
import './assets/styles/tailwind.css'
import './assets/styles/main.scss'
import App from './App.vue'
import router from './router'
import { initializeLiff } from './utils/liff'

// 初始化 LIFF（開發模式下即使失敗也繼續）
initializeLiff()
    .then(() => {
        console.log('✅ LIFF initialized successfully')
    })
    .catch((error) => {
        console.error('❌ LIFF initialization failed:', error)

        if (import.meta.env.DEV) {
            console.warn('⚠️ 開發模式：繼續運行應用程式（使用測試 UID）')
        }
    })
    .finally(() => {
        // 無論 LIFF 是否初始化成功，都啟動應用
        const app = createApp(App)
        app.use(router)
        app.mount('#app')
    })
