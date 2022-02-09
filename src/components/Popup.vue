<template>
  <div class="popup" v-if="isShow" id="popup-backdrop">
    <div id="popup">
      <!-- <h1>Popup</h1> -->
      <h2><slot name="title" /></h2>
      <slot />
      <slot name="button" />
    </div>
  </div>
</template>

<script>
export default {
  name: "popup",
  props: {
    isShow: Boolean,
  },
};
</script>

<style scoped>
#popup-backdrop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 1;
  visibility: visible;
  transform: scale(1);
}

#popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 1rem 1.5rem;
  width: 50%;
  border-radius: 0.5rem;
}
</style>
