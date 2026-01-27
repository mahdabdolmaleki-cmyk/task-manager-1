import { IsDefined, IsEmail, IsStrongPassword, MinLength } from "class-validator";

export class registerValidator {
    @MinLength(3)
    name : string;
    family?: string;
    @IsEmail()
    email : string;
    @IsDefined()
    @IsStrongPassword()
    password : string;
    age?: number;
}
