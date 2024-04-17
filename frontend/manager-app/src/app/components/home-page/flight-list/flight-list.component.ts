import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgZorroModule } from '../../shared/NgZorro.module';

interface ItemData {
  href: string;
  title: string;
  n: number
}

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [CommonModule, NgZorroModule],
  templateUrl: './flight-list.component.html',
  styleUrl: './flight-list.component.css',
})
export class FlightListComponent implements OnInit {
  data: ItemData[] = [];

  ngOnInit(): void {
    this.loadData(1);
  }

  loadData(pi: number): void {
    this.data = new Array(5).fill({}).map((_, index) => ({
      href: 'http://ant.design',
      title: `ant design part ${index} (page: ${pi})`,
      n: index
    }));
  }
}
