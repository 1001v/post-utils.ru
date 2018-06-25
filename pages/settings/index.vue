<template>
  <div>
    <b-card no-body>
      <b-tabs pills card>
        <b-tab title="Сотрудники ОПС" active>
          <h5>Управление списком сотрудников ОПС</h5>
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
          <table class="table">
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
      </b-tabs>
    </b-card>
  </div>
</template>

<script>

export default {

  middleware: 'storage',

  data() {
    return {
      name: '',
      position: ''
    }
  },

  methods: {
    addPerson() {
      if (this.isInputEmpty) {
        return
      }
      this.$store.dispatch('addPerson', { name: this.name, position: this.position })
    },

    deletePerson(index) {
      this.$store.dispatch('deletePerson', index)
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
