import mongoose from "mongoose";


let Korisnik = new mongoose.Schema({
    kor_ime: String,
    lozinka: String,
    ime: String,
    prezime: String,
    pol: String,
    tip: String,
    adresa: String,
    telefon: String,
    imejl: String,
    slika: String,
    br_kred_kartice:String,
    status_naloga:String,
    id_firme : Number
    },
    {
        versionKey : false
    }
)

export default mongoose.model("KorisnikModel", Korisnik, "korisnici")
