import { Component } from '@angular/core';
import {LoaderService} from "./loader.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {

  constructor(public service: LoaderService) {
  }

}
