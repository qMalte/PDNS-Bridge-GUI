import {Injectable, Output} from "@angular/core";
import {RRSet} from "../../models/PowerDNSModels/RRSet";
import {Zone} from "../../models/PowerDNSModels/Zone";

@Injectable()
export class LoaderService {

  visible = false;

  showLoader() {
    this.visible = true;
  }

  cancelLoader() {
    this.visible = false;
  }

}
