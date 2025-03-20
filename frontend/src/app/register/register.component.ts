import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { HttpClient, HttpEventType} from '@angular/common/http'
import { Korisnik } from '../models/user';
import { StatusNaloga } from '../utils/status_naloga';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  ngOnInit(): void {
    this.rechaptchaSuccess = false;

  }

  constructor (private userServis: UserService, private http: HttpClient,private snackBar: MatSnackBar, private formBuilder: FormBuilder) { }

  openSnackBar(tekst : string) {
    this.snackBar.open(tekst, 'Zatvori', {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  korisnik : Korisnik = new Korisnik();
  tipPoljaZaLozinku : string = 'password';

  slikaUrl = "http://localhost:4000/uploads/";

  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  uploadProgress : number | null = null;
  rechaptchaSuccess : boolean = false;

  protected aFormGroup: FormGroup =  this.formBuilder.group({
    recaptcha: ['', Validators.required]
  });;


  siteKey:string = "6Lc9JTQqAAAAANRLm4V1yoL16TegCEV_qohMOa5A"

  handleSuccess(token: string) {
    console.log('reCAPTCHA token:', token);
    this.verifyRecaptcha(token);
  }

  verifyRecaptcha(token: string) {

    this.userServis.posaljiZahtevZaValidacijuRecaptcha(token).subscribe((response: any) => {
      if (response.success) {
        this.openSnackBar('reCAPTCHA verifikacija uspešna!');
        this.rechaptchaSuccess = true;
      } else {
        this.openSnackBar('reCAPTCHA verifikacija nije uspela!');
        this.rechaptchaSuccess = false;
      }
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

          // Proveri veličinu slike
          if (width < 100 || width > 300 || height < 100 || height > 300) {
            this.openSnackBar("Slika mora biti između 100x100 i 300x300 piksela.");
            this.korisnik.slika = "";
            this.resetujFileInput()
            return;
          }

          // Proveri format slike (file type)
          if (!['image/jpeg', 'image/png'].includes(file.type)) {
            this.openSnackBar("Dozvoljeni su samo JPG i PNG formati.");
            this.korisnik.slika = "";
            this.resetujFileInput()
            return;
          }

          // Ako su sve provere prošle, možeš nastaviti sa upload-om
          this.korisnik.slika = file.name;
        };

        img.onerror = () => {
          this.openSnackBar("Greška pri učitavanju slike. Proverite da li je datoteka ispravna.");
        };
      };

      reader.readAsDataURL(file); //cita fajl da bi saznao sirinu/visinu
    }

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
          console.log("Problem sa uploadovanjem slike!  :(")
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

  posaljiZahtevZaRegistraciju(){

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
    if(this.cardType == null){
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

            this.korisnik.tip="vlasnik";
            this.sacuvajSliku();
            this.korisnik.status_naloga = StatusNaloga.Kreiran;
            this.userServis.dodajKorisnika(this.korisnik).subscribe((resp: any)=>{

              if(resp['message']){
                console.log(resp['message']);
                this.openSnackBar('Poslat zahtev za registraciju!');
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
      this.cardType = null;
    }
  }

  resetujFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';
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
