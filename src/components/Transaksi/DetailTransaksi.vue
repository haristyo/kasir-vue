<template>
  <div>
    <table align="center" border="1">
      <tr>
        <th>No</th>
        <th>Item Name</th>
        <th>Item Price</th>
        <th>Item Quantity</th>
        <th>Item Total Price</th>
        <th>Aksi</th>
      </tr>
    <tbody>
      <tr v-for="(transaksi, index) in transaksi.invoiceDetails" :key="index">
      <td>{{index+1}}</td>
      <td>{{transaksi.itemName}}</td>
      <td>Rp. {{transaksi.itemPrice|formatPrice}}</td>
      <td><input type="number" v-model="transaksi.qty" min="0"/></td>
      <td>Rp. {{transaksi.itemPrice*transaksi.qty|formatPrice}}</td>
      <td><button @click="deleteRow(index)" class="hapus">Hapus</button></td>
      </tr>
      <tr>
        <td colspan=4>Total</td>
        <td>Rp.{{total|formatPrice}}</td>
      </tr>
      <tr>
        <td colspan=4>Diskon</td>
        <td>Rp.{{diskon|formatPrice}}</td>
      </tr>
      <tr>
        <td colspan=4>Grand Total</td>
        <td>Rp.{{Number(total)-Number(diskon)|formatPrice}}</td>
      </tr>
    </tbody>
    </table>
    <div>
      <button @click="simpan(true)">Simpan</button>
      <button @click="simpan(false)">Batal</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "DetailTransaksi",
  filters: {
  formatPrice(value) {
      let val = (value / 1).toFixed(0).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
   },
  data() {
    return {
      transaksi: [],
      item: null,
      url: "https://localhost:44356/api/invoice",
      // url: "https://localhost:44356/api/belanja",
      link: null,
    };
  },
  mounted() {
    console.log("Mounted id:", this.invoiceId);
    if (this.invoiceId) {
      this.getTransaksi();
    }
    
  },
  created() {
  },
  beforeMount() {
  },
  computed:{
    total() {
      let total = 0;
      if(this.transaksi.invoiceDetails){
        for(let i=0; i<this.transaksi.invoiceDetails.length; i++){
          total =
            Number(total) + Number(this.transaksi.invoiceDetails[i].itemPrice) * Number(this.transaksi.invoiceDetails[i].qty);
        }
      }
      return total;
    },
    diskon(){
      let diskon=0;
      if(this.total >= 10000){
        diskon = this.total*0.1;
      }
      return diskon;
    }
  },
  methods: {

    deleteRow(index) {
      // this.items.splice(index, 1);
      console.log(index);
        this.transaksi.invoiceDetails.splice(index, 1);
    },
    async getTransaksi() {
      this.transaksi = {};

      if (this.invoiceId) {
        this.link = this.url + "/" + this.invoiceId;
      } else {
        this.link = this.url;
      }
      console.log(this.link);
      await fetch(this.link)
        .then((response) => response.json())
        .then((data) => {
          this.transaksi = data;
        })
        // .then(console.log("Transaksi : ", this.transaksi));
      console.log("target invoice : ",this.transaksi);
    },
    async simpan(status){
      if(status){
      this.$emit("detailTransaksiCallback", this.transaksi);
      }
      else{
        this.$emit("detailTransaksiCallback");
      }
      // console.log(status);
      // console.log(this.transaksi);

    },
    // async simpan(status) {
    //   if (status) {
    //     if (this.detailBarangId) {
    //       this.link = this.url + "/" + this.detailBarangId;

    //       await fetch(this.link, {
    //         method: "PUT",
    //         body: JSON.stringify({
              
    //           name: this.items.namaBarang,
    //           price: this.items.hargaSatuan,
    //           code: this.items.code,
    //         }),
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       });
    //     } else {
    //       await fetch(this.url, {
    //         method: "POST",
    //         body: JSON.stringify({
    //           name: this.items.namaBarang,
    //           price: this.items.hargaSatuan,
    //           code: this.items.code,
    //         }),
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       });
    //     }
    //   }
    //   this.$emit("inputItemCallback");
    // },

  },
  props: {
    invoiceId: Number,
    inputStatus: Boolean,
    detailTransaksiCallback: Event
  },
};
</script>
<style scoped>
th,
td {
  min-width: 150px;
}
</style>
