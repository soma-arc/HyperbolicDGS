import Shape from './shape.js';
import Circle from './circle.js';

export default class CircleFromThreePoints extends Circle {
    /**
     * @param {Point} p1
     * @param {Point} p2
     * @param {Point} p3
     */
    constructor(p1, p2, p3, isPreview) {
        super(0, 0, 0);
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.update();
        this.updateListener = this.update.bind(this);
        this.p1.addUpdateListener(this.updateListener);
        this.p2.addUpdateListener(this.updateListener);
        this.p3.addUpdateListener(this.updateListener);
        this.type = 'CircleFromThreePoints';
        if (isPreview === undefined) {
            this.label = Shape.getLowerLabel;
        } else {
            this.label = '';
        }
    }

    update() {
        const c = Circle.fromPoints(this.p1.values,
                                    this.p2.values,
                                    this.p3.values);
        this.center = c.center;
        this.r = c.r;

        this.updated();
    }
}
