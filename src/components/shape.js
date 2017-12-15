export default class Shape {
    constructor() {
        this.id = new Date().getTime();
        this.selected = false;
    }

    update() {}
    render(ctx) {}
    select(mouseState) {}
    move(mouseState) {}
    updated(mouseState) {}
    deselect() {
        this.selected = false;
    }
}
