import * as React from 'react'
import {
  FC,
  useCallback,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ToDo from '../../models/ToDo'
import { newToDoAction } from '../../redux/actions/toDoActions'
import { createAsyncAction } from '../../redux/helpers'
import { RootState } from '../../redux/reducers'
import AddNew from '../AddNew'

type Props = {
  boardId: string
}

const BoardFooter: FC<Props> = ({ boardId }: Props) => {
  const { user } = useSelector((state: RootState) => state.app)

  const dispatch = useDispatch()

  const onAdd = useCallback(async (text: string) => {
    await createAsyncAction<ToDo>(dispatch, newToDoAction({
      body: {
        boardId,
        text,
      },
      user,
    }))
  }, [boardId, user, dispatch])

  return <AddNew placeholder="New Task" addText="Add new ToDo" onAdd={onAdd} />
}

export default BoardFooter
