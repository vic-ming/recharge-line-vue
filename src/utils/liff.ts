/**
 * LINE LIFF 工具函數
 * 提供 LINE LIFF 初始化和用戶資訊獲取功能
 */

import liff from '@line/liff'

const LIFF_ID = import.meta.env.VITE_LIFF_ID

// LIFF 初始化狀態
let isLiffInitialized = false
let liffInitPromise: Promise<void> | null = null

/**
 * 初始化 LIFF
 * @returns Promise<void>
 */
export async function initializeLiff(): Promise<void> {
    // 如果已經初始化，直接返回
    if (isLiffInitialized) {
        return Promise.resolve()
    }

    // 如果正在初始化，返回現有的 Promise
    if (liffInitPromise) {
        return liffInitPromise
    }

    // 開始初始化
    liffInitPromise = liff
        .init({ liffId: LIFF_ID })
        .then(() => {
            isLiffInitialized = true
            console.log('LIFF initialized successfully')
        })
        .catch((error) => {
            console.error('LIFF initialization failed:', error)
            liffInitPromise = null
            throw error
        })

    return liffInitPromise
}

/**
 * 獲取 LINE 用戶 ID (UID)
 * @returns Promise<string | null>
 */
export async function getLineUserId(): Promise<string | null> {
    try {
        await initializeLiff()

        if (!liff.isLoggedIn()) {
            console.warn('User is not logged in to LINE')

            // 開發模式：如果不在 LINE 環境中，返回測試用的 UID
            if (import.meta.env.DEV && !liff.isInClient()) {
                const mockUid = 'U3e8852614fb3b68bfcba1daa86df5c7e' // 開發測試用 UID
                console.warn('⚠️ 開發模式：使用測試 LINE UID:', mockUid)
                return mockUid
            }

            // 生產環境：導向登入
            liff.login()
            return null
        }

        const profile = await liff.getProfile()
        return profile.userId
    } catch (error) {
        console.error('Failed to get LINE user ID:', error)

        // 開發模式：LIFF 初始化失敗時返回測試 UID
        if (import.meta.env.DEV) {
            const mockUid = 'U3e8852614fb3b68bfcba1daa86df5c7e'
            console.warn('⚠️ 開發模式：LIFF 初始化失敗，使用測試 LINE UID:', mockUid)
            return mockUid
        }

        return null
    }
}

/**
 * 獲取 LINE 用戶完整資料
 * @returns Promise<LineProfile | null>
 */
export async function getLineProfile(): Promise<{
    userId: string
    displayName: string
    pictureUrl?: string
    statusMessage?: string
} | null> {
    try {
        await initializeLiff()

        if (!liff.isLoggedIn()) {
            console.warn('User is not logged in to LINE')
            liff.login()
            return null
        }

        const profile = await liff.getProfile()
        return {
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
            statusMessage: profile.statusMessage
        }
    } catch (error) {
        console.error('Failed to get LINE profile:', error)
        return null
    }
}

/**
 * 獲取 LINE Access Token
 * @returns string | null
 */
export function getLineAccessToken(): string | null {
    try {
        if (!isLiffInitialized) {
            console.warn('LIFF is not initialized')
            return null
        }

        if (!liff.isLoggedIn()) {
            console.warn('User is not logged in to LINE')
            return null
        }

        return liff.getAccessToken()
    } catch (error) {
        console.error('Failed to get LINE access token:', error)
        return null
    }
}

/**
 * 檢查用戶是否已登入 LINE
 * @returns boolean
 */
export function isLineLoggedIn(): boolean {
    if (!isLiffInitialized) {
        return false
    }
    return liff.isLoggedIn()
}

/**
 * 登入 LINE
 */
export function loginLine(): void {
    liff.login()
}

/**
 * 登出 LINE
 */
export function logoutLine(): void {
    if (isLiffInitialized) {
        liff.logout()
    }
}

/**
 * 關閉 LIFF 視窗
 */
export function closeLiff(): void {
    if (isLiffInitialized) {
        liff.closeWindow()
    }
}

/**
 * 檢查是否在 LINE 應用程式中
 * @returns boolean
 */
export function isInLineApp(): boolean {
    if (!isLiffInitialized) {
        return false
    }
    return liff.isInClient()
}

/**
 * 取得 LIFF 環境資訊
 * @returns object | null
 */
export function getLiffContext(): any {
    if (!isLiffInitialized) {
        return null
    }
    return liff.getContext()
}

/**
 * 發送訊息到 LINE 聊天室 (僅在 LINE 應用程式中有效)
 * @param messages - 要發送的訊息
 */
export async function sendLineMessage(messages: any[]): Promise<void> {
    try {
        if (!isInLineApp()) {
            console.warn('sendMessages is only available in LINE app')
            return
        }

        await liff.sendMessages(messages)
        console.log('Messages sent successfully')
    } catch (error) {
        console.error('Failed to send messages:', error)
        throw error
    }
}

/**
 * 開啟外部瀏覽器
 * @param url - 要開啟的 URL
 */
export function openExternalBrowser(url: string): void {
    if (isLiffInitialized) {
        liff.openWindow({
            url,
            external: true
        })
    }
}

// 匯出 liff 實例供進階使用
export { liff }
