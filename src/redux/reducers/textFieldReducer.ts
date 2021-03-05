import { TextFieldAction } from '../constants'
import TextFieldActions from '../types/textFieldTypes'

export interface TextField {
  id: string
  animation: string
}

type TextFieldState = TextField[]

const initialState: TextFieldState = []

export default function textFieldReducer(state = initialState, action: TextFieldActions) {
  let newState = [...state]
  switch (action.type) {
    case TextFieldAction.ADD_TEXTFIELD:
      newState = newState.concat([{
        id: action.payload,
        animation: '',
      }])

      return newState
    case TextFieldAction.SET_ANIMATION:
      newState = newState.map((textField) => {
        if (textField.id === action.payload.id) {
          const newTextField = { ...textField }
          newTextField.animation = action.payload.animation
          return newTextField
        }

        return textField
      })

      return newState
    default:
      return newState
  }
}
