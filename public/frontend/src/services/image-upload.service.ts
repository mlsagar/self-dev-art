import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: "root"
})

export class ImageUploadService {
    baseUrl = environment.BASE_URL;
    routes = environment.ROUTES;
    imageUploadRoute = this.baseUrl + this.routes.UPLOAD + this.routes.IMAGE; 

    constructor(private _http: HttpClient) {}

    uploadSingleImage(request: FormData) {
        this._http.post(this.imageUploadRoute, request)
    }

}