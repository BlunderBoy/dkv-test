import {Component, computed, inject} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatDialogClose
    ],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.css',
})
export class ConfirmationDialog {
    dialogRef = inject(MatDialogRef)
    dialogData = inject(MAT_DIALOG_DATA)
    title = computed(() => this.dialogData.title)
    message = computed(() => this.dialogData.message)

    onConfirm() {
        this.dialogRef.close(true);
    }
}
