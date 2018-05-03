<template>
  <div>
      <i @click="toggleClick" class="fa fa-bars hamburger"  :class="{'is-active':isActive}" ></i>
  </div>
</template>

<script>
export default {
  name: 'hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>

<style scoped>
.hamburger {
    display: inline-block;
    cursor: pointer;
    width: 20px;
    height: 20px;
    transform: rotate(0deg);
    transition: .38s;
    transform-origin: 50% 50%;
    font-size:23px;
    overflow: hidden;
    color:#555;
}

i.hamburger.is-active {
    transform: rotate(90deg);
}
</style>
