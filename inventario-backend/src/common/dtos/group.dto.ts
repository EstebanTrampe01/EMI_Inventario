import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({
    description: 'The name of the group',
    example: 'Development Team',
  })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    description: 'The logo of the group',
    example: 'https://example.com/logo.png',
  })
  @IsOptional()
  @IsString()
  logo?: string;
}

export class UpdateGroupDto {
  @ApiPropertyOptional({
    description: 'The name of the group',
    example: 'Development Team',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    description: 'The logo of the group',
    example: 'https://example.com/logo.png',
  })
  @IsOptional()
  @IsString()
  logo?: string;
}