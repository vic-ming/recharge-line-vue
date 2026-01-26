/**
 * API 服務
 * 提供所有 API 端點的封裝方法
 */

import { apiPost } from '@/utils/api'
import { getLineUserId } from '@/utils/liff'

// ==================== 型別定義 ====================

/** 註冊請求參數 */
export interface RegisterRequest {
    name: string
    phone: string
    email: string
    valicode: string
    line_uid: string
}

/** 重發驗證碼請求參數 */
export interface ResendPhoneCodeRequest {
    line_uid: string
}

/** 驗證手機驗證碼請求參數 */
export interface VerifyPhoneCodeRequest {
    code: string
    line_uid: string
}

/** 會員資料請求參數 */
export interface MemberProfileRequest {
    line_uid: string
}

/** 發票資訊 */
export interface InvoiceInfo {
    type: 'BARCODE' | 'COMPANY' | 'DONATE'
    barcode_value?: string
    company_tax_id?: string
    company_title?: string
}

/** 更新會員資料請求參數 */
export interface UpdateMemberProfileRequest {
    line_uid: string
    name: string
    phone: string
    email: string
    household_number?: string
    parking_spaces?: string[]
    invoice_info?: InvoiceInfo
}

/** 餘額請求參數 */
export interface BalanceRequest {
    line_uid: string
}

/** 充電狀態請求參數 */
export interface ChargingStatusRequest {
    line_uid: string
}

/** 充電記錄請求參數 */
export interface ChargingRecordsRequest {
    line_uid: string
    start_date: string // 格式: YYYY/MM/DD
    end_date: string   // 格式: YYYY/MM/DD
}

/** 充電記錄詳情請求參數 */
export interface ChargingRecordDetailRequest {
    line_uid: string
    record_id: number
}

// ==================== API 方法 ====================

/**
 * 註冊會員
 * @param data 註冊資料
 */
export async function register(data: Omit<RegisterRequest, 'line_uid'>) {
    const line_uid = await getLineUserId()
    if (!line_uid) {
        throw new Error('無法取得 LINE UID')
    }

    return apiPost('api/register.jsp', {
        ...data,
        line_uid
    })
}

/**
 * 重發手機驗證碼
 */
export async function resendPhoneCode() {
    const line_uid = await getLineUserId()
    if (!line_uid) {
        throw new Error('無法取得 LINE UID')
    }

    return apiPost('api/resend-phone-code.jsp', {
        line_uid
    })
}

/**
 * 驗證手機驗證碼
 * @param code 驗證碼
 */
export async function verifyPhoneCode(code: string) {
    const line_uid = await getLineUserId()
    if (!line_uid) {
        throw new Error('無法取得 LINE UID')
    }

    return apiPost('api/verify-phone-code.jsp', {
        code,
        line_uid
    })
}

/**
 * 取得會員資料
 */
export async function getMemberProfile() {
    const line_uid = await getLineUserId()
    if (!line_uid) {
        throw new Error('無法取得 LINE UID')
    }

    return apiPost('api/member-profile.jsp', {
        line_uid
    })
}

/**
 * 更新會員資料
 * @param data 會員資料
 */
export async function updateMemberProfile(data: Omit<UpdateMemberProfileRequest, 'line_uid'>) {
    const line_uid = await getLineUserId()
    if (!line_uid) {
        throw new Error('無法取得 LINE UID')
    }

    return apiPost('api/update-member-profile.jsp', {
        ...data,
        line_uid
    })
}

/**
 * 取得餘額
 */
export async function getBalance() {
    const line_uid = await getLineUserId()
    if (!line_uid) {
        throw new Error('無法取得 LINE UID')
    }

    return apiPost('api/balance.jsp', {
        line_uid
    })
}

/**
 * 取得充電狀態
 */
export async function getChargingStatus() {
    const line_uid = await getLineUserId()
    if (!line_uid) {
        throw new Error('無法取得 LINE UID')
    }

    return apiPost('api/charging-status.jsp', {
        line_uid
    })
}

/**
 * 取得充電記錄
 * @param start_date 開始日期 (格式: YYYY/MM/DD)
 * @param end_date 結束日期 (格式: YYYY/MM/DD)
 */
export async function getChargingRecords(start_date: string, end_date: string) {
    const line_uid = await getLineUserId()
    if (!line_uid) {
        throw new Error('無法取得 LINE UID')
    }

    return apiPost('api/charging-records.jsp', {
        line_uid,
        start_date,
        end_date
    })
}

/**
 * 取得充電記錄詳情
 * @param record_id 記錄 ID
 */
export async function getChargingRecordDetail(record_id: number) {
    const line_uid = await getLineUserId()
    if (!line_uid) {
        throw new Error('無法取得 LINE UID')
    }

    return apiPost('api/charging-record-detail.jsp', {
        line_uid,
        record_id
    })
}
