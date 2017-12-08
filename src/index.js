import Vue from 'vue';
import Root from './vue/root.vue';
import Scene from './scene.js';
import CanvasHandler from './canvasHandler.js';

window.addEventListener('load', () => {
    const scene = new Scene();
    const canvasHandler = new CanvasHandler(scene);
    
    const d = { 'scene': scene,
                'canvasHandler': canvasHandler };

    /* eslint-disable no-unused-vars */
    const app = new Vue({
        el: '#vue-ui',
        data: d,
        render: (h) => {
            return h('root', { 'props': d });
        },
        components: { 'root': Root }
    });

    canvasHandler.init();

    canvasHandler.render();
});
