import Axios from "axios"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

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

  page = 1

  await search(currentTerm)
})

const container = document.querySelector(".container-container")

const dino = document.querySelector("#dino")

const search = async (text) => {
  try {
    if (fetching) return

    if (currentTerm === "//dino" || currentTerm === "//디노") {
      dino.classList.add("spin")

      pageLabel.innerText = `DINO / DINO 페이지`
      return
    } else {
      dino.classList.remove("spin")
    }

    NProgress.start()

    const { data } = await api.get("/search", {
      params: {
        q: text,
        skip: 12 * (page - 1),
        limit: 12,
      },
    })

    results = data.results

    maxPage = Math.ceil(data.count / 12)

    pageLabel.innerText = `${Math.min(page, maxPage)} / ${maxPage} 페이지`

    clearItems()

    for (const item of data.results) {
      addItem(item)
    }

    container.scrollTo({ top: 0, behavior: "smooth" })
  } finally {
    fetching = false
    NProgress.done()
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
  const isj = instance.querySelector(".isj")
  isj.innerText = item.isj + "ppm"

  if (isj >= 0.1) {
    isj.style.color = "#ff2929"
  }

  const sd = instance.querySelector(".sd")
  sd.innerText = item.sd + "㎍/㎥"

  if (item.sd >= 50) {
    sd.style.color = "#ff2929"
  }

  const ag = instance.querySelector(".ag")
  ag.innerText = item.ag + "ppm"

  if (item.ag > 25) {
    ag.style.color = "#ff2929"
  }
  const iot = instance.querySelector(".iot")
  iot.innerText = item.iot + "ppm"

  if (item.iot >= 25) {
    iot.style.color = "#ff2929"
  }

  list.appendChild(instance)
}

search(currentTerm)

const prevButton = document.querySelector("#page-prev")
const nextButton = document.querySelector("#page-next")

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
