import Axios from "axios"

const api = Axios.create({ baseURL: import.meta.env.VITE_API_ENDPOINT })

/**
 * @type {HTMLInputElement}
 */
const searchInput = document.querySelector("#searchbar")

const list = document.querySelector("div#list-wrapper")
const itemTemplate = document.querySelector("#list-item-template").content

console.log(itemTemplate)

let results = []

let offset = 0

let hasNext = false

let currentTerm = ''

document.querySelector("#search-form").addEventListener("submit", async (e) => {
  e.preventDefault()

  currentTerm = searchInput.value

  clearItems()

  await search(currentTerm)
})

const search = async (text, offset = 0) => {
  const { data } = await api.get("/search", {
    params: {
      q: text,
      skip: offset,
      limit: 10,
    },
  })

  if (!data.results.length) {
    hasNext = false
    return
  }

  results = data.results

  for (const item of data.results) {
    addItem(item)
  }
}

const clearItems = () => {
  for (const node of list.querySelectorAll(".list-item")) {
    node.remove()
  }
}

const addItem = (item) => {
  const instance = itemTemplate.cloneNode(true)

  instance.querySelector(".list-item-region").innerText = item.address

  list.appendChild(instance)
}

search(currentTerm)


window.addEventListener('scroll', () => {
  console.log(window.document.body.scrollHeight, window.scrollY + window.innerHeight)
})
