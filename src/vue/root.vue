<template>
  <div>
    <canvas id="mainCanvas" width="512px" height="512px"
            tabIndex="1000"></canvas><br>
    <input type="radio" value="0"
           v-model.number="scene.operationState">Select
    <input type="radio" value="1"
           v-model.number="scene.operationState">Point
  </div>
</template>

<script>
  import Scene from '../scene.js';
  export default {
      props: ['scene', 'canvasHandler'],
      data: function() {
          return {
              'OP_STATE_SELECT': Scene.OP_STATE_SELECT,
              'OP_STATE_POINT': Scene.OP_STATE_POINT
          }
      },
      methods: {
          render: function() {
              this.canvasHandler.render();
          }
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

canvas:focus {
    outline: none;
}
</style>
