<template>
  <div class="text-center">
    <b-icon icon="exclamation-circle" class="mt-3 pt-3 pb-3" style="width: 100px; height: 100px;"></b-icon>
    <h1 class="font-mono z-50 text-6xl text-center font-weight-bold mb-3 pb-3 mt-2 text-uppercase" style="letter-spacing: 5px;">
      {{ error.statusCode }} Page not found!!!
    </h1>
  </div>
</template>

<script>
  export default {
    props: ["error"],
    layout: "error",
  };
</script>
