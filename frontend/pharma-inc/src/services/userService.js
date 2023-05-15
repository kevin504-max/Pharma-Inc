import axios from 'axios';

export const userService = {
    getUsers,
    updateUser,
}

async function getUsers() {
    try {
        return await axios.get('http://localhost:3300/api/users', {
            params: {
                _limite: 50
            }
        });
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function updateUser(user) {
    delete user.fullName;

    try {
        return await axios.put(`http://localhost:3300/api/users/${user.userId}`, {
            name: user.name,
            location: user.location,
            gender: user.gender,
            phone: user.phone,
            email: user.email,
            nat: user.nationality,
            id: {
                value: user.id.value,
            },
            dob: {
                age: getAge(user.birth),
                date: dateString2Date(user.birth)
            }
        });
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

function getAge(birth) {
    const now = new Date();
    const birthDate = new Date(dateString2Date(birth));
    
    let age = now.getFullYear() - birthDate.getFullYear();
    
    const month = now.getMonth() - birthDate.getMonth();

    if(month < 0 || (month === 0 && now.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function dateString2Date(date) {
    const dateArray = date.split('/');
    
    return new Date([dateArray[1], dateArray[0], dateArray[2]]);
}