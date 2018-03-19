import React, { Component } from 'react';
const request = require("superagent-promise")(require("superagent"), Promise)

// first we will make a new context
const MyContext = React.createContext();

// Then create a provider Component
class MyProvider extends Component {
  state = {
    name: 'Wes',
    age: 100,
    cool: true,
    asyncData: undefined,
  }
  render() {
    return (
      <MyContext.Provider value={{
        state: this.state,
        growAYearOlder: () => this.setState({
          age: this.state.age + 1
        }),
        getStuff: async () => {
          const resp1 = await request
            .get("https://jsonplaceholder.typicode.com/posts/1")
            .type("application/json;charset=utf-8")
            .accept("application/json;charset=utf-8")
            .end()
            .then((res) => res.body.title)
            .catch((res) => res)

          const resp2 = await request
            .get("https://jsonplaceholder.typicode.com/posts/2")
            .type("application/json;charset=utf-8")
            .accept("application/json;charset=utf-8")
            .end()
            .then((res) => res.body.title)
            .catch((res) => res)

          this.setState({asyncData: `${resp1} ++++++++++++++++++++ ${resp2}`})
        }
      }}>
        {this.props.children}
      </MyContext.Provider>
    )
  }
}

const Family = (props) => (
  <div className="family">
    <Person />
  </div>
)

class Person extends Component {
  doSomething(context) {
    context.getStuff()
  }

  render() {
    return (
      <div style={{marginLeft: 10}}>
        <MyContext.Consumer>
          {(context) => (
            <React.Fragment>
              <div>{context.state.asyncData}</div>
              <p>Age: {context.state.age}</p>
              <p>Name: {context.state.name}</p>
              {!context.state.asyncData && <button onClick={() => this.doSomething(context)}>get stuff</button>}
            </React.Fragment>
          )}
        </MyContext.Consumer>
      </div>
    )
  }
}


class App extends Component {
  render() {
    return (
      <MyProvider>
        <div style={{marginLeft: 10}}>
          <p>I'm the app</p>
          <Family />
        </div>
      </MyProvider>
    );
  }
}


export default App;