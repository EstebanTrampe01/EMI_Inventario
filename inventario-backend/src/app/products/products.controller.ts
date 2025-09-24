import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../../common/dtos/product.dto';
import { Product } from '../../database/entities/product.entity';
import { QueryResponseDto } from 'src/common/interfaces/responses/query.response';
// Auth & role decorators removed: open endpoints for simplified model

/**
 * Controller to handle HTTP requests related to products.
 */
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Creates a new product with the given data.
   *
   * @param createProductDto - Data transfer object containing the product data.
   * @param groupId - The ID of the group to which the product belongs.
   * @returns The newly created product.
   */
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  // groupId removed (no multi-group model)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  // groupId removed
  ): Promise<Product> {
  return await this.productsService.createProduct(createProductDto);
  }

  /**
   * Retrieves all products from the database.
   *
   * @param search - The search term to filter products by name.
   * @param limit - The maximum number of products to return.
   * @param page - The page number to return.
   * @param groupId - The ID of the group to filter products by group.
   * @param sort - The sort order (ASC or DESC).
   * @param sortBy - The field to sort by.
   * @returns A paginated response containing the products.
   */
  @ApiOperation({ summary: 'Search products' })
  @ApiResponse({
    status: 200,
    description: 'Search all products.',
    type: QueryResponseDto,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term to filter products by name',
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    description: 'The maximum number of products to return',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description: 'The page number to return',
  })
  // groupId removed
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'The sort order (ASC or DESC)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'The field to sort by',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async searchProducts(
    @Query('search') search: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('sort') sort: 'ASC' | 'DESC' = 'ASC',
    @Query('sortBy') sortBy: keyof Product = 'name',
  ): Promise<QueryResponseDto<Product>> {
    return await this.productsService.searchProducts(
      search,
      limit,
      page,
      sort,
      sortBy,
    );
  }
  /**
   * Finds a product by its ID.
   *
   * @param id - The ID of the product to find.
   * @returns The found product.
   */
  @ApiOperation({ summary: 'Find a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the found product.',
    type: CreateProductDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<Product> {
    return await this.productsService.findOneById(id);
  }

  /**
   * Updates a product with the given data.
   *
   * @param id - The ID of the product to update.
   * @param updateProductDto - Data transfer object containing the updated product data.
   * @param groupId - The ID of the group to which the product belongs.
   * @returns The updated product.
   */
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    type: CreateProductDto,
  })
  // groupId removed
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
  return await this.productsService.updateProduct(id, updateProductDto);
  }

  /**
   * Hides a product instead of deleting it.
   *
   * @param id - The ID of the product to hide.
   */
  @ApiOperation({ summary: 'Hide a product' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully hidden.',
  })
  // groupId removed
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Delete(':id')
  async hideProduct(@Param('id') id: string): Promise<{ message: string }> {
    await this.productsService.hideProduct(id);
    return { message: 'Product hidden' };
  }
}
