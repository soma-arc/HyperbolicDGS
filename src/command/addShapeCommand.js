import Scene from '../scene.js';
import Shape from '../components/shape.js';
import Vue from 'vue';


export default class AddShapeCommand {
    /**
     * @param {Scene} scene
     * @param {Shape} shape
     * @param {String} type
     */
    constructor(scene, shape, type) {
        this.scene = scene;
        this.shape = shape;
        this.type = type;
        this.scene.deselectAll();

        if (!this.scene.objects.hasOwnProperty(type)) {
            Vue.set(this.scene.objects, type, []);
        }

        this.scene.objects[type].push(shape);
        shape.selected = true;
        this.scene.selectedObjects.push(shape);
    }

    undo() {
        if (this.scene.objects.length === 0) return;
        this.scene.objects[this.type].pop();
    }

    redo() {
        this.scene.objects[this.type].push(this.shape);
    }
}
