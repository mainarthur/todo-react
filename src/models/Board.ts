export default interface Board {
  _id: string
  users: string[]
  name: string
  createAt: number
  lastUpdate: number
  position: number
  deleted: boolean
}
