// Must be first: registers the background task before anything else runs.
import "./src/tasks/locationTask";

import { registerRootComponent } from "expo";
import App from "./App";

registerRootComponent(App);
