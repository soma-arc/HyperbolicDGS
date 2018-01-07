<template>
<div>
  <canvas id="mainCanvas" width="512px" height="512px"
          tabIndex="1000"></canvas><br>
  <input type="radio" value="0" @change="changeMouseMode"
         v-model.number="scene.operationState">Select
  <input type="radio" value="1" @change="changeMouseMode"
         v-model.number="scene.operationState">Point
  <input type="radio" value="2" @change="changeMouseMode"
         v-model.number="scene.operationState">Hyperbolic Line
  <input type="radio" value="3" @change="changeMouseMode"
         v-model.number="scene.operationState">Hyperbolic Line from Center
  <input type="radio" value="4" @change="changeMouseMode"
         v-model.number="scene.operationState">Perpendicular Bisector
</div>
</template>

<script>
  import Scene from '../scene.js';
  export default {
      props: ['scene', 'canvasHandler'],
      data: function() {
          return {
              'OP_STATE_SELECT': Scene.OP_STATE_SELECT,
              'OP_STATE_POINT': Scene.OP_STATE_POINT,
              'OP_STATE_HYPERBOLIC_LINE': Scene.OP_STATE_HYPERBOLIC_LINE,
              'OP_STATE_HYPERBOLIC_LINE_FROM_CENTER': Scene.OP_STATE_HYPERBOLIC_LINE_FROM_CENTER,
              'OP_STATE_PERPENDICULAR_BISECTOR': Scene.OP_STATE_PERPENDICULAR_BISECTOR
          }
      },
      methods: {
          render: function() {
              this.canvasHandler.render();
          },
          changeMouseMode: function() {
              this.scene.deselectAll();
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
