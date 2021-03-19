import User from '../../../models/User'

export default interface BodyPayload<T> {
  body: T
  user: User
}
