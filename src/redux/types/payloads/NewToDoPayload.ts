import NewToDoBody from '../../../api/bodies/NewToDoBody'
import User from '../../../models/User'

export default interface NewToDoPayload {
  user: User
  body: NewToDoBody
}
