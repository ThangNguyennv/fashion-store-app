export type AlertStates = {
  open: boolean
  message: string
  severity: 'success' | 'error'
}

export type AlertActions =
  | { type: 'SHOW_ALERT', payload: { message: string; severity: 'success' | 'error' } }
  | { type: 'HIDE_ALERT' }