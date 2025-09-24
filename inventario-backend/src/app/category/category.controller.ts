import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/common/dtos/category.dto';
import { Category } from 'src/database/entities/category.entity';

/**
 * Controller to handle HTTP requests related to categories.
 */
@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Creates a new category with the given name.
   *
   * @param dto - Data transfer object containing the name of the category.
   * @returns The newly created category.
   */
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created', type: Category })
  @Post()
  async createCategory(@Body() dto: CreateCategoryDto): Promise<Category> {
    return await this.categoryService.createCategory(dto);
  }

  /**
   * Retrieves all categories from the database.
   *
   * @returns An array of categories.
   */
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of categories', type: [Category] })
  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  /**
   * Finds a category by its ID.
   *
   * @param id - The ID of the category to find.
   * @returns The found category.
   */
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiResponse({ status: 200, description: 'Category found', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<Category> {
    return await this.categoryService.findOneById(id);
  }

  /**
   * Updates a category with the given data.
   *
   * @param id - The ID of the category to update.
   * @param dto - Data transfer object containing the updated category data.
   * @returns The updated category.
   */
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Category updated', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.updateCategory(id, dto);
  }

  /**
   * Hides a category by its ID (soft delete).
   *
   * @param id - The ID of the category to hide.
   * @returns An object with a success message.
   */
  @ApiOperation({ summary: 'Hide a category (soft delete)' })
  @ApiResponse({ status: 200, description: 'Category hidden' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @Delete(':id')
  async hideCategory(@Param('id') id: string): Promise<{ message: string }> {
    return await this.categoryService.hideCategory(id);
  }
}