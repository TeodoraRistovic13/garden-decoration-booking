import axios from 'axios';


const secretKey = '6Lc9JTQqAAAAAK3nG46H2SHCZWDeDvURAaPj5VJI'; 


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

