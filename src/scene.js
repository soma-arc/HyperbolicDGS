import Complex from './utils/complex.js';
import Circle from './components/circle.js';
import Point from './components/point.js';
import HyperbolicLine from './components/hyperbolicLine.js';
import HyperbolicLineFromCenter from './components/hyperbolicLineFromCenter.js';
import PerpendicularBisector from './components/hyperbolicPerpendicularBisector.js';
import HyperbolicMiddlePoint from './components/hyperbolicMiddlePoint.js';
import PointOnCircle from './components/pointOnCircle.js';
import MoveCommand from './command/moveCommand.js';
import AddShapeCommand from './command/addShapeCommand.js';
import InvertOnPoint from './components/invertOnPoint.js';
import InvertOnCircle from './components/invertOnCircle.js';
import CircleFromThreePoints from './components/circleFromThreePoints.js';

const OBJ_POINT = ['Point', 'PointOnCircle', 'InvertOnPoint'];
const OBJ_CIRCLE = ['PoincareDisk', 'HyperbolicLine', 'HyperbolicLineFromCenter',
                    'HyperbolicPerpendicularBisector', 'InvertOnCircle'];
const OBJ_SELECTION_ORDER = Array.prototype.concat.apply([],
                                                         [OBJ_POINT,
                                                          OBJ_CIRCLE]);
const OBJ_RENDER_ORDER = Array.prototype.concat.apply([],
                                                      [OBJ_CIRCLE,
                                                       OBJ_POINT]);

export default class Scene {
    constructor() {
        this.poincareDisk = new Circle(0, 0, 1);
        this.objects = {};
        this.objects['PoincareDisk'] = [Circle.POINCARE_DISK];

        this.operationState = Scene.OP_STATE_SELECT;

        this.undoStack = [];
        this.redoStack = [];

        this.selectedObjects = [];

        this.previewObjects = [];

        this.isSelectable = false;
    }

    checkSelectable(mouseState) {
        let selectable = false;
        this.selectableObjects = {};
        for (const key of Object.keys(this.objects)) {
            for (const obj of this.objects[key]) {
                if (obj.selectable(mouseState)) {
                    if (!this.selectableObjects.hasOwnProperty(key)) {
                        this.selectableObjects[key] = [];
                    }
                    this.selectableObjects[key].push(obj);
                    selectable = true;
                }
            }
        }

        this.isSelectable = selectable;
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
        for (const obj of this.previewObjects) {
            obj.render(ctx);
        }
        for (const key of OBJ_RENDER_ORDER) {
            if (this.objects.hasOwnProperty(key)) {
                for (const obj of this.objects[key]) {
                    obj.render(ctx);
                }
            }
        }
    }

    select() {
        for (const key of OBJ_SELECTION_ORDER) {
            if (this.selectableObjects.hasOwnProperty(key)) {
                for (const obj of this.selectableObjects[key]) {
                    this.selectObj(obj)
                    return;
                }
            }
        }
    }

    selectObj(obj) {
        obj.select();
        this.selectedObjects.push(obj);
    }

    addCommand(command) {
        this.undoStack.push(command);
        this.discardRedoStack();
    }

    addPoint(mouseState) {
        for (const key of OBJ_POINT) {
            if (this.selectableObjects.hasOwnProperty(key)) {
                this.selectObj(this.selectableObjects[key][0]);
                return false;
            }
        }
        const p = mouseState.position;
        for (const key of OBJ_CIRCLE) {
            if (this.selectableObjects.hasOwnProperty(key)) {
                const c = this.selectableObjects[key][0];
                const point = new PointOnCircle(p, c);
                this.addCommand(new AddShapeCommand(this, point, point.type));
                return true;
            }
        }

        const point = new Point(p.re, p.im);
        this.addCommand(new AddShapeCommand(this, point, point.type));
        return true;
    }

    addHyperbolicLine(mouseState) {
        if (this.selectedObjects.length === 0) {
            this.addPoint(mouseState);
        } else if (this.selectedObjects.length === 1) {
            this.addPoint(mouseState);
            const hypLine = new HyperbolicLine(this.selectedObjects[0],
                                               this.selectedObjects[1]);
            this.addCommand(new AddShapeCommand(this, hypLine, hypLine.type));
            this.deselectAll();
            this.removePreviewObjects();
        }
    }

    addHyperbolicLineFromCenter(mouseState) {
        if (this.selectedObjects.length === 0) {
            this.addPoint(mouseState);
            const hypLine = new HyperbolicLineFromCenter(this.selectedObjects[0]);
            this.addCommand(new AddShapeCommand(this, hypLine, hypLine.type));
            this.deselectAll();
            this.removePreviewObjects();
        }
    }

    addPerpendicularBisector(mouseState) {
        if (this.selectedObjects.length === 0) {
            this.addPoint(mouseState);
        } else if (this.selectedObjects.length === 1) {
            this.addPoint(mouseState);
            const hypLine = new PerpendicularBisector(this.selectedObjects[0],
                                                      this.selectedObjects[1]);
            this.addCommand(new AddShapeCommand(this, hypLine, hypLine.type));
            this.deselectAll();
            this.removePreviewObjects();
        }
    }

    addMiddlePoint(mouseState) {
        if (this.selectedObjects.length === 0) {
            this.addPoint(mouseState);
        } else if (this.selectedObjects.length === 1) {
            this.addPoint(mouseState);
            const p = new HyperbolicMiddlePoint(this.selectedObjects[0],
                                                this.selectedObjects[1]);
            this.addCommand(new AddShapeCommand(this, p, p.type));
            this.deselectAll();
            this.removePreviewObjects();
        }
    }

    applyInversion(mouseState) {
        if (this.selectedObjects.length === 0) {
            for (const key of OBJ_CIRCLE) {
                if (this.selectableObjects.hasOwnProperty(key)) {
                    this.selectObj(this.selectableObjects[key][0]);
                }
            }
        } else if (this.selectedObjects.length === 1) {
            for (const key of OBJ_POINT) {
                if (this.selectableObjects.hasOwnProperty(key)) {
                    const p = new InvertOnPoint(this.selectableObjects[key][0],
                                                this.selectedObjects[0]);
                    this.addCommand(new AddShapeCommand(this, p, p.type));
                    this.deselectAll();
                    return;
                }
            }
            for (const key of OBJ_CIRCLE) {
                if (this.selectableObjects.hasOwnProperty(key)) {
                    const p = new InvertOnCircle(this.selectableObjects[key][0],
                                                 this.selectedObjects[0]);
                    this.addCommand(new AddShapeCommand(this, p, p.type));
                    this.deselectAll();
                    return;
                }
            }
        }
    }

    mouseLeft(mouseState) {
        this.moved = false;

        switch (this.operationState) {
        case Scene.OP_STATE_SELECT: {
            this.deselectAll();
            this.select(mouseState);
            break;
        }
        case Scene.OP_STATE_POINT: {
            this.deselectAll();
            this.addPoint(mouseState);
            break;
        }
        case Scene.OP_STATE_HYPERBOLIC_LINE: {
            this.addHyperbolicLine(mouseState);
            break;
        }
        case Scene.OP_STATE_HYPERBOLIC_LINE_FROM_CENTER: {
            this.addHyperbolicLineFromCenter(mouseState);
            break;
        }
        case Scene.OP_STATE_PERPENDICULAR_BISECTOR: {
            this.addPerpendicularBisector(mouseState);
            break;
        }
        case Scene.OP_STATE_HYPERBOLIC_MIDDLE_POINT: {
            this.addMiddlePoint(mouseState);
            break;
        }
        case Scene.OP_STATE_INVERSION: {
            this.applyInversion(mouseState);
            break;
        }
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

    mouseMove(mouseState) {
        this.checkSelectable(mouseState);
        switch (this.operationState) {
        case Scene.OP_STATE_HYPERBOLIC_LINE: {
            if (this.selectedObjects.length === 1) {
                this.removePreviewObjects();
                const p = new Point(mouseState.position.re,
                                    mouseState.position.im,
                                    true);
                this.previewObjects.push(p);
                this.previewObjects.push(new HyperbolicLine(this.selectedObjects[0], p, true));
                return true;
            }
            break;
        }
        case Scene.OP_STATE_HYPERBOLIC_LINE_FROM_CENTER: {
            this.removePreviewObjects();
            const p = new Point(mouseState.position.re,
                                mouseState.position.im,
                                true);
            this.previewObjects.push(p);
            this.previewObjects.push(new HyperbolicLineFromCenter(p, true));
            return true;
        }
        case Scene.OP_STATE_PERPENDICULAR_BISECTOR: {
            if (this.selectedObjects.length === 1) {
                this.removePreviewObjects();
                const p = new Point(mouseState.position.re,
                                    mouseState.position.im,
                                    true);
                this.previewObjects.push(p);
                this.previewObjects.push(new PerpendicularBisector(this.selectedObjects[0],
                                                                   p, true));
                return true;
            }
            break;
        }
        case Scene.OP_STATE_HYPERBOLIC_MIDDLE_POINT: {
            if (this.selectedObjects.length === 1) {
                this.removePreviewObjects();
                const p = new Point(mouseState.position.re,
                                    mouseState.position.im,
                                    true);
                this.previewObjects.push(p);
                this.previewObjects.push(new HyperbolicMiddlePoint(this.selectedObjects[0],
                                                                   p, true));
                return true;
            }
            break;
        }
        }
        this.previewObjects = [];
        return false;
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

    removePreviewObjects() {
        for (const obj of this.previewObjects) {
            obj.removeUpdateListeners();
        }
        this.previewObjects = [];
    }

    mouseOut(mouseState) {
        this.removePreviewObjects();
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

    static get OP_STATE_HYPERBOLIC_LINE() {
        return 2;
    }

    static get OP_STATE_HYPERBOLIC_LINE_FROM_CENTER() {
        return 3;
    }

    static get OP_STATE_PERPENDICULAR_BISECTOR() {
        return 4;
    }

    static get OP_STATE_HYPERBOLIC_MIDDLE_POINT() {
        return 5;
    }

    static get OP_STATE_INVERSION() {
        return 6;
    }

    static get OP_STATE_CIRCLE_FROM_THREE_POINTS() {
        return 7;
    }
}
