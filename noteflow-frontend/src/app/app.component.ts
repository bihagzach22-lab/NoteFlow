import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  animate,
  group,
  query,
  style,
  transition,
  trigger
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%',
            top: 0,
            left: 0
          })
        ], { optional: true }),
        query(':enter', [
          style({
            opacity: 0,
            transform: 'translateY(14px) scale(0.99)'
          })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('140ms ease-out', style({
              opacity: 0,
              transform: 'translateY(-8px) scale(0.99)'
            }))
          ], { optional: true }),
          query(':enter', [
            animate('260ms 80ms ease-out', style({
              opacity: 1,
              transform: 'translateY(0) scale(1)'
            }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class AppComponent {
  prepareRoute(outlet: RouterOutlet): string | undefined {
    return outlet?.activatedRouteData?.['animation'];
  }
}