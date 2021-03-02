import Response from '../Response';

export default class AuthResponse extends Response {
  access_token: string;

  refresh_token: string;
}
