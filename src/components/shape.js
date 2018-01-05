export default class Shape {
    constructor() {
        this.id = new Date().getTime();
        this.selected = false;

        this.updateListeners = [];
    }

    update() {}
    render(ctx) {}
    select(mouseState) {
        return false;
    }
    move(mouseState) {}
    updated(mouseState) {}

    deselect() {
        this.selected = false;
    }

    updated() {
        for (const listener of this.updateListeners) {
            listener();
        }
    }

    addUpdateListener(listener) {
        this.updateListeners.push(listener);
    }
}
