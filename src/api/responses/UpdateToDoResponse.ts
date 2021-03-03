import ToDo from '../../models/ToDo';
import Response from '../Response';

export default class UpdateToDoResponse extends Response {
  result: ToDo;
}
