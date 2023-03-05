<template>
  <div @mouseleave="EditState = false" :id="`note${note.id}`" class="bg-[#333] w-full rounded-2xl border border-neutral-300 h-fit group hover:shadow-lg duration-200 overflow-hidden" :style="`background-color: #${note.colors.hex}; color: ${GoodColorContrast(note.colors.hex)}`">
    <div @click="EditState = true" class="flex flex-col gap-1 p-4">
      <h2 @click="EditThisNoteTitle(note.id, true)" @focusout="UpdateNoteTitle(note.id)" class="font-semibold text-xl min-h-[28px]">{{ note.title }}</h2>
      <div class="flex flex-col text-lg">
        <div v-for="note_element in note.note_elements" :key="note_element" :id="`NoteElement${note_element.id}`" class="relative min-h-[28px] group/note_elem flex">
          <input 
            v-if="note.type == 'checklist'" 
            @click="UpdateNoteElementState(note_element.id)"
            type="checkbox" 
            name=""
            id=""
            class="w-4 mr-1 bg-transparent"
            v-model="note_element.state"
            :checked="note_element.state"
          >
          <svg v-if="note.type == 'checklist'" class="absolute -top-0.5 w-6 duration-100 pointer-events-none" sviewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="8.5" width="13" height="13" rx="3.5" stroke="white" />
            <path d="M3.5 15C5.2207 16 6.55894 17 8 18.5C10.0589 14.5 11.5 12 14.9999 8" stroke="#71D98E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 3.5C17 2 19 1 20.5 1M16.5 6C17.5494 4.46487 18.5 4 20 3.5M18.5 6.5C19.882 5.71261 20.7448 5.36962 22.5 5" stroke="white" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span 
            v-if="note.type == 'list'"
            class="mr-1">
            ●
          </span>
          <p 
            @click="EditThisNoteElem(note_element.id, true)" 
            @focusout="UpdateNoteElement(note_element.id)" 
            class="grow" 
            :class="{ 'line-through' : note_element.state && note.type == 'checklist' }" >
            {{ note_element.content }}
          </p>
          <button @click="DeleteNoteElement(note_element.id)" :id="`AssociateNoteElement${note_element.id}`" class="scale-0 relative w-6 h-6 group/delete" :class="{ 'group-hover/note_elem:scale-100' : EditState }">
            <div class="rounded-full relative w-full h-full duration-100 group-hover/delete:bg-[#33333344]">
              <span class="bg-red-500 h-0.5 w-0 duration-200 absolute left-1/2 top-1/2 rotate-45 -translate-x-1/2 -translate-y-1/2 rounded-sm" :class="{ 'group-hover/note_elem:w-2/3' : EditState }"></span>
              <span class="bg-red-500 h-0.5 w-0 duration-200 absolute left-1/2 top-1/2 -rotate-45 -translate-x-1/2 -translate-y-1/2 rounded-sm" :class="{ 'group-hover/note_elem:w-2/3' : EditState }"></span>
            </div>
          </button>
        </div>
        <input v-if="EditState" placeholder="Élément de liste"  v-model="newNoteElementContent" @focusout="AddNoteElement" @keyup="KeyPress($event)" class="border bg-transparent border-x-0" :style="`border-color: ${GoodColorContrast(note.colors.hex)};`"/>
      </div>
    </div>
    <ToolsBox :note_id="note.id" @delete="DeleteNote" @updateColor="UpdateColor" @UpdateNoteType="UpdateNoteType"></ToolsBox>
  </div>
</template>

<style>
input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
}
input[type="checkbox"] ~ svg rect{
  transition: .2s;
  fill: transparent;
}
input[type="checkbox"]:checked ~ svg rect{
  fill: #FFFFFF;
}
input[type="checkbox"] ~ svg path:nth-of-type(1){
  transition: .2s;
  stroke-dasharray: 19px;
  stroke-dashoffset: 19px;
}
input[type="checkbox"]:checked ~ svg path:nth-of-type(1){
  stroke-dashoffset: 0px;
}
input[type="checkbox"] ~ svg path:nth-of-type(2){
  transition: .2s;
  stroke-dasharray: 10px;
  stroke-dashoffset: 10px;
}
input[type="checkbox"]:checked ~ svg path:nth-of-type(2){
  animation: .2s linear .15s checkbox_eclat;
}
@keyframes checkbox_eclat {
  50%{
    stroke-dashoffset: 0;
  }
  to{
    stroke-dashoffset: -10;
  }
}
</style>

<script>
export default {
  props: ["note"],
  data() {
    return {
      EditState: false,
      newNoteElementContent: '',
    };
  },
  methods: {
    EditThisNoteElem(noteElementId, state) {
      document.querySelector(`#NoteElement${noteElementId} p`).contentEditable = state;
      document.querySelector(`#NoteElement${noteElementId} p`).focus()
    },
    EditThisNoteTitle(noteId, state) {
      document.querySelector(`#note${noteId} h2`).contentEditable = state;
      document.querySelector(`#note${noteId} h2`).focus()
    },
    async UpdateNoteElement(noteElementId) {
      const content = document.querySelector(`#NoteElement${noteElementId} p`).textContent;
      this.EditThisNoteElem(noteElementId, false);
      if (this.isPrintable(content)) {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase
          .from('note_elements')
          .update({ content: content })
          .eq('id', noteElementId)
      } else {
        this.DeleteNoteElement(noteElementId);
      }
    },
    async UpdateNoteElementState(noteElementId) {
      const state = document.querySelector(`#NoteElement${noteElementId} input[type="checkbox"]`).checked;
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('note_elements')
        .update({ state: state })
        .eq('id', noteElementId)
    },
    async UpdateNoteType(noteId, noteType) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('notes')
        .update({ type: noteType })
        .eq('id', noteId)
      this.note.type = noteType;
    },
    async UpdateNoteTitle(noteId) {
      const content = document.querySelector(`#note${noteId} h2`).textContent;
      this.EditThisNoteTitle(noteId, false);
      if (this.isPrintable(content)) {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase
          .from('notes')
          .update({ title: content })
          .eq('id', this.note.id)
      }
    },
    KeyPress(event) {
      if (event.key === "Enter")
        this.AddNoteElement()
    },
    async DeleteNote(id) {
      this.DeleteNoteElements(id).then(async () => {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        document.querySelector(`#note${id}`).remove();
        this.$emit('DeleteNote', this.note.id);
      })
    },
    isPrintable(str) {
      let i = 0;
      while (str[i] && str[i] == " ") {
        i++
      }
      if (i === str.length)
        return false
      return true
    },
    async AddNoteElement() {
      const supabase = useSupabaseClient()
      if (this.newNoteElementContent.length > 0 && this.isPrintable(this.newNoteElementContent)) {
        const newElement = { 
          note_id: this.note.id,
          order: this.note.note_elements.length, 
          content: this.newNoteElementContent, 
          state: false 
        }
        const { data, error } = await supabase
        .from('note_elements')
        .insert([
          newElement,
        ])
        this.note.note_elements.push(newElement);
        this.newNoteElementContent = '';
      }
    },
    async DeleteNoteElements(noteId) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
      .from('note_elements')
      .delete()
      .eq('note_id', noteId)
    },
    async DeleteNoteElement(noteElementId) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
      .from('note_elements')
      .delete()
      .eq('id', noteElementId)
      document.querySelector(`#AssociateNoteElement${noteElementId}`).parentElement.remove();
    },
    async UpdateColor(noteId, colorId) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('notes')
        .update({ color_id: colorId })
        .eq('id', noteId);
      // const noteIndex = this.notes.findIndex(element => element.id == noteId)
      const color = this.allColors.find(element => element.id == colorId)
      this.note.colors = color;
      // this.usedColors = this.GetUserColors();
      this.$emit('GetUserColors')
    },
    GetUserColors() {
      const colors = [];
      for (let i = 0; i < this.notes.length; i++) {
        let j = 0;
        while (colors[j] && colors[j].id != this.notes[i].colors.id)
          j++
        if (j == colors.length)
          colors.push(this.notes[i].colors);
      }
      return colors;
    },
    GoodColorContrast(backgroundColor) {
      // If a leading # is provided, remove it
    	if (backgroundColor.slice(0, 1) === '#') {
    		backgroundColor = backgroundColor.slice(1);
    	}
    	// Convert to RGB value
    	var r = parseInt(backgroundColor.substr(0,2),16);
    	var g = parseInt(backgroundColor.substr(2,2),16);
    	var b = parseInt(backgroundColor.substr(4,2),16);
    	// Get YIQ ratio
    	var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    	// Check contrast
    	return (yiq >= 128) ? '#333333' : '#FFFFFF';
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
}
</script>