import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../app/app.config";
import {Zone} from "../models/PowerDNSModels/Zone";

@Injectable()
export class ZoneService {

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

  zone(id: string) {
    return new Promise<Zone|null>(resolve => {
      this.http
        .get<Zone>(`${this.apiURL}/zone/${id}`, this.httpOptions)
        .subscribe((result) => {
          resolve(result);
        }).add(() => {
        resolve(null);
      });
    });
  }

  zones() {
    return new Promise<Zone[]>(resolve => {
      this.http
        .get<Zone[]>(`${this.apiURL}/zones`, this.httpOptions)
        .subscribe((result) => {
          resolve(result);
        }).add(() => {
        resolve([]);
      });
    });
  }

  createZone(zone: Zone) {
    return new Promise<boolean>(resolve => {
      this.http
        .post(`${this.apiURL}/zone`, zone, this.httpOptions)
        .subscribe((result) => {
          resolve(true);
        }).add(() => {
        resolve(false);
      });
    });
  }

  patchZone(zone: Zone) {
    return new Promise<boolean>(resolve => {
      this.http
        .put(`${this.apiURL}/zone`, zone, this.httpOptions)
        .subscribe((result) => {
          resolve(true);
        }).add(() => {
        resolve(false);
      });
    });
  }

  deleteZone(id: string) {
    return new Promise<boolean>(resolve => {
      this.http
        .delete(`${this.apiURL}/zone/${id}`, this.httpOptions)
        .subscribe((result) => {
          resolve(true);
        }).add(() => {
        resolve(false);
      });
    });
  }

}
