import ToDo from '../../models/ToDo';
import Response from '../Response';

export default class ToDoListResponse extends Response {
  results: ToDo[];
}
