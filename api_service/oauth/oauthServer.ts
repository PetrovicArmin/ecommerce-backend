import oAuth2Server from 'oauth2-server';
import { User } from '../models/users.js';
import PostgresDatabase from '../database/postgresHandler.js';
import bcrypt from 'bcryptjs';

class Token {
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
    console.log('getUser');
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
    console.log('getClient');
    const client = {
        clientID,
        clientSecret,
        grants: ['password', 'refresh_token'],
        redirectUris: null,
    };

    return Promise.resolve(client);
}

const saveToken = async (token: Token, _: any, user: User): Promise<any> => {
    console.log('saveToken');
    await PostgresDatabase.db.Users.update({
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        lastModified: new Date()
    }, { where: { id: user.userResponse.id }});
    console.log('saveToken izašao');
    return Promise.resolve({
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        client: {id: user.userResponse.id },
        user: {id: user.userResponse.id}
    });
}

const getAccessToken = async (accessToken: string): Promise<Token> => {
    console.log('getToken');
    const user: User = new User(
        await PostgresDatabase.db.Users.findOne({
            where: {
                accessToken: accessToken
            }
        })
    )

    return Promise.resolve(new Token({
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        client: {
            id: user.userResponse.id
        },
        user: {
            id: user.userResponse.id
        }
    }))
}

const getRefreshToken = async (refreshToken: string): Promise<Token> => {
    console.log('getRefreshtoken');
    const user: User = new User(
        await PostgresDatabase.db.Users.findOne({
            where: {
                refreshToken: refreshToken
            }
        })
    )

    return Promise.resolve(new Token({
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        client: {
            id: user.userResponse.id
        },
        user: {
            id: user.userResponse.id
        }
    }))
}

const verifyScope = async (accessToken: Token, scope: any): Promise<boolean> => {
    console.log('verifyScope');
    return Promise.resolve(true);
}

const revokeToken = async (token: Token): Promise<boolean> => {
    console.log('revokeToken');
    try {
        await PostgresDatabase.db.Users.update({
            refreshToken: null,
            lastModified: new Date()
        }, { where: { id: token.user.userResponse.id } })
    } catch(err) {
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}

const oauth: oAuth2Server = new oAuth2Server({
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

export default oauth;