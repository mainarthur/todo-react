export default interface UpdateToDoBody {
  id: string
  boardId: string
  text?: string
  done?: boolean
  position?: number
}
