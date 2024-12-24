function corner(style) {
    return `
        <div class="corner" style="${style}">

        </div>
    `;
}

class Corner extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!document.head.getHTML().includes("corner.css")) {
            document.head.insertAdjacentHTML('afterbegin', `
                <link rel="stylesheet" href="corner.css">
            `);
        }

        const style = this.getAttribute('style');

        this.innerHTML = corner(style);
    }
}

customElements.define('board-corner', Corner);