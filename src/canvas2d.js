import Scene from './scene.js';
import Complex from './utils/complex.js';

export default class Canvas2d {
    /**
     *
     * @param {String} canvasId
     * @param {Scene} scene
     */
    constructor(canvasId, scene) {
        this.canvasId = canvasId;
        this.scene = scene;
        this.canvas = document.getElementById(this.canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.scale = 200;

        this.boundMouseDown = this.mouseDown.bind(this);
        this.boundMouseUp = this.mouseUp.bind(this);
        this.boundMouseWheel = this.mouseWheel.bind(this);
        this.boundMouseMove = this.mouseMove.bind(this);
        this.boundMouseOut = this.mouseOut.bind(this);
        this.boundDblClickLisntener = this.mouseDblClick.bind(this);

        this.addEventListeners();

        this.pixelRatio = 1; // window.devicePixelRatio;
        this.canvasRatio = this.canvas.width / this.canvas.height / 2;

        this.mouseState = {
            isPressing: false,
            position: new Complex(0, 0),
            prevPosition: new Complex(0, 0),
            prevTranslate: new Complex(0, 0),
            button: -1
        };
    }

    addEventListeners() {
        this.canvas.addEventListener('mousedown',
                                     this.boundMouseDown);
        this.canvas.addEventListener('mouseup',
                                     this.boundMouseUp);
        this.canvas.addEventListener('wheel',
                                     this.boundMouseWheel);
        this.canvas.addEventListener('mousemove',
                                     this.boundMouseMove);
        this.canvas.addEventListener('mouseout',
                                     this.boundMouseOut);
        this.canvas.addEventListener('dblclick',
                                     this.boundDblClick);
    }

    computeCoordinates(mx, my) {
        const rect = this.canvas.getBoundingClientRect();
        return new Complex(this.canvas.width / this.scale * (((mx - rect.left) * this.pixelRatio) /
                                         this.canvas.height - this.canvasRatio),
                           this.canvas.height / this.scale * -(((my - rect.top) * this.pixelRatio) /
                                          this.canvas.height - 0.5));
    }

    render() {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.beginPath();
        ctx.moveTo(0, this.canvas.height * 0.5);
        ctx.lineTo(this.canvas.width, this.canvas.height * 0.5);
        ctx.moveTo(this.canvas.width * 0.5, 0);
        ctx.lineTo(this.canvas.width * 0.5, this.canvas.height);
        ctx.stroke();
        ctx.moveTo(0, 0);

        ctx.translate(this.canvas.width * 0.5, this.canvas.height * 0.5);
        ctx.scale(this.scale, -this.scale);
        ctx.lineWidth /= this.scale;
        this.scene.render(ctx);

        ctx.restore();
    }

    mouseDown(event) {
        const mouse = this.computeCoordinates(event.clientX, event.clientY);
        this.mouseState.position = mouse;
        let updated = false;
        if (event.button === Canvas2d.MOUSE_BUTTON_LEFT) {
            updated = this.scene.mouseLeft(this.mouseState);
        } else if (event.button === Canvas2d.MOUSE_BUTTON_WHEEL) {
            updated = this.scene.mouseWheel(this.mouseState);
        } else if (event.button === Canvas2d.MOUSE_BUTTON_RIGHT) {
            updated = this.scene.mouseRight(this.mouseState);
        }

        if (updated) this.render();

        this.mouseState.prevPosition = mouse;
    }

    mouseWheel(event) {
    }

    mouseMove(event) {
    }

    mouseUp(event) {
    }

    mouseOut(event) {
    }

    mouseDblClick() {
    }

    static get MOUSE_BUTTON_LEFT() {
        return 0;
    }

    static get MOUSE_BUTTON_WHEEL() {
        return 1;
    }

    static get MOUSE_BUTTON_RIGHT() {
        return 2;
    }
}
