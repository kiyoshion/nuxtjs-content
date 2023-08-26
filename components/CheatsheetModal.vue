<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask" @click.stop="$emit('close')">
      <div class="modal-container" @click.stop="$emit('open')">
        <div class="relative">
          <div class="modal-header flex justify-between">
            <slot name="header">default header</slot>
            <button
              class="modal-default-button"
              @click="$emit('close')"
            >CLOSE</button>
          </div>
          <div class="modal-body flex justify-between">
            <div class="modal-body-content">
              <slot name="body">default body</slot>
            </div>
            <div class="modal-body-preview bg-gray-400">
              <h3>Preview</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
})
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  transition: opacity 0.3s ease;
}

.modal-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 75vh;
  margin: auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  overflow-y: scroll;
}

.modal-header h3 {
  font-size: 1rem;
  font-weight: bold;
  margin-right: 1rem;
}
.modal-container p {
  font-size: .9rem;
  margin: .5rem 0;
  text-align: justify;
  line-height: 1.6rem;
}

.modal-body {
  margin: 20px 0;
}

.modal-body-content,
.modal-body-preview {
  width: calc(50vw - 3rem);
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: translateY(100px);
  transform: translateY(100px);
}
</style>
