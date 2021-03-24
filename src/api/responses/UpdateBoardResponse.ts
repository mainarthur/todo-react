import Response from '../Response'

import Board from '../../models/Board'

export default class UpdateBoardResponse extends Response {
  result: Board
}
