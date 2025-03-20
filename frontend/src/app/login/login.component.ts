import { StatusNaloga } from './../utils/status_naloga';
import { Router } from '@angular/router';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor (private userServis: UserService, private ruter: Router, private snackBar: MatSnackBar) { }

  openSnackBar(tekst : string) {
    this.snackBar.open(tekst, 'Zatvori', {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  ngOnInit(): void {

  }

  kor_ime: string = "";
  lozinka: string = "";
  tipPoljaZaLozinku: string = 'password';

  promeniVidljivostLozinke(): void {
    this.tipPoljaZaLozinku = this.tipPoljaZaLozinku === 'password' ? 'text' : 'password';
  }

  ulogujSe(){
    if(this.kor_ime=='' || this.lozinka==''){
      this.openSnackBar('Morate uneti korisnicko ime i lozinku da biste se ulogovali!')
      return;
    }
    this.userServis.prijavaNaSistem(this.kor_ime, this.lozinka).subscribe((resp: any)=>{
      let korisnik = resp['user'];
      if(!korisnik){
        this.openSnackBar(resp['message']);
      }else{
        if(korisnik.status_naloga == StatusNaloga.Potvrdjen || korisnik.status_naloga == StatusNaloga.Blokiran){
          if(korisnik.tip == "vlasnik" || korisnik.tip=="dekorater"){
            localStorage.setItem("ulogovan", JSON.stringify(korisnik))
            this.ruter.navigate(["/prikaz-profila"]);
          }
          else{
            this.openSnackBar(korisnik.tip);
            if (korisnik.tip == "admin"){
              this.openSnackBar( "Admin se loguje na posebnoj stranici!");
            }else {
              this.openSnackBar("Nepoznat tip korisnika!");
            }
          }
        }else if(korisnik.status_naloga==StatusNaloga.Kreiran){
          this.openSnackBar("Poslat je zahtev za registraciju, ceka se da admin potrvdi!");
        }else if(korisnik.status_naloga == StatusNaloga.Odbijen){
          this.openSnackBar("Odbijen je zahtev za registraciju!");
        }else if(korisnik.status_naloga==StatusNaloga.Deaktiviran){
          this.openSnackBar("Nalog je deaktiviran...:(");
        }
      }
    })
  }
}
