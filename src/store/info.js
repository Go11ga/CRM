import firebase from 'firebase/app'

export default {
  state: {
    info: {}
  },

  getters: {
    info (state) {
      return state.info
    }
  },

  mutations: {
    setInfo (state, info) {
      state.info = info
    },
    clearInfo (state) {
      state.info = {}
    }
  },

  actions: {
    async fetchInfo ({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')
        const info = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val()
        commit('setInfo', info)
        localStorage.setItem('lang', info.locale)
      } catch (e) {
        commit('setError', e)
        throw e
      }   
    },
    async updateInfo ({ dispatch, commit, getters }, toUpdate) {
      try {
        const uid = await dispatch('getUid')
        const updateData = {...getters.info, ...toUpdate}
        await firebase.database().ref(`/users/${uid}/info`).update(updateData)
        commit('setInfo', updateData)
        localStorage.setItem('lang', getters.info.locale)
      } catch (e) {
        commit('setError', e)
        throw e
      }   
    }
  }
}
