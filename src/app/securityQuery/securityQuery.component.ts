import {Component, Input, OnInit} from '@angular/core';
import {SecurityQueryService} from './securityQuery.service';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-security-query',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    FormsModule
  ],
  templateUrl: './securityQuery.component.html',
  styleUrl: './securityQuery.component.scss'
})
export class SecurityQueryComponent {

  constructor(public service: SecurityQueryService) {
  }

  // tslint:disable-next-line:typedef
  get result() {
    return SecurityQueryResult;
  }

}

export enum SecurityQueryResult {
  Yes,
  No,
  Cancel
}
