<template>
    <div>
        <div class="row">
            <div class="col" v-for="(image, m) in images" :key="m + 'imageGenerated'">
                <img :src="image.src" class="img-fluid"/>
            </div>
        </div>
        <v-stage :ref="`list-${i}`" v-show="false" v-for="(list, i) in lists" :key="i + 'listStage'" :config="{ width: 1318, height: 1864 }">
            <v-layer>
                <template v-if="mode === 0">
                    <v-image v-for="(front, j) in list" :key="j + 'bothFront'" :config="{ y: j * 233, x: 0, image: front['image_front'] }"></v-image>
                    <v-image v-for="(back, k) in list" :key="k + 'bothBack'" :config="{ y: k * 233, x: 552, image: back['image_back'] }"></v-image>
                </template>
                <template v-else>
                    <v-image v-for="(item, l) in list" :key="l + 'singleMode'" :config="{ y: Math.floor(l / 2) * 233, x: l % 2 !== 0 ? (isFront ? 552 : 659) : 0, image: item[ isFront ? 'image_front' : 'image_back'] }"></v-image>
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
            images: []
        }
    },

    mounted() {
        this.generateImages()
    },

    methods: {
        generateImages() {
            this.images = []
            this.lists.forEach((list, index) => {
                let self = this
                this.$refs[`list-${index}`][0].getStage().toImage({
                    width: 659, height: 932, callback(image) {
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
        }

    },

    computed: {
        lists() {
            let copy = this.list.slice()
            let lists = []
            while (copy.length >= (this.mode === 0 ? 8 : 16)) {
                lists.push(copy.splice(0, (this.mode === 0 ? 8 : 16)))
            }
            if (copy.length) {
                lists.push(copy.splice(0, copy.length))
            }
            return lists
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
