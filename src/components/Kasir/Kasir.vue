<template>
  <div>
    <Popup :isShow="needConfirm">
      <template name="title">Hapus Data</template>
      <template>
        <Konfirmasi />
      </template>
      <template name="button">
        <button @click="hapus(true)">Hapus</button>
        <button @click="hapus(false)">Batal</button>
      </template>
    </Popup>
    
    <Popup :isShow="tambahBarang">
      <template name="title">Tambah Item Barang</template>
      <template>
        <TambahBarang
          @tambahBarangCallback="addedItem"
          :multipleAdding="multipleAdd"
        />
      </template>
    </Popup>
    <h1>Kalkulator Kasir</h1>

    <table border="2" align="center">
      <thead>
        <tr>
          <th>Code Barang</th>
          <th>Nama Barang</th>
          <th>Harga Satuan</th>
          <th>Quantity</th>
          <th>Subtotal</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(itemData, index) in items" :key="index">
          <td>
            {{ itemData.code }}
          </td>
          <td>
            <!-- <input
              type="text"
              v-model="itemData.namaBarang"
              placeholder="masukkan nama barang"
            /> -->
            {{ itemData.namaBarang }}
          </td>
          <td>
            <!-- <input
              type="number"
              v-model="itemData.hargaSatuan"
              placeholder="masukkan harga barang"
              min="0"
            /> -->
            {{ itemData.hargaSatuan }}
          </td>
          <td>
            <input
              type="number"
              v-model="itemData.qty"
              placeholder="masukkan jumlah barang"
              min="0"
            />
          </td>
          <!-- <td>{{itemData.hargaSatuan}}</td> -->
          <td>
            {{
              "Rp. " +
              formatPrice(
                Number(Number(itemData.hargaSatuan) * Number(itemData.qty))
              )
            }}
          </td>
          <td class="total-label">
            <button @click="removeRow(itemData, index)" class="hapus">
              Hapus
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="4" class="total-label">Total</td>
          <td>{{ "Rp. " + formatPrice(Number(total)) }}</td>
          <!-- <td>{{ total || toCurrency }}</td> -->
          <td class="total-label">
            <button @click="deleteAll()" class="total" v-if="items.length > 0">
              Hapus Semua {{ items.length }}
            </button>
            <!-- <button @click="showTotal()" class="total">Total</button> -->
          </td>
        </tr>
        <tr>
          <td colspan="4" class="total-label">Diskon</td>
          <td :class="diskon ? 'diskon' : 'undiskon'">
            {{ "Rp. " + formatPrice(Number(diskon)) }}
          </td>
          <!-- <td>{{ total || toCurrency }}</td> -->
          <td class="total-label" v-if="diskon == 0">
            Belanja minimal Rp.10.000 diskon 10%
          </td>
          <td class="total-label" v-else>Selamat anda mendapatkan diskon</td>
        </tr>
        <tr>
          <td colspan="4" class="total-label">Grand Total</td>
          <td>{{ "Rp. " + formatPrice(Number(total) - Number(diskon)) }}</td>
          <!-- <td>{{ total || toCurrency }}</td> -->
          <td class="total-label"></td>
        </tr>
      </tbody>
    </table>
    <button @click="addRowSingle" class="tambah">Tambah Barang</button>
    <button @click="addRowMultiple" class="tambah">
      Tambah Barang Lebih dari 1
    </button>
    <button @click="checkout" class="hapus">Checkout</button>
  </div>
</template>

<script>
// import func from "vue-editor-bridge";
import Konfirmasi from "./../Konfirmasi.vue";
import TambahBarang from "./TambahBarang.vue";
import Popup from "./../Popup.vue";

export default {
  name: "kasir",
  components: {
    Konfirmasi,
    TambahBarang,
    Popup,
  },
  data() {
    return {
      multipleAdd: false,
      needConfirm: false,
      tambahBarang: false,
      multipleDelete: false,
      deletedIndex: -1,
      // addedItem:[],
      deletedDataItem: null,
      items: [],
      url: "https://localhost:44356/api/invoice",
    };
  },
  methods: {
    hapus(status) {
      if (status) {
        console.log(this.deletedIndex);
        if (this.multipleDelete) {
          this.items = [];
        } else {
          this.items.splice(this.deletedIndex, 1);
        }
      }
      this.needConfirm = false;
      this.deletedIndex = -1;
      this.deletedDataItem = null;
      this.multipleDelete = false;
    },
    deleteAll() {
      this.needConfirm = true;
      this.multipleDelete = true;
      // this.items = [];
    },
    addRowSingle() {
      this.tambahBarang = true;
      this.multipleAdd = false;
    },
    addRowMultiple() {
      this.tambahBarang = true;
      this.multipleAdd = true;
    },

    removeRow(itemData, index) {
      // this.items.splice(index, 1);
      console.log(itemData);
      console.log(index);
      this.multipleDelete = false;
      this.needConfirm = true;
      this.deletedIndex = index;
      this.deletedDataItem = itemData;
    },

    async checkout() {
      let DetailTransaksi = [];
      for (let i = 0; i < this.items.length; i++) {
        DetailTransaksi.push({
          itemid: this.items[i].id,
          qty: this.items[i].qty
        });
      }
      let dataSend = {
        "invoiceDetails" : DetailTransaksi
      }
      await console.log("data terkirim ke api : ",dataSend);

      console.log("dataSend : ", JSON.stringify(dataSend));
      await fetch(this.url, {
        method: "POST",
        body: JSON.stringify(dataSend),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => console.log(response));

      // .then((data) => console.log("hasil fetch : ", (this.url = data)));
      // await console.log("hasil fetch : ", this.url);
      this.items=[];
    },
    // confirm(param) {
    //   if (param.confirm) {
    //     this.items.splice(param.index, 1);
    //   }
    //   this.needConfirm = false;
    //   this.deletedIndex = -1;
    //   this.deletedDataItem = null;
    // },
    addedItem(param) {
      // console.log(param);
      if (param) {
        this.items.push({
          id: param.id,
          namaBarang: param.namaBarang,
          hargaSatuan: param.hargaSatuan,
          qty: 1,
          code: param.code
        });
      }
      // if (param.adding) {
      //   if (param.multiple) {
      //     for (let index = 0; index < param.item.length; index++) {
      //       this.items.push({
      //         namaBarang: param.item[index].namaBarang,
      //         hargaSatuan: param.item[index].hargaSatuan,
      //         qty: "",
      //       });
      //     }
      //   } else {
      //     this.items.push({
      //       namaBarang: param.item.namaBarang,
      //       hargaSatuan: param.item.hargaSatuan,
      //       qty: "",
      //     });
      //   }
      // }
      this.tambahBarang = false;
    },

    // tambahan
    formatPrice(value) {
      let val = (value / 1).toFixed(0).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    showTotal() {
      alert("Total : Rp." + this.formatPrice(Number(this.total)));
    },
  },
  computed: {
    total() {
      let total = 0;
      // this.item[0]
      this.items.map(function (element) {
        total =
          Number(total) + Number(element.hargaSatuan) * Number(element.qty);
        // return element *3;
      });
      //
      // return total;
      // console.log(total);
      return total;
    },
    diskon() {
      let diskon = 0;

      if (this.total >= 10000) {
        diskon = 0.1;
      }
      let totaldiskon = Number(this.total) * Number(diskon);
      return totaldiskon;
    },
  },
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
  color: black;
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
.hapus:hover {
  background-color: #f44336;
  color: white;
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

button {
  min-width: 65px;
}
</style>
