import Response from '../Response'

import Board from '../../models/Board'

export default class NewBoardResponse extends Response {
  result: Board
}
