import { Model, ModelStatic, Sequelize } from "sequelize";
import { productMetaData }  from "../models/products.js";
import ModelData from "../models/modelData.js";
import { productsCategoriesMetaData } from "../models/productsCategories.js";
import { categoryMetaData } from "../models/categories.js";

class PostgresDatabase {
    #sequelize: Sequelize;

    static #database?: PostgresDatabase = undefined;

    private constructor(connection: string) {
        this.#sequelize = new Sequelize(connection);

        this.testConnection()
            .then(async _ => {
                console.log('Connection established successfully!');
                await this.configureModels();
                await this.configureAssociations();
            })
            .catch(err => console.log('Unable to connect to database: ', err));
    }

    private async testConnection(): Promise<any> {
        return this.#sequelize.authenticate();
    }

    private async configureModels() {
        const metaData: ModelData[] = [
            productMetaData,
            productsCategoriesMetaData,
            categoryMetaData
        ];

        for (const modelData of metaData)
            this.#sequelize.define(
                modelData.modelName,
                modelData.attributes,
                modelData.options
            )

        await this.#sequelize.sync();
    }

    private async configureAssociations() {

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

    static createDatabase(type: string): PostgresDatabase {
        if (this.#database != undefined)
            return this.#database;

        if (type == 'production') 
            this.#database = new PostgresDatabase('blabla');
        else 
            this.#database = new PostgresDatabase(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`);

        return this.#database;
    }

    static get db(): PostgresDatabase {
        if (this.#database != undefined)
            return this.#database;
        throw Error('There is no database created');
    }

    static removeDatabase(): void {
        this.#database = undefined;
    }
}

export default PostgresDatabase;