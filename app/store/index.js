export const state = () => ({
  regulars: [
    "Chris Thile",
    "Serena Brook",
    "Madison Cunningham",
    "Chris Eldridge",
    "Mike Elizondo",
    "Brittany Haas",
    "Alan Hampton",
    "Greg Hess",
    "Sarah Jarosz",
    "Paul Kowert",
    "Julian Lage",
    "Holly Laurent",
    "Gaby Moreno",
    "Aoife O'Donovan",
    "Ted Poor",
    "Gabe Witcher",
    "Mike Yard",
    "Rachel Axler",
    "Patrick Clair",
    "Tom Papa",
    "Katie Rich",
    "Mark Vigeant",
    "Debra Beck",
    "Todd Behrens ",
    "Theresa Burgess",
    "Sam Hudson",
    "Janis Kaiser",
    "Ben Miller",
    "Emerald O’Brien",
    "Joey Ryan",
    "Thomas Scheuzger",
    "Kathryn Slusher",
    "Noah Smith",
    "Albert Webster",
    "Jason Colton",
    "Jeff Hnilicka",
  ],
  search: "",
  shows: [],
})
export const getters = {
  artists(state) {
    let allArtists = state.shows
      .map(show => show.artists)
      .reduce((list, artist) => list.concat(artist))
    allArtists = new Set(allArtists)
    const artists = [...allArtists]
    return artists.sort()
  },
  shows(state) {
    return state.shows
  }
}
export const mutations = {
  setSearch(state, search) {
    return state.search = search
  },
  setShows(state, shows) {
    return state.shows = shows
  }
}
export const actions = {
  setSearch({ commit }) {
    return commit("setSearch")
  },
  setShows({ commit }) {
    return commit("setShows")
  }
}
