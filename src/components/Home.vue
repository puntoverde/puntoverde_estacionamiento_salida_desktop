<template>
  <v-container fluid>
    <v-row class="d-flex mx-auto" width="200">
      <!-- <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col> -->
      <v-col cols="2" id="panel-marca">
        <v-row>
          <v-col v-for="(marca, index) in marcas_auto" :key="index" cols="12">
            <v-card elevation="5" class="px-5" @click="marcaS = Object.assign({},marca)" :disabled="!fullSocio">
              <v-img
                :src="require(`../assets/${marca.icono}.svg`)"
                width="100%"
                height="150"
                class="align-end"
                contain
              >
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="10" id="panel-data">
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title class="d-flex justify-space-between">
                <div id="findAccion">
                  <v-text-field
                    label="Accion"
                    hide-details
                    v-model="accion"
                    v-mask="maskAccion"
                    @keyup.enter="buscarSocios"
                  ></v-text-field>
                </div>
                <h4>Estado Accion: {{estadoAccion | fEstatus}}</h4>
                <h4>Tags Vigentes: {{tagsVigentes}}</h4>
                <h4>Historico de Tags: {{tagsHistorial}}</h4>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-row>
                  <v-col cols="4">
                    <v-list >
                      <v-subheader
                        >Socios de la Accion {{ accion }} </v-subheader
                      >
                      <v-list color="primaryxxx">
                      <v-list-item-group v-model="fullSocio" color="primary">
                        <v-list-item :value="item.cve_socio"
                          v-for="(item, i) in socios"
                          :key="i"
                          @click="
                            findAutosSocio(item.cve_socio, item.cve_accion)
                          "
                        >
                          <v-list-item-avatar class="primary--text">
                            <span class="font-weight-black">
                              {{accion}}
                            </span>                            
                           <span class="teal--text">{{ item.nip }}</span>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title>
                              {{
                                `${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`
                              }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-list>
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col>
                    <v-tabs grow v-model="tab">
                      <v-tab v-for="(it,ind) in autos_socio" :key="ind" > <v-avatar class="mr-2"><v-img contain :src="require(`../assets/${marcas_auto.find(i=>i.marca==it.marca).icono}.svg`)"></v-img></v-avatar>{{it.marca}}</v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab">
                      <v-tab-item v-for="(it,ind) in autos_socio" :key="ind">
                    
                        <v-row class="mt-5">
                        <v-col cols="4" class="title black--text">Tipo: <span class="grey--text text--darken-2">{{it.tipo}}</span></v-col>
                        <v-col cols="4" class="title black--text">Modelo: <span class="grey--text text--darken-2">{{it.modelo}}</span></v-col>
                        <v-col cols="4" class="title black--text">Placas: <span class="grey--text text--darken-2">{{it.placas}}</span></v-col>
                        <v-col cols="4" class="title black--text">Color:<v-chip v-if="it.color=='#FFFFFF'" color="grey darken-2"><v-icon color="white">mdi-palette</v-icon></v-chip> <v-chip v-else :color="it.color"><v-icon color="white">mdi-palette</v-icon></v-chip></v-col>
                        <v-col cols="4" class="title black--text">Tag: <span class="grey--text text--darken-2">{{it.tag}}</span></v-col>
                        <v-col cols="4" class="d-flex justify-space-between infox align-center">
                          <v-btn fab small color="info" @click="editAuto(it)"><v-icon>mdi-circle-edit-outline</v-icon></v-btn> 
                          <v-btn fab small color="error" @click="openDelete(it.id_auto_usuario)"><v-icon>mdi-delete-circle-outline</v-icon></v-btn>
                          <v-switch color="success" v-model="it.estatus" @change="altaBaja(it.estatus,it.id_auto_usuario)" :true-value="1" :false-value="2" :loading="load"></v-switch>
                          </v-col>
                          <v-col cols="12">
                            <label class="title black--text">Fecha Registro: <span class="grey--text text--darken-2">{{it.fecha_registro | fDate}}</span></label>
                          </v-col>
                          <v-col cols="12">
                            <v-checkbox label="Capacidad diferente" disabled v-model="it.capacidad"></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <v-card-title class="d-flex justify-space-between">Datos del Vehiculo
                <v-checkbox label="Capacidad diferente" v-model="capacidad"></v-checkbox>
                <v-text-field v-model="folio_pago" v-mask="'##########'" style="max-width:250px" outlined hide-details dense label="Folio de Pago Tag"></v-text-field>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="2">
                    <v-card elevation="2" class="px-5">
                      <v-img
                        :src="require(`../assets/${marcaS.icono}.svg`)"
                        width="100%"
                        height="150"
                        class="align-end"
                        contain
                      >
                      </v-img> </v-card
                  ></v-col>
                  <v-col cols="2">
                    <v-card height="150">
                      <v-card-text>
                        <v-radio-group v-model="tipo" :disabled="!validarFull">
                          <v-radio label="Auto" value="auto"></v-radio>
                          <v-radio
                            label="Camioneta"
                            value="camioneta"
                          ></v-radio>
                        </v-radio-group>
                      </v-card-text>
                      <!--v-img
                        width="50%"
                        height="150"
                        contain
                        :src="require(`../assets/Mazda-01.svg`)"
                      ></v-img>
                      <v-img
                        width="50%"
                        height="150"
                        contain
                        :src="require(`../assets/Mazda-01.svg`)"
                      ></v-img-->
                    </v-card>
                  </v-col>
                  <v-col cols="3">
                    <v-card height="150">
                      <v-color-picker
                        v-model="color"
                        disabled
                        flat
                        show-swatches                        
                        hide-canvas
                        hide-inputs
                        swatches-max-height="100"
                        :swatches="swatches_color"
                        value="hex"
                        width="100%"                        
                      ></v-color-picker>
                    </v-card>
                  </v-col>
                  <v-col cols="3">
                    <v-card height="150">
                      <v-card-text
                        ><v-text-field
                          label="Modelo"
                          outlined
                          dense
                          hide-details
                          class="mb-8"
                          v-model="modelo"
                          v-mask="ModeloMask"
                          :disabled="!validarFull "
                        ></v-text-field>
                        <v-text-field
                          label="Placa"
                          outlined
                          dense
                          hide-details
                          v-model="placas"
                          v-mask="PlacaMask"
                          :disabled="!validarFull"
                        ></v-text-field
                      ></v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="2">
                    <v-card height="150">
                      <v-card-text>
                        <v-text-field
                          label="Tag"
                          outlined
                          dense
                          hide-details
                          class="mb-8"
                          v-model="tag"
                          :disabled="!validarFull"
                        ></v-text-field>
                        <v-btn block color="success" @click="saveAuto" v-if="tag && validarFull && !banderaUpdate">Registrar</v-btn>
                        <v-btn block color="success" @click="updateAuto" v-if="tag && validarFull && banderaUpdate">Actualizar</v-btn>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title>Alert</v-card-title>
        <v-card-text><h3>Se eliminara por completo el registro del vehiculo... seleccionar la opcion aceptar si esta de acuerdo en caso contrario cancelar</h3></v-card-text>
        <v-card-actions>
          <v-btn outlined color="error" @click="dialog=false,id_auto_eliminar=0">Cancelar</v-btn>
          <v-btn outlined color="success" @click="deleteAuto">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


   
   <v-bottom-sheet
      v-model="sheet"
      inset
    >
      <v-sheet
        class="text-center d-flex justify-center align-center px-10"
        height="200px"
      >
        
          <h1 class="error--text">Por Orden administrativa no se otorga registro ya sea por tag o repuve a esta accion</h1>
        
      </v-sheet>
    </v-bottom-sheet>



  </v-container>
</template>

<script>
import SerialPort from 'serialport';
import net from 'net'
import { mask } from "vue-the-mask";
import { ipcRenderer } from "electron";
import isUndefined from 'lodash/isUndefined'
window.ipcRenderer = ipcRenderer;
import axios from 'axios'
import { closeSync } from 'fs';
import dayjs from 'dayjs'
import 'dayjs/locale/es'

export default {
  name: "HelloWorld",
  directives: { mask },
  async created(){  
    
    let cliente=new net.Socket();
    cliente.connect(100,'192.168.2.114',()=>console.log('se conecto con exito 114.' ))

    cliente.on('data',(data)=>{
      let tagAntenna=data.toString('ascii',7,19)
      
      if(tagAntenna!='000000000000'){
      this.tag= tagAntenna;
      let {changedRows}=ipcRenderer.sendSync('registarSalidaAutos',tagAntenna);
      this.arduinoCOM.write("o");
      
      //se agrega estas lineas para giardadr en el server
      // const params = new URLSearchParams();
      // params.append('tag', tagAntenna);
      // axios.post('http://puntoverdeleon.mx/PV2/core/controller/accesoAutosServiceSalida.php',params)
      // .then(({data})=>console.log(data)).catch(e=>console.error(e))

      if(changedRows>0)ipcRenderer.send('getWinSalidas')//carga  las salidas 

      }

      })

      await this.initConectionArduino()  
  },
  data: () => ({
    accion: "",
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
      { marca: "smart", icono: "smart" },
      
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

      { marca: "mg", icono: "mg-motor" },


      { marca: "foton", icono:`foton` },
      { marca: "faw", icono: `faw` },
      { marca: "jac", icono: `jac` },
      { marca: "dfm", icono: `dfm` },
      { marca: "chery", icono: `chery` },
      { marca: "changhe", icono: `changhe` },
      { marca: "changan", icono: `changan` },
      { marca: "skoda", icono: `skoda` },
      { marca: "bajaj", icono: `bajaj` },
      { marca: "byd", icono: `byd` },
      { marca: "baic", icono: `baic` },
      { marca: "brilliance", icono: `brilliance` },
      { marca: "geely", icono: `geely` },
      { marca: "great-wall", icono: `great-wall` },
      
      { marca: "bentley", icono: `bentley` },
      { marca: "Abarth", icono: `Abarth` },
      { marca: "aston-martin", icono: `aston-martin` },
      { marca: "Isuzu", icono: `Isuzu` },
      { marca: "lotus", icono: `lotus` },
      { marca: "McLaren", icono: `McLaren` },
      { marca: "rolls-royce", icono: `rolls-royce` },
      { marca: "proton", icono: `proton` },
      { marca: "ssang-yong", icono: `ssang-yong` },
      { marca: "daewoo", icono: `daewoo` },
      { marca: "opel", icono: `opel` },
      { marca: "citroen", icono: `citroen` },
      { marca: "daihatsu", icono: `daihatsu` },
      { marca: "saab", icono: `saab` },
      { marca: "rover", icono: `rover` },
      { marca: "lada", icono: `lada` },
      { marca: "maserati", icono: `maserati` },
      { marca: "maybach", icono: `maybach` },
      { marca: "alpina", icono: `alpina` },
      { marca: "scion", icono: `scion` },
      { marca: "lancia", icono: `lancia` },
      { marca: "koenigsegg", icono: `koenigsegg` },
      { marca: "tata", icono: `tata` },
      { marca: "mercury", icono: `mercury` },
      { marca: "vauxhall", icono: `vauxhall` },
      { marca: "holden", icono: `holden` },
      { marca: "saturn", icono: `saturn` },
      { marca: "dacia", icono: `dacia` },
      { marca: "bugatti", icono: `bugatti` },
      { marca: "cupra", icono: `cupra` },
      
    ],
    swatches_color: [
      ["#000000", "#454545"],
      ["#ffffff", "#c0c0c0"],
      ["#e21a0f", "#c17623"],
      ["#066b7a", "#f7c403"],
      ["#90b775", "#c2aea8"],
    ],
    socios: [],
    autos_socio: [],
    cve_socio: 0,
    cve_accion: 0,
    tipo: "auto",
    marcaS: { marca: "", icono: "prohibido" },
    modelo: "",
    color: "#ffffff",
    placas: "",
    folio_pago:"",
    tag: "",
    maskAccion: {
      mask: "#FFFFF",
      tokens: {
        F: {
          pattern: /[0-9a-cA-C]/,
          transform: (v) => v.toLocaleUpperCase(),
        },
        '#': {
            pattern: /\d/
          }
      },
    },
    ModeloMask: {
        mask: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
        tokens: {
          F: {
            pattern: /[0-9a-zA-Z]/,
            transform(v) {
              return v.toLocaleUpperCase();
            }
          },          
        }
      },
      PlacaMask: {
        mask: "FFFFFFF",
        tokens: {
          F: {
            pattern: /[0-9a-zA-Z]/,
            transform(v) {
              return v.toLocaleUpperCase();
            }
          },          
        }
      },
    fullSocio:undefined,
    tab:null,
    banderaUpdate:false,
    cve_auto_socio:0,
    arduinoCOM:null,
    dialog:false,
    load:false,
    id_auto_eliminar:0,
    sheet:false,
    capacidad:0
  }),
  computed:{
    validarFull()
    {
      return this.marcaS.marca!='' && !isUndefined(this.fullSocio)
    },
    estadoAccion(){
      if(this.socios.length>1) return this.socios[0].estatus
      else return 'no aplica'
    },
    tagsVigentes(){
      if(this.socios.length>1) return this.socios.filter(i=>i.tag_actual>0).map(i=>parseInt(i.tag_actual)).reduce((red,val)=>red+val,0);
      else return '0'
    },
    tagsHistorial(){
       if(this.socios.length>1) return this.socios[0].tags
      else return '0'
    }
  },
  methods: {
    async initConectionArduino()
    {
      
      let COMS = await SerialPort.list();
      // let COM =COMS.find(i=>i.serialNumber=="55731323835351D0D052")
      let COM =COMS.find(i=>i.serialNumber=="85734323431351813071")
      console.log(COMS)

      if(!isUndefined(COM))
      {
      let comArduno = COM.path;
      this.arduinoCOM = new SerialPort(comArduno, { baudRate: 9600 });closeSync
      this.arduinoCOM.on('open', () => console.log('open conexion arduino:'+COM.path));
      this.arduinoCOM.on('error', e => console.log('error arduino=>'+e))
      this.arduinoCOM.on('close', () =>{ 
        console.log('cierra conexion arduino')
        //this.arduinoCOM = new SerialPort(comArduno, { baudRate: 9600 });
        })
      }
      else{console.log('COM ERROR=>',COM)}
      
    },
    buscarSocios() {

      this.clean()
      this.fullSocio=undefined
      this.autos_socio=[]

      let indexTripartidas = -1;
      let numero_accion = 0;
      let clasificacion = 0;

      if (this.accion.indexOf("A") > -1) {
        indexTripartidas = this.accion.indexOf("A");
        clasificacion = 1;
      } else if (this.accion.indexOf("B") > -1) {
        indexTripartidas = this.accion.indexOf("B");
        clasificacion = 2;
      } else if (this.accion.indexOf("C") > -1) {
        indexTripartidas = this.accion.indexOf("C");
        clasificacion = 3;
      }

      if (indexTripartidas > -1) {
        numero_accion = this.accion.substr(0, indexTripartidas);
      } 
      else//acciones arriba de la 150 
      {
        numero_accion = this.accion;
        if(parseInt(numero_accion)>1500)
        {
          this.sheet=true
        }
      }

      console.log(
        "numero accion=>",
        numero_accion,
        "calsificacion=>",
        clasificacion
      );

      this.socios = ipcRenderer.sendSync(
        "getSocios",
        numero_accion,
        clasificacion
      );
    },
    findAutosSocio(idsocio, idaccion) { 
      this.clean();     
      this.cve_socio = idsocio;
      console.log("🚀 ~ file: Home.vue:555 ~ findAutosSocio ~ idsocio", idsocio)
      this.cve_accion = idaccion;
      console.log("🚀 ~ file: Home.vue:557 ~ findAutosSocio ~ idaccion", idaccion)
      this.autos_socio = ipcRenderer.sendSync("getAutosSocio", idsocio);
      // console.log(this.autos_socio);
      
    },
    saveAuto() {
      let {
        cve_socio,
        cve_accion,
        tipo,
        marcaS,
        modelo,
        color,
        placas,
        tag,
        folio_pago,
        capacidad
      } = this;

      let repuve_tag=tag.includes('ABCDEF')?1:2;
      let saveSend = [
        cve_accion,
        cve_socio,
        tipo,
        marcaS.marca,
        modelo,
        color,
        placas,
        tag,
        repuve_tag,
        folio_pago,
        capacidad
      ];
      let save = ipcRenderer.sendSync("saveAuto", saveSend);
      if(save>0)
      {this.autos_socio.push({id_auto_usuario:save,cve_accion,cve_socio,tipo,marca:marcaS.marca,modelo,color,placas,tag,estatus:1,capacidad});this.clean();}
    },
    openDelete(idauto){
      this.dialog=true;
      this.id_auto_eliminar=idauto;
    },
    deleteAuto(){
      let {affectedRows:ok}=ipcRenderer.sendSync('deleteAutos',this.id_auto_eliminar);
      if(ok>0)this.autos_socio=this.autos_socio.filter(i=>i.id_auto_usuario!=this.id_auto_eliminar)
      this.dialog=false 
    },
    editAuto(item){
      this.banderaUpdate=true
      this.cve_auto_socio=item.id_auto_usuario

      this.marcaS.icono=this.marcas_auto.find(i=>i.marca==item.marca).icono
      this.marcaS.marca=item.marca
      this.marca=item.marca
      this.tipo=item.tipo
      this.color=item.color
      this.modelo=item.modelo
      this.placas=item.placas
      this.tag=item.tag
      this.folio_pago=item.folio_pago_tag
      this.capacidad=item.capacidad
    },
    updateAuto(){
        let {marcaS,marca,tipo,color,modelo,placas,tag,cve_auto_socio,capacidad} =this
        let repuve_tag=tag.includes('ABCDEF')?1:2;
        let updateSend = [
        tipo,
        marcaS.marca,
        modelo,
        color,
        placas,
        tag,
        repuve_tag,
        cve_auto_socio,
        capacidad
      ];
      let {affectedRows:update} = ipcRenderer.sendSync("updateAutos", updateSend);
      if(update>0){
        let index=this.autos_socio.findIndex(i=>i.id_auto_usuario==cve_auto_socio);        
        this.autos_socio[index].tipo=tipo
        this.autos_socio[index].marca=marcaS.marca;
        this.autos_socio[index].modelo=modelo
        this.autos_socio[index].color=color
        this.autos_socio[index].placas=placas
        this.autos_socio[index].tag=tag
        this.autos_socio[index].capacidad=capacidad
        this.clean()
      }

    },
    altaBaja(estatus,id){
      this.load=true;
      let {affectedRows:update}  = ipcRenderer.sendSync("altaBajaAuto",estatus,id);
      this.load=false      
    },
    clean(){
      this.cve_auto_socio=0
        this.cve_socio=''
        this.cve_accion=''
        this.tipo='auto'
        this.marcaS.marca='';
        this.marcaS.icono='prohibido'
        this.modelo=''
        this.color=''
        this.placas=''
        this.tag=''
        this.banderaUpdate=false

        //se limpia el folio pago en una nueva busqueda
        this.folio_pago=''

        this.capacidad=0
    }
  },
  watch:{
    fullSocio(val)
    {
     if(isUndefined(val))this.clean();
    }
  },
  filters:{
    fEstatus(v)
    {
      let estatus=['Activa','Bloqueada','Baja'];
      return estatus[v-1]
    },
    fDate(v){
        return dayjs(v).locale('es').format('DD [de] MMMM [del] YYYY')
    }
  }
};
</script>

<style lang="scss">
#panel-marca {
  max-height: calc(100vh - 70px);
  overflow-y: scroll;
}

#panel-data {
  max-height: calc(100vh - 70px);
  overflow-y: scroll;
}

#findAccion {
  width: 300px;
}
</style>
