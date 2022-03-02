<template>
  <div class="main-content" v-show="bcConnected && !bcConnectionError">
    <div class="p-4" v-show="bcConnected && !bcConnectionError">

      <h1>Hllooo {{getGreeting()}}</h1>
            <router-view></router-view>
        </div>
       
    
  </div>
</template>

<script>
// export default {
//   name: 'App'
// }
// importing common function
import mixin from './lib/mixinViews';
import TopMenu from './components/TopMenu';
export default {
    components: { TopMenu },
    mixins: [mixin],
    name: 'App'
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>



