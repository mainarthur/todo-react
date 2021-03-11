import * as React from 'react'
import { ChangeEvent, FC } from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'

import DeleteIcon from '@material-ui/icons/Delete'

type Props = {
  id: string
  onDelete(id: string): void
  onStatusChange(id: string, newStatus: boolean): void
  onPositionChange(id: string, nextId: string, prevId: string): void
  text: string
  done: boolean
}

const ToDoElement: FC<Props> = ({
  id,
  done,
  text,
  onDelete,
  onStatusChange,
  onPositionChange,
}: Props) => {
  const onDeleteButtonClick = (): void => {
    onDelete(id)
  }

  const onCheckBoxChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const { target: { checked } } = ev

    onStatusChange(id, checked)
  }
  return (
    <ListItem
      id={id}
      role={undefined}
      dense
      button
    >
      <ListItemIcon>
        <Checkbox
          onChange={onCheckBoxChange}
          edge="start"
          checked={done}
          tabIndex={-1}
          disableRipple
        />
      </ListItemIcon>
      <ListItemText primary={text} />
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={onDeleteButtonClick}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default ToDoElement
