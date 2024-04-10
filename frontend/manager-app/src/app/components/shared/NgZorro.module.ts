import { NgModule } from '@angular/core';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@NgModule({
  exports: [
    NzLayoutModule,
    NzIconModule,
    NzSpaceModule,
    NzButtonModule,
    NzCardModule,
    NzFlexModule,
    NzFormModule,
    NzSelectModule,
    NzGridModule,
    NzInputModule,
    NzAutocompleteModule,
    NzDatePickerModule,
    NzBreadCrumbModule,
    NzMenuModule,
  ],
})
export class NgZorroModule {}
