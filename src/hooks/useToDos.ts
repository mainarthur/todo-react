import { useSelector } from 'react-redux'
import { RootState } from '../redux/reducers'

const useToDos = (boardId: string) => useSelector(
  (state: RootState) => state.boards.find((board) => board.id === boardId),
)?.todos ?? []

export default useToDos
