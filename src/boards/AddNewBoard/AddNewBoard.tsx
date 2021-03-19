import * as React from 'react'
import {
  FC,
} from 'react'
import AddNew from '../AddNew'

const AddNewBoard: FC = () => {
  const onAdd = (text: string) => {
    console.log(text)
  }
  return <AddNew placeholder="New Board" addText="Add board" onAdd={onAdd} />
}

export default AddNewBoard
