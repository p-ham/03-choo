const choo = require('choo');
const html = require('choo/html');
const emoji = require('node-emoji');
const css = require('sheetify');
const app = choo();

css('bootstrap');

const styles = css`
h1 {
    color: blue;
}
`;

const wagon = 'railway_car';
const train = 'steam_locomotive'

app.model({
state: {
    trains: [train, train, train, train],
    wagons: [wagon, wagon, wagon, wagon, wagon, wagon, wagon, wagon, wagon, wagon],
    trackA: [],
    trackB: [],
    selected: false
},
reducers: {
    addWagon: (data, state) => {
        if(state.wagons.length < 10) return{ wagons: [...state.wagons, wagon] }
    },
    moveWagon: (data, state) => {
    const add = [];

    if(data.track == 'A') gleis = state.trackA
    else if(data.track == 'B') gleis = state.trackB

    if (state.wagons.length > 0) {
        if (gleis.length === 0  && state.trains.length > 0) {
            state.trains.pop()
            add.push(train)
            state.wagons.pop()
            add.push(wagon)
        }
        if (((data.track == 'A' && gleis.length < 5) || 
            (data.track == 'B' && gleis.length < 6)) &&
            gleis.length > 0) {
                state.wagons.pop();
                add.push(wagon);
            }
    }

    if(data.track == 'A') {
        return Object.assign(state, {
            wagons: state.wagons,
            trackA: [...state.trackA, ...add]
        });
    } else {
        return Object.assign(state, {
            wagons: state.wagons,
            trackB: [...state.trackB, ...add]
        });
    }
    },
    changeSelected: (data, state) => {
        console.log(data.track)
        return {selected: data.track}
    },
    scheduleTrain: (data, state) => {
        if(state.selected == 'A') {
            while(state.trackA.length > 0) {
                state.trackA.pop()
            }
        } else if(state.selected == 'B') {
            while(state.trackB.length > 0) {
                state.trackB.pop()
            }
        }
    }
}
});

const mainView = (state, prev, send) => html`
<main class=${styles}>
    <h1>🚂🚃 Trainstation 🚂🚃</h1>
    <hr>
    <div>
    🚉 Loks: ${state.trains.map((v) => emoji.get(v))}
    </div>
    <div>
    🚉 Pool: ${state.wagons.map((v) => emoji.get(v))}
    </div>
    <hr>
    <button onclick=${() =>
    send('addWagon')} class="btn btn-primary">Add Wagon</button>
    <button onclick=${() =>
    send('moveWagon', {track: 'A'})} class="btn btn-danger">Add to A</button>
    <button onclick=${() =>
    send('moveWagon', {track: 'B'})} class="btn btn-danger">Add to B</button>
    <select onchange=${() => {
        let e = document.getElementById("selectTrack")
        send('changeSelected', {track: e.options[e.selectedIndex].value})}
    } id="selectTrack">   
        <option value="A">Track A</option>
        <option value="B">Track B</option>
    </select>
    <button onclick=${() =>
        send('scheduleTrain', {track: state.selected})} class="btn btn-success">Schedule</button>
    <hr>
    <div class="gleis">
    🛤️ Track A: ${state.trackA.map((v) => emoji.get(v))}
    </div>
    <div class="gleis">
    🛤️ Track B: ${state.trackB.map((v) => emoji.get(v))}
    </div>
</main>
`;

app.router((route) => [route('/', mainView)]);

const tree = app.start();
document.body.appendChild(tree);
