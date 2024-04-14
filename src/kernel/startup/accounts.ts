import type {
  AccountDataList,
  AccountDataRecord,
} from '../../types/accounts'

import { BrowserWindow } from 'electron'

import { electronAPIEventKeys } from '../../config/constants/main-process'

import { DataDirectory } from './data-directory'

export class AccountsManager {
  static async load(currentWindow: BrowserWindow) {
    const result = await DataDirectory.getAccountsFile()
    const accounts: AccountDataList = result.accounts
      .map((account) => ({
        ...account,
        provider: undefined,
        token: undefined,
      }))
      .toSorted((itemA, itemB) =>
        itemA.displayName.localeCompare(itemB.displayName)
      )

    const accountList = accounts.reduce((accumulator, current) => {
      accumulator[current.accountId] = current

      return accumulator
    }, {} as AccountDataRecord)

    currentWindow.webContents.send(
      electronAPIEventKeys.onAccountsLoaded,
      accountList
    )
  }

  static async remove(accountId: string) {
    const result = await DataDirectory.getAccountsFile()
    const accounts = result.accounts.filter(
      (account) => account.accountId !== accountId
    )

    await DataDirectory.updateAccountsFile(accounts)
  }
}