export default class Shape {
    constructor() {
        this.id = new Date().getTime();
    }

    update() {}
    render(ctx) {}
    select(mouseState) {}
    move(mouseState) {}
    updated(mouseState) {}
}
