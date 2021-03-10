import Response from '../Response'

import ToDo from '../../models/ToDo'

export default class UpdateToDoResponse extends Response {
  result: ToDo
}
