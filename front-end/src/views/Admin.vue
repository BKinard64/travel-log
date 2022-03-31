<template>
<div class="admin">
    <h1>The Admin Page!</h1>
    <div class="heading">
      <div class="circle">1</div>
      <h2>Add an Item</h2>
    </div>
    <div class="add">
      <div class="form">
        <input v-model="name" placeholder="Location">
        <p></p>
        <textarea v-model="dateVisit" placeholder="Date of Visit"/>
        <p></p>
        <input type="file" name="photo" @change="fileChanged">
        <button @click="upload">Upload</button>
      </div>
      <div class="upload" v-if="addLocation">
        <h2>{{addLocation.name}}</h2>
        <img :src="addLocation.path" />
      </div>
    </div>
    <div class="heading">
      <div class="circle">2</div>
      <h2>Edit/Delete an Item</h2>
    </div>
    <div class="edit">
      <div class="form">
        <input v-model="findTitle" placeholder="Search">
        <div class="suggestions" v-if="suggestions.length > 0">
          <div class="suggestion" v-for="s in suggestions" :key="s.id" @click="selectLocation(s)">{{s.name}}
          </div>
        </div>
      </div>
      <div class="upload" v-if="findLocation">
        <input v-model="findLocation.name">
        <p></p>
        <textarea v-model="findLocation.dateVisit"/>
        <p></p>
        <img :src="findLocation.path" />
      </div>
      <div class="actions" v-if="findLocation">
        <button @click="deleteLocation(findLocation)">Delete</button>
        <button @click="editLocation(findLocation)">Edit</button>
      </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'AdminView',
  data() {
    return {
      name: "",
      dateVisit: "",
      file: null,
      addLocation: null,
      locations: [],
      findTitle: "",
      findLocation: null,
    }
  },
  computed: {
    suggestions() {
      let locations = this.locations.filter(loc => loc.name.toLowerCase().startsWith(this.findTitle.toLowerCase()));
      return locations.sort((a, b) => a.name > b.name);
    }
  },
  created() {
    this.getLocations();
  },
  methods: {
    async getLocations() {
      try {
        let response = await axios.get("/api/locations");
        this.locations = response.data;
        return true;
      } catch (error) {
        // Do nothing
      }
    },
    selectLocation(loc) {
      this.findTitle = "";
      this.findLocation = loc;
    },
    async deleteLocation(loc) {
      try {
        await axios.delete("/api/locations/" + loc._id);
        this.findLocation = null;
        this.getLocations();
        return true;
      } catch (error) {
        // Do nothing
      }
    },
    async editLocation(loc) {
      try {
        await axios.put("/api/locations/" + loc._id, {
          name: this.findLocation.name,
          dateVisit: this.findLocation.dateVisit
        });
        this.findLocation = null;
        this.getLocations();
        return true;
      } catch (error) {
        // Do nothing
      }
    },
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/locations', {
          name: this.name,
          dateVisit: this.dateVisit,
          path: r1.data.path
        });
        this.addLocation = r2.data;
      } catch (error) {
        // Do nothing 
      }
    },
  }
}
</script>

<style scoped>
.image h2 {
  font-style: italic;
  font-size: 1em;
}

.heading {
  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;
}

.heading h2 {
  margin-top: 8px;
  margin-left: 10px;
}

.add,
.edit {
  display: flex;
}

.circle {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  padding: 8px;
  background: #333;
  color: #fff;
  text-align: center
}

/* Form */
input,
textarea,
select,
button {
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
}

.form {
  margin-right: 50px;
}

/* Uploaded images */
.upload h2 {
  margin: 0px;
}

.upload img {
  max-width: 300px;
}

/* Suggestions */
.suggestions {
  width: 200px;
  border: 1px solid #ccc;
}

.suggestion {
  min-height: 20px;
}

.suggestion:hover {
  background-color: #000080;	/* Navy */
  color: #fff;
}
</style>
