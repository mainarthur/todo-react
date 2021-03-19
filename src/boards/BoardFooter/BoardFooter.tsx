import * as React from 'react'
import {
  FC,
  useCallback,
} from 'react'
import AddNew from '../AddNew'

type Props = {
  boardId: string
}

const BoardFooter: FC<Props> = ({ boardId }: Props) => {
  const onAdd = useCallback((text: string) => {
    console.log(text)
  }, [boardId])
  return <AddNew placeholder="New Task" addText="Add new ToDo" onAdd={onAdd} />
}

export default BoardFooter
