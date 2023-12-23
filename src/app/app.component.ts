import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {ConfigurationComponent} from "./configuration/configuration.component";
import {HttpClientModule} from "@angular/common/http";
import {ZoneService} from "../services/zone.service";
import {EditorComponent} from "./editor/editor.component";
import {EditorService} from "./editor/editor.service";
import {LoaderService} from "./loader/loader.service";
import {LoaderComponent} from "./loader/loader.component";
import {SecurityQueryComponent} from "./securityQuery/securityQuery.component";
import {SecurityQueryService} from "./securityQuery/securityQuery.service";
import {KeyService} from "../services/key.service";
import {CryptoKeyService} from "./cryptoKeys/cryptoKey.service";
import {CryptoKeyComponent} from "./cryptoKeys/cryptoKey.component";
import {StatsService} from "../services/stats.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ConfigurationComponent,
    HttpClientModule,
    EditorComponent,
    RouterLink,
    LoaderComponent,
    SecurityQueryComponent,
    CryptoKeyComponent
  ],
  providers: [
    ZoneService,
    EditorService,
    LoaderService,
    SecurityQueryService,
    KeyService,
    CryptoKeyService,
    StatsService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'powerdns-admin-app';

  constructor() {
    //
  }

}
