import {inject, Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private readonly snackbar = inject(MatSnackBar);
    private readonly MESSAGE_DURATION = 3000;
    private readonly ACTION = "Close";

    public error(message: string, duration = this.MESSAGE_DURATION) {
        this.snackbar.open(message, this.ACTION, {
            duration: duration,
            panelClass: ['toast-error'],
        });
    }

    public message(message: string, duration = this.MESSAGE_DURATION) {
        this.snackbar.open(message, this.ACTION, {
            duration: duration,
            panelClass: ['toast-info'],
        });
    }
}
