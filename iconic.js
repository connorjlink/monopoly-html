function iconic(name, icon, cost) {
    var classList = "";
    if (icon.includes("?")) {
        classList = "chance";
    }

    return `
        <div class="space ${classList}">
            <div class="space-content">
                <p>${name}</p>
                <div class="dummy"></div>
                <p class="icon">${icon}</p>
                <div class="dummy"></div>
                <p>${cost}</p>
            </div>
        </div>
    `;
}

class Iconic extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!document.head.getHTML().includes("iconic.css")) {
            document.head.insertAdjacentHTML('afterbegin', `
                <link rel="stylesheet" href="iconic.css">
            `);
        }

        const name = this.getAttribute('name');
        const icon = this.getAttribute('icon');
        const cost = this.getAttribute('cost');

        this.innerHTML = iconic(name, icon, cost);
    }
}

customElements.define('board-iconic', Iconic);