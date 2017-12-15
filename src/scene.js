import Circle from './components/circle.js';
import Point from './components/point.js';
import AddPointCommand from './command/addPointCommand.js';

export default class Scene {
    constructor() {
        this.poincareDisk = new Circle(0, 0, 1);
        this.objects = [];

        this.operationState = Scene.OP_STATE_SELECT;

        this.undoStack = [];
        this.redoStack = [];

        this.selectedObjects = [];
    }

    undo() {
        if (this.undoStack.length === 0) return;
        const command = this.undoStack.pop();
        command.undo();
        this.redoStack.push(command);
    }

    redo() {
        if (this.redoStack.length === 0) return;
        const command = this.redoStack.pop();
        command.redo();
        this.undoStack.push(command);
    }

    discardRedoStack() {
        this.redoStack = [];
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        this.poincareDisk.render(ctx);
        for (const obj of this.objects) {
            obj.render(ctx);
        }
    }

    mouseLeft(mouseState) {
        const p = mouseState.position;
        switch (this.operationState) {
        case Scene.OP_STATE_SELECT:
            for (const obj of this.objects) {
                const selected = obj.select(mouseState);
                if (selected) this.selectedObjects.push(obj);
            }
            break;
        case Scene.OP_STATE_POINT:
            const point = new Point(p.re, p.im)
            this.undoStack.push(new AddPointCommand(this, point));
            this.discardRedoStack();
            break;
        }
        return true;
    }

    mouseMove(mouseState) {
    }

    mouseWheel(mouseState) {
    }

    mouseRight(mouseState) {
    }

    static get OP_STATE_SELECT() {
        return 0;
    }

    static get OP_STATE_POINT() {
        return 1;
    }
}
