<template>
  <div>
    <Popup :isShow="deleteStatus">
      <template name="title">Hapus Data</template>
      <template>
        <Konfirmasi />
      </template>
      <template name="button">
        <button @click="hapus(true)">Hapus</button>
        <button @click="hapus(false)">Batal</button>
      </template>
    </Popup>

    <Popup :isShow="detailStatus">
      <template name="title" v-if="!inputStatus">Detail Barang</template>
      <template name="title" v-else-if="inputStatus">
        <div v-if="detailId">Update Barang</div>
        <div v-else>Input Barang</div>
      </template>

      <template v-if="!inputStatus">
        <DetailBarang :detailBarangId="detailId" :inputStatus="inputStatus" />
      </template>
      <template v-else-if="inputStatus">
        <DetailBarang
          :detailBarangId="detailId"
          :inputStatus="inputStatus"
          @inputItemCallback="closePopup"
        />
      </template>
      <template name="button">
        <button v-if="!inputStatus" @click="detailStatus = false">Tutup</button>
      </template>
    </Popup>
    <h1>List Barang</h1>

    <table border="2" align="center">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama Barang</th>
          <th>Harga Satuan</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(itemData, index) in items" :key="index">
          <td>{{ index + 1 }}</td>
          <td>
            {{ itemData.namaBarang }}
          </td>
          <td>
            RP.
            {{ formatPrice(itemData.hargaSatuan) }}
          </td>

          <td class="total-label">
            <button @click="removeRow(itemData.id)" class="hapus">Hapus</button>
            <button @click="detailRow(itemData.id)" class="tambah">
              Detail
            </button>
            <button @click="updateRow(itemData.id)" class="total">
              Update
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td><button @click="addData" class="tambah">Tambah data</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// import func from "vue-editor-bridge";
import DetailBarang from "./Detail.vue";
import Konfirmasi from "./Konfirmasi.vue";
import Popup from "./Popup.vue";
// import axios from "axios";

export default {
  name: "ListBarang",
  components: {
    Konfirmasi,
    DetailBarang,
    Popup,
  },
  data() {
    return {
      items: [],
      url: "https://localhost:5001/api/Items",
      // url: "https://localhost:5001/api/Items",
      deleteStatus: false,
      deletedId: null,
      detailStatus: false,
      detailId: null,
      inputStatus: false,
    };
  },
  mounted() {
    this.getItems();
  },
  methods: {
    async getItems() {
      this.items = [];
      await fetch(this.url)
        .then((response) => response.json())
        // .then((response) => response.$values)
        .then((data) => {
          for (let index = 0; index < data.length; index++) {
            this.items.push({
              id: data[index].id,
              namaBarang: data[index].name,
              hargaSatuan: data[index].price,
            });
          }
        });
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    closePopup() {
      this.detailStatus = false;
      this.detailId = null;
      this.inputStatus = false;
      this.getItems();
    },

    removeRow(id) {
      this.deleteStatus = true;
      console.log("id deleted", id);
      this.deletedId = id;
    },
    detailRow(id) {
      this.detailStatus = true;
      console.log("Detail id", id);
      this.detailId = id;
    },
    addData() {
      // console.log(this.items);
      this.detailStatus = true;
      this.detailId = null;
      this.inputStatus = true;
    },
    updateRow(id) {
      this.detailStatus = true;
      console.log("Detail id", id);
      this.detailId = id;
      this.inputStatus = true;
    },
    async hapus(status) {
      if (status) {
        console.log("status hapus", status, this.deletedId);
        let link = this.url + "/" + this.deletedId;
        console.log("Link delete");
        await fetch(link, {
          method: "DELETE",
        });
      }
      this.deleteStatus = false;
      this.deleteId = false;
      this.getItems();
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
