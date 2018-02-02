<template>
  <header>
    <ul class="headerLeft">
      <a>Hyperbolic DGS</a>
    </ul>
    <header-menu :canvasManager="canvasManager"/>
  </header>
</template>

<script>
export default {
}
</script>

<style>
header {
    border-style: ridge;
    border-color: gray;

    overflow:hidden;
    font-size: 2rem;

    height: 50px;
    background-color: Azure;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    cursor: default
}
</style>
