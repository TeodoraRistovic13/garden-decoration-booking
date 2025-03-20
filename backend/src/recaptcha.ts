import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Učitaj varijable iz .env fajla

export const secretKey = process.env.SECRET_KEY; 


export function verifyRecaptcha(responseToken: any): Promise<boolean> {
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${responseToken}`;

    return axios.post(verificationUrl)
        .then(response => {
            return response.data.success;
        })
        .catch(err => {
            console.log(err);
            return false;
        });
}

