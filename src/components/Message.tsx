import { inject, observer } from "mobx-react";
import { Component } from "react";
import { Store } from "../store";

@inject("store")
@observer
export class Message extends Component<{ store?: Store }, {}> {
  render() {
    const { winner, startOver } = this.props.store as Store;

    return winner ? (
      <div className="message">
        <h1>Player {winner.id} won!</h1>
        <button onClick={startOver}>Start Over</button>
      </div>
    ) : null;
  }
}
