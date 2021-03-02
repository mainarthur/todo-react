import Response from "../Response";

export class AuthResponse extends Response {
    access_token: string
    refresh_token: string
}
