import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  key: string;
  value: number;
  duration: number;
  // key: string, value: string
}

@Component({
  selector: 'vehicle-slot-dialog.component',
  templateUrl: 'vehicle-slot-dialog.component.html',
  styleUrls: ['vehicle-slot-dialog.component.scss']
})

export class VehicleSlotDialog {
  removeBtnShow: any = false;
  updatedKey: number;

  public dialogData: any[];

  constructor(
    public dialogRef: MatDialogRef<VehicleSlotDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    let oldObj = this.data;
    var arr = [];
    for (const [key, value] of Object.entries(oldObj)) {
      let obj = {};
      obj['key'] = key.split('_')[0];
      obj['value'] = value;
      obj['duration'] = key.split('_')[1];
      // console.log(obj);
      arr.push(obj);
    }
    this.dialogData = arr;
  }

  onKeyDown(e){

    if(!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 47 && e.keyCode < 58) 
      || e.keyCode == 8 
      )) {
        return false;
    }
   
  }
  onChange(e){
    let reg = /^0/gi,
        val = e.target.value;
    if (val.match(reg)) {
        e.target.value =  val.replace(reg, '');
    }
  }

  onNoClick(): void {
    // console.log(this.dialogData)
    this.dialogRef.close();
  }
  addSlotField(): void {
    let obj = this.dialogData,
      lastKey = obj.slice(-1)[0].key;
    
    this.dialogData.push({
      // id: this.dialogData.length + 1,
      key: `${Number(lastKey.split('_')[0]) + 1}`,
      value: '',
      duration: 0
    })

    this.removeBtnShow = this.dialogData.length != 1 ? true : false;
  }
  removeAddress(key: number) {

    this.dialogData.splice(key, 1);
    this.removeBtnShow = this.dialogData.length != 1 ? true : false;
  }

}