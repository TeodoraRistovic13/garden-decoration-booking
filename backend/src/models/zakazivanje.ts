import mongoose from "mongoose";


let Zakazivanje = new mongoose.Schema({
    id : Number,
    kor_ime_vlasnika: String,
    firma_naziv: String,
    kor_ime_dekoratera: String,
    datum_zakazivanja: Date,
    datum_izrade : Date,
    datum_zavrsetka : Date,
    datum_odrzavanja : Date,
    uk_povrsina: Number,
    tip_baste: String,
    naziv_restorana : String,
    adresa_restorana : String,
    uk_bazen: Number,
    uk_namestaj: Number,
    uk_fontana : Number,
    br_stolova : Number,
    br_stolica : Number,
    uk_zelenilo: Number,
    kratak_opis : String,
    usluge : Array,
    recenzija: Object, //komentar, ocena...
    status : String,
    slika : String,
    odrzavanoBarJednom : Boolean,
    raspored_baste : Array,
    broj_vodenih_povrsina : Number,
    komentar_odbijenica : String
    },
    {
        versionKey : false
    }
)

export default mongoose.model("ZakazivanjeModel", Zakazivanje, "zakazivanja")
