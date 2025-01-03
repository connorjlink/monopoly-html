const properties = [
    // brown color group
    { name: "Mediterrean Avenue", cost: 60 },
    { name: "Baltic Avenue", cost: 60 },

    // light blue color group
    { name: "Oriental Avenue", cost: 100 },
    { name: "Vermont Avenue", cost: 100 },
    { name: "Connecticut Avenue", cost: 120 },

    // pink color group
    { name: "St. Charles Place", cost: 140 },
    { name: "States Avenue", cost: 140 },
    { name: "Virginia Avenue", cost: 160 },

    // orange color group 
    { name: "St. James Place", cost: 180 },
    { name: "Tennessee Avenue", cost: 180 },
    { name: "New York Avenue", cost: 200 },

    // red color group
    { name: "Kentucky Avenue", cost: 220 },
    { name: "Indiana Avenue", cost: 220 },
    { name: "Illinois Avenue", cost: 240 },

    // yellow color group
    { name: "Atlantic Avenue", cost: 260 },
    { name: "Ventnor Avenue", cost: 260 },
    { name: "Marvin Gardens", cost: 280 },

    // green color group
    { name: "Pacific Avenue", cost: 300 },
    { name: "North Carolina Avenue", cost: 300 },
    { name: "Pennsylavania Avenue", cost: 320 },

    // dark blue color group
    { name: "Park Place", cost: 350 },
    { name: "Boardwalk", cost: 400 },

];

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

const railroads = [
    { name: "Reading Railroad", cost: 200 },
    { name: "Pennsylavania Railroad", cost: 200 },
    { name: "B. & O. Railroad", cost: 200 },
    { name: "Short Line", cost: 200 },
]

function property(name, color, cost) {
    return `
    <div class="space" owned="1" title="Owned by AA">
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

function iconic(name, icon, cost) {
    var classList = "";
    if (icon.includes("?")) {
        classList = "chance";
    }

    return `
    <div class="space ${classList}">
        <p>${name}</p>
        <p class="icon">${icon}</p>
        <p>${cost}</p>
    </div>
    `;
}

function railraod(railid, cost) {
    // icon = &#x1F686;
}


class BoardProperty extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!document.head.getHTML().includes("board.css")) {
            document.head.insertAdjacentHTML('afterbegin', `
                <link rel="stylesheet" href="board.css">
            `);
        }

        const name = this.getAttribute('name');
        const color = this.getAttribute('color');
        const cost = this.getAttribute('cost');

        this.innerHTML = property(name, color, cost);
    }
}

class BoardCorner extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!document.head.getHTML().includes("board.css")) {
            document.head.insertAdjacentHTML('afterbegin', `
                <link rel="stylesheet" href="board.css">
            `);
        }

        const style = this.getAttribute('style');

        this.innerHTML = corner(style);
    }
}

class BoardIconic extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!document.head.getHTML().includes("board.css")) {
            document.head.insertAdjacentHTML('afterbegin', `
                <link rel="stylesheet" href="board.css">
            `);
        }

        const name = this.getAttribute('name');
        const icon = this.getAttribute('icon');
        const cost = this.getAttribute('cost');

        this.innerHTML = iconic(name, icon, cost);
    }
}

customElements.define('board-property', BoardProperty);
customElements.define('board-corner', BoardCorner);
customElements.define('board-iconic', BoardIconic);
