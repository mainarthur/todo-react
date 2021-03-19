import DeleteManyBody from '../../../api/bodies/DeleteManyBody'
import User from '../../../models/User'

export default interface DeleteManyPayload {
  body: DeleteManyBody,
  user: User
}
