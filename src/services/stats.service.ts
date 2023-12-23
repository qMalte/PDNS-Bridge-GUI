import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../app/app.config";
import {Zone} from "../models/PowerDNSModels/Zone";
import {Cryptokey} from "../models/PowerDNSModels/Cryptokey";
import {StatisticItem} from "../models/PowerDNSModels/Statistic";

@Injectable()
export class StatsService {

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
      console.error('No API key set.');
      return '';
    }
    return apiUrl;
  }

  constructor(private http: HttpClient) {
    //
  }

  getStats() {
    return new Promise<StatisticItem[]>(resolve => {
      this.http
        .get<StatisticItem[]>(`${this.apiURL}/stats`, this.httpOptions)
        .subscribe((result) => {
          resolve(result);
        }).add(() => {
        resolve([]);
      });
    });
  }

}
