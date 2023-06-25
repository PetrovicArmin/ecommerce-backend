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
        validate: {
            len: [3, 10000],
            is: /[^a-zA-Z\s]+/ //only spaces and letters
        }
    },
    description: {
        type: DataTypes.STRING
    }
};

const options: ModelOptions = {
    timestamps: false,
    tableName: 'categories',
}

export const categoryMetaData: ModelData = {
    modelName: 'Category',
    attributes: attributes,
    options: options
};

export class Category {
    #id: number;
    #name: string;
    #description: string

    constructor(productObject: any) {
        this.#id = productObject.id;
        this.#name = productObject.name;
        this.#description = productObject.description;
    }

    get categoryResponse() {
        return {
            "category": {
                id: this.#id,
                name: this.#name,
                description: this.#description
            },
            "links": this.links
        }
    }

    get links(): string[] {
        return [];
    }

    static createBatch(array: any[]): Category[] {
        let batch: Category[] = [];

        for (let object of array)
            batch.push(new Category(object));

        return batch;
    }
}