import {Component, OnInit} from '@angular/core';
import {environment} from "../app.config";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule, HttpHandler, HttpHeaders} from "@angular/common/http";
import {NgIf} from "@angular/common";

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
export class ConfigurationComponent implements OnInit {

  visible = false;

  apiKey = localStorage.getItem('X-API-Key');

  constructor(private http: HttpClient) {
    //
  }

  ngOnInit() {
    if (this.apiKey == null) {
      this.visible = true;
    }
  }

  saveApiKey() {
    if (this.apiKey != null) {
      localStorage.setItem('X-API-Key', this.apiKey);
      this.visible = false;
    }
  }

}
