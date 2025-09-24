import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToMany 
} from 'typeorm';

import { Product } from './product.entity';

/**
 * Represents a category in the database.
 */
@Entity()
export class Category {
    /**
     * The unique identifier for the category.
     * This is an automatically generated UUID.
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * The name of the category.
     * This field must be unique.
     */
    @Column({ unique: true })
    name: string;

    /**
     * The products associated with the category.
     * This defines a many-to-many relationship with the Product entity.
     * A category can have multiple products.
     */
    @ManyToMany(() => Product, (product) => product.categories)
    products: Product[];
    
    /**
     * Indicates whether the category is hidden.
     * This field is used to "delete" the category without removing it from the database.
     */
    @Column({ default: false })
    hidden: boolean;
}