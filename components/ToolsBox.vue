<template>
  <div class="shadow-lg-inverted rounded-2xl opacity-0 duration-200 group-hover:opacity-100">
    <div class="grid grid-cols-3" :class="{ 'hidden' : colorsMenuState || deleteMenuState || typeMenuState }">
      <button @click="colorsMenuState = !colorsMenuState" class="text-xl py-1 px-4 text-center cursor-pointer" :class="BorderRadius(0, 1)">Colors</button>
      <button @click="typeMenuState = !typeMenuState" class="text-xl py-1 px-4 text-center cursor-pointer" :class="BorderRadius(0, 1)">Type</button>
      <button @click="deleteMenuState = !deleteMenuState" class="text-xl py-1 px-4 text-center cursor-pointer" :class="BorderRadius(1, 3)">Remove</button>
    </div>
    <div class="grid grid-cols-2" :class="{ 'hidden' : !deleteMenuState }">
      <button @click="deleteMenuState = !deleteMenuState" class="text-xl py-1 px-4 text-center cursor-pointer bg-[#34D399]" :class="BorderRadius(0, 1)">Conserver</button>
      <button @click="$emit('delete', note_id)" class="text-xl py-1 px-4 text-center cursor-pointer bg-[#F87171]" :class="BorderRadius(1, 2)">Supprimer</button>
    </div>
    <div class="flex flex-row" :class="{ 'hidden' : !typeMenuState }">
      <button @click="typeMenuState = !typeMenuState" class="text-xl p-1 px-2 text-center cursor-pointer">⮪</button>
      <button @click="$emit('UpdateNoteType', note_id, 'text')" class="text-xl py-1 px-4 text-center cursor-pointer grow">Text</button>
      <button @click="$emit('UpdateNoteType', note_id, 'list')" class="text-xl py-1 px-4 text-center cursor-pointer grow">List</button>
      <button @click="$emit('UpdateNoteType', note_id, 'checklist')" class="text-xl py-1 px-4 text-center cursor-pointer grow">Checkbox</button>
    </div>
    <div class="flex w-full col-span-2" :class="{ 'hidden' : !colorsMenuState }">
      <button @click="colorsMenuState = !colorsMenuState" class="text-xl p-1 text-center cursor-pointer" :class="BorderRadius(1, 3)">⮪</button>
      <div id="colors_container" class="overflow-scroll flex w-full">
        <button v-for="color in allColors" :key="color" @click="$emit('updateColor', note_id, color.id)" :id="color.id" class="text-xl p-1 text-center cursor-pointer">
          <span class="p-2.5 rounded-full block border border-neutral-300" :style="`background-color: #${color.hex};`">
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["note_id"],
  data() {
    return {
      colorsMenuState: false,
      typeMenuState: false,
      deleteMenuState: false,
      allColors: [],
    };
  },
  methods: {
    BorderRadius(index, lenght) {
      if (index == 0)
        return 'rounded-tl-2xl'
      else if (index == lenght - 1)
        return 'rounded-tr-2xl'
    },
    async GetAllColors() {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
      .from('colors')
      .select();
      return data
    },
  },
  mounted() {
    this.GetAllColors().then(response => {
      this.allColors = response;
    })
  },
  created() {
  }
};
</script>
