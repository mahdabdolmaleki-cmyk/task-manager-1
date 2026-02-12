import { IsEnum, IsString, MaxLength, MinLength } from "class-validator";

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}

export class registerValidator {
    @IsString()
    @MinLength(3)
    title:string;
    @IsString()
    @MaxLength(500)
    description:string;
    @IsEnum(TaskStatus)
    status:string;
    user:object;
}