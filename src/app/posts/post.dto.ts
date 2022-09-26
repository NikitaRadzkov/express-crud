import { IsString } from 'class-validator';

class CreatePostDto {
  @IsString()
  author: string;

  @IsString()
  content: string;

  @IsString()
  title: string;
}

export default CreatePostDto;
