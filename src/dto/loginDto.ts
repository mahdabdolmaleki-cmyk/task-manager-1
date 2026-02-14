import { IsEmail, IsStrongPassword } from "class-validator";

export class loginValidator {
    @IsEmail()
    email : string;

    @IsStrongPassword()
    password : string;
}
