import {Injectable} from "@angular/core";
import {Zone} from "../../models/PowerDNSModels/Zone";
import {Cryptokey} from "../../models/PowerDNSModels/Cryptokey";
import {Subject} from "rxjs";
import {KeyService} from "../../services/key.service";
import {LoaderService} from "../loader/loader.service";
import {SecurityQueryService} from "../securityQuery/securityQuery.service";
import {SecurityQueryResult} from "../securityQuery/securityQuery.component";

@Injectable()
export class CryptoKeyService {

  visible: boolean = false;
  zone: Subject<Zone> = new Subject<Zone>();
  zoneUpdated: Subject<void> = new Subject<void>();
  zoneData?: Zone;
  keys: Cryptokey[] = [];

  constructor(private keyService: KeyService, private loader: LoaderService, private securityQuery: SecurityQueryService) {
    this.zone.subscribe(async (zone: Zone) => {
      this.zoneData = zone;
      this.visible = zone != null;
      this.keys = await this.keyService.keysByZone(zone.id);
      console.log(this.keys);
    });
  }

  close() {
    this.visible = false;
  }

  async activate() {

    if (await this.securityQuery.show('Möchten Sie DNSSEC wirklich aktivieren?', true, true, false) !== SecurityQueryResult.Yes) {
      return;
    }

    this.loader.showLoader()
    const key = await this.keyService.createKey(this.zoneData!.id);
    if (key != null) {
      this.zoneUpdated.next();
      this.keys.push(key);
    }
    this.loader.cancelLoader()
  }

  async deleteKeys() {

    const message = "Möchten Sie DNSSEC wirklich deaktivieren? Stellen Sie sicher, dass die Keys auch bei der Registry entfernt werden, ansonsten werden zukünftige DNS-Abfragen fehlschlagen.";
    if (await this.securityQuery.show(message, true, true, false) !== SecurityQueryResult.Yes) {
      return;
    }

    this.loader.showLoader()
    const result = await this.keyService.deleteKey(this.zoneData!.id);
    if (result) {
      this.zoneUpdated.next();
      this.keys = await this.keyService.keysByZone(this.zoneData!.id);
    }
    this.loader.cancelLoader()
  }

}
