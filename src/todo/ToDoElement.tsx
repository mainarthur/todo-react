import * as React from 'react'
import Button from '@material-ui/core/Button'
import { log } from '../logging/logger'
import ClassNames from './ClassNames'
import './ToDoElement.scss'

type Props = {
  id: string
  onDelete(id: string): void
  onStatusChange(id: string, newStatus: boolean): void
  onPositionChange(id: string, nextId: string, prevId: string): void
  text: string
  done: boolean

}

type State = {

}

class ToDoElement extends React.Component<Props, State> {
  onDeleteButtonClick = (): void => {
    const { id, onDelete } = this.props
    onDelete(id)
  };

  onCheckBoxChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, onStatusChange } = this.props

    onStatusChange(id, ev.target.checked)
  };

  onMouseDown = (ev: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const { onPositionChange } = this.props

    let currentDropable: Element

    if (ev.button !== 0) {
      return
    }

    let target = ev?.target as HTMLElement

    if (target.classList.contains(ClassNames.CHECKBOX_CLASSNAME)
      || target.classList.contains(ClassNames.DELETE_CLASSNAME)) {
      return
    }

    if (target.tagName.toUpperCase() !== 'LI') {
      target = target.parentElement
    }

    const rect = target.getBoundingClientRect()
    const shiftX = ev.clientX - rect.left
    const shiftY = ev.clientY - rect.top

    const ghostDiv = document.createElement('div')

    ghostDiv.style.width = `${rect.right - rect.left}px`
    ghostDiv.style.height = `${rect.bottom - rect.top}px`
    ghostDiv.style.border = '1px dotted rgba(66,66,66,0.3)'

    target.style.width = `${rect.right - rect.left}px`
    target.style.position = 'absolute'
    target.style.backgroundColor = 'white'
    target.style.zIndex = '666'

    const moveAt = (pageX: number, pageY: number): void => {
      target.style.left = `${pageX - shiftX}px`
      target.style.top = `${pageY - shiftY}px`
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

      target.hidden = true
      const elementBelow = window.document.elementFromPoint(clientX, clientY)
      target.hidden = false

      if (!elementBelow) {
        return
      }

      currentDropable = elementBelow

      if (currentDropable.tagName.toUpperCase() === 'LI') {
        currentDropable.before(ghostDiv)
      } else if (currentDropable.classList.contains(ClassNames.BOTTOM_DROPABLE)) {
        target.parentElement.append(ghostDiv)
      }
    }

    const onMouseUp = () => {
      window.document.removeEventListener('mousemove', onMouseMove)
      target.removeEventListener('mouseup', onMouseMove)

      if (currentDropable) {
        let dropableTarget: Element = currentDropable
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

            log('bottom-drag')

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
        }
      }
      target.removeAttribute('style')
      ghostDiv?.remove()
    }

    window.document.addEventListener('mousemove', onMouseMove)
    target.addEventListener('mouseup', onMouseUp)
  };

  render(): JSX.Element {
    const {
      text, done, id,
    } = this.props

    return (
      <li
        id={id}
        role="option"
        aria-selected="false"
        className="todo"
        onMouseDown={this.onMouseDown}
      >
        <input
          className={ClassNames.CHECKBOX_CLASSNAME}
          type="checkbox"
          checked={done}
          onChange={this.onCheckBoxChange}
        />
        <span className={`todo__text${done ? ' todo__text_done' : ''}`}>
          {text}
        </span>
        <span className="todo_centered-horizontally">
          <Button
            onClick={this.onDeleteButtonClick}
            color="primary"
            variant="contained"
          >
            X
          </Button>
        </span>
        <hr className="todo__divider" />
      </li>
    )
  }
}
export default ToDoElement
