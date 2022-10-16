import Axios from "axios"

const api = Axios.create({ baseURL: import.meta.env.VITE_API_ENDPOINT })

/**
 * @type {HTMLInputElement}
 */
const searchInput = document.querySelector("#searchbar")

const list = document.querySelector("div#list-wrapper")
const itemTemplate = document.querySelector("#list-item-template").content

let results = []

let page = 1

let maxPage = 0

let currentTerm = ""

let fetching = false

const pageLabel = document.querySelector("#page-label")

document.querySelector("#search-form").addEventListener("submit", async (e) => {
  e.preventDefault()

  currentTerm = searchInput.value

  clearItems()

  await search(currentTerm)
})

const container = document.querySelector(".container-container")

const search = async (text) => {
  try {
    if (fetching) return

    const { data } = await api.get("/search", {
      params: {
        q: text,
        skip: 12 * (page - 1),
        limit: 12,
      },
    })

    results = data.results

    maxPage = Math.ceil(data.count / 12)

    pageLabel.innerText = `${Math.max(page, maxPage)} / ${maxPage} 페이지`

    clearItems()

    for (const item of data.results) {
      addItem(item)
    }

    container.scrollTo({ top: 0, behavior: "smooth" })
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
  instance.querySelector(".isj").innerText = item.isj + "ppm"
  instance.querySelector(".sd").innerText = item.sd + "㎍/㎥"
  instance.querySelector(".ag").innerText = item.ag + "ppm"
  instance.querySelector(".iot").innerText = item.iot + "ppm"

  list.appendChild(instance)
}

search(currentTerm)

const prevButton = document.querySelector("#page-prev")
const nextButton = document.querySelector("#page-next")

console.log(prevButton, nextButton)

prevButton.addEventListener("click", (e) => {
  e.preventDefault()

  if (page <= 1 || fetching) return

  page--

  search(currentTerm)
})

nextButton.addEventListener("click", (e) => {
  e.preventDefault()

  if (page == maxPage || fetching) return

  page++

  search(currentTerm)
})
