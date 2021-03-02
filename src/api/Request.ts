export default interface Request<B> {
  endpoint: string,
  method?: string
  body?: B,
  headers?: {
    [key: string]: string
  }
}
