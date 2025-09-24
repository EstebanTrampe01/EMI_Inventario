import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Laptop',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'A high-performance laptop',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 100,
  })
  @IsNumber()
  stock: number;

  @ApiProperty({
    description: 'The minimum stock threshold (yellow warning). If not provided, defaults to 20% of stock (min 5).',
    example: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  minStock?: number;

  @ApiProperty({
    description: 'The image URL of the product',
    example: 'https://example.com/image.png',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Array of category IDs to associate with the product',
    example: ['uuid-category-1', 'uuid-category-2'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  categories?: string[];
}

export class UpdateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Laptop',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'A high-performance laptop',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiProperty({
    description: 'The minimum stock threshold (yellow warning).',
    example: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  minStock?: number;

  @ApiProperty({
    description: 'The image URL of the product',
    example: 'https://example.com/image.png',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Array of category IDs to associate with the product',
    example: ['uuid-category-1', 'uuid-category-2'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  categories?: string[];
}
