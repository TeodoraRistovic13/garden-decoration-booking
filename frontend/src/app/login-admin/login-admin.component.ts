import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent implements OnInit {

  ngOnInit(): void {

  }

  constructor (private userServis: UserService, private ruter: Router, private snackBar: MatSnackBar) { }

  kor_ime: string = "";
  lozinka: string = "";
  tipPoljaZaLozinku: string = 'password';

  openSnackBar(tekst : string) {
    this.snackBar.open(tekst, 'Zatvori', {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

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
        this.openSnackBar("Losi podaci!")
      }else{
        if(korisnik.tip == "admin"){
          localStorage.setItem("ulogovan", JSON.stringify(korisnik))
          this.ruter.navigate(["/admin-stranica"]);
        }else{
          this.openSnackBar("Korisnik nije admin!")
        }
      }
    })
  }
}
