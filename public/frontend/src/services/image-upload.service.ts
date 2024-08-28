import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { Response } from "../app/reponse";

export interface ImageUrl{
    url: string;
}

@Injectable({
    providedIn: "root"
})

export class ImageUploadService {
    baseUrl = environment.BASE_API_URL;
    routes = environment.ROUTES;
    imageUploadRoute = this.baseUrl + this.routes.UPLOAD + this.routes.IMAGE; 

    constructor(private _http: HttpClient) {}

    uploadSingleImage(request: FormData) {
        return this._http.post<Response<ImageUrl>>(this.imageUploadRoute, request)
    }

}