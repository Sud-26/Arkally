import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { Page, PageRequest } from '../../model/page.model';

import { Router } from '@angular/router';
import { SelectionType } from '@swimlane/ngx-datatable';


const ROW_SIZE = 60;

@Component({
  selector: 'nvl-overview-table',
  templateUrl: './overview-table.component.html',
  styleUrls: ['./overview-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class OverviewTableComponent<T> implements OnInit {

  // rentTime:any;
  // spentTime: any;
  constructor(  protected router: Router ) {
    // this.rentTime = "00: 00";
    // this.spentTime = "00: 00";
  }
  @ViewChild('table', { static: false }) table: any;

  expanded: any = {};
  rowHeight: number;
  rentStatModal:boolean = false;

  @Input()
  rentTime:any;
  
  @Input()
  spentTime;
 

  @Input()
  deleteEnabled = true;

  @Input()
  editEnabled = true;

  @Input()
  columns: [];

  @Input()
  rows: [];

  @Input()
  alarmIcons = false;
  
  @Input()
  slotCounts = false;

  @Input()
  loader: false;

  @Input()
  page: Page<T>;

  @Input()
  pageRequest: PageRequest;

  availablePageSizeList = [5, 10, 20, 30, 40, 50];

  @Output()
  changePage = new EventEmitter<number>();

  @Output()
  changePageSize = new EventEmitter<number>();

  @Output()
  deleteEntity = new EventEmitter<number>();

  @Output()
  navigateToEdit = new EventEmitter<number>();

  @Output()
  actionListAction = new EventEmitter<any>();

  @Output()
  selectRow = new EventEmitter<any>();

  @Input()
  selectionType: SelectionType = null;

  @Output()
  aClickedEvent = new EventEmitter<any>();

  @Output()
  stateClickedEvent = new EventEmitter<any>();

  @Output()
  clearTimerEvent = new EventEmitter<any>();


  @Output()
  timeSlotEvent = new EventEmitter<any>();

  @Output()
  actionDialog = new EventEmitter<any>();

  @Output()
  countClick = new EventEmitter<any>();

  selected = [];

  parseDate: boolean = true;
  vehicelTimeSlot:boolean = false;
  alarmTimerMobView: boolean = false;
  actionList: boolean = false;
  actionDialogStatus: boolean = false;


  executeAction(row, action) {
    this.actionListAction.emit({ row, action });
  }

  

  ngOnInit() {

    this.rowHeight = (this.columns.length + 1) * ROW_SIZE;

    if(this.router.url === '/alarm-list'){
      this.alarmIcons = true;
      this.deleteEnabled = false;
      this.editEnabled = false;
      this.alarmTimerMobView = true;
      this.actionDialogStatus = false;
    }
    if(this.router.url === '/vehicles'){
      this.vehicelTimeSlot  = true;
    }
    if(this.router.url === '/modules'){
      this.actionDialogStatus = true;
    }
    if(this.router.url === '/rent' || this.router.url === '/rent-stats'){
      this.editEnabled = false;
      this.deleteEnabled = false;
      if(this.router.url === '/rent-stats'){
          this.slotCounts = true;
      }
    }

    
    
  }
  onCountClick(row, value){
    this.countClick.emit({row, value});
    this.rentStatModal = true;
  }

  onAlarmTime(msg, event, id){
    let btn = event.target.parentElement,
    btnGroup = btn.parentElement.children;
    
    for(let chilItems of btnGroup){
          chilItems.classList.remove('active');
    } 
    btn.classList.add('active');
       
    this.aClickedEvent.emit({msg, id})
  }


  timerState(id, event){
    // console.log(id, 'dfsd')
    this.stateClickedEvent.emit({id, event})
 
  }

  clearTimerById(time, id, state){ 

    this.clearTimerEvent.emit({time, id, state})
  }

  openTimeSlotDialog(id, slots){
     this.timeSlotEvent.emit({id, slots});
  }

  excuteDailog(row) {
    this.actionDialog.emit(row)
  }


  onNavigateToEditClick(value) {
    this.navigateToEdit.emit(value);
  }

  onDeleteEntityClick(value: number) {
    this.deleteEntity.emit(value);
  }

  onPageChange(pageNumber: number) {
    this.rows = null;
    this.changePage.emit(pageNumber);
  }

  unsorted() { }
  

  onPageSizeChange(size: number) {
    this.changePageSize.emit(size);
  }

  getValue(row, column) {
    let value = row[column.prop];
    if (column.pipe !== null && column.pipe !== undefined && value !== null) {
      value = column.pipe.transform(value);
   
    }
    return value;
  }

  @HostListener('window:resize', ['$event'])
  onResize($event) {
    if (window.innerWidth > 900) {
      this.rowHeight = 0;

    } else {
      this.rowHeight = (this.columns.length + 1) * ROW_SIZE;

      

    }
  }

  onDetailToggle($event) {
  }

  onSelect($event) {
    this.selectRow.emit($event);
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

}
