import { LoadingPart } from '../todo/constants'

export default class ToDo {
  _id: string

  userId: string

  text: string

  done: boolean

  createdAt: Date

  lastUpdate: number

  position: number

  deleted: boolean

  loadingPart: LoadingPart
}
