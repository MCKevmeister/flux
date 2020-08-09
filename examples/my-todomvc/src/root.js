import AppContainer from "./containers/AppContainer";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<AppContainer />, document.getElementById("todoapp"));

// We will remove these lines later:

import TodoActions from "./data/TodoActions";

TodoActions.addTodo("My first task");
TodoActions.addTodo("Another task");
TodoActions.addTodo("Finish this tutorial");
