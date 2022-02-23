<template>
  <div>
    <table align="center" border="1">
      <tbody>
        <tr>
          <th>Nama</th>
          <td v-if="inputStatus">
            <input type="text" v-model="items.name" />
          </td>
          <td v-else>{{ items.name }}</td>
        </tr>
        <tr>
          <th>Harga Satuan</th>
          <td v-if="inputStatus">
            <input type="text" v-model="items.price" />
          </td>
          <td v-else>Rp. {{ formatPrice(items.price) }}</td>
        </tr>
        <tr>
          <th>Code Barang</th>
          <td v-if="inputStatus">
            <input type="text" v-model="items.code" />
          </td>
          <td v-else>{{items.code}}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="inputStatus">
      <button @click="simpan(true)">Simpan</button>
      <button @click="simpan(false)">Cancel</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Detail",
  data() {
    return {
      items: {
        // namaBarang: "barang",
        // hargaSatuan: 1000,
      },
      item: null,
      url: "https://localhost:44356/api/item",
      // url: "https://localhost:44356/api/Items",
      link: null,
    };
  },
  mounted() {
    console.log("Mounted id:", this.detailBarangId);
    if (this.detailBarangId) {
      this.getItems();
      // console.log(this.items);
      // console.log("items :",this.items);
    }
  },
  created() {
  },
  beforeMount() {
  },
  methods: {
    async getItems() {
      this.items = {};

      if (this.detailBarangId) {
        this.link = this.url + "/" + this.detailBarangId;
      } else {
        this.link = this.url;
      }
      // console.log(this.link);
      await fetch(this.link)
        .then((response) => response.json())
        .then((data) => {
          this.items = {
            id: data.id,
            name: data.name,
            price: data.price,
            code:data.code
          };
        })
        .then("items : ", console.log(this.items));
      console.log(this.items);
    },

    async simpan(status) {
      if (status) {
        if (this.detailBarangId) {
          this.link = this.url + "/" + this.detailBarangId;

          await fetch(this.link, {
            method: "PUT",
            body: JSON.stringify({
              id: this.items.id,
              name: this.items.name,
              price: this.items.price ? this.items.price:0 ,
              code: this.items.code,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        } else {
          await fetch(this.url, {
            method: "POST",
            body: JSON.stringify({
              name: this.items.name,
              price: this.items.price,
              code: this.items.code,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      }
      this.$emit("inputItemCallback");
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
  props: {
    detailBarangId: Number,
    inputStatus: Boolean,
  },
};
</script>
<style scoped>
th,
td {
  min-width: 205px;
}
</style>
