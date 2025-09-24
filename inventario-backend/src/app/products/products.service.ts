import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, In } from 'typeorm';
import { Product } from 'src/database/entities/product.entity';
import { Category } from 'src/database/entities/category.entity';
import {
  CreateProductDto,
  UpdateProductDto,
} from 'src/common/dtos/product.dto';
import { instanceToInstance } from 'class-transformer';
import { QueryResponseDto } from 'src/common/interfaces/responses/query.response';

/**
 * Service to handle operations related to products.
 */
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Creates a new product with the given data.
   *
   * @param createProductDto - Data transfer object containing the product data.
   * @returns The newly created product.
   */
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { categories, minStock, stock, ...rest } = createProductDto;
    const computedMin =
      typeof minStock === 'number' && !Number.isNaN(minStock)
        ? Math.max(0, Math.floor(minStock))
        : Math.max(5, Math.floor((stock ?? 0) * 0.2));
    const newProduct = this.productRepository.create({
      ...rest,
      stock,
      minStock: computedMin,
    });

    if (categories && categories.length > 0) {
      const categoryEntities = await this.productRepository.manager.find(Category, {
        where: { id: In(categories), hidden: false },
      });
      if (categoryEntities.length !== categories.length) {
        throw new HttpException('One or more categories not found', 404);
      }
      newProduct.categories = categoryEntities;
    }

    return await this.productRepository.save(newProduct);
  }

  /**
   * Retrieves all products from the database.
   * @param search - The search term to filter products by name.
   * @param limit - The maximum number of products to return.
   * @param page - The page number to return.
   * @param groupId - The ID of the group to filter products by group.
   * @returns A paginated response containing the products.
   * @throws HttpException if the product is not found.
   */
  async searchProducts(
    search: string = '',
    limit: number = 10,
    page: number = 1,
    sort: 'ASC' | 'DESC' = 'ASC',
    sortBy: keyof Product = 'name',
  ): Promise<QueryResponseDto<Product>> {
    const [data, total] = await this.productRepository.findAndCount({
      where: {
        hidden: false,
        name: ILike(`%${search}%`),
      },
      relations: ['categories'],
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [sortBy]: sort,
      },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Finds a product by its ID.
   *
   * @param id - The ID of the product to find.
   * @returns The found product.
   * @throws HttpException if the product is not found.
   */
  async findOneById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!product || product.hidden) {
      throw new HttpException('Product not found', 404);
    }
    return product;
  }

  /**
   * Updates a product with the given data.
   *
   * @param id - The ID of the product to update.
   * @param updateProductDto - Data transfer object containing the updated product data.
   * @returns The updated product.
   * @throws HttpException if the product is not found.
   */
  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
  const product = await this.productRepository.findOne({ where: { id } });

    if (!product || product.hidden) {
      throw new HttpException('Product not found', 404);
    }

    const { categories, minStock, stock, ...rest } = updateProductDto;
    Object.assign(product, rest);
    if (typeof stock === 'number') {
      product.stock = stock;
      if (minStock === undefined && (product.minStock === null || product.minStock === undefined)) {
        // If minStock not set, compute default from new stock
        product.minStock = Math.max(5, Math.floor(stock * 0.2));
      }
    }
    if (minStock !== undefined) {
      product.minStock = Math.max(0, Math.floor(minStock));
    }

    if (categories !== undefined) {
      if (categories.length > 0) {
        const categoryEntities = await this.productRepository.manager.find(Category, {
          where: { id: In(categories), hidden: false },
        });
        if (categoryEntities.length !== categories.length) {
          throw new HttpException('One or more categories not found', 404);
        }
        product.categories = categoryEntities;
      } else {
        product.categories = [];
      }
    }

    return await this.productRepository.save(product);
  }

  /**
   * Hides a product instead of deleting it.
   *
   * @param id - The ID of the product to hide.
   * @throws HttpException if the product is not found.
   */
  async hideProduct(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product || product.hidden) {
      throw new HttpException('Product not found', 404);
    }

    product.hidden = true;
    await this.productRepository.save(product);
  }
}
