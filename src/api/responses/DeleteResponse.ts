import Response from '../Response'

import ToDo from '../../models/ToDo'

export default class DeleteResponse extends Response {
  result: ToDo
}
