import { User } from "firebase/auth";
import { Observer } from "../Abstract/Observer";

export class LogicService extends Observer {
    emailAdmin: string | null = 'elb00320@g.bstu.by';
    user: User | null = null;
}
    