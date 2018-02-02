<template>
  <div class="contentParent">
    <div class="canvasParent"
         v-bind:class="{ selectable: scene.isSelectable }">
      <canvas id="mainCanvas" tabIndex="1000"/><br>
    </div>
    <controlPanel :scene="scene" :canvasHandler="canvasHandler"/>
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
    },
    components: {
        ControlPanel
    },
    data: function() {
        return {
        }
    }
}
</script>

<style>
canvas:focus {
    outline: none;
}

.selectable {
    cursor: pointer;
}

.contentParent {
    flex: 1;
    display: flex;
    flex-direction: row;
    overflow: hidden;
}

.canvasParent {
    flex: 1;
    display: flex;
    width:100%;
    border-style: ridge;
    border-color: gray;
    overflow: hidden;
}
</style>
