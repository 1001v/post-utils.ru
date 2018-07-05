<template>
  <div>
    <b-card no-body>
      <b-tabs pills card>
        <b-tab title="Сотрудники ОПС" active>
          <h5>Управление списком сотрудников ОПС</h5>
          <p>Сохраненный список сотрудников ОПС используется для подстановки в поля ввода при формировании бланков.</p>
          <b-alert show v-if="personString.length > 31" variant="warning">Рекомендуемая суммарная длина ФИО и должности не более 30 символов</b-alert>
          <b-container>
            <b-row>
              <b-col lg="5">
                <b-input-group prepend="ФИО">
                  <b-form-input v-model="name" placeholder="Введите фамилию и инициалы" type="text" />
                </b-input-group>
              </b-col>

              <b-col lg="5">
                <b-input-group prepend="Должность">
                  <b-form-input v-model="position" placeholder="Введите должность (сокращенно)" type="text" />
                </b-input-group>
              </b-col>
              <b-col lg="2">
                <b-btn :disabled="isInputEmpty" @click="addPerson()" variant="primary">Добавить
                  <i class="fa fa-fw fa-plus"></i>
                </b-btn>
              </b-col>
            </b-row>
          </b-container>
          <h5 class="mt-3">Список сотрудников ОПС</h5>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">ФИО</th>
                <th scope="col">Должность</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(person, index) in $store.state.people" :key="index + 'peopleList'">
                <th scope="row">{{ index + 1}}</th>
                <td>{{person.name}}</td>
                <td>{{person.position}}</td>
                <td>
                  <button @click="deletePerson(index)" class="btn btn-sm text-white btn-warning">Удалить
                    <i class="fa fa-fw fa-minus"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </b-tab>
        <b-tab title="Данные об ОПС">
          <h5>Номер ОПС</h5>
          <p>Сохраненный номер ОПС используется для подстановки в поля ввода при формировании бланков.</p>
          <b-container>
            <b-row>
              <b-col lg="10">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">№ ОПС</span>
                  </div>
                  <input autofocus type="text" class="form-control" maxlength="6" v-model="opsNumber" placeholder="101000" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                </div>
              </b-col>
              <b-col lg="2">
                <b-btn :disabled="opsNumber.length !== 6 || $store.state.opsNumber === opsNumber" @click="saveOpsNumber()" variant="primary">Сохранить
                  <i class="fa fa-fw fa-save"></i>
                </b-btn>
              </b-col>
            </b-row>
          </b-container>
          <h5 class="mt-2">Добавление улиц</h5>
          <p>Сохраненный список улиц в зоне обслуживания ОПС используется для их быстрого выбора из списка при вводе данных.</p>
          <b-alert show v-if="$store.state.streets.includes(street)" variant="warning">Данная улица уже сохранена в списке</b-alert>
          <b-container>
            <b-row>
              <b-col lg="10">
                <b-input-group prepend="Улица">
                  <b-form-input @keyup.enter="addStreet()" v-model="street" placeholder="Мясницкая ул." type="text" />
                </b-input-group>
              </b-col>
              <b-col lg="2">
                <b-btn :disabled="!street || $store.state.streets.includes(street)" @click="addStreet()" variant="primary">Добавить
                  <i class="fa fa-fw fa-plus"></i>
                </b-btn>
              </b-col>
            </b-row>
          </b-container>
          <h5 class="mt-3">Список улиц</h5>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Улица</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(street, index) in $store.state.streets" :key="index + 'savedStreets'">
                <th scope="row">{{ index + 1}}</th>
                <td>{{street}}</td>
                <td>
                  <button @click="deleteStreet(index)" class="btn btn-sm text-white btn-warning">Удалить
                    <i class="fa fa-fw fa-minus"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </b-tab>
        <b-tab title="Направления">
          <h5>Автоматически сохранять направления</h5>
          <p>Названия учреждений будут автоматически сохранятся после ввода в соответствующие формы.</p>
          <b-form-group>
            <b-form-radio-group @input="toggleSaveDest" v-model="saveDest">
              <b-form-radio :value="true">Сохранять</b-form-radio>
              <b-form-radio :value="false">Не сохранять</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <h5>Управление списком направлений</h5>
          <p>Сохраненный список учреждений направлений используется для подстановки в поля ввода при формировании бланков.</p>
          <b-alert show v-if="$store.state.savedDest.includes(dest)" variant="warning">Данное учреждение уже сохранено в списке</b-alert>
          <b-container>
            <b-row>
              <b-col lg="10">
                <b-input-group prepend="Направление">
                  <b-form-input v-model="dest" placeholder="Введите название учреждения" type="text" />
                </b-input-group>
              </b-col>
              <b-col lg="2">
                <b-btn :disabled="!dest || $store.state.savedDest.includes(dest)" @click="addDest()" variant="primary">Добавить
                  <i class="fa fa-fw fa-plus"></i>
                </b-btn>
              </b-col>
            </b-row>
          </b-container>
          <h5 class="mt-3">Список направлений</h5>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Учреждение</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dest, index) in $store.state.savedDest" :key="index + 'savedDest'">
                <th scope="row">{{ index + 1}}</th>
                <td>{{dest}}</td>
                <td>
                  <button @click="deleteDest(index)" class="btn btn-sm text-white btn-warning">Удалить
                    <i class="fa fa-fw fa-minus"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </b-tab>
        <b-tab title="Перенос настроек">
          <h5>Экспорт настроек</h5>
          <p>Сохранить настройки программы в отдельный файл для переноса на другой компьютер.</p>
          <div class="text-center">
            <button @click="exportSettings()" class="btn btn-primary">Сохранить настройки
              <i class="fa fa-fw fa-save"></i>
            </button>
          </div>
          <b-alert v-if="settingsFileValid === true" variant="success" show>Настройки импортированы</b-alert>
          <b-alert v-if="settingsFileValid === false" variant="danger" show>Ошибка импорта настроек: неверный файл</b-alert>
          <h5>Импорт настроек</h5>
          <p>Применить настройки из файла, экспортированного с другого компьютера.</p>
          <div>
            <b-form-file @input="importSettings()" ref="settingsFileForm" accept=".pu" v-model="settingsFile" placeholder="Выберите файл настроек..."></b-form-file>
          </div>
        </b-tab>
        <b-tab title="Сброс настроек">
          <h5>Сброс настроек</h5>
          <p>Данное действие приведет к полному сбросу всех сохраненных данных и настроек.</p>
          <div class="text-center">
            <button v-b-modal.resetModal class="btn btn-danger">Сброс настроек
              <i class="fa fa-fw fa-trash"></i>
            </button>
          </div>
          <b-modal @ok="resetSettings" id="resetModal" ok-title="Сбросить" cancel-title="Отмена" ok-variant="danger" cancel-variant="outline-primary" :centered="true" title="Вы уверены?">
            <div class="text-center">
              <i class="fa fa-fw fa-4x fa-warning"></i>
            </div>
            <p class="my-4">Данное действие приведет к полному сбросу всех сохраненных данных и настроек.</p>
          </b-modal>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>

import FileSaver from 'file-saver'

export default {

  middleware: 'storage',

  data() {
    return {
      name: '',
      position: '',
      saveDest: this.$store.state.saveDest,
      dest: '',
      street: '',
      opsNumber: this.$store.state.opsNumber,
      settingsFile: undefined,
      settingsFileValid: undefined
    }
  },

  methods: {
    addPerson() {
      if (this.isInputEmpty) {
        return
      }
      this.$store.dispatch('addPerson', { name: this.name, position: this.position })
      this.name = ''
      this.position = ''
    },

    deletePerson(index) {
      this.$store.dispatch('deletePerson', index)
    },
    addDest() {
      if (!this.dest) {
        return
      }
      this.$store.dispatch('addDest', this.dest)
      this.dest = ''
    },
    deleteDest(index) {
      this.$store.dispatch('deleteDest', index)
    },
    addStreet() {
      if (!this.street) {
        return
      }
      this.$store.dispatch('addStreet', this.street)
      this.street = ''
    },
    deleteStreet(index) {
      this.$store.dispatch('deleteStreet', index)
    },
    toggleSaveDest() {
      this.$store.dispatch('toggleSaveDest', this.saveDest)
    },
    saveOpsNumber() {
      if (this.$store.state.opsNumber === this.opsNumber || this.opsNumber.length !== 6) {
        return
      }
      this.$store.dispatch('saveOpsNumber', this.opsNumber)
    },
    resetSettings() {
      localStorage.removeItem('data')
      window.location.reload()
    },
    exportSettings() {
      FileSaver.saveAs(new File([JSON.stringify(this.$store.state)], "settings.pu", {type: "text/plain;charset=utf-8"}))
      
    },
    importSettings() {
      if (!this.settingsFile) {
        return
      }
      let reader = new FileReader()

      reader.readAsText(this.settingsFile)

      reader.onloadend = () => {
        try {
          let parsed = JSON.parse(reader.result)
          if (['people', 'streets', 'savedDest', 'opsNumber', 'saveDest'].some(setting => !Object.keys(parsed).includes(setting))) {
            throw new Error('Settings are invalid')
          }
          this.settingsFileValid = true
          this.$store.dispatch('loadData', reader.result)
          this.opsNumber = this.$store.state.opsNumber
          this.saveDest = this.$store.state.saveDest
        } catch (e) {
          this.settingsFileValid = false
        } finally {
          this.$refs.settingsFileForm.reset()
        }
      
        setTimeout(() => this.settingsFileValid = undefined, 8000)
      }
    }
  },

  computed: {
    personString() {
      return `${this.position} ${this.name}`
    },
    isInputEmpty() {
      return !(this.name || this.position)
    }
  }

}
</script>
