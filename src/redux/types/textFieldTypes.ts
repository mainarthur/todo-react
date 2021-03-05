import { TextFieldAction } from '../constants'

export interface AddTextFieldAction {
  type: TextFieldAction.ADD_TEXTFIELD
  payload: string
}

export interface SetAnimationAction {
  type: TextFieldAction.SET_ANIMATION
  payload: {
    animation: string,
    id: string
  }
}

type TextFieldActions = AddTextFieldAction | SetAnimationAction

export default TextFieldActions
