import Scene from '../scene.js';
import HyperbolicLine from '../components/hyperbolicLine.js';

export default class AddHyperbolicLineCommand {
    /**
     * @param {Scene} scene
     * @param {HyperbolicLine} hyperbolicLine
     */
    constructor(scene, hyperbolicLine) {
        this.scene = scene;
        this.hyperbolicLine = hyperbolicLine;
        this.scene.deselectAll();
        this.scene.objects.push(hyperbolicLine);
        hyperbolicLine.selected = true;
        this.scene.selectedObjects.push(hyperbolicLine);
    }

    undo() {
        if (this.scene.objects.length === 0) return;
        this.scene.objects.pop();
    }

    redo() {
        this.scene.objects.push(this.hyperbolicLine);
    }
}
