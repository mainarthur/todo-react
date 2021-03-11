import * as React from 'react'
import {
  ChangeEvent,
  FC,
  useRef,
  useEffect,
  MutableRefObject,
} from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'

import DragHandleIcon from '@material-ui/icons/DragHandle'
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
  const listItem = useRef<HTMLDivElement>(null)
  const checkBox = useRef<HTMLButtonElement>(null)
  const deleteButton = useRef<HTMLButtonElement>(null)
  const dragElement = useRef<HTMLButtonElement>(null)

  const onDeleteButtonClick = (): void => {
    onDelete(id)
  }

  const onCheckBoxChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const { target: { checked } } = ev

    onStatusChange(id, checked)
  }

  useEffect(() => {
    const { current: li } = listItem
    const { current: dragButton } = dragElement
    console.log(li)
    const onMouseDown = (ev: MouseEvent) => {
      if (ev.button !== 0) {
        return // Only left button handle
      }

      if (!dragButton.contains(ev.target as Node)) {
        return
      }

      let currentDropable: Element

      const rect = li.getBoundingClientRect()

      const shiftX = ev.clientX - rect.left
      const shiftY = ev.clientY - rect.top

      const ghostDiv = document.createElement('div')

      ghostDiv.style.width = `${rect.right - rect.left}px`
      ghostDiv.style.height = `${rect.bottom - rect.top}px`
      ghostDiv.style.border = '1px dotted rgba(66,66,66,0.3)'

      li.style.width = `${rect.right - rect.left}px`
      li.style.position = 'fixed'
      li.style.backgroundColor = 'white'
      li.style.zIndex = '666'

      const moveAt = (pageX: number, pageY: number): void => {
        li.style.left = `${pageX - shiftX}px`
        li.style.top = `${pageY - shiftY}px`
      }

      moveAt(ev.pageX, ev.pageY)

      const onMouseMove = (moveEv: MouseEvent) => {
        const {
          pageX,
          pageY,
          clientX,
          clientY,
        } = moveEv

        moveAt(pageX, pageY)

        li.hidden = true
        const elementBelow = window.document.elementFromPoint(clientX, clientY)
        li.hidden = false

        if (!elementBelow) {
          return
        }

        currentDropable = elementBelow

        if (currentDropable.tagName.toUpperCase() === 'LI') {
          currentDropable.before(ghostDiv)
        } /* else if (currentDropable.classList.contains(ClassNames.BOTTOM_DROPABLE)) {
          target.parentElement.append(ghostDiv)
        } */
      }

      const onMouseUp = () => {
        window.document.removeEventListener('mousemove', onMouseMove)
        window.document.removeEventListener('mouseup', onMouseUp)

        if (currentDropable) {
          /* let dropableTarget: Element = currentDropable
          let i = 0

          while (dropableTarget != null && dropableTarget !== ghostDiv && dropableTarget.tagName.toUpperCase() !== 'LI' && !dropableTarget.classList.contains(ClassNames.BOTTOM_DROPABLE) && i !== 10) {
            i += 1
            dropableTarget = dropableTarget.parentElement
          }

          if (dropableTarget) {
            if (dropableTarget.tagName.toUpperCase() === 'LI') {
              dropableTarget.before(target)
              ghostDiv?.remove()
              const nextId = dropableTarget.id
              let prevId = ''

              if (target.previousElementSibling) {
                prevId = target.previousElementSibling.id
              }

              onPositionChange(target.id, nextId, prevId)
            } else if (dropableTarget.classList.contains(ClassNames.BOTTOM_DROPABLE)) {
              target.parentElement.append(target)
              ghostDiv?.remove()

              Console.log('bottom-drag')

              if (target.previousElementSibling) {
                onPositionChange(target.id, '', target.previousElementSibling.id)
              }
            } else if (dropableTarget === ghostDiv) {
              dropableTarget.before(target)
              ghostDiv?.remove()

              const {
                previousElementSibling,
                nextElementSibling,
              } = target

              if (previousElementSibling || nextElementSibling) {
                if (!previousElementSibling) {
                  onPositionChange(target.id, nextElementSibling.id, '')
                } else if (!nextElementSibling) {
                  onPositionChange(target.id, '', previousElementSibling.id)
                } else {
                  onPositionChange(target.id, nextElementSibling.id, previousElementSibling.id)
                }
              }
            }
          } */
        }
        console.log('mouse up')
        li.removeAttribute('style')
        ghostDiv?.remove()
      }

      window.document.addEventListener('mousemove', onMouseMove)
      window.document.addEventListener('mouseup', onMouseUp)

      console.log(123)
    }

    li.addEventListener('mousedown', onMouseDown)

    return () => {
      li.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  return (
    <ListItem
      ref={listItem}
      id={id}
      role={undefined}
      dense
      button
    >
      <ListItemIcon ref={checkBox}>
        <Checkbox
          ref={checkBox}
          onChange={onCheckBoxChange}
          edge="start"
          checked={done}
          tabIndex={-1}
          disableRipple
        />
      </ListItemIcon>
      <ListItemText primary={text} />
      <ListItemSecondaryAction>
        <IconButton ref={deleteButton} edge="end" onClick={onDeleteButtonClick}>
          <DeleteIcon />
        </IconButton>
        <IconButton ref={dragElement} edge="end">
          <DragHandleIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default ToDoElement
