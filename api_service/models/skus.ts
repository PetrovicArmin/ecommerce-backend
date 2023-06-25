import { ModelAttributes, ModelOptions, DataTypes, literal } from 'sequelize';
import ModelData from './modelData.js';

const attributes: ModelAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
            isInt: true
        }   
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true
        },
        field: 'product_id'
    },
    skuCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [5,1000],
            isAlphanumeric: true
        },
        field: 'sku_code'
    },
    color: {
        type: DataTypes.STRING
    },
    weight: {
        type: DataTypes.DOUBLE,
        validate: {
            isDecimal: true,
            min: 0
        },
    },
    countryOfOrigin: {
        type: DataTypes.STRING,
        field: 'country_of_origin'
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    },
    quantityInStock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 0
        },
        field: "quantity_in_stock"
    },
    size: {
        type: DataTypes.STRING
    },
    details: {
        type: DataTypes.STRING
    },
    lastModified: {
        type: "TIMESTAMP",
        allowNull: false,
        defaultValue: literal("CURRENT_TIMESTAMP"),
        field: 'last_modified'
    }
};

const options: ModelOptions = {
    timestamps: false,
    tableName: 'skus',
}

export const skuMetaData: ModelData = {
    modelName: 'Sku',
    attributes: attributes,
    options: options
};

export class Sku {
    #id: number;
    #productId: number;
    #skuCode: string;
    #color: string;
    #weight: number;
    #countryOfOrigin: string;
    #price: number;
    #quantityInStock: number;
    #size: string;
    #details: string;
    lastModified: Date;

    constructor(productObject: any) {
        this.#id = productObject.id ;
        this.#productId = productObject.productId;
        this.#skuCode = productObject.skuCode;
        this.#color = productObject.color;
        this.#weight = productObject.weight;
        this.#countryOfOrigin = productObject.countryOfOrigin;
        this.#price = productObject.price;
        this.#quantityInStock = productObject.quantityInStock;
        this.#size = productObject.size;
        this.#details = productObject.details;
        this.lastModified = productObject.lastModified;
    }

    get skuResponse() {
        return {
            "sku": {
                id: this.#id,
                productId: this.#productId,
                skuCode: this.#skuCode,
                color: this.#color,
                weight: this.#weight,
                countryOfOrigin: this.#countryOfOrigin,
                price: this.#price,
                quantityInStock: this.#quantityInStock,
                size: this.#size,
                details: this.#details
            },
            "links": this.links
        }
    }

    get links(): string[] {
        return [];
    }

    static createBatch(array: any[]): Sku[] {
        let batch: Sku[] = [];

        for (let object of array)
            batch.push(new Sku(object));

        return batch;
    }
}