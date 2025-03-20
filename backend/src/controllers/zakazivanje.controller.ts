import * as express from 'express'
import ZakazivanjeModel from '../models/zakazivanje'
import { getAverageJobsByDayOfWeek, getJobsByMonthForDec, getJobsDistributionInCompany, getNumberOfNewJobs } from '../statistika';

export class ZakazivanjeController {

    addCommentAndStars = (req : express.Request, res: express.Response)=>{

        let id = req.body.id;
        let recenzija = req.body.recenzija;
        ZakazivanjeModel.updateOne({id: id}, {$set :{recenzija: recenzija}}).then(resp=>{
            res.status(200).json({message: "success"})
        }).catch(err=>{
            console.log(err);
            res.status(500).json({message: "error"});
        })
    }

    addRejectComment = (req : express.Request, res: express.Response)=>{
        
        let id = req.body.id;
        let komentar = req.body.komentar;
        ZakazivanjeModel.updateOne({id: id}, {$set :{komentar_odbijenica: komentar}}).then(resp=>{
            res.status(200).json({message: "Uspesno dodat razlog odbijanja!"})
        }).catch(err=>{
            console.log(err);
            res.status(500).json({message: "Error!"});
        })
    }

    changeJobStatus = (req : express.Request, res: express.Response)=>{
        
        let id = req.query.id;
        let status = req.query.status;
        ZakazivanjeModel.findOneAndUpdate({id:id}, {$set : {status: status}}).then(resp=>{
            res.status(200).json({message:"success"});
        }).catch(err=>{
            console.log(err);
            res.status(500).json({message: "err"})
        })
    }

    acceptJobRequest = (req:express.Request, res: express.Response) =>{
        
        let z = req.body.posao;
        ZakazivanjeModel.findOneAndUpdate({id:z.id}, 
            {$set : {kor_ime_dekoratera: z.kor_ime_dekoratera, datum_zavrsetka: z.datum_zavrsetka,status: z.status}}
        ).then(resp=>{
            res.status(200).json({message:"success"});
        }).catch(err=>{
            console.log(err);
            res.status(500).json({message: "err"})
        })
    }

    setPhoto = (req : express.Request, res: express.Response)=>{

        let id = req.query.id;
        let slika = req.query.photo;
        ZakazivanjeModel.findOneAndUpdate({id:id}, {$set : {slika: slika}}).then(resp=>{
            res.status(200).json({message:"success"});
        }).catch(err=>{
            console.log(err);
            res.status(500).json({message: "err"})
        })
    }

    acceptMaintenanceRequest = (req : express.Request, res: express.Response)=>{
        
        let z = req.body.posao;
        ZakazivanjeModel.findOneAndUpdate({id:z.id}, {$set : {status: z.status, datum_odrzavanja: z.datum_odrzavanja, odrzavanoBarJednom: true}}).then(resp=>{
            res.status(200).json({message:"Uspesno prihvacen zahtev za odrzavanje!"});
        }).catch(err=>{
            console.log(err);
            res.status(500).json({message: "Greska!"})
        })

    }

    finishRequest = (req : express.Request, res: express.Response)=>{
        
        let z = req.body.posao;
        ZakazivanjeModel.findOneAndUpdate({id:z.id}, {$set : {status: z.status, datum_zavrsetka: z.datum_zavrsetka}}).then(resp=>{
            res.status(200).json({message:"Uspesno zavrsen posao!"});
        }).catch(err=>{
            console.log(err);
            res.status(500).json({message: "Greska!"})
        })
    }

    getJobsByMonthStatForDecorator = (req : express.Request, res: express.Response)=>{
        
        let kor_ime_dekoratora = req.query.kor_ime;
        if(kor_ime_dekoratora != null && typeof kor_ime_dekoratora === 'string'){
            getJobsByMonthForDec(kor_ime_dekoratora)
            .then(results => {
                return res.json(results);
            })
            .catch(error => {
                console.error('Error getting jobs by month:', error);
                return res.status(500).send(error.message);
            });
        }else{
            return res.status(400).send('Invalid or missing query parameter: kor_ime');
        }
    }

    getJobsDistributionInCompany = (req : express.Request, res: express.Response)=>{
        
        let firmaNaziv = req.query.naziv_firme;
        if(firmaNaziv != null && typeof firmaNaziv == 'string'){

            getJobsDistributionInCompany(firmaNaziv).then(results => {
                res.json(results);
            })
            .catch(error => {
                console.error('Error getting jobs distribution:', error);
                res.status(500).send(error.message);
            });
        }
    }

    getAverageJobsByDayOfWeekInTwoYears = (req : express.Request, res: express.Response)=>{

        getAverageJobsByDayOfWeek().then(results => {
            res.json(results);
        })
        .catch(error => {
            console.error('Error getting avg jobs by day of the week in two years:', error);
            res.status(500).send(error.message);
        });
    }

    getNumberOfFinishedJobs = (req : express.Request, res: express.Response)=>{
        
        ZakazivanjeModel.countDocuments({status: 'zavrseno'}).then(result=>{
            res.status(200).json(result);
        }).catch(err=>{
            console.log(err);
            res.status(500).json({ error: 'Greška prilikom dohvatanja broja korisnika odredjenog tipa!' });
        });
    }

    getNumberOfNewJobsInTime = (req : express.Request, res: express.Response)=>{

        getNumberOfNewJobs()
        .then(results => {
            return res.json(results);
        })
        .catch(error => {
            console.error('Error getting number of new jobs in time: ', error);
            return res.status(500).send(error.message);
        });
    }

    getAllJobs = (req : express.Request, res: express.Response)=>{

        ZakazivanjeModel.find({}).then(result=>{
            res.status(200).json(result);
        }).catch(err=>{
            console.log(err);
            res.status(500).json({message : 'Error!'});
        });
    }

    getAllFinishedJobs = (req : express.Request, res: express.Response)=>{

        ZakazivanjeModel.find({status : 'zavrseno'}).then(result=>{
            res.status(200).json(result);
        }).catch(err=>{
            console.log(err);
            res.status(500).json({message : 'Error!'});
        });
    }
}