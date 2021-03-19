import Response from '../Response'

import Board from '../../models/Board'

export default class BoardsResponse extends Response {
  results: Board[]
}
