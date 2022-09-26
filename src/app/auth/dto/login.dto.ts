import { IsString } from 'class-validator';

class LoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export default LoginDto;
