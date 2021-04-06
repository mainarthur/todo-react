import * as R from 'ramda'
import ToDo from '../../models/ToDo'
import Action from '../types/Action'
import {
  addToDoAction,
  deleteToDosAction,
  setLoadingPartAction,
  setTodosAction,
  updateToDoAction,
} from '../actions/toDoActions'
import { LoadingPart } from '../../common/constants'

export type TodosState = ToDo[]

const deleteTodos = (todos: TodosState, ids: string[]) => R.filter(
  (toDo: ToDo) => R.pipe(R.any(R.equals(toDo.id)), R.not)(ids),
)(todos)

const setLoadingPart = (todos: TodosState, ids: string[], part: LoadingPart) => R.map(
  R.ifElse(
    (toDo: ToDo) => R.any(R.equals(toDo.id))(ids),
    R.mergeLeft({ loadingPart: part }),
    R.identity,
  ),
)(todos)

const updateToDo = (todos: TodosState, toDo: ToDo) => R.map(
  R.ifElse(
    R.propEq('id', toDo.id),
    R.mergeLeft(toDo),
    R.identity,
  ),
)(todos)

const addToDo = (todos: TodosState, toDo: ToDo) => R.concat(todos)(
  [R.ifElse(
    R.has('loadingPart'),
    R.identity,
    R.mergeLeft({
      loadingPart: LoadingPart.NONE,
    }),
  )(toDo)],
)

const initialState: TodosState = []

export default function todosReducer(state = initialState, action: Action): TodosState {
  let newState = [...state]

  if (addToDoAction.match(action)) {
    newState = addToDo(newState, action.payload)
  }
  if (setTodosAction.match(action)) {
    newState = [...action.payload.todos]
  }
  if (setLoadingPartAction.match(action)) {
    const {
      payload: {
        ids,
        loadingPart,
      },
    } = action
    newState = setLoadingPart(newState, ids, loadingPart)
  }

  if (updateToDoAction.match(action)) {
    newState = updateToDo(newState, action.payload)
  }

  if (deleteToDosAction.match(action)) {
    newState = deleteTodos(newState, action.payload.todos)
  }

  return newState
}
