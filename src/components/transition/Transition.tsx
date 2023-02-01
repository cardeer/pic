import { h, Component, Host, Prop, Element, Watch } from '@stencil/core';
import { TransitionEffect, TransitionStyle } from '../../@types/transition';
import { parseObject } from '../../utils/object';

@Component({
  tag: 'pic-transition',
  shadow: true,
})
export class PicTransition {
  @Prop() initial: string | TransitionStyle;
  @Prop() enter: string | TransitionStyle;
  @Prop() leave?: string | TransitionStyle;
  @Prop() duration: number = 300;
  @Prop() active: boolean = false;
  @Prop() transitionEffect: TransitionEffect = 'ease-in-out';

  @Element() host: HTMLElement;

  private initialStyle: TransitionStyle = {};
  private enterStyle: TransitionStyle = {};
  private leaveStyle: TransitionStyle = {};

  private currentStyle: TransitionStyle = {};

  private hideTimeout?: NodeJS.Timeout = null;

  constructor() {
    this.initialStyle = parseObject(this.initial);
    this.enterStyle = parseObject(this.enter);
    this.leaveStyle = parseObject(this.leave || this.initial);

    if (this.active) {
      this.currentStyle = this.enterStyle;
      this.host.style.display = 'block';
    } else {
      this.currentStyle = this.initialStyle;
      this.host.style.display = 'none';
    }

    this.resetTransition();
  }

  @Watch('active')
  private handleActiveChange(newValue: boolean, oldValue: boolean) {
    if (newValue === oldValue) return;

    if (newValue) {
      this.show();
    } else {
      this.hide();
    }
  }

  @Watch('duration')
  @Watch('transitionEffect')
  private handleTransitionStyleChange() {
    this.resetTransition();
  }

  private resetTransition() {
    this.host.style.transition = `all ${this.duration}ms ${this.transitionEffect}`;
  }

  private hide() {
    this.currentStyle = this.leaveStyle;
    this.hideTimeout = setTimeout(() => {
      this.host.style.display = 'none';
      this.host.style.transition = 'none';
      this.currentStyle = this.initialStyle;
      setTimeout(this.resetTransition);
    }, this.duration);
  }

  private show() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    this.host.style.display = 'block';

    setTimeout(() => {
      this.currentStyle = this.enterStyle;
    });
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
