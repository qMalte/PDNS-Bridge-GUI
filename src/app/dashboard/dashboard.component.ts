import {Component, OnInit} from '@angular/core';
import {StatsService} from "../../services/stats.service";
import {StatisticItem} from "../../models/PowerDNSModels/Statistic";
import {NgForOf, NgIf} from "@angular/common";
import {LoaderService} from "../loader/loader.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  stats: StatisticItem[] = [];

  constructor(public statsService: StatsService, private loader: LoaderService) {
    //
  }

  async ngOnInit() {
    this.loader.showLoader();
    this.stats = (await this.statsService.getStats()).filter((stat) => stat.type === "StatisticItem");
    this.loader.cancelLoader()
  }

  protected readonly NaN = NaN;
}
