import oAuth2Server from 'oauth2-server';
import { User } from '../models/users.js';
import PostgresDatabase from '../database/postgresHandler.js';
import bcrypt from 'bcryptjs';

export class Token {
    accessToken: string;
    accessTokenExpiresAt: Date;
    refreshToken: string;
    refreshTokenExpiresAt: Date;
    client: any;
    user: User;

    constructor(tokenObject: any) {
        this.accessToken = tokenObject.accessToken;
        this.accessTokenExpiresAt = tokenObject.accessTokenExpiresAt;
        this.refreshToken = tokenObject.refreshToken;
        this.refreshTokenExpiresAt = tokenObject.refreshTokenExpiresAt;
        this.client = tokenObject.client;
        this.user = tokenObject.user;
    }
}


const getUser = async (username: string, password: string): Promise<User | undefined> => {

    const user: User = new User(
        await PostgresDatabase.db.Users.findOne({
            where: {
                username: username
            }
        })
    );
        
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (isPasswordCorrect)
        return Promise.resolve(user)
    
    return Promise.resolve(undefined);
}

const getClient = async (clientID: string, clientSecret: string): Promise<any> => {

    const client = {
        clientID,
        clientSecret,
        grants: ['password', 'refresh_token'],
        redirectUris: null,
    };

    return Promise.resolve(client);
}

const saveToken = async (token: Token, _: any, user: User): Promise<any> => {

    await PostgresDatabase.db.Users.update({
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        lastModified: new Date()
    }, { where: { id: user.userResponse.id }});

    return Promise.resolve({
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        client: {id: user.userResponse.id },
        user: {id: user.userResponse.id}
    });
}

const getAccessToken = async (accessToken: string): Promise<Token | false> => {

    
    const userInstance: any = await PostgresDatabase.db.Users.findOne({
        where: {
            accessToken: accessToken
        }
    });


    if (userInstance == null)
        return Promise.resolve(false);

    const user: User = new User(userInstance);


    return Promise.resolve(new Token({
        accessToken: user.accessToken,
        accessTokenExpiresAt: user.accessTokenExpiresAt,
        refreshToken: user.refreshToken,
        client: {
            id: user.userResponse.id
        },
        user: user
    }))
}

const getRefreshToken = async (refreshToken: string): Promise<Token> => {

    const user: User = new User(
        await PostgresDatabase.db.Users.findOne({
            where: {
                refreshToken: refreshToken
            }
        })
    )

    return Promise.resolve(new Token({
        refreshToken: user.refreshToken,
        refreshTokenExpiresAt: user.refreshTokenExpiresAt,
        client: {
            id: user.userResponse.id
        },
        user: user
    }))
}

const verifyScope = async (accessToken: Token, scope: any): Promise<boolean> => {
    return Promise.resolve(true);
}

const revokeToken = async (token: Token): Promise<boolean> => {

    try {
        await PostgresDatabase.db.Users.update({
            refreshToken: null,
            refreshTokenExpiresAt: null,
            lastModified: new Date()
        }, { where: { id: token.user.userResponse.id } })
    } catch(err) {
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}

export const oauth: oAuth2Server = new oAuth2Server({
    model: {
        getUser: getUser,
        getClient: getClient,
        saveToken: saveToken,
        getAccessToken: getAccessToken,
        getRefreshToken: getRefreshToken,
        verifyScope: verifyScope,
        revokeToken: revokeToken
    },
    accessTokenLifetime: 24 * 60 * 60,
    alwaysIssueNewRefreshToken: true
});