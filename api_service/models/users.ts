import { ModelAttributes, ModelOptions, DataTypes, literal } from 'sequelize';
import ModelData from './modelData.js';

export enum UserType {
    SHOP_WORKER = "SHOP_WORKER",
    SUPPLY_MANAGER = "SUPPLY_MANAGER",
    SUPPLY_ANALYST = "SUPPLY_ANALYST"
};

const attributes: ModelAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
            isInt: true
        }   
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 1000],
            isAlpha: true
        },
        field: 'first_name'
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 1000],
            isAlpha: true
        },
        field: 'last_name'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isAlphanumeric: true,
            len: [4, 1000]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'user_type',
        validate: {
            isIn: [[UserType.SHOP_WORKER, UserType.SUPPLY_ANALYST, UserType.SUPPLY_MANAGER]]
        }
    },
    accessToken: {
        type: DataTypes.STRING,
        field: 'access_token'
    },
    refreshToken: {
        type: DataTypes.STRING,
        field: 'refresh_token'
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
    tableName: 'users',
}

export const usersMetaData: ModelData = {
    modelName: 'User',
    attributes: attributes,
    options: options
};

export class User {
    #id: number;
    #firstName: string;
    #lastName: string
    #email: string;
    #username: string;
    password: string;
    #userType: string;
    accessToken: string;
    refreshToken: string;
    lastModified: Date;

    constructor(productObject: any) {
        this.#id = productObject.id ;
        this.#firstName = productObject.firstName;
        this.#lastName = productObject.lastName;
        this.#email = productObject.email;
        this.#username = productObject.username;
        this.#userType = productObject.userType;
        this.accessToken = productObject.accessToken;
        this.refreshToken = productObject.refreshToken;
        this.lastModified = productObject.lastModified;
        this.password = productObject.password;
    }

    get userResponse() {
        return {            
            id: this.#id,
            firstName: this.#firstName,
            lastName: this.#lastName,
            email: this.#email,
            username: this.#username,
            userType: this.#userType
        }
    }

    get links(): any[] {
        let additionalLinks: any[] = []
        if (this.#userType == UserType.SUPPLY_ANALYST) {
            additionalLinks = [                
                {
                    "href": `${process.env.API_URL}:${process.env.API_PORT}/products/logs?changedByUserId=${this.#id}`,
                    "rel": "logs",
                    "type": "GET"
                },        
                {
                    "href": `${process.env.API_URL}:${process.env.API_PORT}/products/logs`,
                    "rel": "logs",
                    "type": "GET"
                },
                {
                    "href": `${process.env.API_URL}:${process.env.API_PORT}/skus/logs?changedByUserId=${this.#id}`,
                    "rel": "logs",
                    "type": "GET"
                },        
                {
                    "href": `${process.env.API_URL}:${process.env.API_PORT}/skus/logs`,
                    "rel": "logs",
                    "type": "GET"
                },
                {
                    "href": `${process.env.API_URL}:${process.env.API_PORT}/inventory/logs?changedByUserId=${this.#id}`,
                    "rel": "logs",
                    "type": "GET"
                },        
                {
                    "href": `${process.env.API_URL}:${process.env.API_PORT}/inventory/logs`,
                    "rel": "logs",
                    "type": "GET"
                }
            ]
        } else if (this.#userType == UserType.SHOP_WORKER) {
            additionalLinks = [
                {
                    "href": `${process.env.API_URL}:${process.env.API_PORT}/skus`,
                    "rel": "skus",
                    "type": "GET"
                },
                {
                    "href": `${process.env.API_URL}:${process.env.API_PORT}/skus/:id`,
                    "rel": "skus",
                    "type": "GET"
                },
                {
                    "href": `${process.env.API_URL}:${process.env.API_PORT}/skus`,
                    "rel": "skus",
                    "type": "POST"
                },
                {
                    "href": `${process.env.API_URL}:${process.env.API_PORT}/skus/:id`,
                    "rel": "skus",
                    "type": "UPDATE"
                },
                {
                    "href": `${process.env.API_URL}:${process.env.API_PORT}/skus/:id`,
                    "rel": "skus",
                    "type": "DELETE"
                }
            ]
        } else {
            additionalLinks = [
                {
                    "href": `${process.env.API_URL}:${process.env.API_PORT}/products`,
                    "rel": "products",
                    "type": "GET"
                },
                {
                    "href": `${process.env.API_URL}:${process.env.API_PORT}/products/:id`,
                    "rel": "products",
                    "type": "GET"
                },
                {
                    "href": `${process.env.API_URL}:${process.env.API_PORT}/products`,
                    "rel": "products",
                    "type": "POST"
                },
                {
                    "href": `${process.env.API_URL}:${process.env.API_PORT}/products/:id`,
                    "rel": "products",
                    "type": "UPDATE"
                },
                {
                    "href": `${process.env.API_URL}:${process.env.API_PORT}/products/:id`,
                    "rel": "products",
                    "type": "DELETE"
                }
            ]
        }
        return [
            {
                "href": `${process.env.API_URL}:${process.env.API_PORT}/users`,
                "rel": "users",
                "type": "GET"
            },
            {
                "href": `${process.env.API_URL}:${process.env.API_PORT}/users/${this.#id}`,
                "rel": "users",
                "type": "GET"
            },
            {
                "href": `${process.env.API_URL}:${process.env.API_PORT}/users`,
                "rel": "users",
                "type": "POST"
            },
            {
                "href": `${process.env.API_URL}:${process.env.API_PORT}/users/${this.#id}`,
                "rel": "users",
                "type": "UPDATE"
            },
            {
                "href": `${process.env.API_URL}:${process.env.API_PORT}/users/${this.#id}`,
                "rel": "users",
                "type": "DELETE"
            },...additionalLinks
        ];
    }

    static createBatch(array: any[]): User[] {
        let batch: User[] = [];

        for (let object of array)
            batch.push(new User(object));

        return batch;
    }
}