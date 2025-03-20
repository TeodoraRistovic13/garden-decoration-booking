
import express from 'express'
import { FirmaController } from '../controllers/firma.controller';


const firmaRuter = express.Router();

firmaRuter.route('/getAllCompanies').get((req, res)=> new FirmaController().getAllCompanies(req, res));

firmaRuter.route('/addNewJobRequest').post((req, res)=> new FirmaController().addNewJobRequest(req, res));

firmaRuter.route('/getJobRequestsForUser').get((req, res)=> new FirmaController().getJobRequestsForUser(req, res));

firmaRuter.route('/getJobsForCompany').get((req, res)=> new FirmaController().getJobsForCompany(req, res));

firmaRuter.route('/getMaintenanceRequestsForCompany').get((req, res)=> new FirmaController().getMaintenanceRequestsForCompany(req, res));

firmaRuter.route('/getMaintenanceRequestsForDecorater').get((req, res)=> new FirmaController().getMaintenanceRequestsForDecorater(req, res));

firmaRuter.route('/updateCurrentRatingForCompany').get((req, res)=> new FirmaController().updateCurrentRatingForCompany(req, res));

firmaRuter.route('/addNewCompany').post((req, res)=> new FirmaController().addNewCompany(req, res));

firmaRuter.route('/getCompanyById').get((req, res)=> new FirmaController().getCompanyById(req, res));

firmaRuter.route('/getDecoratorsInCompany').get((req, res)=> new FirmaController().getDecoratorsInCompany(req, res));

firmaRuter.route('/getFreeDecorators').post((req, res)=> new FirmaController().getFreeDecorators(req, res));

export default firmaRuter;