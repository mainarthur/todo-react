import { Dispatch, SetStateAction, ChangeEvent } from 'react'

const onChange = (
  getError: () => boolean,
  setValue: Dispatch<SetStateAction<string>>,
  setError: Dispatch<SetStateAction<boolean>>,
  validator: (a: string) => boolean,
) => (ev: ChangeEvent<HTMLInputElement>) => {
  const { target: { value } } = ev

  if (getError() && (value === '' || validator(value))) {
    setError(false)
  }

  setValue(value)
}

export default onChange
