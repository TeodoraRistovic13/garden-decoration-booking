import { Usluga } from "./usluga";

export class Firma {
  id : number = 0;
  naziv: string = ""
  adresa: string = ""
  prosecna_ocena: number = 0
  telefon: string = ""
  usluge : Usluga[] = []
  datum_pocetka_godisnjeg : Date = new Date();
  datum_kraja_godisnjeg : Date = new Date();
  radno_vreme_od : string = ""
  radno_vreme_do : string = ""
}
