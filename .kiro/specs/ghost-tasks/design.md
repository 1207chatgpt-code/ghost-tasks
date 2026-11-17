# Design

Ghost Tasks uses a single browser document with a local task state model. `src/taskStore.js` owns transitions and persistence, while `app.js` renders the current state and wires the form, language switcher, and focus dialog.

The visual direction is a quiet midnight room: deep ink surfaces, violet ghost light, and warm amber timer accents. The main interaction is the task card moving from the lantern room into the release log after a focus session.
