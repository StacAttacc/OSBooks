import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

const FADE = '3rem';

@Directive({ selector: '[scrollFade]', standalone: true })
export class ScrollFadeDirective implements OnInit, OnDestroy {
  private el: HTMLElement;
  private ro!: ResizeObserver;
  private onScroll = () => this.update();

  constructor(ref: ElementRef<HTMLElement>) {
    this.el = ref.nativeElement;
  }

  ngOnInit() {
    this.el.addEventListener('scroll', this.onScroll, { passive: true });
    this.ro = new ResizeObserver(() => this.update());
    this.ro.observe(this.el);
    if (this.el.firstElementChild) this.ro.observe(this.el.firstElementChild);
    this.update();
  }

  ngOnDestroy() {
    this.el.removeEventListener('scroll', this.onScroll);
    this.ro.disconnect();
  }

  private update() {
    const { el } = this;
    const left  = el.scrollLeft > 0;
    const right = el.scrollLeft + el.clientWidth  < el.scrollWidth  - 1;
    const up    = el.scrollTop  > 0;
    const down  = el.scrollTop  + el.clientHeight < el.scrollHeight - 1;

    const masks: string[] = [];

    if (left || right) {
      const l = left  ? `transparent, black ${FADE}` : 'black, black';
      const r = right ? `black calc(100% - ${FADE}), transparent` : 'black, black';
      masks.push(`linear-gradient(to right, ${l}, ${r})`);
    }
    if (up || down) {
      const t = up   ? `transparent, black ${FADE}` : 'black, black';
      const b = down ? `black calc(100% - ${FADE}), transparent` : 'black, black';
      masks.push(`linear-gradient(to bottom, ${t}, ${b})`);
    }

    const mask = masks.join(', ');
    el.style.maskImage = mask;
    (el.style as any).webkitMaskImage = mask;
    // when both axes are present, intersect so corners fade naturally
    if (masks.length > 1) {
      el.style.maskComposite = 'intersect, intersect';
      (el.style as any).webkitMaskComposite = 'source-in, source-in';
    } else {
      el.style.maskComposite = '';
      (el.style as any).webkitMaskComposite = '';
    }
  }
}
