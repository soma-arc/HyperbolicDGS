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
            prevCanvasCoord: new Complex(0, 0),
            prevTranslate: new Complex(0, 0),
            button: -1
        };

        this.resizeCanvas();
        this.scaleFactor = 1.2;
        this.translate = new Complex(0, 0);
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

    resizeCanvas() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth * this.pixelRatio;
        this.canvas.height = parent.clientHeight * this.pixelRatio;
        this.canvasRatio = this.canvas.width / this.canvas.height / 2;
    }

    computeCanvasCoordinates(mx, my) {
        const rect = this.canvas.getBoundingClientRect();
        return new Complex(mx - rect.left,
                           my - rect.top);
    }

    computeCoordinates(mx, my) {
        const rect = this.canvas.getBoundingClientRect();
        return new Complex(this.canvas.width / this.scale * (((mx - rect.left - this.translate.re) * this.pixelRatio) /
                                                             this.canvas.width - 0.5),
                           this.canvas.height / this.scale * -(((my - rect.top - this.translate.im) * this.pixelRatio) /
                                                               this.canvas.height - 0.5));
    }

    render() {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.translate(this.canvas.width * 0.5 + this.translate.re,
                      this.canvas.height * 0.5 + this.translate.im);

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

        this.mouseState.prevCanvasCoord = this.computeCanvasCoordinates(event.clientX, event.clientY);
        this.mouseState.prevPosition = mouse;
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

        this.mouseState.position = this.computeCoordinates(event.clientX, event.clientY);
        if (this.mouseState.button === Canvas2d.MOUSE_BUTTON_LEFT) {
            if (!this.mouseState.isPressing) return;
            const updated = this.scene.mouseLeftDrag(this.mouseState);
            if (updated) this.render();
        } else if (this.mouseState.button === Canvas2d.MOUSE_BUTTON_RIGHT) {
            if (!this.mouseState.isPressing) return;
            const mouse = this.computeCanvasCoordinates(event.clientX,
                                                        event.clientY);
            this.translate = this.mouseState.prevTranslate.add(mouse.sub(this.mouseState.prevCanvasCoord));
            this.render();
        } else {
            const updated = this.scene.mouseMove(this.mouseState);
            if (updated) this.render();
        }
    }

    mouseUp(event) {
        this.mouseState.isPressing = false;
        this.mouseState.button = -1;
        this.scene.mouseUp(this.mouseState);
    }

    mouseOut(event) {
        this.mouseState.isPressing = false;
        this.scene.mouseOut(this.mouseState);
        this.render();
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
