import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { coerceNumberProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-action-slider-dialog',
  templateUrl: './action-slider-dialog.component.html',
  styleUrls: ['./action-slider-dialog.component.scss']
})
export class ActionSliderDialogComponent {

  autoTicks = false;
  disabled = false;
  invert = false;
  showTicks = true;
  step = 1;
  thumbLabel = true;
  value = 0;
  vertical = false;

  constructor(
    public dialogRef: MatDialogRef<ActionSliderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    data.action.value = data.action.min_value;
  }


  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(value) {
    this._tickInterval = coerceNumberProperty(value);
  }
  private _tickInterval = 1;


  onNoClick(): void {
    //this.dialogRef.close();
  }

}
