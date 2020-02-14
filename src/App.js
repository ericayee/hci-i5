import React, { Component } from "react";
import CanvasDraw from "react-canvas-draw";
import "./App.css";
import eraser from './eraser.svg';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newItem: "",
      list: [],
      brushRadius: 10,
      brushColor: "#663399",
      counterToggle: true,
      fact: '',
      darkChecked: false
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
    this.saveStateToLocalStorage();
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

  getFact() {
    var url = `https://jsonplaceholder.typicode.com/comments/${Math.floor(Math.random(0,500) * 10)}`;
    fetch(url)
    .then(res => res.json())
    .then((data) => {
      document.getElementById("factbox").innerHTML = data['name'];
      // this.setState({ fact: data['name'] })
      // console.log(data);
    })
    .catch(console.log)

  }

  // handleChecked() {
  //   this.setState({darkChecked: !this.state.darkChecked});
  // }

  render() {

    return (
      <div className="App" style={{backgroundColor: this.state.darkChecked ? '#fff' : '#282c34'}}>
        <header className="App-header">
          <h1 className="App-title">IS 4300: I5 Gui Implementation</h1>
          <h3>By Erica Yee</h3>
        </header>
        <label>Dark mode?</label>
        <input type="checkbox" onChange={() =>{
          this.setState({darkChecked: !this.state.darkChecked});
        }}/>
        <div className="list-container">
          Add a to-do item (these will be saved!):
          <br />
          <input
            type="text"
            placeholder="Type item here"
            value={this.state.newItem}
            onChange={e => this.updateInput("newItem", e.target.value)}
          />
          <button
            className="addButton"
            onClick={() => this.addItem()}
            disabled={!this.state.newItem.length}
          >
            +
          </button>
          <br /> <br />
          <ul>
            {this.state.list.map(item => {
              return (
                <li key={item.id}>
                  {item.value}
                  <button
                    className="deleteButton"
                    onClick={() => this.deleteItem(item.id)}>
                    -
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="factContainer">
          <button
            className="factButton"
            onClick={() => {
              this.getFact();
            }}
          >Try pronouncing some lorem ipsum</button>
          <p id="factbox"><br /></p>
        </div>
        <div
          style={{
            textAlign: "center",
            margin: "0 auto"
          }}
        >
          <h3>Feeling overwhelmed? Draw a little to destress!</h3>
          <button
            className="tooltip"
            onClick={() => {
              this.inlineCanvas.clear();
            }}
          >
            <img src={eraser} className="eraser-img" alt="eraser" />
            <span className="tooltiptext">Clear canvas</span>
          </button>
          <CanvasDraw
            className="canvas-container"
            ref={canvasDraw => (this.inlineCanvas = canvasDraw)}
            brushColor={this.state.brushColor}
            brushRadius={this.state.brushRadius}
            canvasWidth={"100%"}
          />
        </div>
        <div className="counter-container">
          <button
            className="surprisebutton"
            onClick={() => this.setState({
              counterToggle: !this.state.counterToggle
            })}
            style={this.state.counterToggle ?
              {backgroundColor: "lightgray"} : {backgroundColor: "lightblue"}
            }
          >Surprise me</button>
          {
          // <label>
          //   Show/hide
          //   <input
          //     type="checkbox"
          //     onChange={() => this.setState({counterToggle: !this.state.counterToggle})}
          //     // defaultChecked={this.state.counterToggle}
          //     />
          // </label>
          }

          {
            this.state.counterToggle  ?
            <div className="iframe-container">
              <h3>Countdown till the end of the semester</h3>
              <iframe title="countdown" src="https://free.timeanddate.com/countdown/i75ffcsp/n43/cf12/cm0/cu4/ct0/cs1/ca0/co0/cr0/ss0/cac000/cpc000/pcfff/tcfff/fn3/fs100/szw576/szh243/iso2020-04-24T23:59:59/pa5" allowtransparency="true" frameBorder="0" width="198" height="59"></iframe>
            </div>
            : <div className="placeholderDiv"></div>
          }

        </div>

      </div>
    );
  }
}

export default App;
