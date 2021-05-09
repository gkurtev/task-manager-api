<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
const API_URL = 'http://gk-task-manager.herokuapp.com/'

console.log(API_URL)

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  mounted(){
      fetch(API_URL).then(res => {
          res.json().then(data => {
              console.log(data)
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
