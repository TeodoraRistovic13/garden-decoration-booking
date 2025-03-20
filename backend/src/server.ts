import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRuter from './routers/user.router';
import firmaRuter from './routers/firma.router';
import zakazivanjeRuter from './routers/zakazivanje.router';

process.env.TZ = 'UTC';
const app = express();
app.use(cors());
app.use(express.json())


mongoose.connect("mongodb://127.0.0.1:27017/aplikacija");
const connection = mongoose.connection;
connection.once("open", ()=>{
    console.log("db connection ok");
})


const ruter = express.Router();

ruter.use("/users", userRuter);
ruter.use("/firme", firmaRuter);
ruter.use("/zakazivanje", zakazivanjeRuter);


app.use("/", ruter);
app.use('/uploads', express.static('uploads'));

app.listen(4000, () => console.log(`Express server running on port 4000`));