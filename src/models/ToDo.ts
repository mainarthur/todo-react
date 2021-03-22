import { LoadingPart } from '../common/constants'

export default interface ToDo {
  id: string
  userId: string
  boardId: string
  text: string
  done: boolean
  createdAt: Date
  lastUpdate: number
  position: number
  deleted: boolean
  loadingPart: LoadingPart
}
