<template>
  <div>
    <div class="row">
      <div class="col-6 border rounded py-4 text-center" ref="previewCol">
        <h5 class="pb-2">Ввод данных</h5>
        <div>
          <b-form-radio-group buttons button-variant="outline-primary" v-model="selectedMode" :options="modes" />
        </div>
        <div class="mt-2">
          <b-button-group>
            <b-button :variant="selectedType === 1 ? 'primary' : 'outline-primary'" @click="changeType(1)">Возврат</b-button>
            <b-button :variant="selectedType === 2 ? 'primary' : 'outline-primary'" @click="changeType(2)">&nbsp;&nbsp;Досыл&nbsp;&nbsp;</b-button>
            <b-button :variant="selectedType === 0 ? 'primary' : 'outline-primary'" @click="changeType(0)">Без типа</b-button>
            <b-dropdown :disabled="!selectedType" variant="outline-primary" right text="Причина">
              <template v-if="selectedType === 2">
                <b-dropdown-item @click="selectReason(1)">{{reasons[1]}}</b-dropdown-item>
                <b-dropdown-item @click="selectReason(2)">{{reasons[2]}}</b-dropdown-item>
                <b-dropdown-item @click="selectReason(0)">{{reasons[0]}}</b-dropdown-item>
              </template>
              <template v-else>
                <b-dropdown-item @click="selectReason(3)">{{reasons[3]}}</b-dropdown-item>
                <b-dropdown-item @click="selectReason(4)">{{reasons[4]}}</b-dropdown-item>
                <b-dropdown-item @click="selectReason(5)">{{reasons[5]}}</b-dropdown-item>
                <b-dropdown-item @click="selectReason(6)">{{reasons[6]}}</b-dropdown-item>
                <b-dropdown-item @click="selectReason(7)">{{reasons[7]}}</b-dropdown-item>
                <b-dropdown-item @click="selectReason(0)">{{reasons[0]}}</b-dropdown-item>
              </template>
            </b-dropdown>
          </b-button-group>
        </div>
        <div :class="{ invisible: selectedMode === 2 }" class="input-group mt-2">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">&nbsp;Индекс&nbsp;</span>
          </div>
          <input ref="indexInputForm" autofocus @keyup.enter="addToList" type="text" class="form-control" maxlength="6" v-model="selectedIndex" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
        </div>
        <b-input-group :class="{ invisible: selectedType === 0 || selectedMode === 1}" class="mt-2" prepend="Причина">
          <b-form-input v-model="reasonText" :disabled="selectedReason !== 0" :placeholder="selectedReason !== 0 ? reasons[selectedReason] : 'Укажите обстоятельства'"></b-form-input>
        </b-input-group>
        <b-input-group :class="{ invisible: selectedMode === 1 }">
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
          <button @click="addToList()" class="btn btn-success w-100 ">Добавить в список
            <i class="fa fa-fw fa-plus-circle"></i>
          </button>
        </div>
        <hr/>
        <h5 class="py-2">Предварительный просмотр</h5>
        <!--<p>{{text}}</p>-->
        <f20 v-show="selectedMode !== 2" :item="getFrontData" mode="front" :width="previewFrontWidth" />
        <f20 v-show="selectedMode !== 1" :item="getBackData" mode="back" :width="previewBackWidth" />
      </div>
      <div class="col-6">
        <b-modal :hide-footer="true" :lazy="true" ref="printModalRef" size="xl" :centered="true" id="printModal">
          <div slot="modal-header" class="w-100">
            <div class="modal-header border-0">
              <h5 class="modal-title">Листы для печати</h5>
              <button @click="closePrintModal()" type="button" class="close" title="Закрыть окно" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="text-center">
              <div class="btn-group">
                <button onclick="window.print()" class="btn btn-success">Печать
                  <i class="fa fa-fw fa-print"></i>
                </button>
              </div>
            </div>
          </div>
          <f20-list :mode="selectedMode" :list="currentList" />
        </b-modal>
        <div>
          <button @click="openPrintModal()" :class="{ disabled: !currentList.length }" class="w-100 btn btn-success">Сформировать листы для печати
            <i class="fa fa-fw fa-print"></i>
          </button>
        </div>
        <div class="scrollable">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Операция</th>
                <th scope="col">Индекс</th>
                <th scope="col">Причина</th>
                <th scope="col">
                  <button :class="{ disabled: !currentList.length }" @click="clearCurrentList()" title="Очистить список" class="btn btn-sm btn-danger">
                    <i class="fa fa-fw fa-trash"></i>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in currentList" :key="index + 'tableItem'">
                <th scope="row">{{index + 1}}</th>
                <td>{{getTypeName(item.type)}}</td>
                <td>{{item.index || '-'}}</td>
                <td>{{getReasonText(item)}}</td>
                <td>
                  <button @click="deleteFromCurrentList(index)" title="Удалить из списка" class="btn text-white btn-sm btn-warning">
                    <i class="fa fa-fw fa-minus-circle"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import F20 from '~/components/f20.vue'
import F20List from '~/components/f20list.vue'

export default {

  head: {
    bodyAttrs: {
      class: 'with-print-container'
    }
  },

  middleware: 'storage',

  components: {
    F20,
    F20List
  },

  data() {
    return {
      reasons: ['Иные обстоятельства', 'Засылка', 'Заявление пользователя', 'Заявление отправителя', 'Отказ адресата от получения', 'Отсутствие адресата по указанному адресу', 'Невозможно прочесть адрес адресата', 'Истек срок хранения'],
      selectedIndex: "",
      selectedMode: 0,
      selectedType: 1,
      selectedReason: 7,
      previewFrontWidth: undefined,
      previewBackWidth: undefined,
      reasonText: '',
      selectedOperator: undefined,
      lists: {
        front: [],
        back: [],
        both: []
      },
      modes: [
        { text: "Обе части", value: 0 },
        { text: "Передняя часть", value: 1 },
        { text: "Задняя часть", value: 2 }
      ],
      operators: this.$store.getters.selectPeople
    }
  },

  methods: {

    deleteFromCurrentList(index) {
      this.currentList.splice(index, 1)
    },

    clearCurrentList() {
      if (!this.currentList.length) {
        return
      }
      this.currentList.splice(0, this.currentList.length)
    },

    getTypeName(type) {
      if (type === 0)
        return '-'
      else if (type === 1)
        return 'Возврат'
      else if (type === 2)
        return 'Досыл'
    },

    changeType(type) {
      if (this.selectedType === type) {
        return
      }
      this.selectedType = type
      this.reasonText = ''
      // При смене типа также меняем причину
      if (this.selectedMode !== 1 && type !== 0) {
        this.selectedReason = type === 1 ? 7 : 1
      }
    },

    selectReason(reason) {
      this.selectedReason = reason
      if (reason !== 0) {
        this.reasonText = ''
      }
    },

    getReasonText(item) {
      if (item.hasOwnProperty('reason')) {
        if (item.reason === 0) {
          return item.reasonText || '-'
        } else {
          return this.reasons[item.reason]
        }
      } else {
        return '-'
      }
    },

    addToList() {
      if (this.selectedMode !== 2) {
        this.$refs.indexInputForm.focus()
      }
      // В список передней
      this.currentList.push(this.getCurrentItemForList())

    },

    getFrontDataForList() {
      let image = this.$children.filter(child => child._name === `f20_front`)[0].currentImage
      image = image.cloneNode(true) || undefined
      return Object.assign({ image_front: image }, this.getFrontData)
    },

    getBackDataForList() {
      let image = this.$children.filter(child => child._name === `f20_back`)[0].currentImage
      image = image.cloneNode(true) || undefined
      return Object.assign({ image_back: image }, this.getBackData)
    },

    getCurrentItemForList() {
      if (this.selectedMode === 1) {
        return this.getFrontDataForList()
        // В список задней  
      } else if (this.selectedMode === 2) {
        return this.getBackDataForList()
        // В обе
      } else if (this.selectedMode === 0) {
        return Object.assign(this.getFrontDataForList(), this.getBackDataForList())
      }
    },

    openPrintModal() {
      if (this.currentList.length) {
        this.$refs.printModalRef.show()
      }
    },

    closePrintModal() {
      this.$refs.printModalRef.hide()
    }
  },

  computed: {
    getFrontData(withImage = false) {
      return {
        index: this.selectedIndex || "",
        type: this.selectedType
      }
    },
    getBackData(withImage = false) {
      return {
        operator: this.currentOperatorName,
        reasonText: this.reasonText && this.selectedReason === 0 ? this.reasonText : '',
        reason: this.selectedReason,
        type: this.selectedType
      }
    },
    currentOperatorName() {
      let operator = this.operators.find(operator => operator.value === this.selectedOperator)
      return operator.value ? operator.text : ''
    },
    text() {
      let string = ''
      if (this.selectedType) {
        string += this.selectedType === 1 ? 'Возврат ' : 'Досыл '
      }
      if (this.selectedIndex && this.selectedMode !== 2) {
        string += `на индекс ${this.selectedIndex} `
      }
      if (this.selectedType) {
        if (this.selectedReason) {
          string += `по причине ${this.reasons[this.selectedReason]} `
        } else {
          string += this.reasonText ? `по причине ${this.reasonText} ` : `по причине иных обстоятельств `
        }
      }

      if (this.selectedOperator) {
        string += `сотрудником ${this.currentOperatorName}`
      }
      return string
    },


    currentList() {
      if (this.selectedMode === 0)
        return this.lists.both
      else if (this.selectedMode === 1)
        return this.lists.front
      else if (this.selectedMode === 2)
        return this.lists.back
    }
  },

  mounted() {
    // Посчитааем ширину для канваса
    this.previewFrontWidth = this.$refs.previewCol.offsetWidth - 30 < 552 ? this.$refs.previewCol.offsetWidth - 30 : 552
    this.previewBackWidth = this.$refs.previewCol.offsetWidth - 30 < 659 ? this.$refs.previewCol.offsetWidth - 30 : 659
  }

}
</script>
