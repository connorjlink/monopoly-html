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

function property(name, color, cost, owned) {
    let owner = owned;
    if (owner == null) {
        owner = '';
    }

    // TODO: use title attribute to produce a hover tooltip for the stringified owner name

    return `
    <div class="space" owned="${owner}">
        <div class="space-color" style="background-color: ${color}"></div>

        <div class="space-content">
            <p>${name}</p>
            <p>${cost}&cent;</p>
        </div>
    </div>
    `;
}

function corner(style) {
    return `
    <div class="corner" style="${style}">

    </div>
    `;
}

function iconic(name, icon, cost, owned) {
    let classList = "";
    if (icon.includes("&quest;")) {
        classList = "chance";
    }

    let owner = owned;
    if (owner == null) {
        owner = '';
    }

    // TODO: use `title` attribute to provide stringified owner name

    return `
    <div class="space ${classList}" owned="${owner}">
        <p>${name}</p>
        <p class="icon">${icon}</p>
        <p>${cost}</p>
    </div>
    `;
}

function utility(name, icon, cost, owned) {
    return iconic(name, icon, cost + "&cent;", owned);
}

function railroad(name, cost, owned) {
    return iconic(name, "&#x1F686;", cost + "&cent;", owned)
}

function tax(name, icon, cost) {
    return iconic(name, icon, `Pay ${cost}&cent;`);
}


class BoardProperty extends HTMLElement {
    static observedAttributes = ["owned"];

    constructor() {
        super();
    }

    rebuild() {
        const square = this.getAttribute('square');
        const owner = this.getAttribute('owned');
        const ref = monopolyGame.squares[square];
        this.innerHTML = property(ref.name, propertyColors[ref.color], ref.cost, owner);
    }

    connectedCallback() {
        this.rebuild();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.rebuild();
    }
}

class BoardCorner extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const style = this.getAttribute('style');
        // TODO: extract the square attribute
        this.innerHTML = corner(style);
    }
}

class BoardIconic extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const square = this.getAttribute('square');
        const ref = monopolyGame.squares[square];
        this.innerHTML = iconic(ref.name, ref.icon, ref.cost);
    }
}

class BoardRailroad extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const square = this.getAttribute('square');
        const owner = this.getAttribute('owned');
        const ref = monopolyGame.squares[square];
        this.innerHTML = railroad(ref.name, ref.cost, owner);
    }
}

class BoardUtility extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const square = this.getAttribute('square');
        const owner = this.getAttribute('owned');
        const ref = monopolyGame.squares[square];
        this.innerHTML = utility(ref.name, ref.icon, ref.cost, owner);
    }
}

class BoardTax extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const square = this.getAttribute('square');
        const ref = monopolyGame.squares[square];
        this.innerHTML = tax(ref.name, ref.icon, ref.cost);
    }
}

customElements.define('board-property', BoardProperty);
customElements.define('board-corner', BoardCorner);
customElements.define('board-iconic', BoardIconic);
customElements.define('board-railroad', BoardRailroad);
customElements.define('board-utility', BoardUtility);
customElements.define('board-tax', BoardTax);
