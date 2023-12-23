import {Component, OnInit} from '@angular/core';
import {environment} from "../app.config";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule, HttpHandler, HttpHeaders} from "@angular/common/http";
import {NgIf} from "@angular/common";
import {ConfigurationService} from "./configuration.service";

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgIf
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent {

  constructor(public service: ConfigurationService) {
    //
  }

}
