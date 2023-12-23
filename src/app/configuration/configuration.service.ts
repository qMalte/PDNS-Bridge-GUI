import {Injectable, Output} from "@angular/core";
import {RRSet} from "../../models/PowerDNSModels/RRSet";
import {Zone} from "../../models/PowerDNSModels/Zone";
import {Subject} from "rxjs";

@Injectable()
export class ConfigurationService {

  visible = false;

  apiKey = localStorage.getItem('X-API-Key');

  constructor() {
    if (this.apiKey == null) {
      this.visible = true;
      console.log(this.visible);
    }
  }

  saveApiKey() {
    if (this.apiKey != null) {
      localStorage.setItem('X-API-Key', this.apiKey);
      this.visible = false;
      window.location.reload();
    }
  }

}
