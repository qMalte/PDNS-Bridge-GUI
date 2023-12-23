import { Component } from '@angular/core';
import {EditorService} from "./editor.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Record} from "../../models/PowerDNSModels/Record";
import validator from 'validator';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    FormsModule
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent {

  nameValidationMessage: string = "";
  ttlValidationMessage: string = "";
  contentValidationMessage: string[] = [""];

  types: Type[] = [
    Type.A,
    Type.AAAA,
    Type.CAA,
    Type.CNAME,
    Type.MX,
    Type.PTR,
    Type.SRV,
    Type.TXT,
    Type.TLSA,
    Type.NS,
    Type.SOA
  ];

  get validateOk() {
    return this.nameValidationMessage == "" && this.ttlValidationMessage == "" && this.contentValidationMessage.every(m => m == "") && this.service.record?.type != '' && this.service.record?.name != '';
  };

  get Type() {
    return Type;
  }

  get canAddContent() {
    const emptyRecords = this.service.record?.records?.filter(r => r.content === "");
    if (emptyRecords == null) {
      return false;
    }
    return emptyRecords.length == 0;
  }

  constructor(public service: EditorService) {
    //
  }

  async setType(type: Type) {
    if (this.service.inCreation) {
      this.service.record!.type = type;
      this.service.setDirty()
    }
    await this.validate();
  }

  addContent() {
    this.service.record!.records!.push({
      content: "",
      disabled: false
    });
  }

  contentOnKeyDown(record: Record, event: KeyboardEvent) {
    if (event.key == "Backspace" && record.content == "") {
      const emptyRecords = this.service.record?.records?.filter(r => r.content !== "");
      if (emptyRecords != null) {
        this.service.record!.records = emptyRecords;
      }
    }
  }

  async validate() {

    this.nameValidationMessage = "";
    this.ttlValidationMessage = "";

    this.contentValidationMessage = [];
    this.service.record?.records?.forEach(r => {
      this.contentValidationMessage.push("");
    });

    if (!/^[a-zA-Z0-9\-_\.]+$/.test(this.service.record!.name) && this.service.record!.name != '') {
      this.nameValidationMessage = "Der Name enthält ungültige Zeichen.";
      return;
    }

    if (!validator.isNumeric(this.service.record!.ttl!.toString())) {
      this.ttlValidationMessage = "Time to Live (TTL) muss eine Zahl sein.";
      return;
    }

    let i = 0;
    switch (this.service.record!.type) {
      case Type.A:
        i = 0;
        this.service.record?.records?.forEach(r => {
          if (r.content != '' && !validator.isIP(r.content.toString())) {
            this.contentValidationMessage[i] = "An dieser Stelle muss eine IPv4-Adresse stehen.";
          }
          i++;
        });
        break;
      case Type.AAAA:
        i = 0;
        this.service.record?.records?.forEach(r => {
          if (r.content != '' && !validator.isIP(r.content.toString())) {
            this.contentValidationMessage[i] = "An dieser Stelle muss eine IPv6-Adresse stehen.";
          }
          i++;
        });
        break;
      case Type.CAA:
        break;
      case Type.CNAME:
        break;
      case Type.MX:
        i = 0;
        this.service.record?.records?.forEach(r => {
          const contentArr = r.content.split(" ");
          if (contentArr.length != 2) {
            this.contentValidationMessage[i] = "An dieser Stelle muss ein MX-Eintrag mit Priorität und Ziel stehen. (Format: <Priorität> <Ziel>)";
          }
          const prio = contentArr[0];
          const target = contentArr[1];
          if (r.content != '' && !validator.isNumeric(prio.toString())) {
            this.contentValidationMessage[i] = "Die Priorität muss eine Zahl sein.";
          }
          i++;
        });
        break;
      case Type.PTR:
        break;
      case Type.SRV:
        break;
      case Type.TXT:
        break;
      case Type.TLSA:
        i = 0;
        this.service.record?.records?.forEach(r => {
          const contentArr = r.content.split(" ");
          if (contentArr.length != 4) {
            this.contentValidationMessage[i] = "An dieser Stelle muss ein TLSA-Eintrag stehen. (Format: <Usage> <Selector> <Matching Type> <Certificate>)";
          }
          const usage = contentArr[0];
          const selector = contentArr[1];
          const matchingType = contentArr[2];
          const certificate = contentArr[3];
          if (r.content != '' && !validator.isNumeric(usage.toString())) {
            this.contentValidationMessage[i] = "Usage muss eine Zahl sein.";
          } else if (r.content != '' && !validator.isNumeric(selector.toString())) {
            this.contentValidationMessage[i] = "Selector muss eine Zahl sein.";
          } else if (r.content != '' && !validator.isNumeric(matchingType.toString())) {
            this.contentValidationMessage[i] = "Matching Type muss eine Zahl sein.";
          } else if (r.content != '' && !validator.isBase64(certificate.toString())) {
            this.contentValidationMessage[i] = "Certificate muss Base64-kodiert sein.";
          }
          i++;
        });
        break;
      case Type.NS:
        break;
      case Type.SOA:
    }
  }

}

export enum Type {
  A = "A",
  AAAA = "AAAA",
  CAA = "CAA",
  CNAME = "CNAME",
  MX = "MX",
  PTR = "PTR",
  SRV = "SRV",
  TXT = "TXT",
  TLSA = "TLSA",
  NS = "NS",
  SOA = "SOA"
}
