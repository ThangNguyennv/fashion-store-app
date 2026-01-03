import { type FormEvent } from 'react'

export interface SearchInputProps {
  onSearchSubmit: () => void
  // eslint-disable-next-line no-unused-vars
  onTermChange: (term: string) => void
  isMobile?: boolean,
  inputValue: string
}

const useSearchInput = ({ onSearchSubmit, onTermChange, inputValue }: SearchInputProps) => {

  const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = event.target.value
    onTermChange(newTerm)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearchSubmit()
  }

  return {
    handleSubmit,
    handleChangeKeyword,
    inputValue
  }
}

export default useSearchInput

