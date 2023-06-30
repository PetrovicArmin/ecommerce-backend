import { Model, ModelStatic, Op, Sequelize } from "sequelize";
import { productMetaData }  from "../models/products.js";
import ModelData from "../models/modelData.js";
import { productsCategoriesMetaData } from "../models/productsCategories.js";
import { categoryMetaData } from "../models/categories.js";
import { skuMetaData } from "../models/skus.js";
import { usersMetaData } from "../models/users.js";
import { productLogMetaData } from "../models/productChangesLog.js";
import { skuLogMetaData } from "../models/skuChangesLog.js";
import { inventoryLogMetaData } from "../models/inventoryChangesLog.js";

class PostgresDatabase {
    #sequelize: Sequelize;

    static #database?: PostgresDatabase = undefined;

    private constructor(connection: string) {
        this.#sequelize = new Sequelize(connection);

        this.connect()
            .then(async _ => {
                console.log('Connection established successfully!');
                this.configureModels();
                await this.#sequelize.sync();
            })
            .catch(err => console.log('Unable to connect to database: ', err));
    }

    private async connect(): Promise<any> {
        return this.#sequelize.authenticate();
    }

    private configureModels() {
        const metaData: ModelData[] = [
            productMetaData,
            productsCategoriesMetaData,
            categoryMetaData,
            skuMetaData,
            usersMetaData,
            productLogMetaData,
            skuLogMetaData,
            inventoryLogMetaData
        ];

        for (const modelData of metaData)
            this.#sequelize.define(
                modelData.modelName,
                modelData.attributes,
                modelData.options
            )
                
        //put here your associations if needed
    }

    get Products(): ModelStatic<Model<any,any>> {
        return this.#sequelize.models.Product;
    }

    get ProductsCategories(): ModelStatic<Model<any,any>> {
        return this.#sequelize.models.ProductsCategories;
    }

    get Categories(): ModelStatic<Model<any,any>> {
        return this.#sequelize.models.Category;
    }

    get Skus(): ModelStatic<Model<any,any>> {
        return this.#sequelize.models.Sku;
    }

    get Users(): ModelStatic<Model<any,any>> {
        return this.#sequelize.models.User;
    }

    get ProductLogs(): ModelStatic<Model<any,any>> {
        return this.#sequelize.models.ProductLog;
    }

    get SkuLogs(): ModelStatic<Model<any,any>> {
        return this.#sequelize.models.SkuLog;
    }

    get InventoryLogs(): ModelStatic<Model<any,any>> {
        return this.#sequelize.models.InventoryLog;
    }

    async existsProduct(userId: number): Promise<boolean> {
        return (await this.Products.count({ where: { id: userId } })) != 0;    
    }

    async allCategoriesExist(categoryIds: number[]): Promise<boolean> {
        return (await this.Categories.count({ where: { id: { [Op.in]: categoryIds } } })) == categoryIds.length;
    }
    
    static createDatabase(type: string): PostgresDatabase {
        if (this.#database != undefined)
            return this.#database;
        
        let host: string | undefined = 'localhost';
        let port: string | undefined = process.env.POSTGRES_PORT;

        if (type == 'PRODUCTION') {
            host = process.env.PG_CONTAINER_NAME;
            port = "5432";
        }
        
        this.#database = new PostgresDatabase(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${host}:${port}/${process.env.POSTGRES_DB}`);

        return this.#database;
    }

    static getTable(topic: string): ModelStatic<Model<any,any>> {
        switch(topic) {
            case 'productLogs': 
                return this.db.ProductLogs
            case 'skuLogs':
                return this.db.SkuLogs;
            default:
                return this.db.InventoryLogs;
        }
    }

    static get db(): PostgresDatabase {
        if (this.#database != undefined)
            return this.#database;
        throw Error('There is no database created');
    }

    get sq(): Sequelize {
        return this.#sequelize;
    }

    static removeDatabase(): void {
        this.#database = undefined;
    }
}

export default PostgresDatabase;