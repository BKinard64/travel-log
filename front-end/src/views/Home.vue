<template>
<div class="home">
  <section class="image-gallery">
    <div class="image" v-for="location in locations" :key="location.id">
      <h2>{{location.name}}</h2>
      <p v-if="getPerson(location.person_id) != undefined">{{getPerson(location.person_id).name}}, {{location.dateVisit}}</p>
      <img :src="location.path" />
    </div>
  </section>
</div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
export default {
  name: 'HomeView',
  data() {
    return {
     locations: [],
     people: [],
    }
  },
  created() {
    this.getLocations();
    this.getPeople();
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
    async getPeople() {
      try {
        let response = await axios.get("/api/people");
        this.people = response.data;
        return true;
      } catch (error) {
        // Do nothing
      }
    },
    getPerson(person_id) {
      let person = this.people.find(x => x._id === person_id);
      return person;
    },
  }
}
</script>

<style scoped>
.image h2 {
  font-style: italic;
}

/* Masonry */
*,
*:before,
*:after {
  box-sizing: inherit;
}

.image-gallery {
  column-gap: 1.5em;
}

.image {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
}

.image img {
  width: 100%;
}

/* Masonry on large screens */
@media only screen and (min-width: 1024px) {
  .image-gallery {
    column-count: 4;
  }
}

/* Masonry on medium-sized screens */
@media only screen and (max-width: 1023px) and (min-width: 768px) {
  .image-gallery {
    column-count: 3;
  }
}

/* Masonry on small screens */
@media only screen and (max-width: 767px) and (min-width: 540px) {
  .image-gallery {
    column-count: 2;
  }
}
</style>
