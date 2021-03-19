export default interface Request<B> {
  endpoint: string
  method?: 'POST' | 'GET' | 'PATCH' | 'DELETE'
  body?: B
  headers?: {
    [key: string]: string
  }
}
