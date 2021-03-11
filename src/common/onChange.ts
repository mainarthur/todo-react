import * as React from 'react'

const onChange = (
  getError: () => boolean,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
  validator: (a: string) => boolean,
) => (ev: React.ChangeEvent<HTMLInputElement>) => {
  const { target: { value } } = ev

  if (getError() && (value === '' || validator(value))) {
    setError(false)
  }

  setValue(value)
}

export default onChange
