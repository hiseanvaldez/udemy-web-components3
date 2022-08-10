import { Component, Fragment, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'uc-tooltip',
  styleUrl: './tooltip.css',
  shadow: true,
})
export class Tooltip {
  @Prop() text: string = '';
  @State() isOpen = false;

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  render() {
    return (
      <Fragment>
        <slot>Default Value</slot>
        <span class="icon" onClick={() => this.toggleOpen()}>
          ?
        </span>
        {this.isOpen ? <div id="text">{this.text}</div> : null}
      </Fragment>
    );
  }
}
