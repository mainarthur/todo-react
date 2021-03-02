import { User } from "../../models/User";
import Response from "../Response";

export class UserResponse extends Response {
    result: User
}