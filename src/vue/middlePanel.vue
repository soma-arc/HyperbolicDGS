<template>
  <div class="contentParent">
    <div class="canvasParent">            
      <canvas id="mainCanvas" tabIndex="1000"/><br>
    </div>
    <controlPanel :scene="scene" :canvasManager="canvasManager"/>
  </div>
</template>

<script>
import ControlPanel from './controlPanel.vue';

export default {
    props: ['scene', 'canvasHandler'],
    methods: {
        render: function() {
            this.canvasHandler.render();
        },
        changeMouseMode: function() {
            this.scene.deselectAll();
            this.canvasHandler.render();
        }
    },
    components: {
        ControlPanel
    }
}
</script>

<style>
canvas:focus {
    outline: none;
}

.contentParent {
    flex: 1;
    display: flex;
    flex-direction: row;
}

.canvasParent {
    flex: 1;
    display: flex;
    width:100%;
    border-style: ridge;
    overflow: hidden;
}
</style>
