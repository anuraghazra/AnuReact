import diff from "./diff";

class Component {
  constructor(props) {
    this.props = props || {};
    this.state = {};
    this._currentVDom = null;
    this._prevState = null;
    this._parentNode = null;
  }

  updateComponent() {
    const prevState = this.state;
    const prevVDom = this._currentVDom;

    if (this._prevState !== prevState) {
      this.state = this._prevState;
    }
    this._prevState = null;
    let nextVDom = this.render();
    this._currentVDom = nextVDom;

    diff(prevVDom, nextVDom);
  }

  setState(newState) {
    this._prevState = { ...this.state, ...newState };
    this.updateComponent();
  }
  render() {}
}

export default Component;
