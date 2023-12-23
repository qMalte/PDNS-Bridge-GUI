import { Component } from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {CryptoKeyService} from "./cryptoKey.service";

@Component({
  selector: 'app-cryptoKeys',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    FormsModule
  ],
  templateUrl: './cryptoKey.component.html',
  styleUrl: './cryptoKey.component.scss'
})
export class CryptoKeyComponent {

  constructor(public service: CryptoKeyService) {
    //
  }

}
