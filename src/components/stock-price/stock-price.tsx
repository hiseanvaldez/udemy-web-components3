import { Component, Fragment, h, Prop, State, Watch } from '@stencil/core';
import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'uc-stock-price',
  styleUrl: './stock-price.css',
  shadow: true,
})
export class StockPrice {
  stockInput: HTMLInputElement;

  @State() currentPrice = 0.0;
  @State() userInput: string;
  @State() isInputValid = false;
  @State() isFetching = false;
  @State() errorMessage = '';

  @Prop({ mutable: true, reflect: true }) symbol = '';
  @Watch('symbol')
  symbolChanged(newValue: string, oldValue: string) {
    if (newValue === oldValue) {
      return;
    }

    this.fetchPrice(this.symbol);
    this.userInput = this.symbol;
    this.isInputValid = true;
    this.isFetching = true;
  }

  componentWillLoad() {
    if (this.symbol) {
      this.userInput = this.symbol;
      this.isInputValid = true;
      this.isFetching = true;
    }
  }

  componentDidLoad() {
    if (this.symbol) {
      this.fetchPrice(this.symbol);
    }
  }

  async fetchPrice(symbol: string) {
    this.isFetching = true;
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${AV_API_KEY}`);
      if (response.status !== 200) {
        throw Error('Request Failed!');
      }

      const data = await response.json();
      if (data['Note']) {
        throw Error('Please wait before requesting again!');
      }
      if (!data['Global Quote']['05. price']) {
        throw Error('Invalid Symbol!');
      }

      this.currentPrice = +data['Global Quote']['05. price'];
      this.errorMessage = '';
    } catch (error) {
      this.currentPrice = 0.0;
      this.errorMessage = error.message;
    } finally {
      this.isFetching = false;
    }
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    this.symbol = this.stockInput.value;
  }

  handleInput(event: Event) {
    this.userInput = (event.target as HTMLInputElement).value;
    if (this.userInput.trim() !== '') {
      this.isInputValid = true;
    } else {
      this.isInputValid = false;
    }
  }

  render() {
    let content = <p>Please enter a symbol.</p>;
    if (this.errorMessage) {
      content = <p>{this.errorMessage}</p>;
    }
    if (this.currentPrice) {
      content = <p>Price: ${this.currentPrice.toFixed(2)}</p>;
    }
    return (
      <Fragment>
        <form onSubmit={e => this.handleSubmit(e)}>
          <input ref={el => (this.stockInput = el)} value={this.userInput} onInput={e => this.handleInput(e)} />
          <button type="submit" disabled={!this.isInputValid || this.isFetching}>
            Get Current Price
          </button>
        </form>
        <div>{content}</div>
      </Fragment>
    );
  }
}
