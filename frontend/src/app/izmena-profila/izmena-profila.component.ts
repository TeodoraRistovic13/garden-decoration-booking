import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Korisnik } from '../models/user';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpEventType} from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar';
import { PROFILE_PICTURE_MAX_HEIGHT, PROFILE_PICTURE_MAX_WIDTH, PROFILE_PICTURE_MIN_HEIGHT, PROFILE_PICTURE_MIN_WIDTH } from '../utils/image_dim';

@Component({
  selector: 'app-izmena-profila',
  templateUrl: './izmena-profila.component.html',
  styleUrls: ['./izmena-profila.component.css']
})
export class IzmenaProfilaComponent implements OnInit {

  ngOnInit(): void {
    let korisnik = localStorage.getItem("ulogovan");
    if (korisnik != null){
      this.ulogovan = JSON.parse(korisnik);
      this.novoKorIme = this.ulogovan.kor_ime;
      this.novoIme = this.ulogovan.ime;
      this.novoPrezime = this.ulogovan.prezime;
      this.noviMejl = this.ulogovan.imejl;
      this.novaAdresa = this.ulogovan.adresa;
      this.novBrTel = this.ulogovan.telefon
      this.novBrKartice = this.ulogovan.br_kred_kartice;
      this.tipKartice = this.proveriTipKartice(this.ulogovan.br_kred_kartice);
      this.novaSlika = this.ulogovan.slika;
    }
  }

  constructor(private ruter: Router, private userServis: UserService, private snackBar: MatSnackBar) { }

  ulogovan : Korisnik = new Korisnik ();
  novoKorIme: string = ""
  novoIme: string = ""
  novoPrezime: string = ""
  novaAdresa: string = ""
  novBrTel: string = ""
  noviMejl: string = ""
  novBrKartice: string = ""
  novaSlika: string = ""
  tipKartice : string = ""
  slikaUrl = "http://localhost:4000/uploads/";

  openSnackBar(tekst : string) {
    this.snackBar.open(tekst, 'Zatvori', {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  izlogujSe(){
    localStorage.removeItem("ulogovan");
    this.ruter.navigate(['/login']);
  }

  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  uploadProgress : number | null = null;

  onFileSelected(event:any){
    const file : File = event.target.files[0];
    if(file){
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e: any) => {
        img.src = e.target.result;

        img.onload = () => {
          const width = img.width;
          const height = img.height;

          console.log(`Width: ${width}, Height: ${height}`);

          if (width < PROFILE_PICTURE_MIN_WIDTH || width > PROFILE_PICTURE_MAX_WIDTH ||
            height < PROFILE_PICTURE_MIN_HEIGHT || height > PROFILE_PICTURE_MAX_HEIGHT
          ) {
            this.openSnackBar(`Slika mora biti između ${PROFILE_PICTURE_MIN_WIDTH}x${PROFILE_PICTURE_MIN_HEIGHT} i
              ${PROFILE_PICTURE_MAX_WIDTH}x${PROFILE_PICTURE_MAX_HEIGHT} piksela.`);
            this.resetujFileInput()
            return;
          }

          if (!['image/jpeg', 'image/png'].includes(file.type)) {
            this.openSnackBar("Dozvoljeni su samo JPG i PNG formati.");
            this.resetujFileInput()
            return;
          }
          this.novaSlika = file.name;
        };
        img.onerror = () => {
          this.openSnackBar("Greška pri učitavanju slike. Proverite da li je datoteka ispravna.");
        };
      };
      reader.readAsDataURL(file);
    }

  }

  resetujFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';
  }

  sacuvajSliku(){

    const formData = new FormData();

    const fileInput : HTMLInputElement | null = document.getElementById(
      'fileInput'
    )as HTMLInputElement;

    console.log(fileInput);

    if(fileInput && fileInput.files && fileInput.files.length >0){

      formData.append('file', fileInput.files[0]);

      console.log(formData);

      this.userServis.sacuvajSliku(formData).subscribe((event:any)=>{

        if(event.type == HttpEventType.UploadProgress){

          this.uploadProgress = Math.round((100 * event.loaded/event.total));
        }
        else if(event.type = HttpEventType.Response){
          this.uploadProgress = null;
          console.log('File uploaded successfully: ', event.body);
        }else{
          console.log("Problem")
        }
      })
      console.log("File upload initiated.");
    }
  }

  promeniKorIme(){
    this.userServis.azuirajPodatke(this.ulogovan.kor_ime, "kor_ime", this.novoKorIme).subscribe((resp:any)=>{
      console.log(resp['msg'])
      if(resp['user'] != null){
        let user = resp['user'];
        this.azuirajLocalStorage(user, "kor_ime");
      }
    })
  }

  promeniIme(){
    this.userServis.azuirajPodatke(this.ulogovan.kor_ime, "ime", this.novoIme).subscribe((resp:any)=>{
      console.log(resp['msg'])
      if(resp['user'] != null){
        let user = resp['user'];
        this.azuirajLocalStorage(user, "ime");
      }
    })
  }

  promeniPrezime(){
    this.userServis.azuirajPodatke(this.ulogovan.kor_ime, "prezime", this.novoPrezime).subscribe((resp:any)=>{
      console.log(resp['msg'])
      if(resp['user'] != null){
        let user = resp['user'];
        this.azuirajLocalStorage(user, "prezime");
      }
    })

  }

  promeniAdresu(){
    const addressRegex = /^[\w\s.,'-]+(?:\s\d+)?$/;
    if(!addressRegex.test(this.novaAdresa)){
      this.openSnackBar("Adresa nije  u validnom formatu!")
      return;
    }
    this.userServis.azuirajPodatke(this.ulogovan.kor_ime, "adresa", this.novaAdresa).subscribe((resp:any)=>{
      console.log(resp['msg'])
      if(resp['user'] != null){
        let user = resp['user'];
        this.azuirajLocalStorage(user, "adresa");
      }
    })
  }

  promeniMejl(){
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(this.noviMejl)){
      this.openSnackBar("Mejl nije u validnom formatu!");
      return;
    }
    this.userServis.azuirajPodatke(this.ulogovan.kor_ime, "imejl", this.noviMejl).subscribe((resp:any)=>{
      console.log(resp['msg'])
      if(resp['user'] != null){
        let user = resp['user'];
        this.azuirajLocalStorage(user, "mejl");
      }
    })
  }

  promeniTelefon(){
    this.userServis.azuirajPodatke(this.ulogovan.kor_ime, "telefon", this.novBrTel).subscribe((resp:any)=>{
      console.log(resp['msg'])
      if(resp['user'] != null){
        let user = resp['user'];
        this.azuirajLocalStorage(user, "telefon");
      }
    })
  }

  promeniKarticu() {
    if(this.tipKartice == 'none'){
      this.openSnackBar("Nije validan tip kartice!")
      return;
    }
    this.userServis.azuirajPodatke(this.ulogovan.kor_ime, "br_kred_kartice", this.novBrKartice).subscribe((resp:any)=>{
      console.log(resp['msg'])
      if(resp['user'] != null){
        let user = resp['user'];
        this.azuirajLocalStorage(user, "kartica");
      }
    })
  }

  promeniSliku(){
    this.sacuvajSliku();
    this.userServis.azuirajPodatke(this.ulogovan.kor_ime, "slika", this.novaSlika).subscribe((resp:any)=>{
      console.log(resp['msg'])
      if(resp['user'] != null){
        let user = resp['user'];
        this.azuirajLocalStorage(user, "slika");
      }
    })
  }

  private azuirajLocalStorage(user: Korisnik, podatak: string){
    this.ulogovan = user;
    localStorage.setItem("ulogovan", JSON.stringify(user))
    this.tipKartice = this.proveriTipKartice(this.ulogovan.br_kred_kartice);
    this.openSnackBar(`Promenjen/o ${podatak}`)
  }

  checkCardType(event: any): void {
    const number = event.target.value;
    this.tipKartice = this.proveriTipKartice(number);
  }

  proveriTipKartice(number: string): string {
    if (/^3(00|01|02|03|6|8)\d{12}$/.test(number)) {
      return 'diners';
    } else if (/^5[1-5]\d{14}$/.test(number)) {
      return 'mastercard';
    } else if (/^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/.test(number)) {
      return 'visa';
    } else {
      return 'none';
    }
  }


}
