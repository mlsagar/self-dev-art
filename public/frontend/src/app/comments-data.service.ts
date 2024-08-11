import { Injectable } from '@angular/core';

export interface Comment {
  _id: string;
  name: string;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsDataService {

  constructor() { }
}
