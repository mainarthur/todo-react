import NewBoardBody from '../../../api/bodies/NewBoardBody'
import User from '../../../models/User'

export default interface NewBoardPayload {
  user: User
  body: NewBoardBody
}
