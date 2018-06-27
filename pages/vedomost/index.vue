<template>
  <div class="row">
    <div class="col-6 text-center">
      <div class="card">
        <div class="card-body">
          <h5>Ввод данных</h5>
          <b-input-group class="mt-2" prepend="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Из&nbsp;&nbsp;&nbsp;&nbsp;">
            <b-form-input v-model="from" placeholder="Отправляющиее учреждение"></b-form-input>
          </b-input-group>
          <b-input-group class="mt-2" prepend="В адрес">
            <b-form-input v-model="to" placeholder="Учреждение назначения"></b-form-input>
            <b-dropdown :disabled="!$store.state.savedDest.length" text="Dropdown" variant="success" slot="append">
              <i slot="button-content" class="fa fa-fw fa-save"></i>
              <b-dropdown-item @click="to = dest" v-for="(dest, index) in $store.state.savedDest" :key="index + 'savedDestDropdown'">{{dest}}</b-dropdown-item>
            </b-dropdown>
          </b-input-group>
          <b-input-group class="mt-2" prepend="&nbsp;&nbsp;&nbsp;&nbsp;ШИ&nbsp;&nbsp;&nbsp;&nbsp;">
            <b-form-input v-model="number" placeholder="Мешок № / ШИ"></b-form-input>
          </b-input-group>
          <b-input-group class="mt-2" prepend="&nbsp;&nbsp;Вес А&nbsp;&nbsp;">
            <b-form-input v-model="weightA" placeholder="Вес АВИА, кг"></b-form-input>
          </b-input-group>
          <b-input-group class="mt-2" prepend="&nbsp;&nbsp;Вес Н&nbsp;&nbsp;">
            <b-form-input v-model="weightG" placeholder="Вес НАЗЕМНЫЙ, кг"></b-form-input>
          </b-input-group>
          <b-input-group>
            <b-form-select v-model="selectedOperator" :options="operators" class="mb-3 mt-2" />
            <b-input-group-append class="mb-3 mt-2">
              <nuxt-link to="/settings">
                <b-btn title="Добавить сотрудника в программу" variant="outline-success">
                  <i class="fa fa-fw fa-plus"></i>
                </b-btn>
              </nuxt-link>
            </b-input-group-append>
          </b-input-group>
          <div class="mt-2">
            <button @click="print()" class="btn btn-success w-100">Печать
              <i class="fa fa-fw fa-print"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-6 text-center">
      <div class="card">
        <div class="card-body">
          <h5>Предварительный просмотр</h5>
          <v-stage v-show="false" :config="{ height: 1242, width: 880 }">
            <v-layer v-if="canvasImage" ref="vedomost">
              <v-image :config="{x: 0, y: 0, width: 880, height: 1242, image: canvasImage}"></v-image>
              <v-text :config="{
                x: 130, y: 235, text: from, fontSize: 24, fontFamily: 'Arial', fill: 'black', strokeWidth: 3
              }"></v-text>
              <v-text :config="{
                x: 180, y: 290, text: to, fontSize: 24, fontFamily: 'Arial', fill: 'black', strokeWidth: 3
              }"></v-text>
              <v-text :config="{
                x: 260, y: 360, text: number, fontSize: 24, fontFamily: 'Arial', fill: 'black', strokeWidth: 3
              }"></v-text>
              <v-text :config="{
                x: 50, y: 496, text: weightA, width: 400, align: 'center', fontSize: 24, fontFamily: 'Arial', fill: 'black', strokeWidth: 3
              }"></v-text>
              <v-text :config="{
                x: 440, y: 496, text: weightG, width: 400, fontSize: 24, align: 'center', fontFamily: 'Arial', fill: 'black', strokeWidth: 3
              }"></v-text>
              <v-text :config="{
                x: 90, y: 1130, text: currentOperatorName, fontSize: 20, fontFamily: 'Arial', fill: 'black', strokeWidth: 3
              }"></v-text>
            </v-layer>
          </v-stage>
          <div class="vedomost-preview mt-1">
            <img v-if="image" class="img-fluid" :src="image.src" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  middleware: 'storage',

  head: {
    style: [
      { cssText: '@media print{@page {size: landscape}}', type: 'text/css' }
    ],
    bodyAttrs: {
      class: 'with-print-container'
    }
  },

  data() {
    return {
      from: this.$store.state.opsNumber ? `ОПС ${this.$store.state.opsNumber}` : '',
      to: '',
      number: '',
      weightA: '0.000',
      weightG: '0.000',
      canvasImage: undefined,
      image: undefined,
      breakers: [],
      selectedOperator: undefined,
      operators: this.$store.getters.selectPeople
    }
  },

  methods: {
    setBackground() {
      this.canvasImage = new Image()
      this.canvasImage.src = this.$sprites.vedomost
    },
    generateImage() {
      let self = this
      let ref = this.$refs.vedomost
      if (ref) {
        ref.getStage().toImage({
          width: 880, height: 1242, callback(image) {
            self.image = image
          }
        })
      }
    },
    addDest() {
      if (!this.to || !this.$store.state.saveDest) {
        return
      }
      this.$store.dispatch('addDest', this.to)
    },
    setPrintContainer() {
      document.getElementById('printContainer').innerHTML = ''
      let page = document.createElement('div')
      let div1 = document.createElement('div')
      let div2 = document.createElement('div')
      page.classList.add('page')
      page.classList.add('vedomost')
      page.appendChild(div1)
      page.appendChild(div2)
      div1.appendChild(this.image)
      div2.appendChild(this.image.cloneNode(true))

      document.getElementById('printContainer').appendChild(page)
    },
    print() {
      this.setPrintContainer()
      this.addDest()
      setTimeout(window.print, 1000)
    }
  },

  computed: {
    currentOperatorName() {
      let operator = this.operators.find(operator => operator.value === this.selectedOperator)
      return operator.value ? operator.text : ''
    }
  },

  updated() {
    this.generateImage()
  },

  mounted() {
    this.setBackground()
    this.generateImage()
  }

}
</script>
