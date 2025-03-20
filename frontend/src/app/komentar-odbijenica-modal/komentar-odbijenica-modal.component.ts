import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-komentar-odbijenica-modal',
  templateUrl: './komentar-odbijenica-modal.component.html',
  styleUrls: ['./komentar-odbijenica-modal.component.css']
})
export class KomentarOdbijenicaModalComponent {

  constructor(
    public dialogRef: MatDialogRef<KomentarOdbijenicaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {komentar: string},
  ) {}

  maksDuzina : number = 100;

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.data);
  }

  isKomentarValid() {
    return this.data.komentar.length <= this.maksDuzina && this.data.komentar.length > 0;
  }

}
