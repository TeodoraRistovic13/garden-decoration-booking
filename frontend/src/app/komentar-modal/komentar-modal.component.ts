import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-komentar-modal',
  templateUrl: './komentar-modal.component.html',
  styleUrls: ['./komentar-modal.component.css']
})
export class KomentarModalComponent {

  constructor(
    public dialogRef: MatDialogRef<KomentarModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {komentar: string, ocena : number},
  ) {}

  stars: number[] = [1, 2, 3, 4, 5];
  maksDuzina : number = 40;

  rate(star: number) {
    this.data.ocena = star;
  }

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
