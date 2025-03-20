import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Korisnik } from '../models/user';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-promena-lozinke',
  templateUrl: './promena-lozinke.component.html',
  styleUrls: ['./promena-lozinke.component.css']
})
export class PromenaLozinkeComponent implements OnInit {

  ngOnInit(): void {

    let korisnik = localStorage.getItem("ulogovan");
    if(korisnik != null){
      this.ulogovan = JSON.parse(korisnik);
    }

  }

  constructor(private userServis: UserService, private ruter: Router,private snackBar: MatSnackBar) { }

  openSnackBar(tekst : string) {
    this.snackBar.open(tekst, 'Zatvori', {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  staraLozinka: string =""
  novaLozinka: string = ""
  ponovljenaNova: string= ""
  ulogovan: Korisnik = new Korisnik();

  tipPoljaZaLozinku1: string = 'password';
  tipPoljaZaLozinku2: string = 'password';
  tipPoljaZaLozinku3: string = 'password';

  promeniLozinku(){

    this.userServis.prijavaNaSistem(this.ulogovan.kor_ime, this.staraLozinka).subscribe((resp:any)=>{

      let user = resp['user'];

      if(user == null){
        this.openSnackBar("Netacna stara lozinka!");
        return;

      }else{

        if(this.novaLozinka != this.ponovljenaNova){
          this.openSnackBar("Lozinke se ne poklapaju!");
          return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?\":{}|<>])(?!.*\s).{6,10}$/;

        if(passwordRegex.test(this.novaLozinka)){

          this.userServis.promeniLozinku(this.ulogovan.kor_ime, this.novaLozinka).subscribe((resp:any)=>{

            let user = resp['user'];
            if(user != null){

              this.openSnackBar("Uspesno promenjena lozinka!");

              if(this.ulogovan.tip=='admin'){
                this.ruter.navigate(["login-admin"]);
              }else{
                this.ruter.navigate(["login"]);
              }
            }else{

              this.openSnackBar("Lozinka nije promenjena!")
            }
          })

        }else{
          this.openSnackBar(`Nova lozinka ne zadovoljava sve kriterijume!
            Kriterijumi su:
            - Minimalno 6, maksimalno 10 karaktera
            - Bar jedno veliko slovo
            - Tri mala slova
            - Jedan broj
            - Jedan specijalni karakter
            - Mora počinjati slovom`
          );
        }
      }
    })

  }

  izlogujSe(tip:string){

    localStorage.removeItem('ulogovan');
    if(tip =='admin'){
      this.ruter.navigate(['/login-admin']);
    }else{
      this.ruter.navigate(['/login']); //vracamo se na pocetnu stranicu
    }
  }

}
