<template>
  <div>
    <h4>
      <div>
        <table align="center" border="1">
          <thead>
            <tr>
              <td>Aksi</td>
              <td>Nama Barang</td>
              <td>Harga</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(barangData, index) in barang" :key="index">
              <td v-if="multipleAdding">
                <input type="checkbox" v-model="barangData.checkedStatus" />
              </td>
              <td v-else>
                <button @click="actionAddSingle(index)">Tambah</button>
              </td>
              <td>{{ barangData.namaBarang }}</td>
              <td>Rp. {{ formatPrice(barangData.hargaSatuan) }}</td>
            </tr>
          </tbody>
        </table>
        <div>
          <button
            v-if="multipleAdding"
            @click="actionAddMultiple"
            class="mt-20px"
          >
            Add Items
          </button>
          <button class="mt-20px" @click="actionNo">Cancel</button>
        </div>
      </div>
    </h4>
  </div>
</template>
<style scoped>
td {
  min-width: 100px;
  padding: 5px;
  vertical-align: middle;
}
div > button {
  margin-top: 20px;
  margin-right: 20px;
  margin-left: 20px;
  min-width: 125px;
}
.mt-20px {
  margin-top: 20px;
}
</style>
<script>
// import axios from "axios";
export default {
  data() {
    // this.getList("https://localhost:44386/api/Items");
    // this.getList();
    return {
      // url: "https://api.dictionaryapi.dev/api/v2/entries/en/hello",
      url: "https://localhost:5001/api/Items",
      //   barang: [
      //     {
      //       checkedStatus: false,
      //       namaBarang: "Beras",
      //       hargaSatuan: "10000",
      //     },
      //     {
      //       checkedStatus: false,
      //       namaBarang: "Minyak",
      //       hargaSatuan: "14000",
      //     },
      //     {
      //       checkedStatus: false,
      //       namaBarang: "Gula",
      //       hargaSatuan: "12000",
      //     },
      //   ],
      hasil: "",
      barang: null,
    };
  },

  mounted() {
    this.getList();
    console.log(this.barang);
    // console.log("this barang mounted", this.barang);
  },
  methods: {
    actionAddMultiple() {
      this.addItem();
    },
    async getList() {
      this.barang = [];
      // axios.get(this.url)
      await fetch(this.url)
        .then((response) => response.json())
        // .then((response) => response.$values)
        .then((response) => {
          // console.log(response);

          // this.barang = response.data;
          for (let i = 0; i < response.length; i++) {
            this.barang.push({
              id: response[i].id,
              namaBarang: response[i].name,
              hargaSatuan: response[i].price,
              checkedStatus: false,
            });
            // console.log(response);
          }
        })
        .catch((err) => console.error("erornya", err));
      //   console.log("this barang baru digetlist: ", this.barang);
    },

    actionAddSingle(index) {
      this.barang.map((e) => (e.checkedStatus = false));
      this.barang[index].checkedStatus = true;
      this.addItem();
      //   this.barang.map((e) => (e.checked = false));
    },
    addItem() {
      for (let index = 0; index < this.barang.length; index++) {
        if (this.barang[index].checkedStatus) {
          this.$emit("tambahBarangCallback", this.barang[index]);
        }
      }
    },
    actionNo() {
      this.$emit("tambahBarangCallback");
    },
    // actionAddSingle(barangData) {
    //   this.$emit("tambahBarangCallback", {
    //     adding: true,
    //     item: barangData,
    //   });
    // },
    formatPrice(value) {
      let val = (value / 1).toFixed(0).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
  computed: {
    // checkedbarang() {
    //   return this.barang.filter(function (e) {
    //     return e.checkedStatus == true;
    //   });
    // },
  },
  props: {
    tambahBarangCallback: Event,
    multipleAdding: Boolean,
  },
};
</script>
