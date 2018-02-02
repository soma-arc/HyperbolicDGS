<template>
  <div class="controlPanel">
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
    <input type="radio" value="5" @change="changeMouseMode"
           v-model.number="scene.operationState">Middle Point
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
            'OP_STATE_PERPENDICULAR_BISECTOR': Scene.OP_STATE_PERPENDICULAR_BISECTOR,
            'OP_STATE_HYPERBOLIC_MIDDLE_POINT': Scene.OP_STATE_HYPERBOLIC_MIDDLE_POINT
            }
    },
}
</script>

<style>
.controlPanel {
    border-style: ridge;
    border-color: gray;
    background-color: Gainsboro;
    display: flex;
    flex-direction: column;
    width:300px;
}
</style>
