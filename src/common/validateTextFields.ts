import TextFieldToValidate from './TextFieldToValidate'

import validateTextField from './validateTextField'

const validateTextFields = (
  p: TextFieldToValidate[],
): boolean => {
  for (let i = 0; i < p.length; i += 1) {
    if (!validateTextField(p[i])) {
      return false
    }
  }
  return true
}

export default validateTextFields
