<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      {{user.name}}
    </li>
  </ul>
</template>

<script>
/* import HelloWorld from './components/HelloWorld.vue' */
const API_URL = 'https://gk-task-manager.herokuapp.com/users'

console.log(API_URL)

export default {
  name: 'App',
  components: {
    /* HelloWorld */
  },
  data: () => ({
     users: []
    }),
    mounted(){
      fetch(API_URL).then(res => {
        res.json().then(data => {
            this.users = data
          })
      })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
