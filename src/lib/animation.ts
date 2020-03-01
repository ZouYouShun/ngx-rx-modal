import {
  animateChild,
  AnimationAnimateMetadata,
  AnimationStyleMetadata,
  AnimationTransitionMetadata,
  group,
  keyframes,
  query,
  style,
  transition,
  trigger,
  animate,
} from '@angular/animations';

const time = '195ms cubic-bezier(0.4, 0.0, 0.6, 1)';

export function animateAsyncTransition(
  state: string,
  ani: (AnimationStyleMetadata | AnimationAnimateMetadata)[],
): AnimationTransitionMetadata {
  return transition(state, [
    group([
      ...ani,
      // query('@*', stagger(200, animateChild()), { optional: true })
      query('@*', animateChild(), { optional: true }),
    ]),
  ]);
}

export const allAnimation = trigger('animate', [
  animateAsyncTransition('* => fadeIn', [
    style({ opacity: 0 }),
    animate(time, style({ opacity: 1 })),
  ]),
  animateAsyncTransition('fadeIn => void, * => fadeOut', [
    style({ opacity: 1 }),
    animate(time, style({ opacity: 0 })),
  ]),
  animateAsyncTransition('* => bounceInDown', [
    animate(
      time,
      keyframes([
        style({
          opacity: 0,
          transform: 'translate3d(0, -1000px, 0)',
          offset: 0,
        }),
        style({
          opacity: 1,
          transform: 'translate3d(0, 20px, 0)',
          offset: 0.6,
        }),
        style({ transform: 'translate3d(0, -10px, 0)', offset: 0.75 }),
        style({ transform: 'translate3d(0, 5px, 0)', offset: 0.9 }),
        style({ transform: 'translate3d(0, 0, 0)', offset: 1 }),
      ]),
    ),
  ]),
  animateAsyncTransition('bounceInDown => void, * => bounceOutDown', [
    animate(
      time,
      keyframes([
        style({ transform: 'translate3d(0, 10px, 0)', offset: 0.2 }),
        style({
          opacity: 1,
          transform: 'translate3d(0, -20px, 0)',
          offset: 0.5,
        }),
        style({
          opacity: 0,
          transform: 'translate3d(0, 1000px, 0)',
          offset: 1,
        }),
      ]),
    ),
  ]),
  animateAsyncTransition('* => zoomIn', [
    style({ opacity: 0, transform: 'scale3d(.1, .1, .1)' }),
    animate(time, style({ opacity: 1, transform: 'scale3d(1, 1, 1)' })),
  ]),
  animateAsyncTransition('zoomIn => void, * => zoomOut', [
    animate(
      time,
      keyframes([
        style({ opacity: 1, transform: 'scale3d(1, 1, 1)', offset: 0 }),
        style({ opacity: 0, transform: 'scale3d(.1, .1, .1)', offset: 1 }),
      ]),
    ),
  ]),
  transition('* => slideInRtoL', [
    style({ transform: 'translate3d(100%, 0, 0)' }),
    animate(time, style({ transform: 'translate3d(0, 0, 0)' })),
  ]),
  transition('slideInRtoL => void', [
    style({ transform: 'translate3d(0, 0, 0)' }),
    animate(time, style({ transform: 'translate3d(100%, 0, 0)' })),
  ]),
]);
