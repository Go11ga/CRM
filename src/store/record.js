import firebase from 'firebase/app'
import category from './category'

export default {
  actions: {
    async createRecord ({ dispatch, commit }, record) {
      try {
        const uid = await dispatch('getUid')
        return await firebase.database().ref(`/users/${uid}/records`).push(record)
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchRecords ({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')
        const records = (await firebase.database().ref(`/users/${uid}/records`).once('value')).val() || {}

        return Object.keys(records).map(key => ({...records[key], id: key}))
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchRecordById ({ dispatch, commit }, id) {
      try {
        const uid = await dispatch('getUid')
        const record = (await firebase.database().ref(`/users/${uid}/records`).child(id).once('value')).val() || {}

        return {...record, id}
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async removeRecords ({ dispatch, commit }, categoryId) {
      try {
        const uid = await dispatch('getUid')

        const records = (await dispatch('fetchRecords')).filter(el => el.categoryId === categoryId).map(el => el.id)
        
        const promices = records.map(el => {
          return firebase.database().ref(`/users/${uid}/records`).child(el).remove()
        })

        await Promise.all(promices)

      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}
