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
    skuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true
        },
        field: 'sku_id'
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
    tableName: 'sku_changes_log',
}

export const skuLogMetaData: ModelData = {
    modelName: 'SkuLog',
    attributes: attributes,
    options: options
};

export class SkuLog {
    #id: number;
    #skuId: number;
    #changedByUserId: number;
    #changeType: number;
    #changeDateTime: Date;

    constructor(productObject: any) {
        this.#id = productObject.id ;
        this.#skuId = productObject.skuId;
        this.#changedByUserId = productObject.changedByUserId;
        this.#changeType = productObject.changeType;
        this.#changeDateTime = productObject.changeDateTime;
    }

    get skuLogResponse() {
        return {
            "skuLog": {
                id: this.#id,
                skuId: this.#skuId,
                changedByUserId: this.#changedByUserId,
                changeType: this.#changeType,
                changeDateTime: this.#changeDateTime
            },
            "links": this.links
        }
    }

    get links(): string[] {
        return [];
    }

    static createBatch(array: any[]): SkuLog[] {
        let batch: SkuLog[] = [];

        for (let object of array)
            batch.push(new SkuLog(object));

        return batch;
    }
}