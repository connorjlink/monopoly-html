// property color group identifiers
const BROWN = 0, LIGHT_BLUE = 1, PINK = 2, ORANGE = 3, RED = 4, YELLOW = 5, GREEN = 6, BLUE = 7;

const propertyColors = [
    // brown
    "rgb(90, 50, 20)",

    // light blue
    "rgb(200, 230, 255)",

    // pink
    "rgb(220, 20, 110)",

    // orange
    "rgb(240, 130, 30)",

    // red
    "rgb(220, 20, 50)",

    // yellow
    "rgb(250, 230, 0)",

    // green
    "rgb(30, 130, 20)",

    // dark blue
    "rgb(30, 50, 150)",
];


function property(name, color, cost, owned, target, highlight) {
    let owner = owned;
    if (owner == null) {
        owner = '';
    }

    let targeted = (target == null ? "" : "targeted");
    let highlighted = (highlight == null ? "" : "highlighted");

    // TODO: use title attribute to produce a hover tooltip for the stringified owner name

    return `
    <div class="space ${targeted} ${highlighted}" owned="${owner}">
        <div class="space-color" style="background-color: ${color}"></div>

        <div class="space-content">
            <p>${name}</p>
            <p>${cost}&cent;</p>
        </div>
    </div>
    `;
}

function corner(which, target, highlight) {
    let targeted = (target == null ? "" : "targeted");
    let highlighted = (highlight == null ? "" : "highlighted");

    if (which == 0) {
        return `
        <div class="corner ${targeted} ${highlighted} go">
            <div class="go-wrapper">
                <div class="top-wrapper">
                    <p class="top">COLLECT 200¢ SALARY AS YOU PASS</p>
                    <p class="middle">GO</p>
                </div>

                <p class="bottom">&larrtl;</p>
            </div>
        </div>
        `;
    } else if (which == 1) {
        return `
        <div class="corner ${targeted} ${highlighted} jail">
            <div class="jail-wrapper">
                <div class="injail">
                    <div class="injail-wrapper">
                        <p class="top">IN</p>

                        <div class="middle">
                            <div class="bar"></div>
                            <div class="bar"></div>
                            <div class="bar"></div>
                            <div class="bar"></div>
                        </div>

                        <p class="bottom">JAIL</p>
                    </div>
                </div>
            </div>

            <div class="justvisiting">
                <p class="just">JUST</p>
                <p class="visting">VISITING</p>
            </div>
        </div>
        `;
    } else if (which == 2) {
        return `
        <div class="corner ${targeted} ${highlighted} freeparking">
            <div class="freeparking-wrapper">
                <p class="top">FREE</p>
                <p class="middle">&#x1F17F;</p>
                <p class="bottom">PARKING</p>
            </div>
        </div>
        `;
    } else if (which == 3) {
        return `
        <div class="corner ${targeted} ${highlighted} gotojail">
            <div class="gotojail-wrapper">
                <p class="top">GO TO</p>
                <p class="middle">&#x1F6A8;</p>
                <p class="bottom">JAIL</p>
            </div>
        </div>
        `;
    }
}

function iconic(name, icon, cost, owned, target, highlight) {
    let owner = owned;
    if (owner == null) {
        owner = '';
    }

    let chance = (icon.includes("&quest;") ? "chance" : "");
    let targeted = (target == null ? "" : "targeted");
    let highlighted = (highlight == null ? "" : "highlighted");

    // TODO: use `title` attribute to provide stringified owner name

    return `
    <div class="space ${chance} ${targeted} ${highlighted}" owned="${owner}">
        <p>${name}</p>
        <p class="icon">${icon}</p>
        <p>${cost}</p>
    </div>
    `;
}

function draw(name, icon, cost, target, highlight) {
    return iconic(name, icon, cost, null, target, highlight);
}

function utility(name, icon, cost, owned, target, highlight) {
    return iconic(name, icon, cost + "&cent;", owned, target, highlight);
}

function railroad(name, cost, owned, target, highlight) {
    //return iconic(name, "&#x1F686;", cost + "&cent;", owned, target, highlight);
    return iconic(name, `<img src="train.svg" width="60">`, cost + "&cent;", owned, target, highlight);

}

function tax(name, icon, cost, target, highlight) {
    return iconic(name, icon, `Pay ${cost}&cent;`, null, target, highlight);
}

function wrap(markup, players) {
    let playersMarkup = '';

    const trim = (str, chars) => str.split(chars).filter(Boolean).join(chars);

    if (players != null) {
        players = trim(players, ',');
        let playersArray = players.split(',');

        for (let player of playersArray) {
            playersMarkup += `<span class="player${player}"></span>`;
        }
    }
    
    return `
    <div class="space-wrapper">
        ${markup}
        ${playersMarkup}
    </div>
    `;
}

class BoardProperty extends HTMLElement {
    static observedAttributes = ["owned", "targeted", "highlighted", "players"];

    constructor() {
        super();
    }

    rebuild() {
        const square = this.getAttribute('square');
        const owner = this.getAttribute('owned');
        const target = this.getAttribute('targeted');
        const highlight = this.getAttribute('highlighted');
        const players = this.getAttribute('players');

        const ref = monopolyGame.squares[square];
        this.innerHTML = wrap(property(ref.name, propertyColors[ref.color], ref.cost, owner, target, highlight), players);
    }

    connectedCallback() {
        this.rebuild();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.rebuild();
    }
}

class BoardCorner extends HTMLElement {
    static observedAttributes = ["owned", "targeted", "highlighted", "players"];

    constructor() {
        super();
    }

    rebuild() {
        const target = this.getAttribute('targeted');
        const highlight = this.getAttribute('highlighted');
        const players = this.getAttribute('players');
        const which = this.getAttribute('which');

        // TODO: extract the square attribute
        this.innerHTML = wrap(corner(which, target, highlight), players);
    }

    connectedCallback() {
        this.rebuild();        
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.rebuild();
    }
}

class BoardDraw extends HTMLElement {
    static observedAttributes = ["owned", "targeted", "highlighted", "players"];

    constructor() {
        super();
    }

    rebuild() {
        const square = this.getAttribute('square');
        const target = this.getAttribute('targeted');
        const highlight = this.getAttribute('highlighted');
        const players = this.getAttribute('players');

        const ref = monopolyGame.squares[square];
        this.innerHTML = wrap(draw(ref.name, ref.icon, ref.cost, target, highlight), players);
    }

    connectedCallback() {
        this.rebuild();        
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.rebuild();
    }
}

class BoardIconic extends HTMLElement {
    static observedAttributes = ["owned", "targeted", "highlighted", "players"];

    constructor() {
        super();
    }

    rebuild() {
        const square = this.getAttribute('square');
        const target = this.getAttribute('targeted');
        const highlight = this.getAttribute('highlighted');
        const players = this.getAttribute('players');

        const ref = monopolyGame.squares[square];
        this.innerHTML = wrap(iconic(ref.name, ref.icon, ref.cost, target, highlight), players);
    }

    connectedCallback() {
        this.rebuild();        
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.rebuild();
    }
}

class BoardRailroad extends HTMLElement {
    static observedAttributes = ["owned", "targeted", "highlighted", "players"];

    constructor() {
        super();
    }

    rebuild() {
        const square = this.getAttribute('square');
        const owner = this.getAttribute('owned');
        const target = this.getAttribute('targeted');
        const highlight = this.getAttribute('highlighted');
        const players = this.getAttribute('players');

        const ref = monopolyGame.squares[square];
        this.innerHTML = wrap(railroad(ref.name, ref.cost, owner, target, highlight), players);
    }

    connectedCallback() {
        this.rebuild();        
    }

    attributeChangedCallback() {
        this.rebuild();
    }
}

class BoardUtility extends HTMLElement {
    static observedAttributes = ["owned", "targeted", "highlighted", "players"];

    constructor() {
        super();
    }

    rebuild() {
        const square = this.getAttribute('square');
        const owner = this.getAttribute('owned');
        const target = this.getAttribute('targeted');
        const highlight = this.getAttribute('highlighted');
        const players = this.getAttribute('players');

        const ref = monopolyGame.squares[square];
        this.innerHTML = wrap(utility(ref.name, ref.icon, ref.cost, owner, target, highlight), players);
    }

    connectedCallback() {
        this.rebuild();        
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.rebuild();
    }
}

class BoardTax extends HTMLElement {
    static observedAttributes = ["owned", "targeted", "highlighted", "players"];

    constructor() {
        super();
    }

    rebuild() {
        const square = this.getAttribute('square');
        const target = this.getAttribute('targeted');
        const highlight = this.getAttribute('highlighted');
        const players = this.getAttribute('players');

        const ref = monopolyGame.squares[square];
        this.innerHTML = wrap(tax(ref.name, ref.icon, ref.cost, target, highlight), players);
    }

    connectedCallback() {
        this.rebuild();        
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.rebuild();
    }
}

customElements.define('board-property', BoardProperty);
customElements.define('board-corner', BoardCorner);
customElements.define('board-iconic', BoardIconic);
customElements.define('board-draw', BoardDraw);
customElements.define('board-railroad', BoardRailroad);
customElements.define('board-utility', BoardUtility);
customElements.define('board-tax', BoardTax);
