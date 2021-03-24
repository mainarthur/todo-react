import Response from '../Response'

import Board from '../../models/Board'

export default class DeleteBoardResponse extends Response {
  result: Board
}
