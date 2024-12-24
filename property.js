function property(name, color, cost) {
    return `
        <div class="space">
            <div class="space-color" style="background-color: ${color}"></div>

            <div class="space-content">
                <p>${name}</p>
                <div class="dummy"></div>
                <p>${cost}&cent;</p>
            </div>
        </div>
    `;
}

class Property extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        document.head.insertAdjacentHTML('afterbegin', `
            <link rel="stylesheet" href="property.css">
        `);

        const name = this.getAttribute('name');
        const color = this.getAttribute('color');
        const cost = this.getAttribute('cost');

        this.innerHTML = property(name, color, cost);
    }
}

customElements.define('board-property', Property);