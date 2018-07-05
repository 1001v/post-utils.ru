<template>
    <div>
        <div class="text-center mb-3">
            <i v-if="!images.length" class="fa fa-fw fa-4x fa-cog fa-spin"></i>
            <div v-if="images.length" class="btn-group">
                <button onclick="window.print()" class="btn btn-success">Печать
                    <i class="fa fa-fw fa-print"></i>
                </button>
                <button :class="{ disabled: pdfMaking }" @click="savePdf()" class="btn btn-primary">Сохранить документ
                    <i v-if="!pdfMaking" class="fa fa-fw fa-file-pdf-o"></i>
                    <i v-if="pdfMaking" class="fa fa-fw fa-spin fa-cog"></i>
                </button>
            </div>
        </div>
        <div v-if="images.length" class="row">
            <div class="col" v-for="(image, m) in images" :key="m + 'imageGenerated'">
                <img :src="image.src" class="img-fluid" />
            </div>
        </div>
        <v-stage :ref="`list-${i}`" v-show="false" v-for="(list, i) in lists" :key="i + 'listStage'" :config="{ width: listWidth, height: listHeight }">
            <v-layer>
                <v-rect :config="{ x: 0, y: 0, fill: 'white', width: listWidth, height: listHeight}"></v-rect>
                <template v-if="mode === 0">
                    <v-image v-for="(front, j) in list" :key="j + 'bothFront'" :config="{ y: j * formHeight, x: 0, width: frontWidth, height: formHeight, image: front['image_front'] }"></v-image>
                    <v-image v-for="(back, k) in list" :key="k + 'bothBack'" :config="{ y: k * formHeight, x: frontWidth, width: backWidth, height: formHeight, image: back['image_back'] }"></v-image>
                </template>
                <template v-else>
                    <v-image v-for="(item, l) in list" :key="l + 'singleMode'" :config="{ y: Math.floor(l / 2) * formHeight, x: l % 2 !== 0 ? (isFront ? frontWidth : backWidth) : 0, width: isFront ? frontWidth : backWidth, height: formHeight, image: item[ isFront ? 'image_front' : 'image_back'] }"></v-image>
                </template>
            </v-layer>
        </v-stage>
    </div>
</template>


<script>

export default {
    props: ['mode', 'list'],

    data() {
        return {
            images: [],
            listWidth: 1240,
            listHeight: 1754,
            pdfMaking: false
        }
    },

    mounted() {
        setTimeout(this.generateImages.bind(this), 1000)
    },

    methods: {
        generateImages() {
            this.images = []
            this.lists.forEach((list, index) => {
                let self = this
                let stage = this.$refs[`list-${index}`][0].getStage()
                stage.toImage({
                    width: this.listWidth, height: this.listHeight, mimeType: 'image/png', callback(image) {
                        self.images.push(image)
                        self.printContent(image)
                    }
                })
            })
        },
        printContent(image) {
            if (!image) {
                return
            }
            let page = document.createElement('div')
            page.classList.add('page')
            page.appendChild(image)

            document.getElementById('printContainer').appendChild(page)
        },
        savePdf() {
            this.pdfMaking = true
            let pdf = {
                pageSize: 'A2',
                content: [
                    
                ],
                pageMargins: [0, 0, 0, 0]
            }
            this.images.forEach((image, index) => {
                pdf.content.push({
                    columns: [
                        {
                             image: image.src,
                             width: 1191
                        }
                    ],
                    pageBreak: this.images.length - 1 === index ? undefined : 'after'
                })
            })
            pdfMake.createPdf(pdf).download('f20list.pdf', () => this.pdfMaking = false)
        }

    },

    computed: {
        lists() {
            let copy = this.list.slice()
            let lists = []
            copy.forEach(item => {
                if (typeof item.image_front === 'string') {
                    let imageFront = new Image()
                    imageFront.src = item.image_front
                    item.image_front = imageFront
                }
                if (typeof item.image_back === 'string') {
                    let imageBack = new Image()
                    imageBack.src = item.image_back
                    item.image_back = imageBack
                }
            })
            while (copy.length >= (this.mode === 0 ? 8 : 16)) {
                lists.push(copy.splice(0, (this.mode === 0 ? 8 : 16)))
            }
            if (copy.length) {
                lists.push(copy.splice(0, copy.length))
            }
            return lists
        },
        formHeight() {
            return Math.floor(this.listHeight / 8)
        },
        frontWidth() {
            return Math.floor((552 * this.formHeight) / 233)
        },
        backWidth() {
            return Math.floor((659 * this.formHeight) / 233)
        },

        isFront() {
            return this.mode === 1
        }
    },


    beforeDestroy() {
        document.getElementById('printContainer').innerHTML = ''
    }
}
</script>
