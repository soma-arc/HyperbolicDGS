<template>
  <div id="root">
    <header-panel :scene="scene" :canvasManager="canvasManager"/>
    <middle-panel :scene="scene" :canvasManager="canvasManager"/>
    <footer-panel/>
  </div>
</template>

<script>
import Scene from '../scene.js';
import HeaderPanel from './headerPanel.vue';
import MiddlePanel from './middlePanel.vue';
import FooterPanel from './footerPanel.vue';

export default {
    props: ['scene', 'canvasHandler'],
    components: {
        HeaderPanel, MiddlePanel, FooterPanel
    }
}
</script>

<style>
div {
   -ms-user-select: none; /* IE 10+ */
   -moz-user-select: -moz-none;
   -khtml-user-select: none;
   -webkit-user-select: none;
   user-select: none;
}

#root {
    margin: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>
