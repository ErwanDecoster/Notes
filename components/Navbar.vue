<template>
  <div class="w-full absolute inset-x-0 top-0 flex flex-row-reverse p-4 gap-2">
    <button @click="LogOut()" class="text-xl bg-neutral-800 text-white rounded-full py-1 px-4 text-center cursor-pointer">Deconnection</button>
    <NuxtLink to="/setting" class="text-xl bg-neutral-800 text-white rounded-full py-1 px-4 text-center cursor-pointer">Parametre</NuxtLink>
  </div>  
</template>

<script>
export default {
  data() {
    return {
      colors: [],
      notes: [],
    };
  },
  methods: {
    async LogOut() {
      const supabase = useSupabaseClient()
      let { error } = await supabase.auth.signOut()
    }
  }
}
</script>