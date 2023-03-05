<template>
  <div class="pt-16 flex">
    <Navbar />
    <div class="max-w-screen-xl w-full m-auto p-4 grid gap-8 mt-12">
      <h1 class="text-5xl font-semibold w-full text-center">Notes - Paramètre</h1>
      <div class="grid m-auto gap-8">
        <div class="bg-red-400 py-1 px-2 text-xl rounded-3xl">Rien ne fonctionne c'est juste une jolie page</div>
        <div class="grid grid-cols-2 gap-8 ">
          <h2 class="col-span-2 text-3xl font-semibold">Modification du compte</h2>
          <form class="flex flex-col gap-4 w-80">
            <h3 class="text-xl font-semibold">Changement d'email</h3>
            <div class="grid">
              <label class="text-xl" for="email">Email actuel</label>
              <input class="text-xl w-full bg-white shadow-md rounded-full py-1 px-2" type="email" name="email" id="email" v-model="updateEmailForm.email" autocomplete="email"> 
            </div>
            <div class="grid">
              <label class="text-xl" for="newEmail">Nouveau actuel</label>
              <input class="text-xl w-full bg-white shadow-md rounded-full py-1 px-2" type="email" name="email" id="newEmail" v-model="updateEmailForm.newEmail" autocomplete="email"> 
            </div>
            <button type="submit" class="text-xl bg-neutral-800 text-white rounded-full py-1 px-2 text-center cursor-pointer">Sauvegarder</button>
          </form>
          <form class="flex flex-col gap-4 w-80">
            <h3 class="text-xl font-semibold">Changement de mot de passe</h3>
            <div class="grid">
              <label class="text-xl" for="actualPassword">Mot de passe actuel</label>
              <div class="relative">
                <button type="button" @click.self="ShowPassword($event)" class="p-2 absolute top-1/2 -translate-y-1/2 right-2">
                  <svg class="pointer-events-none" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 8.30154C5.74762 1.80365 12.4889 1.88804 17 8.30154C12.1679 15.0526 5.78141 14.6813 1 8.30154Z" stroke="#333333" stroke-linejoin="round"/>
                    <path d="M11.7864 8.33554C11.7864 9.86722 10.5433 11.1098 9.00868 11.1098C7.47409 11.1098 6.23096 9.86722 6.23096 8.33554C6.23096 6.80386 7.47409 5.56128 9.00868 5.56128C10.5433 5.56128 11.7864 6.80386 11.7864 8.33554Z" stroke="#333333"/>
                    <path d="M2.62195 1.33341L15.9694 14.6667" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <input class="text-xl w-full bg-white shadow-md rounded-full py-1 px-2" type="password" name="password" id="actualPassword" v-model="updatePasswordForm.actualPassword" autocomplete="new-password"> 
              </div>
            </div>
            <div class="grid">
              <label class="text-xl" for="newPassword">Nouveau mot de passe</label>
              <div class="relative">
                <button type="button" @click.self="ShowPassword($event)" class="p-2 absolute top-1/2 -translate-y-1/2 right-2">
                  <svg class="pointer-events-none" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 8.30154C5.74762 1.80365 12.4889 1.88804 17 8.30154C12.1679 15.0526 5.78141 14.6813 1 8.30154Z" stroke="#333333" stroke-linejoin="round"/>
                    <path d="M11.7864 8.33554C11.7864 9.86722 10.5433 11.1098 9.00868 11.1098C7.47409 11.1098 6.23096 9.86722 6.23096 8.33554C6.23096 6.80386 7.47409 5.56128 9.00868 5.56128C10.5433 5.56128 11.7864 6.80386 11.7864 8.33554Z" stroke="#333333"/>
                    <path d="M2.62195 1.33341L15.9694 14.6667" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <input class="text-xl w-full bg-white shadow-md rounded-full py-1 px-2" type="password" name="password" id="newPassword" v-model="updatePasswordForm.newPassword" autocomplete="new-password"> 
              </div>
            </div>
            <div class="grid">
              <label class="text-xl" for="newPasswordRetype">Confirmation du mot de passe</label>
              <div class="relative">
                <button type="button" @click.self="ShowPassword($event)" class="p-2 absolute top-1/2 -translate-y-1/2 right-2">
                  <svg class="pointer-events-none" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 8.30154C5.74762 1.80365 12.4889 1.88804 17 8.30154C12.1679 15.0526 5.78141 14.6813 1 8.30154Z" stroke="#333333" stroke-linejoin="round"/>
                    <path d="M11.7864 8.33554C11.7864 9.86722 10.5433 11.1098 9.00868 11.1098C7.47409 11.1098 6.23096 9.86722 6.23096 8.33554C6.23096 6.80386 7.47409 5.56128 9.00868 5.56128C10.5433 5.56128 11.7864 6.80386 11.7864 8.33554Z" stroke="#333333"/>
                    <path d="M2.62195 1.33341L15.9694 14.6667" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <input class="text-xl w-full bg-white shadow-md rounded-full py-1 px-2" type="password" name="password" id="newPasswordRetype" v-model="updatePasswordForm.newPasswordRetype" autocomplete="new-password"> 
              </div>
            </div>
            <button type="submit" class="text-xl bg-neutral-800 text-white rounded-full py-1 px-2 text-center cursor-pointer">Sauvegarder</button>
          </form>
        </div>
        <div class="flex flex-col gap-4">
          <h2 class="text-3xl font-semibold">Déconnexion et suppression</h2>
          <div class="flex flex-wrap gap-4">
            <button type="submit" class="text-xl bg-red-400 rounded-full py-1 px-2 text-center cursor-pointer w-72 ">Se deconnecter</button>
            <button type="submit" class="text-xl bg-red-400 rounded-full py-1 px-2 text-center cursor-pointer w-72 ">Supprimer le compte</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      updateEmailForm: {
        email: '',
        newEmail: '',
      },
      updatePasswordForm: {
        actualPassword: '',
        newPassword: '',
        newPasswordRetype: '',
      },
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
  }
};
</script>
