// Must be first: registers the background task before anything else runs.
import "./src/tasks/geofenceTask";

import { registerRootComponent } from "expo";
import App from "./App";

registerRootComponent(App);
