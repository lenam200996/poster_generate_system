import { createContext, useCallback, useContext, useState } from "react"
import MuiIconButton from "@mui/material/IconButton"
import { Alert, Snackbar } from "@mui/material"
import { Close } from "@mui/icons-material"

type ShowAlertMessageType = (
  type: "info" | "success" | "error",
  message: string,
) => void

const AlertMessageContext = createContext<{
  showAlertMessage: ShowAlertMessageType
}>({
  showAlertMessage: undefined,
})

export const useShowAlertMessage = () => useContext(AlertMessageContext)

interface AlertMessage {
  type: "info" | "success" | "error"
  message: string
  key: number
}

const AlertMessageProvider = ({ children }) => {
  const [alert, setAlert] = useState<AlertMessage | undefined>(undefined)

  const showAlertMessage: ShowAlertMessageType = useCallback(
    (type, message) => {
      setAlert({ type, message, key: Date.now() })
    },
    [],
  )

  const handleOnClickClose = () => {
    setAlert(undefined)
  }

  return (
    <AlertMessageContext.Provider value={{ showAlertMessage }}>
      {children}
      <div className='absolute left-0 bottom-0 z-50'>
        {alert !== undefined && (
          <Snackbar
            key={alert.key}
            open={true}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            sx={{ minWidth: 500 }}
            onClose={(event, reason) => {
              if (reason === "clickaway") {
                return
              }
              setAlert(undefined)
            }}
          >
            <Alert
              severity={alert.type}
              action={
                <div className='flex space-x-3'>
                  <MuiIconButton
                    aria-label='close'
                    size='small'
                    color='inherit'
                    onClick={handleOnClickClose}
                  >
                    <Close fontSize='small' />
                  </MuiIconButton>
                </div>
              }
            >
              <div className='text-base font-medium'>{alert.message}</div>
            </Alert>
          </Snackbar>
        )}
      </div>
    </AlertMessageContext.Provider>
  )
}

export default AlertMessageProvider
