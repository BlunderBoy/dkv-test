import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
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
    templateUrl: './confirmation-dialog.component.html',
    styleUrl: './confirmation-dialog.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
    private readonly dialogRef = inject(MatDialogRef)
    private readonly dialogData = inject<{ title: string, message: string }>(MAT_DIALOG_DATA)
    title = this.dialogData.title;
    message = this.dialogData.message;

    onConfirm() {
        this.dialogRef.close(true);
    }
}
