import { IsEmail, IsString, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    description: 'El nombre de usuario del nuevo usuario',
    example: 'johndoe',
  })
  @IsString({
    message: 'El usuario debe ser un string',
  })
  username: string;

  @ApiProperty({
    description: 'La contraseña del nuevo usuario',
    example: 'Password123!',
  })
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, {
    message: 'La contraseña debe contener al menos una letra y un número',
  })
  password: string;

  @ApiProperty({
    description: 'El correo electrónico del nuevo usuario',
    example: 'johndoe@example.com',
  })
  @IsEmail(
    {},
    {
      message: 'El correo electrónico debe ser un correo electrónico válido',
    },
  )
  email: string;
}
