import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Electrónica',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Array of product IDs to associate with the category',
    example: ['uuid-product-1', 'uuid-product-2'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  products?: string[];
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: 'The name of the category',
    example: 'Electrodomésticos',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Array of product IDs to associate with the category',
    example: ['uuid-product-1', 'uuid-product-2'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  products?: string[];
}