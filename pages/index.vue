<template>
  <div class="pt-16 flex">
    <Navbar />
    <div class="max-w-screen-xl w-full m-auto p-4 grid gap-8">
      <h1 class="text-5xl font-semibold w-full text-center">Notes</h1>
      <div 
        @click="newNoteState = true"
        class="grid gap-1 text-xl bg-white text-[333] rounded-2xl p-4 cursor-pointer border border-neutral-300 m-auto w-full sm:w-80 lg:w-96">
        <h2 v-if="!newNoteState" class="w-full text-left font-semibold">Prendre une note</h2>
        <input
          @focusout="NewNoteTitleOut()"
          v-if="newNoteState" 
          v-model="newNote.title" 
          placeholder="Titre" 
          class="w-full text-left font-semibold" />
        <div class="flex flex-col text-lg">
          <div v-for="note_element in newNote.note_elements" :key="note_element" :id="`NoteElement${note_element.id}`" class="relative min-h-[28px] group/note_elem flex">
            <p 
              @click="EditThisNoteElem(note_element.id, true)" 
              @focusout="UpdateNoteElement(note_element.id)" 
              class="grow text-left">{{ note_element.content }}
            </p>
            <button 
              @click="DeleteNoteElement(note_element.id)"
              :id="`AssociateNoteElement${note_element.id}`"
              class="duration-100 scale-0 relative w-6 h-6 group/delete"
              :class="{ 'group-hover/note_elem:scale-100' : EditState }">
              <div class="rounded-full relative w-full h-full duration-100 group-hover/delete:bg-[#33333344]">
                <span class="bg-red-500 h-0.5 w-2/3 absolute left-1/2 top-1/2 rotate-45 -translate-x-1/2 -translate-y-1/2 rounded-sm"></span>
                <span class="bg-red-500 h-0.5 w-2/3 absolute left-1/2 top-1/2 -rotate-45 -translate-x-1/2 -translate-y-1/2 rounded-sm"></span>
              </div>
            </button>
          </div>
          <div v-if="newNoteState" class="grid">
            <input 
              placeholder="Élément de liste"
              v-model="newNote.note_element_content"
              @focusout="AddNoteElement"
              @keyup="KeyPress($event)"
              class="border bg-transparent border-x-0 text-lg"
            />
          </div>
        </div>
        <button 
          v-if="newNoteState && newNoteAdded"
          @click="AddNewNoteToArray"
          class="text-xl bg-neutral-800 text-white rounded-full py-1 px-4 text-center cursor-pointer">
          Ajouter
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button 
          class="text-xl bg-white text-[333] rounded-2xl py-1 px-4 text-center cursor-pointer border border-neutral-300"
          @click="AllFilterState(true); UpdateFilteredNotes()">
          All
        </button>
        <button 
          v-for="filter in filters" :key="filter"
          @click="filter.state = !filter.state; UpdateFilteredNotes();"
          class="text-xl rounded-2xl py-1 px-4 text-center cursor-pointer border border-neutral-300 duration-200"
          :class="{ 'line-through' : !filter.state }" 
          :style="`background-color: #${filter.colorHex}; color: ${GoodColorContrast(filter.colorHex)}; test : `">
          {{ filter.colorName }}
        </button>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="col in displayedNotes" :key="col" class="flex flex-col gap-8">
          <Note v-for="note in col" :key="note" :note="note" @GetUserColors="UpdateUsedColors" @DeleteNote="UpdateNoteList"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newNote: {
        id: null,
        color_id: 2,
        title: '',
        type: 'Elemlist',
        note_elements: [],
        note_element_content: '',
      },
      newNoteState: false,
      newNoteAdded: false,
      usedColors: [],
      filters: [],
      allColors: [],
      notes: [],
      filterdNote: [],
      displayedNotes: [],
    };
  },
  methods: {
    DisplayNote(screenWidth) {
      this.displayedNotes = [];
      // const screenWidth = 1000;
      let divideBy = 1;
      if (screenWidth >= 640 && screenWidth < 1024) {
        divideBy = 2;
      }
      if (screenWidth > 1024 && screenWidth < 1280) {
        divideBy = 3;
      }
      if (screenWidth > 1280) {
        divideBy = 4;
      }
      let i = 0;
      for (let j = 0; j < divideBy; j++) {
        this.displayedNotes[j] = []
      }
      while (this.filterdNote[i]) {
        for (let j = 0; j < divideBy; j++) {
          if (this.filterdNote[i])
            this.displayedNotes[j].push(this.filterdNote[i]);
          i++;
        }
      }
    },
    AddNewNoteToArray() {
      const newNote = {
        id: this.newNote.id,
        title: this.newNote.title,
        type: this.newNote.type,
        colors: this.allColors.filter(color => color.id == this.newNote.color_id)[0],
        note_elements: this.newNote.note_elements,
      }
      this.notes.unshift(newNote);
      this.newNote.id = null;
      this.newNote.color_id = 2;
      this.newNote.title = '';
      this.newNote.type = 'Elemlist';
      this.newNote.note_elements = [];
      this.newNote.note_element_content = '';
      this.newNoteAdded = false;
      this.newNoteState = false;
      this.UpdateNoteList();
    },
    EditThisNoteElem(noteElementId, state) {
      document.querySelector(`#NoteElement${noteElementId}`).firstChild.contentEditable = state;
      document.querySelector(`#NoteElement${noteElementId}`).firstChild.focus()
    },
    async DeleteNoteElement(noteElementId) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
      .from('note_elements')
      .delete()
      .eq('id', noteElementId)
      document.querySelector(`#AssociateNoteElement${noteElementId}`).parentElement.remove();
    },
    async UpdateNoteElement(noteElementId) {
      const content = document.querySelector(`#NoteElement${noteElementId}`).firstChild.textContent;
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
    UpdateNoteList(noteId) {
      // remove note from note list
      this.notes = this.notes.filter(note => note.id != noteId);
      localStorage.notes = this.notes;
      this.UpdateUsedColors();
      this.UpdateFilteredNotes();
    },
    NewNoteTitleOut() {
      if (this.newNoteAdded == false) {
        this.AddNote();
        this.GetNewNoteId().then(response => {
          this.newNote.id = response[0].id;
        })
        this.newNoteAdded = true;
      } else {
        this.UpdateNoteTitle(this.newNote.id)
      }
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
    async UpdateNoteTitle(noteId) {
      const content = this.newNote.title;
      // this.EditThisNoteTitle(noteId, false);
      if (this.isPrintable(content)) {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase
        .from('notes')
        .update({ title: content })
        .eq('id', this.newNote.id)
      }
    },
    async AddNote() {
      const user = useSupabaseUser()
      const newNote = { 
        color_id: this.newNote.color_id,
        title: this.newNote.title, 
        type: this.newNote.type, 
        user_id: user.value.id 
      }
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
      .from('notes')
      .insert([
        newNote,
      ])
    },
    // recupere l'ID de la derniere note crée
    async GetNewNoteId() {
      let biggest = (this.notes.length > 0 ? this.notes[0].id : 0);
      for (let i = 1; i < this.notes.length; i++) {
        if (this.notes[i].id > biggest)
          biggest = this.notes[i].id;
      }
      const supabase = useSupabaseClient()
      const user = useSupabaseUser()
      const { data, error } = await supabase
      .from('notes')
      .select('id')
      .eq('user_id', user.value.id)
      .gt('id', biggest)
      .order('created_at')
      .limit(1)
      return data
    },
    KeyPress(event) {
      if (event.key === "Enter")
        this.AddNoteElement()
    },
    // Ajouteras un element a la note nouvelement crée
    async AddNoteElement() {
      if (this.newNote.note_element_content.length > 0 && this.isPrintable(this.newNote.note_element_content)) {
        const supabase = useSupabaseClient()
        if (this.newNoteAdded == false) {
          this.AddNote();
          this.GetNewNoteId();
          this.newNoteAdded = true;
        }
        let newElement = { 
          note_id: this.newNote.id,
          order: this.newNote.note_elements.length, 
          content: this.newNote.note_element_content, 
          state: false 
        }
        const { data, error } = await supabase
        .from('note_elements')
        .insert([
          newElement,
        ])
        this.GetNewNoteElementId().then(response => {
          newElement.id = response[0].id
          this.newNote.note_elements.push(newElement);
        });
        this.newNote.note_element_content = '';
      }
    },
    async GetNewNoteElementId() {
      let biggest = (this.newNote.note_elements.length > 0 ? this.newNote.note_elements[0].id : 0);
      for (let i = 1; i < this.newNote.note_elements.length; i++) {
        if (this.newNote.note_elements[i].id > biggest)
          biggest = this.newNote.note_elements[i].id;
      }
      const supabase = useSupabaseClient()
      const user = useSupabaseUser()
      const { data, error } = await supabase
      .from('note_elements')
      .select('id')
      .eq('note_id', this.newNote.id)
      .gt('id', biggest)
      .order('created_at')
      .limit(1)
      return data
    },
    AllFilterState() {
      const majority = !this.MajorityState();
      for (let i = 0; i < this.filters.length; i++) {
        this.filters[i].state = majority;
      }
    },
    MajorityState() {
      let count = 0;
      for (let i = 0; i < this.filters.length; i++) {
        if (this.filters[i].state == true)
          count++;
      }
      if (count >= this.filters.length / 2)
        return true;
      return false;
    },
    UpdateFilter() {
      for (let i = 0; i < this.usedColors.length; i++) {
        let y = 0;
        while (this.filters[y] && this.filters[y] != this.usedColors[i]) {
          y++;
        }
        if (y < this.usedColors.length) {
          const filter = {
            colorId: this.usedColors[y].id,
            colorHex: this.usedColors[y].hex,
            colorName: this.usedColors[y].name,
            state: true,
          };
          this.filters.push(filter)
        }
      }
      // localStorage.setItem('filters', JSON.stringify(this.filters));
    },
    UpdateFilteredNotes(all) {
      this.filterdNote = []
      for (let i = 0; i < this.notes.length; i++) {
        for (let j = 0; j < this.filters.length; j++) {
          if (this.filters[j].state == true && this.notes[i].colors.id == this.filters[j].colorId) {
            this.filterdNote.push(this.notes[i]);
          }
        }
      }
      this.DisplayNote(window.innerWidth)
      // localStorage.setItem('filters', JSON.stringify(this.filters));
      // localStorage.setItem('notes', JSON.stringify(this.notes));
    },
    async GetNotes() {
      const supabase = useSupabaseClient()
      const user = useSupabaseUser()
      const { data, error } = await supabase
      .from('notes')
      .select('id, title, type, colors(id, hex, name), note_elements(*)')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
      return data
    },
    async FetchNoteElement(Actualdata) {
      const supabase = useSupabaseClient()
      for (let i = 0; i < Actualdata.length; i++) {
        const { data, error } = await supabase
        .from('note_elements')
        .select('id, order, content, state')
        .eq('note_id', Actualdata[i].id)
        .order('created_at')
        Actualdata[i].note_elements = data;
      }
      return Actualdata;
    },
    UpdateUsedColors() {
      const colors = [];
      for (let i = 0; i < this.notes.length; i++) {
        let j = 0;
        while (colors[j] && colors[j].id != this.notes[i].colors.id)
          j++
        if (j == colors.length)
          colors.push(this.notes[i].colors);
      }
      this.usedColors = colors;
      this.UpdateFilter();
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
      .select('id, hex, name');
      return data
    },
  },
  mounted() {
    // if (localStorage.filters) {
    //     this.filters = JSON.parse(localStorage.filters);
    // }
    // if (localStorage.notes) {
    //     this.notes = JSON.parse(localStorage.notes);
    // }
    this.GetAllColors().then(response => {
      this.allColors = response;
    })
    window.scrollTo(0,0);
    const user = useSupabaseUser();
    watchEffect(() => {
      if (!user.value)
        navigateTo('/login');
    })
    this.GetNotes().then(response => {
      this.notes = response;
      this.FetchNoteElement(this.notes).then(response => {
        this.notes = response;
      });
      this.UpdateUsedColors();
      this.UpdateFilteredNotes();
      this.DisplayNote(window.innerWidth);
    })
    window.addEventListener('resize', () => {
      this.DisplayNote(window.innerWidth);
    });
  },
  created() {
  }
};
</script>
