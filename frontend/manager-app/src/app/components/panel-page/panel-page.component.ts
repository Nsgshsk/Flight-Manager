import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { NgZorroModule } from '../shared/NgZorro.module';

@Component({
  selector: 'app-panel-page',
  standalone: true,
  imports: [CommonModule, NgZorroModule],
  templateUrl: './panel-page.component.html',
  styleUrl: './panel-page.component.css',
})
export class PanelPageComponent {
  showBrandName = true;

  onSiderCollapse(value: boolean) {
    if (!value)
      setTimeout(() => {
        this.showBrandName = !value;
      }, 120);
    else this.showBrandName = !value;
  }
}
