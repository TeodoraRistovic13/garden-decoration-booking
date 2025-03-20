import * as express from 'express'
import KorisnikModel from '../models/user'
import { checkPassword, hashPassword } from '../bcryptConfig';
import { verifyRecaptcha } from '../recaptcha';


export class UserController {

    addPhoto = (req : express.Request, res : express.Response) =>{

        if(req.file != null){
            const responseData = {
                message : "File uploaded successfully",
                originalFileName : req.file.originalname,
                mimeType: req.file.mimetype,
                sizeInBytes : req.file.size
            };
            //treba da se doda u bazu naziv slike
            res.status(200).json(responseData);
        } 
    }
    
    verifyRecaptcha = (req: express.Request, res: express.Response) => {
        const recaptchaToken = req.body.token;
    
        verifyRecaptcha(recaptchaToken).then(isHuman => {
            if (!isHuman) {
                return res.status(200).json({ success: false, message: 'reCAPTCHA verification failed.' });
            }
            res.status(200).json({ success: true });
        });
    }

    register = (req : express.Request, res: express.Response) =>{
        
        let korisnik = req.body.korisnik;

        if (korisnik.slika == ""){
            korisnik.slika = "default_user.jpg";
        }
        hashPassword(korisnik.lozinka)
        .then((hesiranaLozinka: string) => { 
            korisnik.lozinka = hesiranaLozinka;
            return new KorisnikModel(korisnik).save();
        })
        .then(() => {
            res.status(200).json({ message: "User added." });
        })
        .catch((err: any) => {
            console.log(err);
            if (!res.headersSent) {
                res.status(500).json({ message: "Error, user not added." });
            }
        });

       
    }

    login = (req: express.Request, res:express.Response) =>{
        const kor_ime = req.body.kor_ime;
        const lozinka = req.body.lozinka;

        KorisnikModel.findOne({ kor_ime: kor_ime })
            .then(user => {
                if (user === null) {
                    // Ako korisnik nije pronađen
                    return res.status(200).json({ user: null, message: "Ne postoji korisnik sa tim korisnickim imenom!" });
                }
                if (!user.lozinka) {
                    // Ako lozinka korisnika nije definisana
                    return res.status(500).json({ user : null, message: "Nije definisana lozinka za korisnika!" });
                }

                // Proveri lozinku
                return checkPassword(lozinka, user.lozinka)
                    .then((isMatch: boolean) => {
                        if (isMatch) {
                            return res.status(200).json({user: user, message:""});
                        } else {
                            // Lozinka je neispravna
                            console.log('Lozinka je neispravna');
                            return res.status(200).json({user : null, message:"Lozinka je netacna!"});
                        }
                    });
            })
            .catch(err => {
                // Greška pri pretrazi korisnika ili proveri lozinke
                console.log(err);
                return res.status(500).json({ message: "Error!" });
            });
    }

    updateUserData = (req: express.Request, res: express.Response) =>{
      
        let korIme = req.body.korIme;
        let vrsta = req.body.vrstaPodatka;
        let vrednost = req.body.novaVrednost;


        KorisnikModel.findOneAndUpdate({kor_ime: korIme}, {$set:{[vrsta]: vrednost}} as any, {new : true}).then((updatedUser)=>{
            if(updatedUser){
                res.status(200).json({msg: "Succes!", user: updatedUser})
            }else{
                res.status(404).json({ msg: "User not found!" });
            }
        }).catch(err=>{
            console.log(err)
            res.status(500).json({msg:"Error!"})
        })
    }

    updatePassword = (req: express.Request, res: express.Response) =>{

        let kor_ime = req.body.kor_ime;
        let nova_lozinka = req.body.nova_lozinka;
       
        hashPassword(nova_lozinka)
        .then((hesirana_lozinka: string) => {

            KorisnikModel.findOneAndUpdate({kor_ime: kor_ime}, {$set : {"lozinka": hesirana_lozinka}}, {new : true}).then(updatedUser=>{
                return res.status(200).json({message:"password updated", user: updatedUser});
            }).catch(err=>{
                console.log(err)
                return res.status(500).json({msg:"Error, user password not updated!", user : null})
            })
        })
        .catch((err: any) => {
            console.log(err);
            if (!res.headersSent) {
                res.status(500).json({ message: "Error, password not updated.", user : null});
            }
        });
    }

    getUserByEmail = (req: express.Request, res: express.Response) =>{

        let imejl = req.query.email;

        KorisnikModel.findOne({imejl: imejl}).then(user=>{
            res.status(200).json({msg:"Postoji korisnik sa tom imejl adresom!", user: user});
        }).catch(err=>{
            console.log(err)
            res.status(500).json({msg:"Error!"})
        })

    }

    getUserByUsername = (req: express.Request, res: express.Response) =>{

        let kor_ime = req.query.kor_ime;

        KorisnikModel.findOne({kor_ime: kor_ime}).then(user=>{
            res.status(200).json({message:"Postoji korisnik sa tim korisnickim imenom", user: user});
        }).catch(err=>{
            console.log(err)
            res.status(500).json({message:"Error!", user: null})
        })

    }
    
    getAllUsers = (req: express.Request, res: express.Response) =>{

        KorisnikModel.find({}).then(users=>{
            res.status(200).json(users);
        }).catch(err=>{
            console.log(err)
            res.status(500).json({msg:"Error!"})
        })

    }

    getUserTypeCount = (req: express.Request, res: express.Response) =>{

        let tip = req.query.tip;

        KorisnikModel.countDocuments({tip: tip}).then(result=>{
            res.status(200).json(result);
        }).catch(err=>{
            console.log(err);
            res.status(500).json({ error: 'Greška prilikom dohvatanja broja korisnika odredjenog tipa!' });
        });


    }

    addDecoratorToCompany = (req: express.Request, res: express.Response) =>{

        let kor_ime = req.query.kor_ime;
        let id_firme = req.query.id_firme;

        KorisnikModel.findOneAndUpdate({kor_ime: kor_ime}, {$set : {id_firme : id_firme}}).then(resp=>{
            res.status(200).json({message : 'Dekorater je dodat firmi.'});
        }).catch(err=>{
            console.log(err);
            res.status(500).json({ error: 'Nije dodata firma za dekoratera.' });
        });


    }
}