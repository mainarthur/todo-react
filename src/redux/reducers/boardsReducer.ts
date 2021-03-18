import ToDo from '../../models/ToDo'
import Action from '../types/Action'
import { addToDoAction, setLoadingPartAction, setTodosAction } from '../actions/toDoActions'

export type TodosState = ToDo[]

const initialState: TodosState = []

export default function todosReducer(state = initialState, action: Action): TodosState {
  let newState = [...state]

  if (addToDoAction.match(action)) {
    newState = newState.concat([{ ...action.payload }])
  }
  if (setTodosAction.match(action)) {
    newState = [...action.payload]
  }
  if (setLoadingPartAction.match(action)) {
    const {
      payload: {
        ids,
        loadingPart,
      },
    } = action
    newState = newState.map((toDo) => {
      const { _id: toDoId } = toDo
      if (ids.indexOf(toDoId) !== -1) {
        return { ...toDo, loadingPart }
      }
      return toDo
    })
  }

  return newState
}
