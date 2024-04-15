import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgZorroModule } from '../../shared/NgZorro.module';

interface ItemData {
  href: string;
  title: string;
  avatar: string;
  description: string;
  content: string;
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
      avatar:
        'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources ' +
        '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    }));
  }
}
