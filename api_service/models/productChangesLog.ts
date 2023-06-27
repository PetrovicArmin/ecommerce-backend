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
    changedByUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'changed_by_user_id'
    },
    changeType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'change_type'
    },
    changeDateTime: {
        type: "TIMESTAMP",
        allowNull: false,
        defaultValue: literal("CURRENT_TIMESTAMP"),
        field: 'change_date_time'
    }
};

const options: ModelOptions = {
    timestamps: false,
    tableName: 'product_changes_log',
}

export const productLogMetaData: ModelData = {
    modelName: 'ProductLog',
    attributes: attributes,
    options: options
};

export class ProductLog {
    #id: number;
    #productId: number;
    #changedByUserId: number;
    #changeType: number;
    #changeDateTime: Date;

    constructor(productObject: any) {
        this.#id = productObject.id ;
        this.#productId = productObject.productId;
        this.#changedByUserId = productObject.changedByUserId;
        this.#changeType = productObject.changeType;
        this.#changeDateTime = productObject.changeDateTime;
    }

    get productLogResponse() {
        return {
            id: this.#id,
            productId: this.#productId,
            changedByUserId: this.#changedByUserId,
            changeType: this.#changeType,
            changeDateTime: this.#changeDateTime
        }
    }

    static get links(): any[] {
        return [
            {
                "href": `${process.env.API_URL}:${process.env.API_PORT}/logs/inventory`,
                "rel": "inventory",
                "type": "GET"
            },
            {
                "href": `${process.env.API_URL}:${process.env.API_PORT}/logs/skus`,
                "rel": "skus",
                "type": "GET"
            }
        ];
    }

    static createBatch(array: any[]): ProductLog[] {
        let batch: ProductLog[] = [];

        for (let object of array)
            batch.push(new ProductLog(object));

        return batch;
    }
}