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
        this.scene.objects.push(point);
    }

    undo() {
        if (this.scene.objects.length === 0) return;
        this.scene.objects.pop();
    }

    redo() {
        this.scene.objects.push(this.point);
    }
}
