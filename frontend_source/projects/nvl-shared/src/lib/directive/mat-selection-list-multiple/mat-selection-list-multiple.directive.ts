import { Directive, OnChanges, Input, Host } from '@angular/core';
import { MatSelectionList, MatListOption } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Directive({
  selector: 'mat-selection-list[multiple]'
})
export class MatSelectionListMultipleDirective implements OnChanges {
  private matSelectionList: MatSelectionList;

  @Input()
  public multiple: boolean;

  constructor(@Host() matSelectionList: MatSelectionList) {
      this.matSelectionList = matSelectionList;
  }

  public ngOnChanges(): void {
      if (this.multiple) {
          this.matSelectionList.selectedOptions = new SelectionModel<MatListOption>(true, this.matSelectionList.selectedOptions.selected);
      } else {
          const selected = this.matSelectionList.selectedOptions.selected.splice(0, 1);
          this.matSelectionList.selectedOptions = new SelectionModel<MatListOption>(false, selected);
      }
  }
}
