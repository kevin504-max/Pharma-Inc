const { UserService } = require('../services');
const UserService = new UserService();
const usersJSON = require('../users.json');

module.exports = class UserController {
    registerUsers = async (request, response) => {
        try {
            const users = this.getUsersFromJSON(usersJSON);
            const usersParams = { users: users };
            const usersRegistered = await UserService.getUsers();

            this.verifyUsersRegistered(usersRegistered);

            await UserService.registerUsers(usersParams);
            return response.status(200).json({ message: 'Usuários registrados com sucesso!' });
        } catch (error) {
            console.error(`Error: ${error}`);
            return response.status(500).json({ message: `Error: ${error}` });
        }
    }

    getUsers = async (request, response) => {
        try {
            const users = await UserService.getUser();

            if (!users) {
                return response.status(404).json({ message: 'Nenhum usuário foi encontrado...' });                
            }

            return response.status(200).json({ users: users });
        } catch (error) {
            console.error(`Error: ${error}`);
            return response.status(500).json({ message: `Error: ${error}` });
        }
    }

    findUser = async (request, response) => {
        try {
            const user = await UserService.findUser(request.params.userId);

            if (!user) {
                return response.status(404).json({ message: 'Nenhum usuário foi encontrado...' });
            }

            return response.status(200).json({ user: user });
        } catch (error) {
            console.error(`Error: ${error}`);
            return response.status(500).json({ message: `Error: ${error}` });
        }
    }

    updateUser = async (request, response) => {
        try {
            const updateParams = { userId: Number(request.params.userId), userUpdate: request.body };
            const userUpdated = await UserService.updateUser(updateParams);

            if (!userUpdated) {
                return response.status(404).json({ message: 'Nenhum usuário foi encontrado...' });
            }

            return response.status(200).json({ message: 'Usuário atualizado com sucesso!', user: userUpdated });
        } catch (error) {
            console.error(`Error: ${error}`);
            return response.status(500).json({ message: `Error: ${error}` });
        }
    }

    removeUser = async (request, response) => {
        try {
            const userRemoved = await UserService.removeUser(request.params.userId);

            if (!userRemoved) {
                return response.status(404).json({ message: 'Nenhum usuário foi encontrado...' });
            }

            return response.status(200).json({ message: 'Usuário removido com sucesso!', user: userRemoved });
        } catch (error) {
            console.error(`Error: ${error}`);
            return response.status(500).json({ message: `Error: ${error}` });
        }
    }

    getUsersFromJSON = (jsonFile) => {
        return jsonFile.results;
    }

    verifyUsersRegistered(usersRegistered) {
        if (usersRegistered.length > 0) {
            throw 'O arquivo já foi registrado no banco de dados!';
        }
    }
}