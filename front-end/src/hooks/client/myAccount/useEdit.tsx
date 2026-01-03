import { useRef, type ChangeEvent } from 'react'
import { fetchEditInfoUserAPI } from '~/apis/client/user.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useAuth } from '~/contexts/client/AuthContext'

const useEdit = () => {
  const { accountUser, setAccountUser } = useAuth()
  const { dispatchAlert } = useAlertContext()

  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const uploadImagePreviewRef = useRef<HTMLImageElement | null>(null)
  const handleChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file && uploadImagePreviewRef.current) {
      uploadImagePreviewRef.current.src = URL.createObjectURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!accountUser) return

    const formData = new FormData(event.currentTarget)
    formData.set('fullName', accountUser.fullName)
    formData.set('email', accountUser.email)
    formData.set('phone', accountUser.phone)
    formData.set('address', accountUser.address)

    const response = await fetchEditInfoUserAPI(formData)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        window.location.href = '/user/account/info' // Fix load lại trang sau!
      }, 2000)
    } else if (response.code === 409) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    uploadImageInputRef.current?.click()
  }

  return {
    setAccountUser,
    handleClick,
    handleSubmit,
    handleChange,
    accountUser,
    uploadImageInputRef,
    uploadImagePreviewRef
  }
}

export default useEdit