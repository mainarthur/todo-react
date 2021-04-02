import * as React from 'react'
import {
  FC,
} from 'react'
import { useDispatch } from 'react-redux'
import useUser from '../../hooks/useUser'
import Board from '../../models/Board'
import { requestNewBoardAction } from '../../redux/actions/boardsActions'
import { createAsyncAction } from '../../redux/helpers'
import AddNew from '../AddNew'

const AddNewBoard: FC = () => {
  const user = useUser()
  const dispath = useDispatch()

  const onAdd = async (text: string) => {
    await createAsyncAction<Board>(dispath, requestNewBoardAction({
      body: {
        name: text,
      },
      user,
    }))
  }
  return <AddNew placeholder="New Board" addText="Add board" onAdd={onAdd} inputMaxLength={26} />
}

export default AddNewBoard
