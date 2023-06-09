const { UserService } = require('../services');
const userService = new UserService();
const usersJSON = require('../users.json');

module.exports = class UserController {
    registerUsers = async (request, response) => {
        try {
            const users = this.getUsersFromJSON(usersJSON);
            const usersParams = { users: users };
            const usersRegistered = await userService.getUsers();

            this.verifyUsersRegistered(usersRegistered);

            await userService.registerUsers(usersParams);
            return response.status(200).json({ message: 'Usuários registrados com sucesso!' });
        } catch (error) {
            console.error(`Error: ${error}`);
            return response.status(500).json({ message: `Error: ${error}` });
        }
    }

    getUsers = async (request, response) => {
        try {
            const users = await userService.getUsers();

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
            const user = await userService.findUser(request.params.userId);

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
            const userUpdated = await userService.updateUser(updateParams);

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
            const userRemoved = await userService.removeUser(request.params.userId);

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