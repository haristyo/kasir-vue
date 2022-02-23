<template>
  <div>
    <Popup :isShow="deleteStatus">
      <template name="title">Hapus Transaksi</template>
      <br/>

      <template name="button">
        <button @click="hapus(true)">Hapus</button>
        <button @click="hapus(false)">Batal</button>
      </template>
    </Popup>

    <Popup :isShow="detailStatus">
      <template name="title">Detail Transaksi</template>
      <template>
        <DetailTransaksi :invoiceId="InoviceId" @detailTransaksiCallback="detailTransaksiEvent"/>
      </template>
    </Popup>

    <h1>Data Transaksi</h1>

    <table border="2" align="center">
      <thead>
        <tr>
          <th>No</th>
          <th>Nomor Invoice</th>
          <th>Tanggal Transaksi</th>
          <th>Harga Total</th>
          <th>Jumlah Item</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(transaksiData, index) in transaksi" :key="index">
        <td>{{index+1}}</td>
        <td>{{transaksiData.invoiceNo}}</td>
        <td>{{transaksiData.invoiceDate | moment}}</td>
        <td>Rp. {{ total_harga(transaksiData)*0.9 | formatPrice}}</td>
        <td>{{ total_item(transaksiData)}}</td>
        <td>
        <button @click="showDetail(transaksiData)" class="total" >Tampil Rincian Transaksi</button>
        <button @click="deleteRow(transaksiData)" class="hapus" >Hapus</button>
        </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td><button @click="showData" class="tambah">Tampil Data</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// import func from "vue-editor-bridge";
import Popup from "./../Popup.vue";
import DetailTransaksi from "./DetailTransaksi.vue";

// import axios from "axios";
import moment from 'moment';

export default {
  name: "ListBarang",
   filters: {
    moment(date) {
      moment.locale('id');
      return moment(date).format("D-MMMM-YYYY h:mm ");
    },

    formatPrice(value) {
      let val = (value / 1).toFixed(0).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
   },
  components: {
    Popup,
    DetailTransaksi
  },
  data() {
    return {
      transaksi: [],
      url: "https://localhost:44356/api/invoice",
      // url: "https://localhost:44356/api/Belanja",
      // url: "https://localhost:5001/api/Items",
      deleteStatus: false,
      showJson: null,
      deletedId: null,
      detailStatus: false,
      detailId: null,
      inputStatus: false,
      InoviceId:null,
      errors:null
    };
  },
  mounted() {
    this.getTransaksi();
  },
  methods: {
    showDetail(transaksiData){
      this.detailStatus = true;
      this.InoviceId = transaksiData.id;
    },
    async getTransaksi() {
      this.transaksi = [];
      await fetch(this.url)
        .then((response) => response.json())
        // .then((response) => response.$values)
        .then((data) => 
                        {
                          for (let index = 0; index < data.length; index++) {
                            this.transaksi.push(data[index]);
                          }
                        }
        );
    },
    showData(){
      console.log(this.errors);
    },
    deleteRow(param){
      this.deleteStatus = true;
      console.log("id deleted", param.id);
      this.deletedId = param.id;
      // console.log(param);
    },
    async hapus(status){
      if (status) {
        console.log("status hapus ", status, this.deletedId);
        let link = this.url + "/" + this.deletedId;
        console.log("Link delete", link);
        await fetch(link, {
          method: "DELETE",
        })
        .then();
        // .then(this.getTransaksi());
        // .then(function(response) {if(response){ alert(response);}})
        // .then((response) => console.log("Hasilnya : ",response));
      }
      this.getTransaksi();
      this.deleteStatus = false;
      this.deletedId = null;
    },

    async detailTransaksiEvent(param){
      this.detailStatus = false;
      if(param){
      console.log("terkirim dari popup : ", param);
      let invoiceUpdate = {
        id : param.id,
        invoiceDate : param.invoiceDate,
        invoiceNo : param.invoiceNo,
        invoiceDetails: param.invoiceDetails
        };

      
      // console.log("invoice Update Terbaru:", invoiceUpdate);
      let dataSend = JSON.stringify(invoiceUpdate);
      // console.log("data bakal disubmit  : ", dataSend);
      this.link = this.url + "/" + param.id;
      // console.log("target api : ", this.link);
      // }
      // alert(dataSend);
      
      let errorList = null;
      await fetch(this.link, {
        method: "PUT",
        body: dataSend,
        headers: {
          "Content-Type": "application/json",
        }
      })
        // .then((response) => (response.json()))
        // .then(()=> this.getTransaksi())
        .then((response) => {if(response.status==200){this.getTransaksi();}else{return response.json();}})
        .then((response) => errorList=response)
        // .catch(err => {console.log("errornya",err.response)})
       
        if(this.error!=null){
          console.log("this.error", this.error);
        }

        if(errorList=="tes"){
          console.log("list error : ",(errorList));
        }

        var dataError = Object.keys(errorList);
        // var keys = Object.keys(obj); // ['key1', 'key2']
        dataError.forEach( function(key) {
          var values = errorList[key];
          for(let i=0; i<errorList[key].length; i++)
          {alert(values[i]);}
          // do stuff with "values"
        })
      }

      
      // this.getTransaksi();

    },

    total_item(transaksiData){
      let totalitems = 0;
      for(var i = 0; i<transaksiData.invoiceDetails.length; i++){
                  totalitems += transaksiData.invoiceDetails[i].qty;
              }
      return totalitems;
    },
    total_harga(transaksiData){
      let totalprice = 0;
      for(var i = 0; i<transaksiData.invoiceDetails.length; i++){
                  totalprice += transaksiData.invoiceDetails[i].price;
              }
      return totalprice;
    },
  },
  computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
/* button {
  margin-left: 0px;
} */
tr th,
tr td {
  min-width: 205px;
}
.tambah {
  border-color: #04aa6d;
  color: green;
}
.diskon {
  background: green;
  color: white;
}
.undiskon {
  background: yellow;
  color: rgb(22, 11, 11);
}
.tambah:hover {
  background-color: #04aa6d;
  color: white;
}
.total {
  border-color: orange;
  color: orange;
}

.total:hover {
  background-color: orange;
  color: white;
}
.hapus {
  border-color: #f44336;
  color: red;
}
.total-label {
  background-color: aqua;
  background: blue;
  color: white;
}
tr th {
  color: white;
  background: black;
}
.hapus:hover {
  background-color: #f44336;
  color: white;
}
button {
  min-width: 65px;
}
.hapus {
  border-color: #f44336;
  color: red;
}
.hapus:hover {
  background-color: #f44336;
  color: white;
}
</style>