import {
  trigger,
  transition,
  style,
  animate,
  stagger,
  query,
} from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(30px)' }),
    animate(
      '600ms ease-out',
      style({ opacity: 1, transform: 'translateY(0)' }),
    ),
  ]),
]);

export const staggerFadeIn = trigger('staggerFadeIn', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        stagger(100, [
          animate(
            '500ms ease-out',
            style({ opacity: 1, transform: 'translateY(0)' }),
          ),
        ]),
      ],
      { optional: true },
    ),
  ]),
]);

export const slideInLeft = trigger('slideInLeft', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-60px)' }),
    animate(
      '600ms ease-out',
      style({ opacity: 1, transform: 'translateX(0)' }),
    ),
  ]),
]);

export const slideInRight = trigger('slideInRight', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(60px)' }),
    animate(
      '600ms ease-out',
      style({ opacity: 1, transform: 'translateX(0)' }),
    ),
  ]),
]);

export const scaleIn = trigger('scaleIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.9)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
]);
