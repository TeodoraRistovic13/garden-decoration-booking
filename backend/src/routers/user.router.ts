import express from 'express'
import { UserController } from '../controllers/user.controller';
import { upload } from '../multerConfig';


const userRuter = express.Router();


userRuter.post('/addPhoto', upload.single('file'), (req: express.Request, res: express.Response) => {new UserController().addPhoto(req, res)})

//userRuter.post('/register', (req, res) => {new UserController().register(req, res)})
userRuter.route('/register').post((req, res)=> new UserController().register(req, res));

userRuter.route('/login').post((req, res)=> new UserController().login(req, res));

userRuter.route('/updateUserData').post((req, res)=> new UserController().updateUserData(req, res));

userRuter.route('/updatePassword').post((req, res)=> new UserController().updatePassword(req, res));

userRuter.route('/getUserByEmail').get((req, res)=> new UserController().getUserByEmail(req, res));

userRuter.route('/getUserByUsername').get((req, res)=> new UserController().getUserByUsername(req, res));

userRuter.route('/getAllUsers').get((req, res)=> new UserController().getAllUsers(req, res));

userRuter.route('/getNumberOfUsersByType').get((req, res)=> new UserController().getUserTypeCount(req, res));

userRuter.route('/addDecoratorToCompany').get((req, res)=> new UserController().addDecoratorToCompany(req, res));

userRuter.route('/verify-recaptcha').post((req, res)=> new UserController().verifyRecaptcha(req, res));


export default userRuter;