<template>
  <div class="mb-8 flex">

  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  mounted() {
    window.scrollTo(0,0);
    const user = useSupabaseUser();
    watchEffect(() => {
      if (!user.value)
        navigateTo('/login');
    })
  },
  created() {
  }
};
</script>
