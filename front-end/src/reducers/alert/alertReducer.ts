/* eslint-disable indent */
import type { AlertActions, AlertStates } from '~/interfaces/alert.interface'

export const initialState: AlertStates = {
  open: false,
  message: '',
  severity: 'success'
}
export function alertReducer(state: AlertStates, action: AlertActions): AlertStates {
  switch (action.type) {
    case 'SHOW_ALERT':
      return { open: true, message: action.payload.message, severity: action.payload.severity }
    case 'HIDE_ALERT':
      return { ...state, open: false }
    default:
      return state
  }
}