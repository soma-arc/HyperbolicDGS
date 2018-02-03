let UpperLabelIndex = 0;
let LowerLabelIndex = 0;
export default class Shape {
    constructor() {
        this.id = new Date().getTime();
        this.selected = false;

        this.updateListeners = [];
        this.label = this.id;
    }

    update() {}
    render(ctx) {}
    selectable(mouseState) {}
    select() {
        this.selected = true;
    }
    move(mouseState) {}
    updated(mouseState) {}

    deselect() {
        this.selected = false;
    }

    updated () {
        for (const listener of this.updateListeners) {
            listener();
        }
    }

    addUpdateListener(listener) {
        this.updateListeners.push(listener);
    }

    removeUpdateListener(listener) {
        const idx = this.updateListeners.findIndex(
            (element, index, array) => {
                return element === listener;
            },
            listener
        );
        if (idx === -1) return;

        this.updateListeners.splice(idx, 1);
    }

    removeUpdateListeners() {}

    static get getLowerLabel() {
        const label = String.fromCharCode(97 + LowerLabelIndex % 26);
        LowerLabelIndex++;
        return label;
    }

    static get getUpperLabel() {
        const label = String.fromCharCode(65 + UpperLabelIndex % 26);
        UpperLabelIndex++;
        return label;
    }
}
