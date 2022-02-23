<template>
  <div>
    <Popup :isShow="deleteStatus">
      <template name="title">Hapus Transaksi</template>
      <template>
        <Konfirmasi />
      </template>
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
        <td><button @click="showDetail(transaksiData)" class="total" >Tampil Rincian Transaksi</button></td>
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
      console.log(this.transaksi);
    },
    hapus(){

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
        // InvoiceDetails: []
        };
        // for(let i=0; i < param.invoiceDetails.length;i++){
        //   invoiceUpdate.InvoiceDetails.push(
        //     {
        //       Id: param.invoiceDetails[i].id,
        //       ItemId: param.invoiceDetails[i].itemId,
        //       InvoiceId : param.id,
        //       Qty : param.invoiceDetails[i].qty,
        //     }
        //   );
        // }
      
      console.log("invoice Update Terbaru:", invoiceUpdate);
      let dataSend = JSON.stringify(invoiceUpdate);
      // this.showJson = dataSend;
      console.log("data bakal disubmit  : ", dataSend);
      this.link = this.url + "/" + param.id;
      console.log("target api : ", this.link);
      // }
      // alert(dataSend);
      
      
      await fetch(this.link, {
        method: "PUT",
        body: dataSend,
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then((response) => response.json())
        .then((response) => console.log("Hasilnya : ",response));
      
      }

      
      this.getTransaksi();

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
</style>