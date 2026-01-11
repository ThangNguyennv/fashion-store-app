import { Snackbar, Alert } from '@mui/material'
import { useAlertContext } from '~/contexts/alert/AlertContext'

export const AlertToast = () => {
  const { stateAlert, dispatchAlert } = useAlertContext()
  const { open, message, severity } = stateAlert
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => dispatchAlert({ type: 'HIDE_ALERT' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => dispatchAlert({ type: 'HIDE_ALERT' })}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}

