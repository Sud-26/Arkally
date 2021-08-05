import { CovalentChipsModule } from '@covalent/core/chips';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { CovalentDynamicFormsModule } from '@covalent/dynamic-forms';
import { CovalentExpansionPanelModule } from '@covalent/core/expansion-panel';
import { CovalentFileModule } from '@covalent/core/file';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { CovalentMediaModule } from '@covalent/core/media';
import { CovalentMessageModule } from '@covalent/core/message';
import { NgModule } from '@angular/core';

/**
 * Module used for aggregating teradata covalen modules.
 * Must be exported via shared module.
 * @author __
 */
@NgModule({
  declarations: [],
  imports: [
    CovalentDialogsModule,
    CovalentChipsModule,
    CovalentLayoutModule,
    CovalentMediaModule,
    CovalentMessageModule,
    CovalentDynamicFormsModule,
    CovalentExpansionPanelModule,
    CovalentFileModule
  ],
  exports: [
    CovalentDialogsModule,
    CovalentChipsModule,
    CovalentLayoutModule,
    CovalentMediaModule,
    CovalentMessageModule,
    CovalentDynamicFormsModule,
    CovalentExpansionPanelModule,
    CovalentFileModule
  ]
})
export class CovalentModule {}
