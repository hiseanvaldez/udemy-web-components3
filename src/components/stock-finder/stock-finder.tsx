import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'uc-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true,
})
export class StockFinder {
  nameInput: HTMLInputElement;
  @State() userInput: string;
  @State() results: Array<{ symbol: string; name: string }> = [];
  @State() isFetching = false;

  @Event({ bubbles: true, composed: true }) ucSymbolSelected: EventEmitter<string>;

  @Prop({ mutable: true }) name = '';
  @Watch('name')
  nameChanged(newValue: string, oldValue: string) {
    if (newValue === oldValue) {
      return;
    }

    this.fetchCompanies(this.name);
  }

  async fetchCompanies(name: string) {
    this.isFetching = true;
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${name}&apikey=${AV_API_KEY}`);
      if (response.status !== 200) {
        throw Error('Request Failed!');
      }

      const data = await response.json();
      if (!data['bestMatches']) {
        throw Error('Invalid Symbol!');
      }

      this.results = data['bestMatches'].map((result: Object) => {
        return {
          symbol: result['1. symbol'],
          name: result['2. name'],
        };
      });
    } catch (error) {
    } finally {
      this.isFetching = false;
    }
  }

  handleSelectSymbol(symbol: string) {
    this.ucSymbolSelected.emit(symbol);
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    this.name = this.nameInput.value.trim();
  }

  handleInput(event: Event) {
    this.userInput = (event.target as HTMLInputElement).value;
  }

  render() {
    return (
      <Host>
        <form onSubmit={e => this.handleSubmit(e)}>
          <input ref={el => (this.nameInput = el)} value={this.userInput} onInput={e => this.handleInput(e)} />
          <button type="submit">Search Stock</button>
        </form>
        {this.isFetching ? (
          <uc-spinner></uc-spinner>
        ) : (
          <ul>
            {this.results.map(result => (
              <li
                onClick={() => {
                  this.handleSelectSymbol(result.symbol);
                }}
              >
                <strong>{result.symbol}</strong> - {result.name}
              </li>
            ))}
          </ul>
        )}
      </Host>
    );
  }
}
