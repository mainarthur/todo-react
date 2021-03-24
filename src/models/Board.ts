export default interface Board {
  id: string
  users: string[]
  name: string
  createAt: number
  lastUpdate: number
  position: number
  deleted: boolean
  invitedUsersEmails: string[]
}
