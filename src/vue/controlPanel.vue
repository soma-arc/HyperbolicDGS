<template>
<div class="controlPanel">
  <b-tabs position="is-centered" v-model="activeTab">
    <b-tab-item label="Component">
      <section id="component">
        <label><b>Basic</b></label>
        <b-field>
          <b-radio-button v-model.number="scene.operationState"
                          :native-value="OP_STATE_SELECT"
                          @input="changeMouseMode"
                          size="is-small">
            <span>Select</span>
          </b-radio-button>
          <b-radio-button v-model.number="scene.operationState"
                          :native-value="OP_STATE_POINT"
                          @input="changeMouseMode"
                          size="is-small">
            <span>Point</span>
          </b-radio-button>
          <b-radio-button v-model.number="scene.operationState"
                          :native-value="OP_STATE_INVERSION"
                          @input="changeMouseMode"
                          size="is-small">
            <span>Inversion</span>
          </b-radio-button>
        </b-field>
        <label><b>Hyperbolic Line</b></label>
        <b-field>
          <b-radio-button v-model.number="scene.operationState"
                          :native-value="OP_STATE_HYPERBOLIC_LINE"
                          @input="changeMouseMode"
                          size="is-small">
            <span>TwoPoints</span>
          </b-radio-button>
          
          <b-radio-button v-model.number="scene.operationState"
                          :native-value="OP_STATE_HYPERBOLIC_LINE_FROM_CENTER"
                          @input="changeMouseMode"
                          size="is-small">
            <span>FromCenter</span>
          </b-radio-button>
          <b-radio-button v-model.number="scene.operationState"
                          :native-value="OP_STATE_HYPERBOLIC_TANGENT_LINES" @input="changeMouseMode"
                          size="is-small">
            <span>Tangent</span>
          </b-radio-button>
        </b-field>
        <label><b>Bisection</b></label>
        <b-field>
          <b-radio-button v-model.number="scene.operationState"
                          :native-value="OP_STATE_PERPENDICULAR_BISECTOR" @input="changeMouseMode"
                          size="is-small">
            <span>PerpendicularBisector</span>
          </b-radio-button>

          <b-radio-button v-model.number="scene.operationState"
                          :native-value="OP_STATE_HYPERBOLIC_MIDDLE_POINT" @input="changeMouseMode"
                          size="is-small">
                <span>MiddlePoint</span>
              </b-radio-button>
            </b-field>
            <label><b>Circle</b></label>
            <b-field>
              <b-radio-button v-model.number="scene.operationState"
                              :native-value="OP_STATE_CIRCLE_FROM_THREE_POINTS" @input="changeMouseMode"
                              size="is-small">
                <span>ThreePoints</span>
              </b-radio-button>

              <b-radio-button v-model.number="scene.operationState"
                              :native-value="OP_STATE_CIRCLE_FROM_CENTER_AND_R" @input="changeMouseMode"
                              size="is-small">
                <span>CenterAndR</span>
              </b-radio-button>
            </b-field>
            <label><b>Euclidean Line</b></label>
            <b-field>
              <b-radio-button v-model.number="scene.operationState"
                              :native-value="OP_STATE_EUCLIDEAN_LINE" @input="changeMouseMode"
                              size="is-small">
                <span>TwoPoints</span>
              </b-radio-button>

                <b-radio-button v-model.number="scene.operationState"
                                :native-value="OP_STATE_EUCLIDEAN_TANGENT_LINES" @input="changeMouseMode"
                                size="is-small">
                  <span>Tangent</span>
                </b-radio-button>
            </b-field>
          </section>
        </b-tab-item>
        <b-tab-item label="Scene">
          <section>
            <b-table :data="sceneObjectsList"
                     :columns="columns"
                     :paginated="true"
                     :per-page="perPage"
                     :current-page.sync="currentPage"
                     :pagination-simple="true"
                     :stripe="true"
                     :hoverable="true"
                     :selected.sync="tableSelected">
            <template slot="empty">
                <section class="section">
                    <div class="content has-text-grey has-text-centered">
                        <p>
                            <b-icon
                                icon="emoticon-sad"
                                size="is-large">
                            </b-icon>
                        </p>
                        <p>Nothing here.</p>
                    </div>
                </section>
            </template>
            </b-table>
          </section>
        </b-tab-item>
        <b-tab-item label="Render">
        </b-tab-item>
      </b-tabs>

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
            'OP_STATE_HYPERBOLIC_MIDDLE_POINT': Scene.OP_STATE_HYPERBOLIC_MIDDLE_POINT,
            'OP_STATE_INVERSION': Scene.OP_STATE_INVERSION,
            'OP_STATE_CIRCLE_FROM_THREE_POINTS': Scene.OP_STATE_CIRCLE_FROM_THREE_POINTS,
            'OP_STATE_CIRCLE_FROM_CENTER_AND_R': Scene.OP_STATE_CIRCLE_FROM_CENTER_AND_R,
            'OP_STATE_EUCLIDEAN_LINE': Scene.OP_STATE_EUCLIDEAN_LINE,
            'OP_STATE_EUCLIDEAN_TANGENT_LINES': Scene.OP_STATE_EUCLIDEAN_TANGENT_LINES,
            'OP_STATE_HYPERBOLIC_TANGENT_LINES': Scene.OP_STATE_HYPERBOLIC_TANGENT_LINES,
            'activeTab': 0,
            'columns': [
                {
                    field: 'label',
                    label: 'Label',
                    width: '40',
                    numeric: true
                },
                {
                    field: 'type',
                    label: 'Type',
                },
            ],
            'selected': null,
            'currentPage': 1,
            'perPage': 5,
            'tableSelected': null,
        }
    },
    methods: {
        changeMouseMode: function() {
            this.scene.deselectAll();
            this.canvasHandler.render();
        }
    },
    computed: {
        sceneObjectsList: function() {
            return Array.prototype.concat.apply([],
                                                Object.values(this.scene.objects));
        }
    }
}
</script>

<style>
.controlPanel {
    border-style: ridge;
    border-color: gray;

    flex-direction: column;
    width:300px;
    overflow: hidden;
}

</style>
