<template>
  <div class="flex min-h-[100vh] h-full justify-center items-center">
    <div class="flex flex-col gap-16 items-center -mt-12">
      <h1 class="text-5xl font-semibold">Notes - Inscription</h1>
      <div class="grid gap-4 w-80">
        <h2 class="text-3xl font-semibold">Crée un compte</h2>
        <form id="form" class="grid gap-1" @submit.prevent="SendForm()">
          <div v-if="errors" class="flex flex-col gap-2">
            <div v-for="error in errors" :key="error" @click="errors.splice(errors.indexOf(error), 1)" class="bg-red-400 py-1 px-2 text-xl rounded-3xl">{{ error }}</div>
          </div>
          <div class="grid">
            <label class="text-xl" for="email">Email</label>
            <input class="text-xl bg-white shadow-md rounded-full py-1 px-2" type="email" name="email" id="email" v-model="form.email" autocomplete="email"> 
          </div>
          <div class="grid">
            <label class="text-xl" for="password">Mot de passe</label>
            <div class="relative">
              <button type="button" @click.self="ShowPassword($event)" class="p-2 absolute top-1/2 -translate-y-1/2 right-2">
                <svg class="pointer-events-none" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 8.30154C5.74762 1.80365 12.4889 1.88804 17 8.30154C12.1679 15.0526 5.78141 14.6813 1 8.30154Z" stroke="#333333" stroke-linejoin="round"/>
                  <path d="M11.7864 8.33554C11.7864 9.86722 10.5433 11.1098 9.00868 11.1098C7.47409 11.1098 6.23096 9.86722 6.23096 8.33554C6.23096 6.80386 7.47409 5.56128 9.00868 5.56128C10.5433 5.56128 11.7864 6.80386 11.7864 8.33554Z" stroke="#333333"/>
                  <path d="M2.62195 1.33341L15.9694 14.6667" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <input class="text-xl w-full bg-white shadow-md rounded-full py-1 px-2" type="password" name="password" id="password" v-model="form.password" autocomplete="new-password"> 
            </div>
          </div>
          <div class="grid">
            <label class="text-xl" for="passwordRetype">Confirmation du mot de passe</label>
            <div class="relative">
              <button type="button" @click.self="ShowPassword($event)" class="p-2 absolute top-1/2 -translate-y-1/2 right-2">
                <svg class="pointer-events-none" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 8.30154C5.74762 1.80365 12.4889 1.88804 17 8.30154C12.1679 15.0526 5.78141 14.6813 1 8.30154Z" stroke="#333333" stroke-linejoin="round"/>
                  <path d="M11.7864 8.33554C11.7864 9.86722 10.5433 11.1098 9.00868 11.1098C7.47409 11.1098 6.23096 9.86722 6.23096 8.33554C6.23096 6.80386 7.47409 5.56128 9.00868 5.56128C10.5433 5.56128 11.7864 6.80386 11.7864 8.33554Z" stroke="#333333"/>
                  <path d="M2.62195 1.33341L15.9694 14.6667" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <input class="text-xl w-full bg-white shadow-md rounded-full py-1 px-2" type="password" name="passwordRetype" id="passwordRetype" v-model="form.passwordRetype" autocomplete="new-password"> 
            </div>
          </div>
        </form>
        <div class="grid gap-2">
          <button form="form" type="submit" class="text-xl bg-neutral-800 text-white rounded-full py-1 px-2 text-center cursor-pointer">S’inscrire</button>
          <NuxtLink to="/login" class="text-xl rounded-full py-1 px-2 text-center cursor-pointer">Connection</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
        passwordRetype: '',
      },
      errors: [],
    };
  },
  methods: {
    ShowPassword(input) {
      const target = input.target.nextSibling;
      if (target.type === "password")
        target.type = "text";
      else
        target.type = "password";
    },
    VerifEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    VerifForm(form) {
      this.errors = [];
      if (!this.VerifEmail(form.email))
        this.errors.push('Un email valide est requi');
      if (!form.password)
        this.errors.push('Le champ mot de passe est requi');
      else if (form.password.length < 8)
        this.errors.push('Le mot de passe doit contenir au moin 8 caracteres');
      else if (form.password !== form.passwordRetype)
        this.errors.push('Les mots de passe ne corespondent pas');
      if (this.errors.length === 0)
        return true;
    },
    async signUp() {
      const supabase = useSupabaseClient();
      const { user, error } = await supabase.auth.signUp({
        email: this.form.email,
        password: this.form.password,
      });
      console.log('user', user);
      console.log('error', error);
    }, 
    SendForm() {
      if (!this.VerifForm(this.form))
        return;
      this.signUp();
    },
  },
  mounted() {
    window.scrollTo(0,0);
    const user = useSupabaseUser();
    console.log(user);
    watchEffect(() => {
      if (user.value)
        navigateTo('/');
    })
  },
  created() {
  }
};
</script>
