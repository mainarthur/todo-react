import Response from '../Response'

import User from '../../models/User'

export default class UserResponse extends Response {
  result: User
}
