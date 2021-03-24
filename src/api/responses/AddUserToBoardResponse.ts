import Response from '../Response'

import Board from '../../models/Board'

export default class AddUserToBoardResponse extends Response {
  result: Board
}
