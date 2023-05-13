const { Users } = require('../models/Users');

module.exports = class UserService {
    constructor () {

    }

    registerUsers = async params => {
        try {
            const { users } = params;
            const usersToRegister = this.setUsersToRegister(users);
    
            return await Users.create(usersToRegister);
        } catch (error) {
            console.error(`Error: ${error}`);
            throw `Error: ${error}`;
        }
    }

    getUsers = async () => {
        try {
            return await Users.findAll();
        } catch (error) {
            console.error(`Error: ${error}`);
            throw `Error: ${error}`;
        }
    }

    findUser = async userId => {
        try {
            return await Users.findOne({ userId: userId});
        } catch (error) {
            console.error(`Error: ${error}`);
            throw `Error: ${error}`;
        }
    }

    updateUser = async params => {
        const { userId, userUpdate } = params;

        try {
            return await Users.findOneAndUpdate({ userId: userId}, userUpdate)
        } catch (error) {
            console.error(`Error: ${error}`);
            throw `Error: ${error}`;
        }
    }

    removeUser = async userId => {
        try {
            return await Users.findOneAndRemove({ userId: userId});
        } catch (error) {
            console.error(`Error: ${error}`);
            throw `Error: ${error}`;
        }
    }

    setUsersToRegister(users) {
        let firstUser = 0;

        users.forEach(async (user) => {
            Object.assign(user, { userId: firstUser++});
        });

        return users;
    }
}