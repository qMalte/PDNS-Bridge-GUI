import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Zone} from "../../models/PowerDNSModels/Zone";
import {ZoneService} from "../../services/zone.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RRSet} from "../../models/PowerDNSModels/RRSet";
import {EditorService} from "../editor/editor.service";
import {EditorComponent} from "../editor/editor.component";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {LoaderService} from "../loader/loader.service";
import {FormsModule} from "@angular/forms";
import {SecurityQueryService} from "../securityQuery/securityQuery.service";
import {SecurityQueryResult} from "../securityQuery/securityQuery.component";
import {KeyService} from "../../services/key.service";
import {CryptoKeyService} from "../cryptoKeys/cryptoKey.service";

@Component({
  selector: 'app-domains',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    EditorComponent,
    NgClass,
    RouterLink,
    FormsModule
  ],
  templateUrl: './domains.component.html',
  styleUrl: './domains.component.scss'
})
export class DomainsComponent implements AfterViewInit {

  selectedZone?: Zone;
  cryptoKeys: CryptoKey[] = [];
  zones: Zone[] = [];
  maxLength = 32;
  newDomainName = '';
  init = false;

  private sub: any;

  constructor(private zoneService: ZoneService, public editor: EditorService,
              private route: ActivatedRoute, private loader: LoaderService,
              private securityQuery: SecurityQueryService,
              private router: Router, private keyService: CryptoKeyService) {
    this.keyService.zoneUpdated.subscribe(async () => {
      await this.ngAfterViewInit();
    });
    this.editor.canceled.subscribe(async () => {
      await this.ngAfterViewInit();
    });
  }

  async ngAfterViewInit() {
    this.loader.showLoader();
    this.sub = this.route.params.subscribe(async (params) => {
      const id = params['id'];
      if (id != null) {
        const zone = await this.zoneService.zone(id.replace('_', '.'));
        if (zone != null) {
          this.selectedZone = zone;
          this.editor.zone = this.selectedZone;
        }
      } else {
        this.zones = await this.zoneService.zones();
      }
    });
    this.init = true;
    this.loader.cancelLoader();
  }

  async selectZone(z: Zone) {
    const zone = await this.zoneService.zone(z.id.replace('_', '.'));
    if (zone != null) {
      this.selectedZone = zone;
      this.editor.zone = this.selectedZone;
    }
  }

  getShortName(record: RRSet) {
    let name = record.name.replace(`.${this.selectedZone?.name}`, '');
    if (name === record.name) {
      name = '@';
    }
    if (name.length > this.maxLength) {
      name = `${name.substring(0, this.maxLength)}...`;
    }
    return name;
  }

  getRecords(): RRSet[] {
    const records = this.selectedZone?.rrsets?.sort((a, b) => {
      if (a.type > b.type) {
        return 1;
      } else if (a.type < b.type) {
        return -1;
      } else {
        return 0;
      }
    });
    if (records === undefined) {
      return [];
    } else {
      return records;
    }
  }

  getContentList(record: RRSet): string[] {
    const contentList: string[] = [];
    record.records?.forEach(r => {
      if (r.content) {
        if (r.content.length > this.maxLength) {
          contentList.push(`${r.content.substring(0, this.maxLength)}...`);
        } else {
          contentList.push(r.content);
        }
      }
    });
    return contentList;
  }

  editRecord(record: RRSet) {
    this.editor.inCreation = false;
    this.editor.zone = this.selectedZone;
    this.editor.record = record;
  }

  getNameForUrl(zone: Zone) {
    const name = zone.name.replace('.', '_');
    if (name.endsWith('.')) {
      return name.slice(0, -1);
    }
    return name;
  }

  getBeautifiedName(name: string) {
    if (name.endsWith('.')) {
      name = name.slice(0, -1);
    }
    return name;
  }

  async save() {
    this.loader.showLoader();
    this.selectedZone?.rrsets?.map(r => {
      if (r.changetype === undefined) {
        r.changetype = 'REPLACE';
      }
    })
    const result = await this.zoneService.patchZone(this.selectedZone!);
    if (result) {
      this.editor.isDirty = false;
      await this.ngAfterViewInit();
    }
    this.loader.cancelLoader();
  }

  async createZone() {
    this.loader.showLoader();
    if (!this.newDomainName.endsWith('.')) {
      this.newDomainName += '.';
    }
    const zone: Zone = {
      id: this.newDomainName,
      name: this.newDomainName,
      type: '',
      url: '',
      kind: "Master",
      rrsets: [],
      serial: 0,
      notified_serial: 0,
      edited_serial: 0,
      masters: [],
      dnssec: false,
      nsec3param: '',
      nsec3narrow: false,
      presigned: false,
      soa_edit: '',
      soa_edit_api: '',
      api_rectify: false,
      zone: '',
      catalog: '',
      account: '',
      nameservers: [],
      master_tsig_key_ids: [],
      slave_tsig_key_ids: []
    }
    if (await this.zoneService.createZone(zone)) {
      await this.ngAfterViewInit();
      this.newDomainName = '';
    }
    this.loader.cancelLoader();
  }

  initCreationRRSet() {
    this.editor.zone = this.selectedZone;
    this.editor.inCreation = true;
    const record: RRSet = {
      name: '',
      type: '',
      changetype: 'REPLACE',
      ttl: 3600,
      records: [{
        content: '',
        disabled: false
      }]
    };
    this.editor.record = record;
    this.selectedZone?.rrsets?.push(record);
  }

  async deleteZone() {
    const message = `Möchten Sie die Zone <b>${this.selectedZone?.name}</b> wirklich löschen?<br>Dieser Vorgang kann nicht rückgängig gemacht werden!`;
    if (await this.securityQuery.show(message, true, true, false) == SecurityQueryResult.Yes) {
      this.loader.showLoader();
      if (await this.zoneService.deleteZone(this.selectedZone!.id)) {
        await this.router.navigate(['/domains']);
      }
      this.loader.cancelLoader();
    }
  }

  markRecordAsDeleted(record: RRSet) {
    record.changetype = 'DELETE';
    this.editor.isDirty = true;
  }

  unmarkRecordAsDeleted(record: RRSet) {
    record.changetype = undefined;
    this.editor.isDirty = true;
  }

  openCryptoKeys() {
    this.keyService.zone.next(this.selectedZone!);
  }

}
