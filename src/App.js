/** @jsx AnuReact.createElement */
import "./styles.css";
import { v4 } from "uuid";
import AnuReact, { Component } from "./AnuReact";

class List extends Component {
  render() {
    return (
      <div>
        <button onClick={this.props.handleAdd}>Add Item</button>
        <ul>
          {this.props.data.map((item) => {
            return (
              <li key={item.id}>
                <span>{item.name}</span>
                <button onClick={() => this.props.handleRemove(item.id)}>
                  X
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

class TestComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontSize: "18",
      color: this.props.initColor || "red",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div style="border: 1px solid; padding: 10px">
        <p
          style={`color: ${this.state.color}; font-size: ${this.state.fontSize}px`}
        >
          {this.state.color}
        </p>
        <input
          min={18}
          max={30}
          type="range"
          name="fontSize"
          onInput={this.handleChange}
        />
        <input
          type="text"
          name="color"
          value={this.state.color}
          onInput={this.handleChange}
        />
      </div>
    );
  }
}

const NotWork = (props) => {
  return <h2>Hello {props.msg}</h2>;
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "Item",
      time: new Date().toLocaleTimeString(),
      data: [
        { name: "Item one", id: v4() },
        { name: "Item Two", id: v4() },
        { name: "Item Three", id: v4() },
        { name: "Item Four", id: v4() },
        { name: "Item Five", id: v4() },
      ],
    };

    window.setInterval(() => {
      this.setState({ time: new Date().toLocaleTimeString() });
    }, 1000);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  addItem() {
    this.setState({
      data: [...this.state.data, { name: this.state.text, id: v4() }],
    });
  }
  removeItem(id) {
    let n = [...this.state.data];
    n = n.filter((item) => item.id !== id);
    this.setState({ data: n });
  }

  render() {
    return (
      <div>
        <TestComp initColor={"green"} />
        <p>{this.state.time}</p>
        <input
          value={this.state.text}
          onInput={(e) => this.setState({ text: e.target.value })}
        />
        <NotWork msg={this.state.text} />
        <List
          data={this.state.data}
          handleAdd={this.addItem}
          handleRemove={(id) => this.removeItem(id)}
        />
      </div>
    );
  }
}

AnuReact.render(<App />, document.body);
