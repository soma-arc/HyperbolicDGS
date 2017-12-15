import Complex from './utils/complex.js';
import Circle from './components/circle.js';
import Point from './components/point.js';
import AddPointCommand from './command/addPointCommand.js';
import MoveCommand from './command/moveCommand.js';

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

    selectObj(mouseState) {
        for (const obj of this.objects) {
            if (obj.selected) continue;

            const selected = obj.select(mouseState);
            if (selected) {
                this.selectedObjects.push(obj);
                return true;
            }
        }
        return false;
    }

    addCommand(command) {
        this.undoStack.push(command);
        this.discardRedoStack();
    }

    mouseLeft(mouseState) {
        const p = mouseState.position;
        this.deselectAll();
        this.moved = false;

        switch (this.operationState) {
        case Scene.OP_STATE_SELECT:
            this.selectObj(mouseState);
            break;
        case Scene.OP_STATE_POINT:
            const selected = this.selectObj(mouseState);
            if (selected) break;

            const point = new Point(p.re, p.im)
            this.addCommand(new AddPointCommand(this, point));
            break;
        }
        return true;
    }

    mouseLeftDrag(mouseState) {
        let moved = false;
        for (const obj of this.selectedObjects) {
            moved = moved || obj.move(mouseState);
        }
        this.moved = this.moved || moved;
        return moved;
    }

    mouseWheel(mouseState) {
    }

    mouseRight(mouseState) {
    }

    mouseUp(mouseState) {
        if (this.moved) {
            for (const obj of this.selectedObjects) {
                const d = mouseState.position.sub(mouseState.prevPosition);
                if (d.abs() < 0.01) continue;
                this.addCommand(new MoveCommand(obj, d));
            }
        }
    }

    deselectAll() {
        for (const obj of this.selectedObjects) {
            obj.deselect();
        }
        this.selectedObjects = [];
    }

    static get OP_STATE_SELECT() {
        return 0;
    }

    static get OP_STATE_POINT() {
        return 1;
    }
}
