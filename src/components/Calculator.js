import React, { Component } from "react";
import Main from "./MainComponent";
import Settings from "./SettingsComponent";
import { Switch, Route, Redirect } from "react-router-dom";
import ErrorBoundary from "../ErrorBoundaryComponent";
import { TransitionGroup, CSSTransition } from "react-transition-group";

export default class Calculator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayInput: "",
      displayResult: "",
      operatorInUse: null,
      sideOperators: null,
      sideDrawerOpen: false,
      deg: false,
      inverse: false,
      theme: "original",
      history: []
    };
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKey);
  }

  handleTheme = event => {
    this.setState({ theme: event.target.value }, function() {
      console.log(this.state.theme);
    });
  };

  handleKey = event => {
    let numArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let { key } = event;

    if (key === "Enter") key = this.calculate(this.state.displayInput);

    if (numArr.includes(key)) {
      event.preventDefault();
      this.handleClick(key);
    } else if (key === ".") {
      event.preventDefault();
      this.handleDot();
    } else if (key === "Backspace") {
      event.preventDefault();
      this.handleBackSpace();
    } else if (key === "Clear") {
      event.preventDefault();
      this.handleClear();
    } else if (["*", "/", "+", "-"].includes(key)) {
      event.preventDefault();
      this.toggleOperator(key);
      this.calculate(this.state.displayInput);
    } else if (["^", "(", ")", "%"].includes(key)) {
      event.preventDefault();
      this.handleSideDrawerKeys(key);
    }
  };
  componentWillUnmount() {
    document.addEventListener("keydown", this.handleKey);
  }

  calculate = input => {
    if (input !== "") {
      try {
        let result = eval(input);

        if (isNaN(result)) {
          return;
        } else {
          this.setState(
            {
              displayResult: result.toString()
            },
            function() {
              console.log(this.state.history);
            }
          );
        }
      } catch (e) {
        this.setState({
          displayResult: `Bad Expression`
        });
      }
    }
  };

  handleClick = value => {
    if (value === "=") {
      let result = this.calculate(this.state.displayResult);
      this.setState({
        displayInput: this.state.displayResult,
        displayResult: result,
        operatorInUse: null,
        sideOperators: null
      });
      this.addToHistory(this.state.displayInput, this.state.displayResult);
    } else if (this.state.operatorInUse !== null) {
      let newInput = this.state.displayInput + value;
      let replace = newInput
        .replace(/x/g, "*")
        .replace(/÷/g, "/")
        .replace(/%/g, "/100")
        .replace(/sin\(/g, "Math.sin(")
        .replace(/sin⁻¹\(/g, "Math.asin(")
      this.calculate(replace);

      this.setState({
        displayInput: newInput,
        operatorInUse: null
      });
    } else if (this.state.sideOperators !== null) {
      this.handleSideFunctions(value);
    } else {
      this.setState({
        displayInput: this.state.displayInput + value
      });
    }
  };
  handleBackSpace = () => {
    const { displayInput } = this.state;
    const display =
      displayInput > 0
        ? displayInput.substring(0, displayInput.length - 1)
        : "";
    this.setState({
      displayInput: display
    });
  };
  handleClear = () => {
    this.setState({
      displayInput: "",
      displayResult: "",
      sideOperators: null,
      operatorInUse: null
    });
  };

  handleDot = () => {
    const { displayInput } = this.state;
    if (displayInput.indexOf(".") === -1) {
      this.setState({ displayInput: displayInput + "." });
    }
  };

  toggleOperator = newOperator => {
    const { displayInput, operatorInUse } = this.state;
    const prevOp = operatorInUse;
    const prevDisplay = displayInput;

    if (operatorInUse) {
      if (prevOp === newOperator) {
        return;
      } else {
        let x = prevDisplay.slice(0, -1);
        this.setState(
          () => ({
            operatorInUse: newOperator,
            displayInput: x + newOperator
          }),
          function() {
            console.log(this.state);
          }
        );
      }
    }  else {
      this.setState(() => ({
        operatorInUse: newOperator,
        displayInput: displayInput + newOperator
      }));
    }
  };
  
  handleSideFunctions = value => {
    let newInput = this.state.displayInput + value;
    let x = newInput.slice(4);
    let i = newInput.slice(6);

    if (this.state.sideOperators === "sin(") {
      let result = this.state.deg ? Math.sin((x * Math.PI) / 180) : Math.sin(x);
      this.calculate(result);
      this.setState({
        displayInput: newInput
      });
    } else if (this.state.sideOperators === "sin⁻¹(") {
      let result = this.state.deg
        ? Math.asin((i * Math.PI) / 180)
        : Math.asin(i);
      this.calculate(result);
      this.setState({
        displayInput: newInput
      });
    } else if (this.state.sideOperators === "^") {
      let base = newInput.slice(0, newInput.indexOf("^"));
      let exponent = newInput.slice(newInput.indexOf("^") + 1);
      let display = newInput + value;
      let result = `Math.pow(${base}, ${exponent})`;
      this.calculate(result);
      this.setState({
        displayInput: display
      });
    } else if (this.state.sideOperators === "10^") {
      let exponent = newInput.slice(newInput.indexOf("^") + 1);
      let display = newInput + value;
      let result = `Math.pow(${10}, ${exponent})`;
      this.calculate(result);

      this.setState({
        displayInput: display
      });
    } else if (this.state.sideOperators === "√") {
      let y = newInput.slice(1);
      let result = Math.sqrt(y);
      this.calculate(result);
      this.setState({
        displayInput: newInput
      });
    } else if (this.state.sideOperators === "²") {
      let result = Math.pow(newInput, 2);
      this.calculate(result);
      this.setState({
        displayInput: newInput
      });
    }
  };

  handleSideDrawerKeys = oper => {
    const newInput = this.state.displayInput;

    let result;
    let display;

    switch (oper) {
      case "sin(":
        if (newInput) {
          display = `${oper}${newInput}`;
          result = this.state.deg
            ? Math.sin((newInput * Math.PI) / 180)
            : Math.sin(newInput);
        } else if (this.state.displayResult !== undefined) {
          display = `${oper}${newInput}`;
          result = "";
        }
        this.setState({
          displayInput: display,
          sideOperators: oper
        });
        this.calculate(result);
        break;
      case "sin⁻¹(":
        if (newInput) {
          display = `${oper}${newInput}`;
          result = this.state.deg
            ? Math.asin((newInput * Math.PI) / 180)
            : Math.asin(newInput);
        } else if (this.state.displayResult !== undefined) {
          display = `${oper}${newInput}`;
          result = "";
        }
        this.calculate(result);
        this.setState({
          displayInput: display,
          sideOperators: oper
        });
        break;
      case "^":
        let base = newInput.slice(0, newInput.indexOf("^"));
        let exponent = newInput.slice(newInput.indexOf("^") + 1);
        display = newInput + oper;
        result = Math.pow(base, exponent);

        this.setState({
          displayInput: display,
          sideOperators: oper
        });
        this.calculate(result);
        break;
      case "10^":
        if (newInput) {
          display = `${oper}${newInput}`;
          result = Math.pow(10, newInput);
        } else {
          display = `${oper}${newInput}`;
          result = "";
        }

        this.setState({
          displayInput: display,
          sideOperators: oper
        });
        this.calculate(result);
        break;
      case "²":
        if (newInput) {
          display = `${newInput}${oper}`;
          result = Math.pow(newInput, 2);
        } else {
          display = `${newInput}${oper}`;
          result = "";
        }

        this.setState({
          displayInput: display,

          sideOperators: oper
        });
        this.calculate(result);
        break;
      case "√":
        if (newInput) {
          display = `${oper}${newInput}`;
          result = Math.sqrt(newInput);
        } else {
          display = `${oper}${newInput}`;
          result = "";
        }

        this.setState({
          displayInput: display,

          sideOperators: oper
        });
        this.calculate(result);
        break;
      default:
        this.setState({
          displayInput: newInput ? newInput + oper : oper,
          sideOperators: oper,
          displayResult: null
        });
    }
  };

  handleRadorDeg = () => {
    this.setState({ deg: !this.state.deg });
  };

  toggleInverse = () => {
    this.setState({ inverse: !this.state.inverse });
  };
  toggleSideDrawer = () => {
    this.setState(
      { sideDrawerOpen: !this.state.sideDrawerOpen },
      console.log(this.state)
    );
  };
  render() {
    return (
      <TransitionGroup>
        <CSSTransition classNames="page" timeout={300}>
          <Switch>
            <Route
              exact
              path="/main"
              component={() => (
                <ErrorBoundary>
                  <Main
                    displayInput={this.state.displayInput}
                    displayResult={this.state.displayResult}
                    toggleOperator={this.toggleOperator}
                    operatorInUse={this.operatorInUse}
                    handleClick={this.handleClick}
                    handleBackSpace={this.handleBackSpace}
                    handleClear={this.handleClear}
                    handleDot={this.handleDot}
                    handleSideDrawerKeys={this.handleSideDrawerKeys}
                    handleRadorDeg={this.handleRadorDeg}
                    inverse={this.state.inverse}
                    toggleInverse={this.toggleInverse}
                    sideDrawerOpen={this.state.sideDrawerOpen}
                    toggleSideDrawer={this.toggleSideDrawer}
                    theme={this.state.theme}
                  />
                </ErrorBoundary>
              )}
            />
            <Route
              path="/settings"
              component={() => (
                <ErrorBoundary>
                  <Settings
                    theme={this.state.theme}
                    handleTheme={this.handleTheme}
                  />
                </ErrorBoundary>
              )}
            />
            <Redirect to="/main" />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    );
  }
}
