/**
 * API 工具函數
 * 提供統一的 API 請求介面
 */

// 從環境變數獲取 API URL
const API_URL = import.meta.env.VITE_API_URL

// API 請求選項介面
interface ApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    headers?: Record<string, string>
    body?: any
    params?: Record<string, string | number | boolean>
}

// API 回應介面
interface ApiResponse<T = any> {
    Code?: number
    Message?: string
    Data?: T
    // 支援直接回傳的格式（不包裝在 Data 中）
    [key: string]: any
}

/**
 * 建立完整的 API URL
 * @param endpoint - API 端點
 * @param params - URL 查詢參數
 * @returns 完整的 URL
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    // 檢查 endpoint 是否已經是絕對路徑
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
        return endpoint
    }

    // 檢查 API_URL 是否為相對路徑（用於開發環境代理）
    const isRelativePath = API_URL.startsWith('/')
    let url: string

    if (isRelativePath) {
        // 相對路徑：直接拼接
        url = `${API_URL}${endpoint}`
    } else {
        // 絕對路徑：使用 URL 構造器
        const urlObj = new URL(endpoint, API_URL)
        url = urlObj.toString()
    }

    // 添加查詢參數
    if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
            searchParams.append(key, String(value))
        })
        url += (url.includes('?') ? '&' : '?') + searchParams.toString()
    }

    return url
}

/**
 * 發送 API 請求
 * @param endpoint - API 端點 (例如: 'users', 'deposit')
 * @param options - 請求選項
 * @returns Promise<ApiResponse<T>>
 */
export async function apiRequest<T = any>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<ApiResponse<T>> {
    const {
        method = 'GET',
        headers = {},
        body,
        params
    } = options

    const url = buildUrl(endpoint, params)




    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            // ...(lineUid ? { 'X-Line-UID': lineUid } : {}), // CORS 不支援此 header，改為 body 傳送
            ...headers
        }
    }

    // 如果有 body 且不是 GET 請求，加入 body
    if (body && method !== 'GET') {
        config.body = JSON.stringify(body)
    }

    try {
        const response = await fetch(url, config)

        // 檢查 HTTP 狀態碼
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
        }

        // 檢查是否為 204 No Content，或者 body 為空
        let data: any = {}
        const contentType = response.headers.get('content-type')
        if (response.status !== 204 && contentType && contentType.includes('application/json')) {
            data = await response.json()
        } else {
            // 如果沒內容，至少回傳 HTTP 狀態，方便前端判斷
            data = {
                success: response.ok,
                status: response.status,
                Message: response.statusText
            }
        }

        // 檢查 API 回應的 Code (相容舊格式)
        if (data && data.Code !== undefined && data.Code !== 0 && data.Code !== 1) {
            console.error('API Error:', data.Message)
            // 可以在這裡加入全域錯誤處理
        }

        return data
    } catch (error) {
        console.error('API Request Failed:', error)
        // 增強錯誤訊息，不直接修改 error.message 以免它是 readonly 的
        const message = error instanceof Error ? error.message : String(error)
        const enhancedError = new Error(`Request failed to ${url}: ${message}`)

        // 保留原始錯誤的 stack
        if (error instanceof Error && error.stack) {
            enhancedError.stack = error.stack
        }

        throw enhancedError
    }
}

/**
 * GET 請求
 * @param endpoint - API 端點
 * @param params - URL 查詢參數
 * @param headers - 自訂 headers
 * @returns Promise<ApiResponse<T>>
 */
export async function apiGet<T = any>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    headers?: Record<string, string>
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { method: 'GET', params, headers })
}

/**
 * POST 請求
 * @param endpoint - API 端點
 * @param body - 請求 body
 * @param headers - 自訂 headers
 * @returns Promise<ApiResponse<T>>
 */
export async function apiPost<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { method: 'POST', body, headers })
}

/**
 * PUT 請求
 * @param endpoint - API 端點
 * @param body - 請求 body
 * @param headers - 自訂 headers
 * @returns Promise<ApiResponse<T>>
 */
export async function apiPut<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { method: 'PUT', body, headers })
}

/**
 * DELETE 請求
 * @param endpoint - API 端點
 * @param params - URL 查詢參數
 * @param headers - 自訂 headers
 * @returns Promise<ApiResponse<T>>
 */
export async function apiDelete<T = any>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    headers?: Record<string, string>
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { method: 'DELETE', params, headers })
}

/**
 * 取得 API Base URL
 * @returns API Base URL
 */
export function getApiUrl(): string {
    return API_URL
}
