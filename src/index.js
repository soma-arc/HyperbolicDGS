import Vue from 'vue';
import Root from './vue/root.vue';

window.addEventListener('load', () => {
    console.log('hello');

    const d = {};
    /* eslint-disable no-unused-vars */
    const app = new Vue({
        el: '#vue-ui',
        data: d,
        render: (h) => {
            return h('root', { 'props': d });
        },
        components: { 'root': Root }
    });
});
