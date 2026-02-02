/**
 * ECPay SDK Utility
 */

declare global {
    interface Window {
        ECPay?: {
            initialize: (serverType: string, isLoading: number, callback: (errMsg: string | null) => void) => void
            createPayment: (token: string, language: string, callback: (errMsg: string | null) => void, version?: string) => void
            getPayToken: (callback: (paymentInfo: any, errMsg: string | null) => void) => void
        }
    }
}

/**
 * 載入 ECPay SDK
 * @param env 環境 'stage' | 'prod'
 */
export function loadECPaySDK(env: 'stage' | 'prod' = 'stage'): Promise<void> {
    return new Promise(async (resolve, reject) => {
        // 1. 檢查並載入 jQuery
        if (!(window as any).jQuery) {
            try {
                await loadScript('https://code.jquery.com/jquery-3.7.1.min.js')
            } catch (error) {
                reject(new Error('Failed to load jQuery'))
                return
            }
        }

        // 2. 檢查 ECPay SDK 是否已存在
        if (window.ECPay) {
            resolve()
            return
        }

        // 3. 載入 ECPay SDK
        const baseUrl = env === 'prod'
            ? 'https://ecpg.ecpay.com.tw/Scripts/sdk-1.0.0.js'
            : 'https://ecpg-stage.ecpay.com.tw/Scripts/sdk-1.0.0.js'

        try {
            await loadScript(baseUrl)
            // 等待一下確保 ECPay 初始化
            if (!window.ECPay) {
                // 簡單的輪詢檢查
                let attempts = 0
                const checkInterval = setInterval(() => {
                    attempts++
                    if (window.ECPay) {
                        clearInterval(checkInterval)
                        resolve()
                    } else if (attempts > 20) { // 2秒後放棄
                        clearInterval(checkInterval)
                        reject(new Error('ECPay SDK loaded but window.ECPay is undefined'))
                    }
                }, 100)
            } else {
                resolve()
            }
        } catch (error) {
            reject(new Error('Failed to load ECPay SDK'))
        }
    })
}

function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
        document.body.appendChild(script)
    })
}
