import Response from '../Response'

import ToDo from '../../models/ToDo'

export default class ToDoListResponse extends Response {
  results: ToDo[]
}
