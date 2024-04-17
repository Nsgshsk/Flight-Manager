import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgZorroModule } from '../../../shared/NgZorro.module';

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [CommonModule, NgZorroModule],
  templateUrl: './planes.component.html',
  styleUrl: './planes.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PlanesComponent {

}
