import { ModelAttributes, ModelOptions, DataTypes, literal } from 'sequelize';
import ModelData from './modelData.js';

const attributes: ModelAttributes = {
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        validate: {
            isInt: true
        },
        field: "category_id"
    },
    productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        validate: {
            isInt:true
        },
        field: "product_id"
    }
};

const options: ModelOptions = {
    timestamps: false,
    tableName: 'products_categories',
}

export const productsCategoriesMetaData: ModelData = {
    modelName: 'ProductsCategories',
    attributes: attributes,
    options: options
};

export class ProductCategory {
    productId: number;
    categoryId: number;

    constructor(productObject: any) {
        this.productId = productObject.productId;
        this.categoryId = productObject.categoryId;
    }

    static createBatch(array: any[]): ProductCategory[] {
        let batch: ProductCategory[] = [];

        for (let object of array)
            batch.push(new ProductCategory(object));

        return batch;
    }
}