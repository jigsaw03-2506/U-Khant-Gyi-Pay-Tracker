export type TransactionType = 'deposit' | 'withdraw'
export type TransferSortOrder = 'newest' | 'oldest'

export const transferProviders = [
  'KBZPay',
  'WavePay',
  'AYA Pay',
  'CB Pay',
  'Bank Transfer',
  'Other',
] as const

export type TransferProvider = (typeof transferProviders)[number]

export interface Transaction {
  id: string
  transactionType: TransactionType
  provider: string
  dateTime: string
  customerName: string
  phoneNumber?: string
  accountInformation?: string
  amount: number
  serviceFee: number
  cashReceived: number
  cashPaid: number
  referenceNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface TransferFormValues {
  transactionType: TransactionType
  provider: string
  dateTime: string
  customerName: string
  phoneNumber: string
  accountInformation: string
  amount: string
  serviceFee: string
  cashReceived: string
  cashPaid: string
  referenceNumber: string
  notes: string
}

export type TransferFormErrors = Partial<Record<keyof TransferFormValues | 'cashAmount', string>>

export interface TransferFiltersValue {
  search: string
  transactionType: TransactionType | 'all'
  provider: string
  dateFrom: string
  dateTo: string
  sortOrder: TransferSortOrder
}

export interface TransferSummaryTotals {
  depositAmount: number
  withdrawAmount: number
  serviceFees: number
  cashReceived: number
  cashPaid: number
  transactionCount: number
  netCash: number
  electronicReceived: number
  electronicSent: number
  netElectronic: number
}
