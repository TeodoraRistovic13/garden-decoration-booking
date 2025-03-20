import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Firma = new Schema({
    id : Number,
    naziv : String,
    adresa : String,
    prosecna_ocena : Number,
    telefon: String,
    usluge : Array,
    datum_pocetka_godisnjeg : Date,
    datum_kraja_godisnjeg : Date,
    radno_vreme_od : String,
    radno_vreme_do : String
    },
    {
        versionKey: false
    }
)

export default mongoose.model("FirmaModel", Firma, "firme");