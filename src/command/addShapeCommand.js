import Scene from '../scene.js';
import Shape from '../components/shape.js';;

export default class AddShapeCommand {
    /**
     * @param {Scene} scene
     * @param {Shape} shape
     */
    constructor(scene, shape) {
        this.scene = scene;
        this.shape = shape;
        this.scene.deselectAll();
        this.scene.objects.push(shape);
        shape.selected = true;
        this.scene.selectedObjects.push(shape);
    }

    undo() {
        if (this.scene.objects.length === 0) return;
        this.scene.objects.pop();
    }

    redo() {
        this.scene.objects.push(this.shape);
    }
}
