import Shape from '../components/shape.js';
import Complex from '../utils/complex.js';

export default class MoveCommand {
    /**
     * 
     * @param {Shape} object
     * @param {Complex} translation
     */
    constructor(object, translation) {
        this.object = object;
        this.translation = translation;
        this.revTranslation = translation.scale(-1);
    }

    undo() {
        this.object.translate(this.revTranslation);
    }

    redo() {
        this.object.translate(this.translation);
    }
}
