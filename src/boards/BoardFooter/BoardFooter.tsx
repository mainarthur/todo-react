import * as React from 'react'
import {
  FC,
  useCallback,
} from 'react'
import { useDispatch } from 'react-redux'
import useUser from '../../hooks/useUser'
import ToDo from '../../models/ToDo'
import { requestNewToDoAction } from '../../redux/actions/toDoActions'
import { createAsyncAction } from '../../redux/helpers'
import AddNew from '../AddNew'

type Props = {
  boardId: string
}

const BoardFooter: FC<Props> = ({ boardId }: Props) => {
  const user = useUser()

  const dispatch = useDispatch()

  const onAdd = useCallback(async (text: string) => {
    await createAsyncAction<ToDo>(dispatch, requestNewToDoAction({
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
