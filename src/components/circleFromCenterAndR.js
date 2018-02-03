import Shape from './shape.js';
import Circle from './circle.js';
import Complex from '../utils/complex.js';

export default class CircleFromCenterAndR extends Circle {
    /**
     * @param {Point} centerPoint
     * @param {Point} p1
     */
    constructor(centerPoint, p1, isPreview) {
        super(0, 0, 0);
        this.centerPoint = centerPoint;
        this.p1 = p1;
        this.update();
        this.updateListener = this.update.bind(this);
        this.centerPoint.addUpdateListener(this.updateListener);
        this.p1.addUpdateListener(this.updateListener);
        this.type = 'CircleFromCenterAndR';
        if (isPreview === undefined) {
            this.label = Shape.getLowerLabel;
        } else {
            this.label = '';
        }
    }

    update() {
        this.center = this.centerPoint.values;
        this.r = Complex.distance(this.centerPoint.values,
                                  this.p1.values);

        this.updated();
    }
}
