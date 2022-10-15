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

let hasNext = true

let currentTerm = ''

let fetching = false

document.querySelector("#search-form").addEventListener("submit", async (e) => {
  e.preventDefault()

  currentTerm = searchInput.value

  clearItems()

  await search(currentTerm)
})

const search = async (text, offset = 0) => {
  try {
    if (fetching) return

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
  } finally {
    fetching = false
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
  instance.querySelector(".isj").innerText = item.isj
  instance.querySelector(".sd").innerText = item.sd
  instance.querySelector(".ag").innerText = item.ag

  console.log(item)

  list.appendChild(instance)
}

search(currentTerm)


const container = document.querySelector('.container-container')

container.addEventListener('scroll', () => {
  const bottomOffset = container.scrollHeight - container.clientHeight - container.scrollTop

  if(bottomOffset < 100) {
    if (fetching) return

    if (!hasNext) return

    offset += 10

    search(currentTerm, offset)
  }
})
