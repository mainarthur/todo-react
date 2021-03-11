import * as React from 'react'

export default interface TextFieldToValidate {
  textFieldValue: string
  error: boolean
  setError: React.Dispatch<React.SetStateAction<boolean>>
  validator: (v: string) => boolean
}
