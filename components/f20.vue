<template>
  <div>
    <img :src="currentImage.src" v-if="currentImage" class="img-fluid">
    <v-stage v-show="false" :ref="`stage-${mode}`" :config="configKonva">
      <v-layer :ref="`layer-${mode}`">
        <v-image v-if="configBackground.image" :config="configBackground"></v-image>
        <template v-if="isFront && parsedIndex.length">
          <v-image v-for="(number, i) in parsedIndex" :key="i + 'indexNumbers'" :config="{ x: 220 + 53 * i, y: 0, width: 35, height: 233, image: numberImages[number] }"></v-image>
        </template>
        <v-line v-if="item.type === 1 && item.reason !== 0 && !isFront" :config="{ stroke: 'black', strokeWidth: 3, points: [25, 41 + offsets[item.reason], 30, 46 + offsets[item.reason], 39, 34 + offsets[item.reason]] }"></v-line>
        <v-line v-if="item.type === 2 && item.reason !== 0 && !isFront" :config="{ stroke: 'black', strokeWidth: 3, points: [311, 55 + offsets[item.reason], 316, 60 + offsets[item.reason], 325, 47 + offsets[item.reason]] }"></v-line>
        <v-line v-if="item.type !== 0 && !isFront && item.reason === 0" :config="{ stroke: 'black', strokeWidth: 3, points: [55, 176, 60, 181, 69, 169] }"></v-line>
        <v-text v-if="item.reasonText && !isFront" :config="{
            x: 235, y: 164, text: this.item.reasonText, fontSize: 15, fontFamily: 'Arial', fill: 'black', strokeWidth: 2
          }"></v-text>
        <v-text v-if="item.operator && !isFront" :config="{
            x: 160, y: 195, text: this.item.operator, fontSize: 17, fontFamily: 'Arial', fill: 'black', strokeWidth: 2
          }"></v-text>
        <v-line v-if="item.type && isFront" :config="{ points: [item.type === 2 ? 220 : 335, 20, item.type === 2 ? 320 : 440, 20], stroke: 'black', strokeWidth: 10 }"></v-line>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
export default {
  props: ['width', 'mode', 'item'],

  watch: {
    item: function() {
      this.$forceUpdate()
    }
  },

  data() {
    return {
      currentImage: undefined,
      configKonva: {
        width: this.mode === 'front' ? 552 : 659,
        height: 233
      },
      configBackground: {
        x: 0,
        y: 0,
        image: undefined,
        width: this.mode === 'front' ? 552 : 659,
        height: 233
      },
      numberImages: {

      },
      offsets: [0, 43, 0, 0, 21, 45, 80, 112]
    };
  },

  created() {
    this._name = `f20_${this.mode}`
    this.setBackground()
    if (this.isFront) {
      [...Array(10).keys()].forEach(number => {
        let newImage = new Image()
        newImage.src = this.$sprites.numbers[number]
        this.numberImages[number] = newImage
      })
    }
  },

  mounted() {
    this.generateImage()
  },

  updated() {
    this.generateImage()
  },


  computed: {
    height() {
      return Math.round(this.width / (this.isFront ? 2.37 : 2.92))
    },
    scale() {
      return this.width / (this.isFront ? 552 : 659)
    },
    image() {
      return this.isFront ? this.$sprites.f20front : this.$sprites.f20back
    },
    isFront() {
      return this.mode === 'front'
    },
    parsedIndex() {
      return this.item.index ? this.item.index.split('') : []
    }
  },

  methods: {

    generateImage() {
      let self = this
      let ref = this.$refs[`layer-${this.mode}`]
      if (ref) {
        ref.getStage().toImage({
          width: self.mode === 'front' ? 552 : 659, height: 233, callback(image) {
            //self.$emit('preview-update', { image, mode: self.mode }) 
            self.currentImage = image
          }
        })
      }
    },

    setBackground() {
      this.configBackground.image = new Image()
      this.configBackground.image.src = this.image
    }
  }
}
</script>