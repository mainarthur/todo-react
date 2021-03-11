import TextFieldToValidate from './TextFieldToValidate'

const validateTextField = ({
  textFieldValue,
  error,
  setError,
  validator,
}: TextFieldToValidate): boolean => {
  if (!validator(textFieldValue)) {
    if (!error) {
      setError(true)
    }
    return false
  }

  if (error) {
    setError(false)
  }

  return true
}

export default validateTextField
