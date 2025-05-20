<template>
  <v-card>
      <v-card-title>ultimas salidas</v-card-title>
      <v-data-table :headers="headers" :items="lista_salidas">

            <template v-slot:item.color="{item}">
                <v-btn :color="item.color"></v-btn>
            </template>

            <template v-slot:item.tipo="{item}">
                <v-img :src="require('./../assets/tipo-auto.svg')" width="62" v-if="item.tipo==1"></v-img>
                 <v-img :src="require('./../assets/tipo-camioneta.svg')" width="62" v-else></v-img>
            </template>

            <template v-slot:item.marca="{item}">
               <v-img v-if="marcas_auto.find(i=>i.marca==item.marca)" :src="require(`./../assets/${marcas_auto.find(i=>i.marca==item.marca).icono}.svg`)" width="62"></v-img>
            </template>


      </v-data-table>
  </v-card>
</template>

<script>
import {ipcRenderer} from 'electron'
export default {
    created(){
        this.getSalidas()
        ipcRenderer.on('renderGetSalidas',()=>{this.getSalidas()})
        },
data:()=>({
    headers:[
        {text:'Accion',value:'accion'},
        {text:'Salida',value:'salida'},
        {text:'Color',value:'color'},
        {text:'Tipo',value:'tipo'},
        {text:'Marca',value:'marca'},
        {text:'Modelo',value:'modelo'},
        {text:'Placas',value:'placas'},
        {text:'Usuario',value:'usuario'},
    ],
    lista_salidas:[],
        marcas_auto: [
      {
        marca: "chevrolet",
        icono: "360387-bowtiechevrolet_stacked_md_5in_cmyk",
      },
      { marca: "ford", icono: "icons8-vado" },
      { marca: "nissan", icono: "nissan" },
      { marca: "vw", icono: "vw" },

      { marca: "mazda", icono: "Mazda-01" },
      { marca: "hyundai", icono: "hyundai" },
      { marca: "kia", icono: "icons8-kia" },
      { marca: "honda", icono: "honda" },
      { marca: "mercedes", icono: "mercedes" },
      { marca: "bmw", icono: "bmw" },
      
      
      { marca: "toyota", icono: "toyota" },
      { marca: "suzuki", icono: "Suzuki-logo" },      
      { marca: "seat", icono: "seat" },
      { marca: "renault", icono: "renault" },
      { marca: "fiat", icono: "fiat" },
     
      { marca: "minicupper", icono: "minicupper" },
      
      { marca: "audi", icono: "icons8-audi" },
      { marca: "mitsubishi", icono: "mitsubishi" },
      { marca: "gmc", icono: "gmc" },
      { marca: "dodge", icono: "dodge" },
      { marca: "peugeot", icono: "peugeot-5" },
      { marca: "subaru", icono: "subaru" },
      { marca: "chrysler", icono: "chrysler" },
      { marca: "pontiac", icono: "pontiac" },

      { marca: "volvo", icono: "volvo" },
      { marca: "tesla", icono: "tesla" },
      { marca: "jaguar", icono: "jaguar" },
      { marca: "porsche", icono: "porsche" },
      { marca: "cadillac", icono: "cadillac" },

      { marca: "acura", icono: "acura" },
      { marca: "buick", icono: "buick" },
      { marca: "infiniti", icono: "infiniti" },
      { marca: "landrover", icono: "landrover" },
      { marca: "lincoln", icono: "lincoln" },

      { marca: "jeep", icono: "jeep" },
      { marca: "lexus", icono: "lexus" },
      { marca: "lamborghini", icono: "lamborghini" },
      { marca: "ferrari", icono: "ferrari" },
      { marca: "mercury", icono: "mercury" },
      
      { marca: "alfaromeo", icono: "alfaromeo" },
      
    ],
}),
methods:{
    getSalidas()
    {
       this.lista_salidas=ipcRenderer.sendSync('getListaSalidas')
       console.log(this.lista_salidas)
    }
}
}
</script>

<style>

</style>