<template>
  <div class="box bg-hc-dark-blue">
    <slot></slot>
  </div>
</template>

<style scoped>
.box {
  position: relative;
  flex-shrink: 0;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25),
    -4px 4px 50px rgba(114, 158, 203, 0.7),
    inset 0 0 0 7px rgba(255, 255, 255, 0.7);
}
.dark .box {
  background: rgba(253, 214, 175, 0.1);
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25),
    -4px 4px 50px rgba(12, 59, 81, 0.5),
    inset 0 0 0 7px rgba(255, 255, 255, 0.7);
}
</style>
