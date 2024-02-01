import { writable } from 'svelte/store'

export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  CHAT_MODE: 2,
  ERROR: -1
}

export const appStatus = writable(APP_STATUS.CHAT_MODE)
export const appStatusInfo = writable({
  id: 'c1a098ffcb49079c8180b18c7b15229a',
  url: 'https://res.cloudinary.com/midudev/image/upload/v1706810969/pdf/khiice5vqnr1gcn1pmtq.pdf',
  pages: 4
})

export const setAppStatusLoading = () => {
  appStatus.set(APP_STATUS.LOADING)
}

export const setAppStatusError = () => {
  appStatus.set(APP_STATUS.ERROR)
}

export const setAppStatusChatMode = (
  { id, url, pages } :
  { id: string, url: string, pages: number }) => {
  appStatus.set(APP_STATUS.CHAT_MODE)
  appStatusInfo.set({ id, url, pages })
}