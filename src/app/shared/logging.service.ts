import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() { }

  log(assigmentName: string, action: string) {
    console.log("Assignment " + assigmentName + " " + action);
  }
}
