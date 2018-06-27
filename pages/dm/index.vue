<template>
  <div class="row">
    <div class="col-5">
      <div class="card text-center">
        <div class="card-body">
          <h5>Ввод данных о рассылке</h5>
          <div>
            <b-form-radio-group buttons button-variant="outline-primary" v-model="selectedMode" :options="[ { text: 'Без ФИО', value: 0 }, { text: 'С ФИО', value: 1 } ]" />
          </div>
          <b-form-textarea class="mt-2" v-model="description" placeholder="Описание рассылки: №, отправитель, ШИ" :rows="1" :max-rows="6"></b-form-textarea>
          <h5 class="mt-2">Ввод получателей</h5>
          <b-alert show class="mt-2" v-if="!$store.state.streets.length" variant="warning">Заполните список улиц в обслуживании ОПС в
            <nuxt-link to="/settings">настройках</nuxt-link> чтобы использовать ускоренный ввод
          </b-alert>
          <b-card no-body>
            <b-tabs v-model="selectedType" pills card>
              <b-tab title="Обычный ввод">
                <b-input-group v-if="selectedMode" class="mt-2" prepend="&nbsp;ФИО&nbsp;">
                  <b-form-input ref="simpleInputNameForm" @keydown.enter.native="addToList" v-model="name" placeholder="ФИО получателя"></b-form-input>
                </b-input-group>
                <b-input-group class="mt-2" prepend="Улица">
                  <b-form-input @keydown.enter.native="addToList" v-model="street" placeholder="Введите название улицы"></b-form-input>
                  <b-dropdown :disabled="!$store.state.streets.length" text="Dropdown" variant="success" slot="append">
                    <i slot="button-content" class="fa fa-fw fa-save"></i>
                    <b-dropdown-item @click="street = savedStreet" v-for="(savedStreet, index) in $store.state.streets" :key="index + 'streetsDropdown'">{{savedStreet}}</b-dropdown-item>
                  </b-dropdown>
                </b-input-group>
                <b-input-group class="mt-2" prepend="№ дома, кв">
                  <b-form-input ref="simpleInputForm" @keydown.enter.native="addToList" v-model="house" placeholder="Номер дома, корпус, квартира"></b-form-input>
                </b-input-group>
                <b-input-group class="mt-2" prepend="Причина">
                  <b-form-input @keydown.enter.native="addToList" v-model="reason" placeholder="Причина недоставки получателю"></b-form-input>
                </b-input-group>
                <div class="text-center mt-2">
                  <button @click="addToList()" class="btn btn-success w-100">Добавить в список
                    <i class="fa fa-fw fa-plus-circle"></i>
                  </button>
                </div>
              </b-tab>
              <b-tab :disabled="!$store.state.streets.length" title="Ускоренный ввод">
                <b-input-group v-if="selectedMode" class="mt-2" prepend="ФИО">
                  <b-form-input ref="fastInputNameForm" @keydown.enter.native="addToList" v-model="name" placeholder="ФИО получателя"></b-form-input>
                </b-input-group>
                <div class="streets-list mt-2" v-if="$store.state.streets.length">
                  <ul class="list-group text-left">
                    <li v-for="(street, index) in $store.state.streets" :key="index + 'streetList'" class="list-group-item p-1 pl-2">№{{index + 1}}: {{street}}</li>
                  </ul>
                </div>
                <b-input-group class="mt-2" prepend="Ввод">
                  <b-input-group-text slot="append">
                    <i v-b-tooltip.hover title="Ускоренный ввод адреса позволяет сформировать полный адрес, введя только последовательность символов. Символы вводятся через пробел, первым символом должен быть номер улицы, затем через пробел номер дома с корпусом слитно, затем через пробел номер кввартиры. Список улиц должен быть предварительно внесен в настройках программы." class="fa fa-fw fa-question-circle-o pointer"></i>
                  </b-input-group-text>
                  <b-form-input ref="fastInputForm" @keydown.enter.native="addToList" v-model="fastInput" placeholder="Через пробел введите № улицы, № дома, № квартиры"></b-form-input>
                </b-input-group>
                <b-input-group class="mt-2">
                  <b-form-input :value="address" :disabled="true" placeholder="Ускоренный ввод"></b-form-input>
                </b-input-group>
                <b-input-group class="mt-2" prepend="Причина">
                  <b-form-input @keydown.enter.native="addToList" v-model="reason" placeholder="Причина недоставки получателю"></b-form-input>
                </b-input-group>
                <div class="text-center mt-2">
                  <button @click="addToList()" class="btn btn-success w-100">Добавить в список
                    <i class="fa fa-fw fa-plus-circle"></i>
                  </button>
                </div>
              </b-tab>
            </b-tabs>
          </b-card>
          <div class="text-center mt-2">
            <button onclick="window.print()" class="btn btn-success w-100">Печать листа
              <i class="fa fa-fw fa-print"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-7 dm-print">
      <div class="card">
        <div class="card-body">
          <div class="text-center">
            <h5 contenteditable="true">Упаковочный лист ДМ</h5>
            <p>{{description}}</p>
            <div class="scrollable">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th v-if="selectedMode" scope="col">ФИО</th>
                    <th scope="col">Адрес</th>
                    <th scope="col">Причина недоставки</th>
                    <th scope="col" class="control">
                      <button :class="{ disabled: !list.length }" @click="list = []" title="Очистить список" class="btn btn-sm btn-danger">
                        <i class="fa fa-fw fa-trash"></i>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(dm, index) in list" :key="index + 'dmList'">
                    <th scope="row">{{ index + 1}}</th>
                    <td contenteditable="true" v-if="selectedMode">{{dm.name}}</td>
                    <td contenteditable="true">{{dm.address}}</td>
                    <td contenteditable="true">{{dm.reason}}</td>
                    <td class="control">
                      <button @click="deleteFromList(index)" title="Удалить из списка" class="btn text-white btn-sm btn-warning">
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
    </div>
  </div>
</template>

<script>

export default {
  middleware: 'storage',

  head: {
    style: [
      { cssText: '@media print{@page {size: landscape}}', type: 'text/css' }
    ]
  },

  data() {
    return {
      selectedMode: 0,
      selectedType: this.$store.state.streets.length ? 1 : 0,
      description: '',
      name: '',
      street: '',
      house: '',
      fastInput: '1 12к1 64',
      reason: '',
      list: []
    }
  },

  methods: {
    addToList() {
      this.list.push({
        name: this.name,
        address: this.address,
        reason: this.reason
      })
      setTimeout((function() {
        if (this.selectedType) {
          this.fastInput = ''
        }
        this.name = ''
        this.house = ''
        this.reason = ''
      }).bind(this), 100)
      this.returnFocus()
    },
    deleteFromList(index) {
      this.list.splice(index, 1)
    },
    returnFocus() {
      if (this.selectedMode) {
        this.$refs[this.selectedType ? 'fastInputNameForm' : 'simpleInputNameForm'].$el.focus()
      } else {
        this.$refs[this.selectedType ? 'fastInputForm' : 'simpleInputForm'].$el.focus()
      }
    }
  },

  computed: {
    parsedFastInput() {
      let parts = this.fastInput.split(' ')
      let result = ''
      if (parts[0] && this.$store.state.streets[parseInt(parts[0] - 1, 10)]) {
        result += this.$store.state.streets[parseInt(parts[0] - 1, 10)]
      } else {
        result += parts[0]
      }
      if (parts[1]) {
        result += ` дом ${parts[1]}`
      }
      if (parts[2]) {
        result += ` кв. ${parts[2]}`
      }
      return result
    },
    address() {
      return this.selectedType ? this.parsedFastInput : `${this.street} ${this.house}`
    }
  }

}
</script>
