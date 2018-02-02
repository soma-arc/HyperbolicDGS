import Vue from 'vue';
import Buefy from 'buefy';
import Root from './vue/root.vue';
import Scene from './scene.js';
import CanvasHandler from './canvasHandler.js';

window.addEventListener('load', () => {
    Vue.use(Buefy);
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
    canvasHandler.resize();

    let resizeTimer = setTimeout(canvasHandler.resizeCallback, 500);
    window.addEventListener('resize', () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(canvasHandler.resizeCallback, 500);
    });

    canvasHandler.render();
});
