function property(name, color, cost) {
    return `
    <div class="space" owned="" title="Owned by AA">
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
