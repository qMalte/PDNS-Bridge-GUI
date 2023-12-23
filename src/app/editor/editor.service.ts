import {Injectable, Output} from "@angular/core";
import {RRSet} from "../../models/PowerDNSModels/RRSet";
import {Zone} from "../../models/PowerDNSModels/Zone";
import {Subject} from "rxjs";

@Injectable()
export class EditorService {

  canceled: Subject<void> = new Subject<void>();

  isDirty: boolean = false;
  inCreation: boolean = false;
  zone?: Zone;
  record?: RRSet;

  setDirty() {
    this.isDirty = true;
    this.record!.changetype = "REPLACE";
  }

  close() {
    if (!this.record?.name.endsWith(this.zone!.id)) {
      this.record!.name = `${this.record!.name}.${this.zone!.id}`;
    }
    this.record = undefined;
  }

  cancel() {
    if (this.inCreation) {
      this.zone?.rrsets?.splice(this.zone.rrsets.indexOf(this.record!), 1);
    } else {
      this.canceled.next();
    }
    this.record = undefined;

  }

}
