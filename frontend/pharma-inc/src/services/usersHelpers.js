import axios from 'axios';

export const usersHelpers = {
    getNationalities,
    getCountries
};

async function getNationalities() {
    try {
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries/iso');
        const nationalities = response.data.data.map(country => {
            return country.Iso2;
        });


        return nationalities;
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function getCountries() {
    try {
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries/iso');
        const countries = response.data.data.map(country => {
            return country.name;
        });

        return countries;
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}