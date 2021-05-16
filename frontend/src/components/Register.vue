<template>
  <form action="App_submit" method="get" @submit.prevent="createUser">
    <div class="form__row">
      <input v-model="name" placeholder="name" type="text" name="name" />
    </div>

    <div class="form__row">
      <input v-model="age" placeholder="age" type="text" name="age" />
    </div>

    <div class="form__row">
      <input v-model="email" type="email" name="email" placeholder="email" />
    </div>

    <div class="form__row">
      <input
        v-model="password"
        type="password"
        name="password"
        placeholder="password"
      />
    </div>

    <div class="form__row">
      <button type="submit">Create new user</button>
    </div>

    <div class="form__row">
      <a href="/">Already have an account?</a>
    </div>
  </form>
</template>

<script charset="utf-8">
import axios from "axios";

const API_URL = "https://gk-task-manager.herokuapp.com";
console.log(API_URL);
export default {
  name: "CreateAccount",
  data: () => ({
    users: [],
    name: "",
    age: null,
    email: "",
    password: "",
  }),
  mounted() {
    axios.get(API_URL + "/users").then((res) => {
      console.log(res.data);
      this.users = res.data;
    });
  },
  methods: {
    createUser(e) {
      const formData = new FormData(e.target);
      const formEntries = Object.fromEntries(formData);

      axios
        .post(API_URL + "/users", formEntries)

        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
