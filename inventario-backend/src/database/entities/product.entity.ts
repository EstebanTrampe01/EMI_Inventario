import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Category } from './category.entity';

/**
 * Represents a product in the database.
 */
@Entity()
export class Product {
  /**
   * The unique identifier for the product.
   * This is an automatically generated UUID.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The name of the product.
   */
  @Column()
  name: string;

  /**
   * The description of the product.
   */
  @Column()
  description: string;

  /**
   * The stock quantity of the product.
   */
  @Column('int')
  stock: number;

  /**
   * Minimum stock threshold for low stock warning.
   * Optional: if not provided, the service will compute 20% of stock (minimum 5).
   */
  @Column('int', { nullable: true })
  minStock?: number | null;

  /**
   * The image URL of the product.
   * This field is optional and can be null.
   */
  @Column({ nullable: true })
  image: string;

  /**
   * The group to which the product belongs.
   * This defines a many-to-one relationship with the Group entity.
   */
  // Group relationship removed: now products are global and only categorized
  // If in future we need multi-tenant separation, reintroduce a relation here.
  

  /**
   * The category to which the product belongs.
   * This defines a many-to-one relationship with the Category entity.
   */
  @ManyToMany(() => Category, (category) => category.products, { cascade: true })
  @JoinTable()
  categories: Category[];

  /**
   * Indicates whether the product is hidden.
   * This field is used to "delete" the product without removing it from the database.
   */
  @Column({ default: false })
  hidden: boolean;
}
