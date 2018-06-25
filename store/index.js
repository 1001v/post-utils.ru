import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({

  state: {
    people: [],
    storageInited: false
  },

  getters: {
    selectPeople(state) {
      let list = [{ value: undefined, text: 'Сотрудник не выбран' }]
      state.people.forEach((person, index) => {
        list.push({ value: index + 1, text: `${person.position} ${person.name}` })
      })
      return list
    }
  },

  mutations: {
      addPerson(state, { name, position }) {
        state.people.push({ name, position })
      },
      deletePerson(state, id) {
        state.people.splice(id, 1)
      },
      setPeople(state, people) {
        state.people = people
      },
      setStorageState(state, value) {
        state.storageInited = value
      }
  },
  actions: {
      addPerson(context, { name, position }) {
        context.commit('addPerson', { name, position })
        context.dispatch('savePeople')
      },
      deletePerson(context, id) {
        context.commit('deletePerson', id)
        context.dispatch('savePeople')
      },
      loadPeople(context) {
        let people = []
        try {
            let ls = localStorage.getItem('people')
            if (!ls) {
              throw new Error('localStorage is empty')
            }
            people = JSON.parse(ls)
        } catch(e) {
            people = []
            localStorage.setItem('people', JSON.stringify([]))
        }
        context.commit('setPeople', people)
      },
      savePeople(context) {
        localStorage.setItem('people', JSON.stringify(context.state.people))
      },

      initStorage(context) {
        if (!context.state.storageInited) {
          context.dispatch('loadPeople')
          context.commit('setStorageState', true)
        }
      }
  }
})

export default store
