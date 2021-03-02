import User from '../../models/User';
import Response from '../Response';

export default class UserResponse extends Response {
  result: User;
}
