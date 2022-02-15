<template>
  <div>
    <table align="center" border="1">
      <tr>
        <th>No</th>
        <th>Item Name</th>
        <th>Item Price</th>
        <th>Item Quantity</th>
        <th>Item Total Price</th>
      </tr>
    <tbody>
      <tr v-for="(transaksi, index) in transaksi.invoiceDetails" :key="index">
      <td>{{index+1}}</td>
      <td>{{transaksi.itemName}}</td>
      <td>Rp. {{transaksi.itemPrice|formatPrice}}</td>
      <td>{{transaksi.qty}}</td>
      <td>Rp. {{transaksi.price|formatPrice}}</td>
      </tr>
        
    </tbody>
    </table>
    <div>
      <button @click="simpan(true)">Simpan</button>
      <button @click="simpan(false)">Cancel</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Detail",
  filters: {
  formatPrice(value) {
      let val = (value / 1).toFixed(0).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
   },
  data() {
    return {
      transaksi: {
        // namaBarang: "barang",
        // hargaSatuan: 1000,
      },
      item: null,
      url: "https://localhost:44356/api/Belanja",
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
  methods: {
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
        .then(console.log("Transaksi : ", this.transaksi));
    },
    async simpan(status){
      console.log(status);
      console.log(this.transaksi);
      this.$emit("detailTransaksiCallback", this.transaksi);
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
