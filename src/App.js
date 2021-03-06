import React, { Component } from "react";
import CanvasDraw from "react-canvas-draw";
import "./App.css";
import eraser from './eraser.svg';
import brush from './brush.svg';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newItem: "",
      list: [],
      counterToggle: false,
      fact: "",
      darkChecked: false,
      brushColor: "#663399",
      brushLabel: "purple"
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
  }

  deleteItem(id) {
    // copy current list of items
    const list = [...this.state.list];
    // filter out the item being deleted
    const updatedList = list.filter(item => item.id !== id);

    this.setState({ list: updatedList });
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
    var url = 'https://uselessfacts.jsph.pl/random.json?language=en'
    fetch(url)
    .then(res => res.json())
    .then((data) => {
      // update the state
      this.setState({
        fact: data['text']
      });
    })
    .catch(console.log)
  }

  clearFact() {
    this.setState({
      fact: ''
    });
  }

  render() {

    return (
      <div className="App">
        <header className="App-header" style={{backgroundColor: this.state.darkChecked ? '#fff' : '#282c34'}}>
          <h1 className="App-title" style={{color: this.state.darkChecked ? '#282c34' : '#fff'}}>IS 4300: I5 Gui Implementation</h1>
          <h3 style={{color: this.state.darkChecked ? '#282c34' : '#fff'}}>By Erica Yee</h3>
        </header>
        <label>Change header theme</label>
        <input type="checkbox" onChange={() => {
          this.setState({darkChecked: !this.state.darkChecked});
        }}/>
        <div className="list-container">
          <h3>Add a to-do item (these will be saved!):</h3>
          <input
            type="text"
            placeholder="Add item here"
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
          <ul className="todos">
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
          <h3>Learn a useless fact</h3>
          <button
            className="factButton"
            onClick={() => {
              this.getFact();
            }}
          >Get fact</button>
          <button
            className="clearFactButton"
            onClick={() => {
              this.clearFact();
            }}
          >Clear fact</button>
          <p id="factbox">
          {
            this.state.fact ? <span>{this.state.fact}</span> : <br />
          }
          </p>
        </div>
        <div
          style={{
            textAlign: "center",
            margin: "0 auto"
          }}
        >
          <h3>Feeling overwhelmed? Draw a little to destress! <span><img src={brush} className="icon" alt="brush" /></span></h3>
          <div className="dropdown">
           <button className="dropbtn">Choose color:<br /><span>{this.state.brushLabel}</span></button>
           <div className="dropdown-content">
             <div onClick={() => this.setState({
               brushColor: "#663399",
               brushLabel: "purple"
             })}>purple</div>
             <div onClick={() => this.setState({
               brushColor: "#993399",
               brushLabel: "pink"
             })}>pink</div>
             <div onClick={() => this.setState({
               brushColor: "#333399",
               brushLabel: "blue"
             })}>blue</div>
           </div>
          </div>
          <button
            className="tooltip"
            onClick={() => {
              this.inlineCanvas.clear();
            }}
          >
            <img src={eraser} className="icon" alt="eraser" />
            <span className="tooltiptext">Clear canvas</span>
          </button>
          <CanvasDraw
            className="canvas-container"
            ref={canvasDraw => (this.inlineCanvas = canvasDraw)}
            brushColor={this.state.brushColor}
            canvasWidth={"100%"}
          />
        </div>
        <div className="counter-container">
          <button
            className="surpriseButton"
            onClick={() => this.setState({
              counterToggle: !this.state.counterToggle
            })}
            style={this.state.counterToggle ?
              {backgroundColor: "lightgray", border: "1px solid lightgray" } : {backgroundColor: "lightblue", border: "1px solid lightblue" }
            }
          >Surprise me</button>
          {
            this.state.counterToggle  ?
            <div className="iframe-container">
              <h3>Countdown till the end of the semester</h3>
              <iframe title="countdown" src="https://free.timeanddate.com/countdown/i75ffcsp/n43/cf12/cm0/cu4/ct0/cs1/ca0/co0/cr0/ss0/cac000/cpc000/pcfff/tcfff/fn3/fs100/szw576/szh243/iso2020-04-24T23:59:59/pa5" allowtransparency="true" frameBorder="0" width="198" height="59"></iframe>
            </div>
            : <div className="placeholderDiv"></div>
          }
        </div>
        <div className="credits-container">
          <h3>Credits</h3>
            <p>This project was bootstrapped with <a href="https://github.com/facebook/create-react-app" target="_blank" rel="noopener noreferrer">Create React App.</a></p>
            <p>Thanks to Ryan J. Yost's <a href="https://medium.com/hackernoon/how-to-take-advantage-of-local-storage-in-your-react-projects-a895f2b2d3f2" target="_blank" rel="noopener noreferrer">Hackernoon article</a> and starter code for how to use the Local Storage web API.</p>
            <p>Thanks to the team behind <a href="https://embiem.github.io/react-canvas-draw/" target="_blank" rel="noopener noreferrer">React Canvas Draw</a> for their awesome component.</p>
            <p>Thanks to Joseph Paul for his <a href="https://uselessfacts.jsph.pl/" target="_blank" rel="noopener noreferrer">Random Useless Facts</a> API.</p>
            <p>Thanks to timeanddate.com for the <a href="https://www.timeanddate.com/clocks/freecountdown.html" target="_blank" rel="noopener noreferrer">Free Countdown Timer for Your Website</a> embed.</p>
        </div>
      </div>
    );
  }
}

export default App;
