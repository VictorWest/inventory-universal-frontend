import { getSessionEmail } from "@/lib/session"

const SESSION_EMAIL = getSessionEmail() || "";

export const BACKEND_BASE_URL = "http://localhost:3000/api"

export const LOGIN_API_URL = `${BACKEND_BASE_URL}/auth/login`
export const REGISTER_API_URL = `${BACKEND_BASE_URL}/auth/register`

export const UPDATE_INDUSTRY = (industry: string) => `${BACKEND_BASE_URL}/user/update-industry/${SESSION_EMAIL}?industry=${encodeURIComponent(industry)}`

export const GET_INVOICE_LIST = `${BACKEND_BASE_URL}/user/inventory/${SESSION_EMAIL}`
export const ADD_INVENTORY = `${BACKEND_BASE_URL}/user/add-inventory/${SESSION_EMAIL}`

export const GET_THRESHOLDS_LIST = `${BACKEND_BASE_URL}/user/thresholds/${SESSION_EMAIL}`
export const ADD_THRESHOLD = `${BACKEND_BASE_URL}/user/add-threshold-setting/${SESSION_EMAIL}`
export const deleteThresholdsList = (index: number | string) => `${BACKEND_BASE_URL}/user/thresholds/${SESSION_EMAIL}/${index}`

export const GET_MEASUREMENTS_LIST = `${BACKEND_BASE_URL}/user/measurements/${SESSION_EMAIL}`
export const ADD_MEASUREMENT = `${BACKEND_BASE_URL}/user/add-measurement/${SESSION_EMAIL}`

export const GET_WRITE_OFF_LIST = `${BACKEND_BASE_URL}/user/write-offs/${SESSION_EMAIL}`
export const ADD_WRITE_OFF = `${BACKEND_BASE_URL}/user/add-write-off-request/${SESSION_EMAIL}`

export const GET_CATEGORIES_LIST = `${BACKEND_BASE_URL}/user/categories/${SESSION_EMAIL}`
export const ADD_CATEGORY = `${BACKEND_BASE_URL}/user/add-category/${SESSION_EMAIL}`

export const GET_CURRENCIES_LIST = `${BACKEND_BASE_URL}/user/currencies/${SESSION_EMAIL}`

export const GET_DEPARTMENTS_LIST = `${BACKEND_BASE_URL}/user/departments/${SESSION_EMAIL}`
export const ADD_DEPARTMENT = `${BACKEND_BASE_URL}/user/add-department/${SESSION_EMAIL}`

export const GET_SUPPLIERS_LIST = `${BACKEND_BASE_URL}/user/suppliers/${SESSION_EMAIL}`
export const ADD_SUPPLIERS_LIST = `${BACKEND_BASE_URL}/user/add-supplier/${SESSION_EMAIL}`

export const GET_RECEIVABLES_LIST = `${BACKEND_BASE_URL}/user/receivables/${SESSION_EMAIL}`
export const UPDATE_RECEIVABLE = `${BACKEND_BASE_URL}/user/receivables/payment/${SESSION_EMAIL}`

export const GET_CREDITORS_LIST = `${BACKEND_BASE_URL}/user/creditors/${SESSION_EMAIL}`
export const ADD_CREDITOR = `${BACKEND_BASE_URL}/user/add-creditor/${SESSION_EMAIL}`
export const UPDATE_CREDITOR = (supplierName: string) => `${BACKEND_BASE_URL}/user/creditors/${SESSION_EMAIL}/${encodeURIComponent(supplierName)}`

export const GET_PROCUREMENTS_LIST = `${BACKEND_BASE_URL}/user/procurements/${SESSION_EMAIL}`
export const ADD_PROCUREMENT = `${BACKEND_BASE_URL}/user/add-procurement/${SESSION_EMAIL}`
export const GET_USERS_LIST = `${BACKEND_BASE_URL}/user/users/${SESSION_EMAIL}`
export const GET_PAYMENTS_LIST = `${BACKEND_BASE_URL}/user/payments/${SESSION_EMAIL}`
export const GET_CUSTOMERS_LIST = `${BACKEND_BASE_URL}/user/customers/${SESSION_EMAIL}`

export const ADD_PAYMENT = `${BACKEND_BASE_URL}/user/add-payment/${SESSION_EMAIL}`
export const GET_PAYMENTS = `${BACKEND_BASE_URL}/user/payments/${SESSION_EMAIL}`