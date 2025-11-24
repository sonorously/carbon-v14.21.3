<template>
  <div class="home-style">
    <h1>404</h1>
  </div>
</template>

<style>
.home-style {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 100px;
  color: #9a9aee;
  @supports (-webkit-background-clip: text) or (background-clip: text) {
    background: linear-gradient(to right, #ea9b9b, #9a9aee);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}
</style>
