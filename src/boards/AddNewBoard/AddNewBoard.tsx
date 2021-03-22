import * as React from 'react'
import {
  FC,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Board from '../../models/Board'
import { requestNewBoardAction } from '../../redux/actions/boardsActions'
import { createAsyncAction } from '../../redux/helpers'
import { RootState } from '../../redux/reducers'
import AddNew from '../AddNew'

const AddNewBoard: FC = () => {
  const { user } = useSelector((state: RootState) => state.app)
  const dispath = useDispatch()

  const onAdd = async (text: string) => {
    await createAsyncAction<Board>(dispath, requestNewBoardAction({
      body: {
        name: text,
      },
      user,
    }))
  }
  return <AddNew placeholder="New Board" addText="Add board" onAdd={onAdd} />
}

export default AddNewBoard
