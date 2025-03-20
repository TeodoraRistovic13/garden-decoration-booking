import { Recenzija } from "./recenzija";
import { Usluga } from "./usluga";

export class Zakazivanje {
  id: number = 0;
  kor_ime_vlasnika : string = ""
  firma_naziv : string = ""
  kor_ime_dekoratera : string = ""
  datum_zakazivanja : Date = new Date();
  datum_izrade : Date = new Date();
  datum_zavrsetka : Date = new Date();
  datum_odrzavanja : Date = new Date();
  uk_povrsina : number = 0;
  tip_baste : string = "";
  naziv_restorana : string = ""
  adresa_restorana : string = ""
  uk_bazen: number = 0;
  uk_namestaj: number = 0;
  uk_fontana : number = 0;
  br_stolova : number = 0;
  br_stolica : number = 0;
  uk_zelenilo: number = 0;
  kratak_opis : string = "";
  usluge : Usluga[] = [];
  recenzija : Recenzija = new Recenzija();
  status : string =""; // kreirano, prihvaceno, odbijeno, otkazano, zavrseno
  slika : string = "";
  odrzavanoBarJednom : boolean = false;
  raspored_baste : any[] = [];
  unosKomentaraKodOdbijanja : boolean = false;
  broj_vodenih_povrsina : number = 0;
  komentar_odbijenica : string = ""
  date_time_input : string = ''
  img_input : string = ''
}
