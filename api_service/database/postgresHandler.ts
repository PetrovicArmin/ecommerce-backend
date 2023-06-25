import { Sequelize } from "sequelize";

class PostgresDatabase {
    #sequelize?: Sequelize;
    static #database?: PostgresDatabase = undefined;

    private constructor(connection: string) {
        this.#sequelize = new Sequelize(connection);
        this.testConnection()
            .then(_ => console.log('Connection established successfully!'))
            .catch(err => console.log('Unable to connect to database: ', err));
    }

    private async testConnection(): Promise<any> {
        return this.#sequelize?.authenticate();
    }



    static createDatabase(type: string): PostgresDatabase {
        if (this.#database != undefined)
            return this.#database;
        console.log('baza!',process.env.POSTGRES_USER);
        if (type == 'production') 
            this.#database = new PostgresDatabase('blabla');
        else 
            this.#database = new PostgresDatabase(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`);

        return this.#database;
    }

    static getDatabase(): PostgresDatabase {
        if (this.#database != undefined)
            return this.#database;
        throw Error('There is no database created');
    }

    static removeDatabase(): void {
        this.#database = undefined;
    }
}

export default PostgresDatabase;