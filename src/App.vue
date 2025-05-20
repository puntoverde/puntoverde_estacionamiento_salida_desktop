<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <!-- <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/logo.png"
          transition="scale-transition"
          width="40"
        />
      </div> --> 
      <v-toolbar-title>Registro Autos (v3.0)</v-toolbar-title>

      <v-spacer></v-spacer>

      {{showDate()}}

    </v-app-bar>

    <v-content>
      <router-view></router-view>
      <!-- <Home/> -->
    </v-content>
  </v-app>
</template>

<script>
import Home from './components/Home';
import dayjs from 'dayjs'
import 'dayjs/locale/es'

export default {
  name: 'App',

  components: {
    Home,
  },

  data: () => ({
    //
  }),
  methods:{
    showDate(){
      return dayjs().locale('es').format('DD [de] MMMM [del] YYYY')
    }
  }
};
</script>
