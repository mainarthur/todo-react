import { Dispatch, SetStateAction } from 'react'

export default interface TextFieldToValidate {
  textFieldValue: string
  error: boolean
  setError: Dispatch<SetStateAction<boolean>>
  validator: (v: string) => boolean
}
