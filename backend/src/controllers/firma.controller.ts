import * as express from 'express'
import FirmaModel from '../models/firma'
import ZakazivanjeModel from '../models/zakazivanje'
import KorisnikModel from '../models/user'
import { getFreeDecorators } from '../utils'


export class FirmaController {

    getAllCompanies = (req : express.Request, res: express.Response) =>{
        
        FirmaModel.find({}).then(firme=>{
            res.status(200).json(firme);
        }).catch(err=>{
            console.log(err)
            res.status(500).json({msg:"Error"})
        })
    }

    addNewJobRequest = (req : express.Request, res: express.Response) =>{

        let zakazivanje = new ZakazivanjeModel(req.body.zakazivanje);
        let x = 1;
        ZakazivanjeModel.find({}).sort({ id: -1 }).limit(1)
        .then((max) => {
            if (max.length > 0) {
                // provera za slucaj da je kolekcija inicijalno prazna
                // tada ce prvi objekat imati id = x = 1
                // ako kolekcija nije prazna, dodelicemo prvi sledeci id
                x = max[0].id + 1;
            }
            zakazivanje.id = x;
            zakazivanje.save().then(() => {
                return res.status(200).json({ message: "Uspesno ste zakazali uredjivanje vase baste!" });
            })
            .catch((err) => {
                console.log(err);
                return res.status(400).json({ message: "error" });
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ message: "error" });
        });
    }

    getJobRequestsForUser = (req : express.Request, res: express.Response) =>{

        let kor_ime = req.query.kor_ime;
        ZakazivanjeModel.find({kor_ime_vlasnika: kor_ime}).then(z=>{
            res.status(200).json(z);
        }).catch(err=>{
            console.log(err)
            res.status(500).json({msg:"Error!"})
        })
    }

    getJobsForCompany = (req : express.Request, res: express.Response) => {
        
        let firma = req.query.firma;
        ZakazivanjeModel.find({firma_naziv:firma}).then(poslovi=>{
            res.status(200).json(poslovi);
        }).catch(err=>{
            console.log(err);
            res.status(500).json({message: "err"})
        })
    }

    getMaintenanceRequestsForCompany = (req : express.Request, res: express.Response) => {
        
        let firma = req.query.firma;
        //status je majstor kada se ceka da majstor potvrdi
        ZakazivanjeModel.find({firma_naziv:firma, status: 'majstor'}).then(poslovi=>{
            res.status(200).json(poslovi);
        }).catch(err=>{
            console.log(err);
            res.status(500).json({message: "err"})
        })
    }

    

    getMaintenanceRequestsForDecorater = (req : express.Request, res: express.Response) => {
        
        let kor_ime_dekorater = req.query.kor_ime;
        //status je majstor kada se ceka da majstor potvrdi
        ZakazivanjeModel.find({kor_ime_dekoratera:kor_ime_dekorater, status: 'servisiranje'}).then(poslovi=>{
            res.status(200).json(poslovi);
        }).catch(err=>{
            console.log(err);
            res.status(500).json({message: "err"})
        })
    }

    updateCurrentRatingForCompany = (req : express.Request, res: express.Response) => {
        
        let firma_naziv = req.query.firma_naziv;
        ZakazivanjeModel.find({firma_naziv : firma_naziv, 'recenzija.ocena': { $exists: true , $ne : 0}}).then(rezultati=>{
            if(rezultati.length!= 0){
                let ukupnaOcena = rezultati.reduce((sum, zakazivanje) => sum + zakazivanje.recenzija.ocena, 0);
                let prosecnaOcena = ukupnaOcena / rezultati.length;

                FirmaModel.updateOne({ naziv : firma_naziv }, { prosecna_ocena: prosecnaOcena }).then(rez=>{
                    return res.status(200).json({message : "Azurirana prosecna ocena firme!"})
                }).catch(err=>{
                    console.log(err);
                    return res.status(500).json({message: "Neuspesan update prosecne ocene!"})
                })
            }
        }).catch(err=>{
            console.log(err);
            return res.status(500).json({message: "Neuspesna pretraga firme!"})
        })
    }

    addNewCompany = (req : express.Request, res: express.Response) =>{

        let firma = new FirmaModel(req.body.firma);
        let x = 1;
        FirmaModel.find({}).sort({ id: -1 }).limit(1).then((max) => {

            if (max.length > 0) {
                x = max[0].id + 1;
            }
            
            firma.id = x;
            firma.save().then(() => {
                return res.status(200).json({ message: "Dodata nova firma.", id_firme : x});
            })
            .catch((err) => {
                console.log(err);
                return res.status(400).json({ message: "Nije dodata nova firma." });
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).json({ message: "error" });
        });
    }

    getCompanyById = (req : express.Request, res: express.Response) =>{
        
        let id = req.query.id;
        FirmaModel.findOne({id : id}).then(firma=>{
            res.status(200).json(firma);
        }).catch(err=>{
            console.log(err)
            res.status(500).json({message:"Nije dohvacena firma"})
        })
    }

    getDecoratorsInCompany = (req : express.Request, res: express.Response) =>{
        
        let id = req.query.id;
        KorisnikModel.find({id_firme : id}).then(users=>{
            res.status(200).json(users);
        }).catch(err=>{
            console.log(err);
            res.status(500).json({message : 'Problem pri dohvatanju dekoratera za firmu!'})
        })
    }

    getFreeDecorators = (req : express.Request, res: express.Response) =>{

        const id = req.body.id;
        const datum = new Date(req.body.datum);
        getFreeDecorators(id, datum)
            .then(result => {
                if (result.length == 0) {
                    console.log("Nema slobodnih dekorartera!")
                    return res.status(200).json({ users: null, message: "Nema slobodnih dekoratera!" });
                } else {
                    console.log("Ima dekoratera i to su: ")
                    console.log(JSON.stringify(result));
                    return res.status(200).json({ users: result, message: "Ima slobodnih dekoratera!" });
                }
            })
            .catch(err => {
                console.error(err);
                return res.status(500).json({ message: "Došlo je do greške!" });
            });
    }

}