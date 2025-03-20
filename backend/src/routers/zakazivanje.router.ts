
import express from 'express'
import { ZakazivanjeController } from '../controllers/zakazivanje.controller';


const zakazivanjeRuter = express.Router();

zakazivanjeRuter.route('/addCommentAndStars').post((req, res)=> new ZakazivanjeController().addCommentAndStars(req, res));

zakazivanjeRuter.route('/changeJobStatus').get((req, res)=> new ZakazivanjeController().changeJobStatus(req, res));

zakazivanjeRuter.route('/acceptJobRequest').post((req, res)=> new ZakazivanjeController().acceptJobRequest(req, res));

zakazivanjeRuter.route('/setPhoto').get((req, res)=> new ZakazivanjeController().setPhoto(req, res));

zakazivanjeRuter.route('/acceptMaintenanceRequest').post((req, res)=> new ZakazivanjeController().acceptMaintenanceRequest(req, res));

zakazivanjeRuter.route('/finishRequest').post((req, res)=> new ZakazivanjeController().finishRequest(req, res));

zakazivanjeRuter.route('/getJobsByMonthStatForDecorator').get((req, res)=> new ZakazivanjeController().getJobsByMonthStatForDecorator(req, res));

zakazivanjeRuter.route('/getJobsDistributionInCompany').get((req, res)=> new ZakazivanjeController().getJobsDistributionInCompany(req, res));

zakazivanjeRuter.route('/getAverageJobsByDayOfWeekInTwoYears').get((req, res)=> new ZakazivanjeController().getAverageJobsByDayOfWeekInTwoYears(req, res));

zakazivanjeRuter.route('/getNumberOfFinishedJobs').get((req, res)=> new ZakazivanjeController().getNumberOfFinishedJobs(req, res));

zakazivanjeRuter.route('/getNumberOfNewJobsInTime').get((req, res)=> new ZakazivanjeController().getNumberOfNewJobsInTime(req, res));

zakazivanjeRuter.route('/addRejectComment').post((req, res)=> new ZakazivanjeController().addRejectComment(req, res));

zakazivanjeRuter.route('/getAllJobs').get((req, res)=> new ZakazivanjeController().getAllJobs(req, res));

zakazivanjeRuter.route('/getAllFinishedJobs').get((req, res)=> new ZakazivanjeController().getAllFinishedJobs(req, res));

export default zakazivanjeRuter;