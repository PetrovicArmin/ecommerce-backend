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
        validate: {
            isEmail: true
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
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
        field: 'user_type'
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
            "user": {
                id: this.#id,
                firstName: this.#firstName,
                lastName: this.#lastName,
                email: this.#email,
                username: this.#username,
                userType: this.#userType
            },
            "links": this.links
        }
    }

    get links(): string[] {
        return [];
    }

    static createBatch(array: any[]): User[] {
        let batch: User[] = [];

        for (let object of array)
            batch.push(new User(object));

        return batch;
    }
}