import { ToDo } from "../../models/ToDo";
import Response from "../Response";

export class ToDoListResponse extends Response {
    results: ToDo[]
}