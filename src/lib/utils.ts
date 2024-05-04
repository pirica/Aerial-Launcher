import type { ClassValue } from 'clsx'
import type { AccountData, AccountDataRecord } from '../types/accounts'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sortAccounts(data: AccountDataRecord) {
  const result = Object.values(data)
  const accounts = result.toSorted((itemA, itemB) => {
    const _itemADisplayName =
      (itemA.customDisplayName?.trim() ?? '') === ''
        ? itemA.displayName
        : itemA.customDisplayName ?? ''
    const _itemBDisplayName =
      (itemB.customDisplayName?.trim() ?? '') === ''
        ? itemB.displayName
        : itemB.customDisplayName ?? ''

    return _itemADisplayName.localeCompare(_itemBDisplayName, undefined, {
      numeric: true,
    })
  })

  const accountList = accounts.reduce((accumulator, current) => {
    accumulator[current.accountId] = current

    return accumulator
  }, {} as AccountDataRecord)

  return accountList
}

export function parseCustomDisplayName(account: AccountData | null) {
  const rawCustomDisplayName = account?.customDisplayName?.trim() ?? ''
  const customDisplayNameText =
    rawCustomDisplayName.length > 0 ? ` (${rawCustomDisplayName})` : ''

  return customDisplayNameText
}
