<template>
  <div class="row">
    <div class="col-6 text-center">
      <div class="card">
        <div class="card-body">
          <h5>Ввод данных</h5>
          <b-row class="mt-2">
            <b-col lg="4">
              <b-input-group prepend="Число">
                <b-form-input placeholder="Число" v-model="day" type="text" />
              </b-input-group>
            </b-col>
            <b-col lg="4">
              <b-input-group prepend="Месяц">
                <b-form-input placeholder="Месяц" v-model="month" type="text" />
              </b-input-group>
            </b-col>
            <b-col lg="4">
              <b-input-group prepend="20">
                <b-form-input placeholder="Год" v-model="year" type="text" />
              </b-input-group>
            </b-col>
          </b-row>
          <b-input-group class="mt-2" prepend="Из">
            <b-form-input v-model="from" placeholder="Отправляющиее учреждение"></b-form-input>
          </b-input-group>
          <b-input-group class="mt-2" prepend="На">
            <b-form-input v-model="to" placeholder="Учреждение назначения"></b-form-input>
            <b-dropdown :disabled="!$store.state.savedDest.length" text="Dropdown" variant="success" slot="append">
              <i slot="button-content" class="fa fa-fw fa-save"></i>
              <b-dropdown-item @click="to = dest" v-for="(dest, index) in $store.state.savedDest" :key="index + 'savedDestDropdown'">{{dest}}</b-dropdown-item>
            </b-dropdown>
          </b-input-group>
          <textarea class="form-control mt-2" v-model="description" placeholder="Содержимое" @keydown.enter.prevent id="exampleFormControlTextarea1" rows="10"></textarea>
          <b-input-group>
            <b-form-select v-model="selectedOperator1" :options="operators" class="mt-2" />
            <b-input-group-append class="mt-2">
              <nuxt-link to="/settings">
                <b-btn title="Добавить сотрудника в программу" variant="outline-success">
                  <i class="fa fa-fw fa-plus"></i>
                </b-btn>
              </nuxt-link>
            </b-input-group-append>
          </b-input-group>
          <b-input-group>
            <b-form-select v-model="selectedOperator2" :options="operators" class="mb-3 mt-2" />
            <b-input-group-append class="mb-3 mt-2">
              <nuxt-link to="/settings">
                <b-btn title="Добавить сотрудника в программу" variant="outline-success">
                  <i class="fa fa-fw fa-plus"></i>
                </b-btn>
              </nuxt-link>
            </b-input-group-append>
          </b-input-group>
          <div class="mt-2 btn-group">
            <button @click="print()" class="btn btn-success">Печать
              <i class="fa fa-fw fa-print"></i>
            </button>
            <button :class="{ disabled: pdfMaking }" @click="savePdf()" class="btn btn-primary">Сохранить документ
              <i v-if="!pdfMaking" class="fa fa-fw fa-file-pdf-o"></i>
              <i v-if="pdfMaking" class="fa fa-fw fa-spin fa-cog"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-6 text-center">
      <div class="card">
        <div class="card-body">
          <h5>Предварительный просмотр</h5>
          <v-stage v-show="false" :config="{ height: 1537, width: 1088 }">
            <v-layer ref="f30">
              <v-image :config="{x: 0, y: 0, width: 1088, height: 1537, image: canvasImage}"></v-image>
              <template v-if="canvasImageLoaded">
                <v-text :config="{ x: 327, y: 272, text: day.length === 1 ? `0${day}` : day, fontSize: 24, fontFamily: 'Arial', fill: 'black', strokeWidth: 3}"></v-text>
                <v-text :config="{
                            x: 370, y: 272, text: month.length === 1 ? `0${month}` : month, width: 180, fontSize: 24, align: 'center', fontFamily: 'Arial', fill: 'black', strokeWidth: 3
                          }"></v-text>
                <v-text :config="{ x: 575, y: 272, text: year, fontSize: 24, fontFamily: 'Arial', fill: 'black', strokeWidth: 3}"></v-text>
                <v-text :config="{ x: 680, y: 272, text: from, fontSize: 24, fontFamily: 'Arial', fill: 'black', strokeWidth: 3}"></v-text>
                <v-text :config="{ x: 210, y: 337, text: to, fontSize: 24, fontFamily: 'Arial', fill: 'black', strokeWidth: 3}"></v-text>
                <v-text :config="{ x: 327, y: 405, text: part1, fontSize: 24, fontFamily: 'Arial', fill: 'black', strokeWidth: 3}"></v-text>
                <v-text :config="{ x: 170, y: 450, width: 850, lineHeight: 2.7, text: part2, fontSize: 24, fontFamily: 'Arial', fill: 'black', strokeWidth: 3}"></v-text>
                <v-text :config="{ x: 80, y: 800, width: 940, lineHeight: 2.1, text: part3, fontSize: 24, fontFamily: 'Arial', fill: 'black', strokeWidth: 3}"></v-text>
                <v-text :config="{ x: 170, y: 1305, text: currentOperatorName1, fontSize: 24, fontFamily: 'Arial', fill: 'black', strokeWidth: 3}"></v-text>
                <v-text :config="{ x: 170, y: 1375, text: currentOperatorName2, fontSize: 24, fontFamily: 'Arial', fill: 'black', strokeWidth: 3}"></v-text>
              </template>
            </v-layer>
          </v-stage>
          <div ref="f30PreviewImage" class="f30-preview mt-1">
            <img v-pre class="img-fluid" />
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
      description: '',
      day: `${new Date().getDate()}`,
      month: `${new Date().getMonth() + 1}`,
      year: `${new Date().getFullYear() - 2000}`,
      canvasImage: new Image(),
      canvasImageLoaded: false,
      image: undefined,
      selectedOperator1: undefined,
      selectedOperator2: undefined,
      operators: this.$store.getters.selectPeople,
      pdfMaking: false
    }
  },

  methods: {
    setBackground() {
      this.canvasImage.src = this.$sprites.f30
      this.canvasImage.onload = (function() { this.canvasImageLoaded = true }).bind(this)
    },
    generateImage() {
      let self = this
      let ref = this.$refs.f30
      if (ref) {
        ref.getStage().toImage({
          width: 1088, height: 1537, callback(image) {
            self.image = image
            self.$refs.f30PreviewImage.children[0].src = image.src
            self.setPrintContainer()
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
      page.classList.add('f30')
      page.appendChild(div1)
      page.appendChild(div2)
      div1.appendChild(this.image)
      div2.appendChild(this.image.cloneNode(true))

      document.getElementById('printContainer').appendChild(page)
    },
    print() {
      this.addDest()
      window.print()
    },

    savePdf() {
      this.pdfMaking = true
      this.addDest()
      let pdf = {
        pageOrientation: 'landscape',
        pageSize: 'A3',
        content: [
          {
            columns: [
              { width: 590, image: this.image.src },
              { width: 590, image: this.image.src }
            ]
          }
        ],
        pageMargins: [0, 0, 0, 0]
      }
      pdfMake.createPdf(pdf).download('f30.pdf', () => this.pdfMaking = false)
    }
  },

  computed: {
    currentOperatorName1() {
      let operator = this.operators.find(operator => operator.value === this.selectedOperator1)
      return operator.value ? operator.text : ''
    },
    currentOperatorName2() {
      let operator = this.operators.find(operator => operator.value === this.selectedOperator2)
      return operator.value ? operator.text : ''
    },
    part1() {
      return this.description.slice(0, 45)
    },
    part2() {
      return this.description.slice(45, 285)
    },
    part3() {
      return this.description.slice(285, 1000)
    }
  },

  updated() {
    this.generateImage()
  },

  mounted() {
    this.setBackground()
  }

}
</script>
