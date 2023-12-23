import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../app/app.config";
import {Zone} from "../models/PowerDNSModels/Zone";
import {Cryptokey} from "../models/PowerDNSModels/Cryptokey";

@Injectable()
export class KeyService {

  get apiURL(): string {
    return environment.apiUrl;
  }

  httpOptions = {
    headers: new HttpHeaders({
      Authorization: this.apiKey
    })
  };

  get apiKey(): string {
    const apiUrl = localStorage.getItem('X-API-Key');
    if (apiUrl == null) {
      throw new Error('No API key set.');
    }
    return apiUrl;
  }

  constructor(private http: HttpClient) {
    //
  }

  keysByZone(zoneId: string) {
    return new Promise<Cryptokey[]>(resolve => {
      this.http
        .get<Cryptokey[]>(`${this.apiURL}/zone/${zoneId}/keys`, this.httpOptions)
        .subscribe((result) => {
          resolve(result);
        }).add(() => {
        resolve([]);
      });
    });
  }

  createKey(id: string) {
    return new Promise<Cryptokey|null>(resolve => {
      this.http
        .post<Cryptokey>(`${this.apiURL}/zone/key`, {id}, this.httpOptions)
        .subscribe((result) => {
          resolve(result);
        }).add(() => {
        resolve(null);
      });
    });
  }

  deleteKey(zoneId: string) {
    return new Promise<boolean>(resolve => {
      this.http
        .delete<boolean>(`${this.apiURL}/zone/${zoneId}/keys`, this.httpOptions)
        .subscribe((result) => {
          resolve(true);
        }).add(() => {
        resolve(false);
      });
    });
  }

}
