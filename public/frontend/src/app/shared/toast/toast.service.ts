import { Injectable, setTestabilityGetter } from "@angular/core";
import { Subject } from "rxjs";

export enum MESSAGE_TYPE {
    ERROR = 'error',
    WARNING = 'warning',
    SUCCESS = 'success'
}

export interface Message {
    type: MESSAGE_TYPE,
    message: string
}

@Injectable({
    providedIn: 'root'
})

export class ToastService {
    public toastMessage$ = new Subject<Message | null>();

    constructor() {}

    open(message: Message) {
        this.toastMessage$.next(message);

        setTimeout(() => {
            this.toastMessage$.next(null);
        }, 5000)
    }

    close() {
        this.toastMessage$.next(null);
    }
}