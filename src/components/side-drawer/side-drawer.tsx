import { Component, h, Host, Method, Prop, State } from '@stencil/core';

@Component({
  tag: 'uc-side-drawer',
  styleUrl: './side-drawer.css',
  shadow: true,
})
export class SideDrawer {
  @State() showContact: boolean = false;

  @Prop({ reflect: true, attribute: 'title' }) drawerTitle: string = 'hello';
  @Prop({ reflect: true, mutable: true }) open: boolean = false;

  @Method()
  async toggleOpen() {
    this.open = !this.open;
  }

  handleContentChange(content: string) {
    this.showContact = content === 'contact';
  }

  render() {
    let mainContent = <slot />;

    if (this.showContact) {
      mainContent = (
        <div id="contact-information">
          <h2>Contact Information</h2>
          <p>You can reach us via phone or email</p>
          <ul>
            <li>Phone: 0917 555 5555</li>
            <li>
              Email: <a href="mailto:h.v@x.com">h.v@x.com</a>
            </li>
          </ul>
        </div>
      );
    }

    return (
      <Host>
        <div class="backdrop" onClick={() => this.toggleOpen()}></div>
        <aside>
          <header>
            <h1>{this.drawerTitle}</h1>
            <button onClick={() => this.toggleOpen()}>X</button>
          </header>
          <section id="tabs">
            <button class={!this.showContact ? 'active' : ''} onClick={() => this.handleContentChange('nav')}>
              Navigation
            </button>
            <button class={this.showContact ? 'active' : ''} onClick={() => this.handleContentChange('contact')}>
              Contact
            </button>
          </section>
          <main>{mainContent}</main>
        </aside>
      </Host>
    );
  }
}
