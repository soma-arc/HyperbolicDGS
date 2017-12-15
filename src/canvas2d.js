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
        this.boundKeydown = this.keydown.bind(this);
        this.boundKeyup = this.keyup.bind(this);

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

        this.scaleFactor = 1.2;
        this.translate = new Complex(this.canvas.width * 0.5,
                                       this.canvas.height * 0.5);
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
        this.canvas.addEventListener('keydown', this.boundKeydown);
        this.canvas.addEventListener('keyup', this.boundKeyup);
        this.canvas.addEventListener('contextmenu', event => event.preventDefault());
    }

    computeCanvasCoordinates(mx, my) {
        const rect = this.canvas.getBoundingClientRect();
        return new Complex(mx - rect.left,
                           my - rect.top);
    }

    computeCoordinates(mx, my) {
        const rect = this.canvas.getBoundingClientRect();
        return new Complex(this.canvas.width / this.scale * (((mx - rect.left) * this.pixelRatio) /
                                         this.canvas.height - this.canvasRatio),
                           this.canvas.height / this.scale * -(((my - rect.top) * this.pixelRatio) /
                                          this.canvas.height - 0.5));
    }

    render() {
        console.log(typeof this.scene.operationState)
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.translate(this.translate.re, this.translate.im);

        ctx.beginPath();
        ctx.moveTo(-this.translate.re - this.canvas.width, 0);
        ctx.lineTo(-this.translate.re + this.canvas.width, 0);
        ctx.moveTo(0, -this.translate.im - this.canvas.height);
        ctx.lineTo(0, -this.translate.im + this.canvas.height);
        ctx.stroke();
        ctx.moveTo(0, 0);

        ctx.scale(this.scale, -this.scale);
        ctx.lineWidth /= this.scale;
        this.scene.render(ctx);

        ctx.restore();
    }

    mouseDown(event) {
        event.preventDefault();
        this.canvas.focus();
        const mouse = this.computeCoordinates(event.clientX, event.clientY);
        this.mouseState.button = event.button;
        this.mouseState.position = mouse;
        let updated = false;
        if (event.button === Canvas2d.MOUSE_BUTTON_LEFT) {
            updated = this.scene.mouseLeft(this.mouseState);
        } else if (event.button === Canvas2d.MOUSE_BUTTON_WHEEL) {
            updated = this.scene.mouseWheel(this.mouseState);
        } else if (event.button === Canvas2d.MOUSE_BUTTON_RIGHT) {
            this.mouseState.prevTranslate = this.translate;
        }

        if (updated) this.render();

        this.mouseState.prevPosition = this.computeCanvasCoordinates(event.clientX, event.clientY);
        this.mouseState.isPressing = true;
    }

    mouseWheel(event) {
        event.preventDefault();
        if (event.deltaY < 0) {
            this.scale *= this.scaleFactor;
        } else {
            this.scale /= this.scaleFactor;
        }
        this.render();
    }

    mouseMove(event) {
        event.preventDefault();
        if (!this.mouseState.isPressing) return;

        this.mouseState.position = this.computeCoordinates(event.clientX, event.clientY);
        if (this.mouseState.button === Canvas2d.MOUSE_BUTTON_LEFT) {
            const updated = this.scene.mouseLeftDrag(this.mouseState);
            if (updated) this.render();
        } else if (this.mouseState.button === Canvas2d.MOUSE_BUTTON_RIGHT) {
            const mouse = this.computeCanvasCoordinates(event.clientX,
                                                        event.clientY);
            this.translate = this.mouseState.prevTranslate.add(mouse.sub(this.mouseState.prevPosition));
            this.render();
        }
    }

    mouseUp(event) {
        this.mouseState.isPressing = false;
        this.scene.mouseUp(this.mouseState);
    }

    mouseOut(event) {
        this.mouseState.isPressing = false;
    }

    mouseDblClick(event) {
    }

    keydown(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
            console.log('redo');
            this.scene.redo();
            this.render();
        } else if (event.ctrlKey && event.key === 'z') {
            console.log('undo');
            this.scene.undo();
            this.render();
        }
    }

    keyup(event) {
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
