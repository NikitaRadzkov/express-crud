import { IsEmail, IsString } from 'class-validator';

class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export default CreateUserDto;
