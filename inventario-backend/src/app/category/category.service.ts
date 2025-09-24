import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Category } from 'src/database/entities/category.entity';
import { Product } from 'src/database/entities/product.entity';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/common/dtos/category.dto';

/**
 * Service to handle operations related to categories.
 */
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Creates a new category with the given data.
   *
   * @param dto - Data transfer object containing the name of the category.
   * @returns The newly created category.
   */
  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const { products, ...categoryData } = dto;
    const category = this.categoryRepository.create(categoryData);

    if (products && products.length > 0) {
      const productEntities = await this.categoryRepository.manager.find(Product, {
        where: { id: In(products), hidden: false },
      });
      if (productEntities.length !== products.length) {
        throw new NotFoundException('One or more products not found');
      }
      category.products = productEntities;
    }

    return await this.categoryRepository.save(category);
  }

  /**
   * Retrieves all categories from the database.
   *
   * @returns An array of categories.
   */
  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({ where: { hidden: false }, relations: ['products'] });
  }

  /**
   * Finds a category by its ID.
   *
   * @param id - The ID of the category to find.
   * @returns The found category.
   * @throws NotFoundException if the category is not found.
   */
  async findOneById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id, hidden: false }, relations: ['products'] });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  /**
   * Updates a category with the given data.
   *
   * @param id - The ID of the category to update.
   * @param dto - Data transfer object containing the updated category data.
   * @returns The updated category.
   * @throws NotFoundException if the category is not found.
   */
  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOneById(id);
    const { products, ...updateData } = dto;
    Object.assign(category, updateData);

    if (products !== undefined) {
      if (products.length > 0) {
        const productEntities = await this.categoryRepository.manager.find(Product, {
          where: { id: In(products), hidden: false },
        });
        if (productEntities.length !== products.length) {
          throw new NotFoundException('One or more products not found');
        }
        category.products = productEntities;
      } else {
        category.products = [];
      }
    }

    return await this.categoryRepository.save(category);
  }

  /**
   * Hides a category instead of deleting it.
   *
   * @param id - The ID of the category to hide.
   * @returns An object with a success message.
   * @throws NotFoundException if the category is not found.
   */
  async hideCategory(id: string): Promise<{ message: string }> {
    const category = await this.findOneById(id);
    category.hidden = true;
    await this.categoryRepository.save(category);
    return { message: 'Category hidden successfully' };
  }
}