import Response from '../Response'

import ToDo from '../../models/ToDo'

export default class NewToDoResponse extends Response {
  result: ToDo
}
