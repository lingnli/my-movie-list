(function () {
  //從localStorage中印出movie資料
  const BASE_URL = "https://movie-list.alphacamp.io"
  const INDEX_URL = BASE_URL + "/api/v1/movies/" //movie API
  const POSTER_URL = BASE_URL + "/posters/" //image位置
  const dataPanel = document.getElementById('data-panel')
  const data = JSON.parse(localStorage.getItem('favoriteMovies')) || []//data來源localStorage

  displayDataList(data)

  function displayDataList(data) {
    let htmlContent = ``
    data.forEach(function (item, index) {
      htmlContent += `
      <div class="col-sm-3">
        <div class="card border-secondary mb-3">
          <img class="card-img-top" src="${POSTER_URL}${item.image}" alt="">
          <div class="card-body movie-item-body">
            <h6 class="card-title">${item.title}</h6>
          </div>

          <!-- more按鈕 -->
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-remove-favorite" data-id="${item.id}">X</button>
          </div>
        </div>
      </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      console.log(event.target.dataset.id)
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-remove-favorite')) {
      //x按鈕功能
      console.log('remove')
      removeFavoriteItem(event.target.dataset.id)
    }
  })
  //more
  function showMovie(id) {
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    const url = INDEX_URL + id
    console.log(url)

    axios.get(url)
      .then((response) => {
        const data = response.data.results
        console.log(data)

        modalTitle.textContent = data.title
        modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
        modalDate.textContent = `release at: ${data.release_date}`
        modalDescription.textContent = `${data.description}`
      })
  }

  //reomove 
  function removeFavoriteItem(id) {
    const index = data.findIndex(item => item.id === Number(id))//利用id去data裡搜尋對應的id
    if (index === -1) return//防呆機制，未來若程式碼修改避免出錯

    data.splice(index, 1)//從data中刪除對應id的index
    localStorage.setItem('favoriteMovies', JSON.stringify(data))//更新localStorage內容為新的data(已刪除指定index的data)，若無更新會呈現同樣的畫面

    displayDataList(data)//展現新內容
  }
})()