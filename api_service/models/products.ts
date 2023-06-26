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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 10000],
            is: /^[A-Za-z\s]*$/ //only spaces and letters
        }
    },
    instructionManual: {
        type: DataTypes.STRING,
        field: 'instruction_manual'
    },
    description: {
        type: DataTypes.STRING
    },
    lastModified: {
        type: "TIMESTAMP",
        allowNull: false,
        defaultValue: literal("CURRENT_TIMESTAMP"),
        field: 'last_modified'
    },
    lastModifiedCategory: {
        type: "TIMESTAMP",
        allowNull: false,
        defaultValue: literal("CURRENT_TIMESTAMP"),
        field: 'last_modified_category'
    }
};

const options: ModelOptions = {
    timestamps: false,
    tableName: 'products',
}

export const productMetaData: ModelData = {
    modelName: 'Product',
    attributes: attributes,
    options: options
};

export class Product {
    #id: number;
    #name: string;
    #instructionManual: string;
    #description: string
    lastModified: Date;
    lastModifiedCategory: Date;

    constructor(productObject: any) {
        this.#id = productObject.id;
        this.#name = productObject.name;
        this.#instructionManual = productObject.instructionManual;
        this.#description = productObject.description;
        this.lastModified = productObject.lastModified;
        this.lastModifiedCategory = productObject.lastModifiedCategory;
    }

    get productResponse() {
        return {
            id: this.#id,
            name: this.#name,
            instructionManual: this.#instructionManual,
            description: this.#description,
        }
    }

    get links(): any[] {
        return [
            {
                "href": `${process.env.API_URL}:${process.env.API_PORT}/products/${this.#id}/categories`,
                "rel": "categories",
                "type": "POST"
            },
            {
                "href": `${process.env.API_URL}:${process.env.API_PORT}/products/${this.#id}/categories`,
                "rel": "categories",
                "type": "GET"
            },
            {
                "href": `${process.env.API_URL}:${process.env.API_PORT}/products/${this.#id}/categories`,
                "rel": "categories",
                "type": "DELETE"
            },
            {
                "href": `${process.env.API_URL}:${process.env.API_PORT}/products/${this.#id}`,
                "rel": "products",
                "type": "GET"
            },
            {
                "href": `${process.env.API_URL}:${process.env.API_PORT}/products/${this.#id}`,
                "rel": "products",
                "type": "PUT"
            },
            {
                "href": `${process.env.API_URL}:${process.env.API_PORT}/products/${this.#id}`,
                "rel": "products",
                "type": "DELETE"
            }
        ];
    }

    static createBatch(array: any[]): Product[] {
        let batch: Product[] = [];

        for (let object of array)
            batch.push(new Product(object));

        return batch;
    }
}