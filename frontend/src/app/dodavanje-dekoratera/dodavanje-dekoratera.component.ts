import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Korisnik } from '../models/user';
import { StatusNaloga } from '../utils/status_naloga';
import { UserService } from '../services/user.service';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { TipKorisnika } from '../utils/tipoviKorisnika';
import {MatSnackBar} from '@angular/material/snack-bar';
import { PROFILE_PICTURE_MAX_HEIGHT, PROFILE_PICTURE_MAX_WIDTH, PROFILE_PICTURE_MIN_HEIGHT, PROFILE_PICTURE_MIN_WIDTH } from '../utils/image_dim';

@Component({
  selector: 'app-dodavanje-dekoratera',
  templateUrl: './dodavanje-dekoratera.component.html',
  styleUrls: ['./dodavanje-dekoratera.component.css']
})
export class DodavanjeDekorateraComponent implements OnInit {

  ngOnInit(): void {

  }

  constructor (private userServis: UserService, private ruter: Router, private snackBar: MatSnackBar) { }

  korisnik : Korisnik = new Korisnik();
  tipPoljaZaLozinku : string = 'password';

  slikaUrl = "http://localhost:4000/uploads/";

  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  uploadProgress : number | null = null;

  openSnackBar(tekst : string) {
    this.snackBar.open(tekst, 'Zatvori', {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

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
            ){
            this.openSnackBar(`Slika mora biti između ${PROFILE_PICTURE_MIN_WIDTH}x${PROFILE_PICTURE_MIN_HEIGHT} i
              ${PROFILE_PICTURE_MAX_WIDTH}x${PROFILE_PICTURE_MAX_HEIGHT} piksela.`);
            this.resetujFileInput()
            this.korisnik.slika ='';
            return;
          }

          if (!['image/jpeg', 'image/png'].includes(file.type)) {
            this.openSnackBar("Dozvoljeni su samo JPG i PNG formati.");
            this.resetujFileInput()
            this.korisnik.slika = '';
            return;
          }
          this.korisnik.slika = file.name;
        };
        img.onerror = () => {
          this.openSnackBar("Greška pri učitavanju slike. Proverite da li je datoteka ispravna.");
        };
      };

      reader.readAsDataURL(file); //cita fajl da bi saznao sirinu/visinu
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


  proveraLozinke(lozinka: string) : boolean {

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?\":{}|<>])(?!.*\s).{6,10}$/;
    return passwordRegex.test(lozinka);
  }

  proveraAdrese(adresa: string){

    const addressRegex = /^[\w\s.,'-]+(?:\s\d+)?$/;
    return addressRegex.test(adresa);

  }

  proveraImejl(imejl: string){

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(imejl);
  }

  potvrdi(){

    if(!this.proveraLozinke(this.korisnik.lozinka)){
      //koristi ` da bi napravila viselinijski string
      this.openSnackBar(`Lozinka ne zadovoljava sve kriterijume!
        Kriterijumi su:
        - Minimalno 6, maksimalno 10 karaktera
        - Bar jedno veliko slovo
        - Tri mala slova
        - Jedan broj
        - Jedan specijalni karakter
        - Mora počinjati slovom`);
      return;
    }

    if(this.cardType == 'none'){
      this.openSnackBar('Nije validan tip kartice!')
      return;
    }

    if(!this.proveraAdrese(this.korisnik.adresa)){
      this.openSnackBar('Nije validan format adrese!')
      return;
    }

    if(!this.proveraImejl(this.korisnik.imejl)){
      this.openSnackBar('Nije validan format imejl adrese!')
      return;
    }

    this.userServis.dohvatiSveKorisnike().subscribe(users=>{

      if(users.length != 0){
        let user1 = users.filter(user=> user.kor_ime == this.korisnik.kor_ime);
        if(user1.length != 0){
          this.openSnackBar("Postoji korisnik sa datim korisnickim imenom u bazi.");
        }else{
          let user2 = users.filter(user=> user.imejl == this.korisnik.imejl);
          if(user2.length != 0){
            this.openSnackBar("Postoji korisnik sa datom imejl adresom u bazi!");
          }else{
            this.korisnik.tip=TipKorisnika.Dekorater;
            this.sacuvajSliku();
            this.korisnik.status_naloga = StatusNaloga.Potvrdjen;
            this.userServis.dodajKorisnika(this.korisnik).subscribe((resp: any)=>{

              if(resp['message']){
                console.log(resp['message']);
                this.openSnackBar('Dodat je novi dekorater!');
              }

            })
          }
        }
      }
    })


  }

  cardType: string | null = null;

  checkCardType(event: any): void {
    const number = event.target.value;

    if (/^3(00|01|02|03)\d{12}$/.test(number) || /^3(6|8)\d{13}$/.test(number)) {
      this.cardType = 'diners';
    } else if (/^5[1-5]\d{14}$/.test(number)) {
      this.cardType = 'mastercard';
    } else if (/^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/.test(number)) {
      this.cardType = 'visa';
    } else {
      this.cardType = 'none';
    }
  }

  izlogujSe(){
    localStorage.removeItem('ulogovan');
    this.ruter.navigate(['/login-admin']);
  }

  proveraSvaPoljaPopunjena(){

    const obaveznaPolja: (keyof Korisnik)[] = ['kor_ime', 'lozinka', 'ime', 'prezime', 'pol', 'adresa', 'telefon', 'imejl', 'br_kred_kartice'];
    const svaPoljaPopunjena = obaveznaPolja.every(key => {
      const value = this.korisnik[key];
      return value && value.toString().trim().length > 0;
    });
    if (svaPoljaPopunjena) {
      return true;
    }
    return false;
  }





}
