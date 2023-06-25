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
    },
    quantityChange: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'quantity_change'
    }
};

const options: ModelOptions = {
    timestamps: false,
    tableName: 'inventory_log',
}

export const inventoryLogMetaData: ModelData = {
    modelName: 'InventoryLog',
    attributes: attributes,
    options: options
};

export class InventoryLog {
    #id: number;
    #skuId: number;
    #changedByUserId: number;
    #changeType: number;
    #changeDateTime: Date;
    #quantityChange: number;

    constructor(productObject: any) {
        this.#id = productObject.id ;
        this.#skuId = productObject.skuId;
        this.#changedByUserId = productObject.changedByUserId;
        this.#changeType = productObject.changeType;
        this.#changeDateTime = productObject.changeDateTime;
        this.#quantityChange = productObject.quantityChange;
    }

    get inventoryLogResponse() {
        return {
            "inventoryLog": {
                id: this.#id,
                skuId: this.#skuId,
                changedByUserId: this.#changedByUserId,
                changeType: this.#changeType,
                changeDateTime: this.#changeDateTime,
                quantityChange: this.#quantityChange
            },
            "links": this.links
        }
    }

    get links(): string[] {
        return [];
    }

    static createBatch(array: any[]): InventoryLog[] {
        let batch: InventoryLog[] = [];

        for (let object of array)
            batch.push(new InventoryLog(object));

        return batch;
    }
}