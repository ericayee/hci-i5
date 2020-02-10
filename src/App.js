import React, { Component } from "react";
import CanvasDraw from "react-canvas-draw";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newItem: "",
      list: [],
      brushRadius: 10,
      brushColor: "#663399"
    };
  }

  componentDidMount() {
    this.hydrateStateWithLocalStorage();

    // add event listener to save state to localStorage
    // when user leaves/refreshes page
    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );

    // saves if component has chance to unmount
    this.saveStaetToLocalStorage();
  }

  updateInput(key, value) {
    // update react state
    this.setState({ [key]: value });
  }

  addItem() {
    // create a new item
    const newItem = {
      id: 1 + Math.random(),
      value: this.state.newItem.slice()
    };

    // copy current list of items
    const list = [...this.state.list];

    // add the new item to the list
    list.push(newItem);

    // update state with new list, reset the new item input
    this.setState({
      list,
      newItem: ""
    });

    // update localStorage
    localStorage.setItem("list", JSON.stringify(list));
    localStorage.setItem("newItem", "")
  }

  deleteItem(id) {
    // copy current list of items
    const list = [...this.state.list];
    // filter out the item being deleted
    const updatedList = list.filter(item => item.id !== id);

    this.setState({ list: updatedList });

    // update LocalStorage
    localStorage.setItem("list", JSON.stringify(updatedList));
  }

  hydrateStateWithLocalStorage() {
    // for all items in state
    for (let key in this.state) {
      // if key exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get key's value from localStorage
        let value = localStorage.getItem(key);

        // parse localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({
            [key]: value
          });
        } catch (e) {
          // handle empty string
          this.setState({
            [key]: value
          });
        }
      }
    }
  }

  saveStateToLocalStorage() {
    // for every item in React state
    for (let key in this.state) {
      // save to localStorage
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">IS 4300: I5 Gui Implementation</h1>
          <h3>By Erica Yee</h3>
        </header>
        <div
          style={{
            padding: 50,
            textAlign: "left",
            maxWidth: 500,
            margin: "auto"
          }}
        >
          Add an item to the list
          <br />
          <input
            type="text"
            placeholder="Type item here"
            value={this.state.newItem}
            onChange={e => this.updateInput("newItem", e.target.value)}
          />
          <button
            onClick={() => this.addItem()}
            disabled={!this.state.newItem.length}
          >
            &#43; Add
          </button>
          <br /> <br />
          <ul>
            {this.state.list.map(item => {
              return (
                <li key={item.id}>
                  {item.value}
                  <button onClick={() => this.deleteItem(item.id)}>
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div
          style={{
            textAlign: "center",
            margin: "0 auto"
          }}
        >
          <h3>Feeling overwhelmed? Draw a little to destress!</h3>
          <CanvasDraw
            className="canvas-container"
            ref={canvasDraw => (this.inlineCanvas = canvasDraw)}
            brushColor={this.state.brushColor}
            brushRadius={this.state.brushRadius}
            canvasWidth={"100%"}
          />
          <button
            onClick={() => {
              this.inlineCanvas.clear();
            }}
          >
            Clear
          </button>
        </div>
      </div>
    );
  }
}

export default App;
