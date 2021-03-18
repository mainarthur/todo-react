export default interface UpdateToDoBody {
  _id: string
  boardId: string
  text?: string
  done?: boolean
  position?: number
}
