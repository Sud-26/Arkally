import { Component, OnInit } from "@angular/core";
import { RestClientService } from "../../../service/rest-client/rest-client.service";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { SelectionType } from "@swimlane/ngx-datatable";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "projects/admin/src/environments/environment";
import { Options } from "@angular-slider/ngx-slider";
import { NotifyService } from "../../../service/notify/notify.service";

const DROPDOWN_PATHS = environment.api.path.dropdown;
@Component({
  selector: "app-speed-details",
  templateUrl: "./speed-details.component.html",
  styleUrls: ["./speed-details.component.scss"],
})
export class SpeedDetailsComponent implements OnInit {
  constructor(
    private restClientService: RestClientService,
    private translateService: TranslateService,
    protected router: Router,
    private datePipe: DatePipe,
    private notifyService: NotifyService
  ) {}

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  public barChartLabels = [];
  public barChartType = "bar";
  public barChartLegend = true;
  // public barChartData = [];
  public barChartData = [
    { data: [], label: "Gari" },
    // {data: [20, 38, 30, 9, 76, 17, 80], label: 'Yamaha'},
    // {data: [10, 48, 40, 19, 86, 27, 90], label: 'Yamaha2'}
  ];

  // pageRequest: PageRequest = new PageRequest(1, 500);

  // events

  ngOnInit() {
    // http://arkally.com/api/nvl_report?page=1&size=500&traceable_object_id=36&user_id=1&date_from=2020-01-10T13:38:23.000+0530&date_to=2021-05-10T13:38:42.068+0530
    this.restClientService
      .get(
        environment.api.path.report,
        `?page=1&size=500&traceable_object_id=36&user_id=1&date_from=2020-01-10T13:38:23.000+0530&date_to=2021-05-10T13:38:42.068+0530`
      )
      .subscribe((response) => {
        let content = response.data.content;
        // console.log(content)
        this.barChartLabels = [
          "0-10 mph",
          "10-20 mph",
          "20-25 mph",
          "25-30 mph",
          "30-40 mph",
          "40-50 mph",
        ]
        content.map((item) =>
          item.meta_information.speed != undefined &&
          item.meta_information.speed != 0
            ? this.barChartData[0]["data"].push(Number(item.meta_information.speed))
            : ""
        );

        // console.log(this.barChartData,'datat')
        // this.loader = false;
      });
  }
}
