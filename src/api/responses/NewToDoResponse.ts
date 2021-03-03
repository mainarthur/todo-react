import ToDo from '../../models/ToDo';
import Response from '../Response';

export default class NewToDoResponse extends Response {
  result: ToDo;
}
