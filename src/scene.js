import Circle from './components/circle.js';
import Point from './components/point.js';
import AddPointCommand from './command/addPointCommand.js';

export default class Scene {
    constructor() {
        const poincareDisk = new Circle(0, 0, 1);
        this.objects = [poincareDisk];

        this.operationStete = Scene.OP_STATE_POINT;

        this.undoStack = [];
        this.redoStack = [];
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
        for (const obj of this.objects) {
            obj.render(ctx);
        }
    }

    mouseLeft(mouseState) {
        const p = mouseState.position;
        const point = new Point(p.re, p.im)
        this.objects.push(point);
        this.undoStack.push(new AddPointCommand(this, point));
        return true;
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
