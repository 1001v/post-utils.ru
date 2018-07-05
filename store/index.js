import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({

  state: {
    people: [],
    streets: [],
    opsNumber: '',
    savedDest: [],
    saveDest: true,
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
      addDest(state, dest) {
        state.savedDest.push(dest)
      },
      deleteDest(state, id) {
        state.savedDest.splice(id, 1)
      },
      addStreet(state, street) {
        state.streets.push(street)
      },
      deleteStreet(state, id) {
        state.streets.splice(id, 1)
      },
      setSaveDestState(state, value) {
        state.saveDest = value
      },
      saveOpsNumber(state, number) {
        state.opsNumber = number
      },
      setData(state, data) {
        Object.keys(data).forEach(key => state[key] = data[key])
      },
      setStorageState(state, value) {
        state.storageInited = value
      }
  },
  actions: {
      saveOpsNumber(context, number) {
        context.commit('saveOpsNumber', number)
        context.dispatch('saveData')
      },
      addPerson(context, { name, position }) {
        context.commit('addPerson', { name, position })
        context.dispatch('saveData')
      },
      deletePerson(context, id) {
        context.commit('deletePerson', id)
        context.dispatch('saveData')
      },
      addDest(context, dest) {
        if (context.state.savedDest.includes(dest)) {
          return
        }
        context.commit('addDest', dest)
        context.dispatch('saveData')
      },
      toggleSaveDest(context, value) {
        if (value === context.state.saveDest) {
          return
        }
        context.commit('setSaveDestState', value)
        context.dispatch('saveData')
      },
      deleteDest(context, id) {
        context.commit('deleteDest', id)
        context.dispatch('saveData')
      },
      addStreet(context, street) {
        if (context.state.streets.includes(street)) {
          return
        }
        context.commit('addStreet', street)
        context.dispatch('saveData')
      },
      deleteStreet(context, id) {
        context.commit('deleteStreet', id)
        context.dispatch('saveData')
      },
      loadData(context, jsonData = undefined) {
        let data = {}
        try {
            let ls = jsonData || localStorage.getItem('data')
            if (!ls) {
              throw new Error('localStorage is empty')
            }
            data = JSON.parse(ls)
        } catch(e) {
            if (!jsonData) {
              data = { people: [], opsNumber: '', savedDest: [], saveDest: true, streets: [] }
              localStorage.setItem('data', JSON.stringify({ people: [], opsNumber: '', savedDest: [], saveDest: true, streets: [] }))
            } else {
              return
            }
        }
        context.commit('setData', data)
        if (jsonData) {
          context.dispatch('saveData')
        }
      },
      saveData(context) {
        localStorage.setItem('data', JSON.stringify(context.state))
      },

      initStorage(context) {
        if (!context.state.storageInited) {
          context.dispatch('loadData')
          context.commit('setStorageState', true)
        }
      }
  }
})

export default store
