import Scene from '../scene.js';
import Point from '../components/point.js';

export default class AddPointCommand {
    /**
     *
     * @param {Scene} scene
     * @param {Point} point
     */
    constructor(scene, point) {
        this.scene = scene;
        this.point = point
        this.scene.deselectAll();
        this.scene.objects.push(point);
        point.selected = true;
        this.scene.selectedObjects.push(point);
    }

    undo() {
        if (this.scene.objects.length === 0) return;
        this.scene.objects.pop();
    }

    redo() {
        this.scene.objects.push(this.point);
    }
}
