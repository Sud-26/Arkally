import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pie-details',
  templateUrl: './pie-details.component.html',
  styleUrls: ['./pie-details.component.scss']
})
export class PieDetailsComponent implements OnInit {

  constructor() { }

    public pieChartLabels:string[] = ['Gari', 'Tester1', 'User1','User2','Other'];
    public pieChartData:number[] = [40, 20, 20 , 10,10];
    // public colors= ['Red', 'Blue', 'Purple', 'Yellow' , 'Pink']
    public pieChartType:string = 'pie';
   
    // events
    public chartClicked(e:any):void {
      // console.log(e);
    }
   
    public chartHovered(e:any):void {
      // console.log(e);
    }
  ngOnInit() {
  }


 
}
