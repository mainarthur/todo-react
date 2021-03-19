import User from '../../../models/User'

export default interface BoardPayload {
  boardId: string
  user?: User
}
