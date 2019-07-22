(function () {

  const BASE_URL = "https://movie-list.alphacamp.io"
  const INDEX_URL = BASE_URL + "/api/v1/movies/" //movie API
  const POSTER_URL = BASE_URL + "/posters/" //image位置
  const data = []
  let type = 'block'//type初始為卡片模式，利用type的不同來更改顯示模式
  let page = 1//設定初始頁面為1

  //串接api資料
  axios
    .get(INDEX_URL)
    .then((response) => {
      data.push(...response.data.results)//data被二個array包住，用...將array扁平
      //displayDataList(data)
      getTotalPages(data)//計算data所需頁數
      getPageData(page, data)//初始為顯示第一頁資料且為block版
    })
    .catch((error) => console.log(error))

  const dataPanel = document.getElementById('data-panel')

  //more按鈕功能 新增add按鈕功能
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      console.log(event.target.dataset.id)
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      console.log('like')
      addFavoriteItem(event.target.dataset.id)
    }
  })
  //mode功能 切換樣式
  const mode = document.getElementById('mode-btn')

  mode.addEventListener('click', event => {
    if (event.target.matches('.mode-line')) {
      console.log(event.target.dataset.type)
      type = event.target.dataset.type//當點選mode按鈕時，type會變動
      getPageData(page)
    } else if (event.target.matches('.mode-block')) {
      console.log(event.target.dataset.type)
      type = event.target.dataset.type//當點選mode按鈕時，type會變動
      getPageData(page)
    }
  })

  //把資料動態轉成html-block or html-line版
  function displayDataList(data) {
    let htmlContent = ''
    if (type === 'block') {
      data.forEach(function (item) {//用forEach印出所有item的指定值image,title
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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
        `
      })
    } else if (type === 'line') {

      htmlContent = '<ul class="list-group list-group-flush">'
      data.forEach(function (item) {
        htmlContent += `
        <li class="list-group-item">
          ${item.title}
          <div class="info-btn">
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </li> 
      `
      })
      htmlContent += '</ul>'
    }
    dataPanel.innerHTML = htmlContent
  }

  //把資料轉成html-line版
  function displayLineList(data) {
    let htmlContent = '<ul class="list-group list-group-flush">'
    data.forEach(function (item) {
      htmlContent += `
        <li class="list-group-item">
          ${item.title}
          <div class="info-btn">
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </li> 
      `
    })
    htmlContent += '</ul>'
    dataPanel.innerHTML = htmlContent
  }

  //顯示電影詳細資料
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
  //增加蒐藏電影
  /*搜尋電影分解步驟
  新增 search bar 的 UI 元件---用來搜尋 html
  將搜尋表單綁定點擊事件，觸發搜尋功能
  比對搜尋關鍵字與電影標題
  將匹配結果回傳到網頁畫面上*/
  //分頁

  //監聽searchbar
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')

  searchForm.addEventListener('submit', event => {
    event.preventDefault()//抵銷<form>跟<button>產生的刷新頁面效果

    let results = []
    console.log(searchInput.value) //取得searchInput裡面的值
    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    getTotalPages(results)//計算results中所含資料所需顯示的頁面數量
    getPageData(1, results)//喜愛的全數顯示在第一頁中
    searchInput.value = ``//搜尋完後清空搜尋列
  })

  //+按鈕監聽事件 將想收藏的資料丟到localstorage裡儲存
  function addFavoriteItem(id) {
    //第一次使用先創陣列
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))//一個movie的object
    //data是儲存movie API資料的陣列
    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite lise.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))//把object丟到favoriteMovies的localSotrage中
    console.log(localStorage.getItem('favoriteMovies'))
  }

  //計算頁碼
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12 //每頁顯示12筆資料

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1//若無資料總頁數直接等於1，避免bug
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
      <li class="page-item">
        <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
      </li>`
      //data-page標注頁數
    }
    pagination.innerHTML = pageItemContent
  }

  //新增頁碼的監聽器
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    page = event.target.dataset.page
    if (event.target.tagName === 'A') {
      //若點擊tag<a>標籤（使用tagName 後面對應字符串為大寫）
      getPageData(event.target.dataset.page)//選到特定頁面後，顯示出該頁面資料
      //getPageData(頁碼,data)若無輸入則傳入預設data
    }
  })

  let paginationData = []
  //取出特定頁面資料
  function getPageData(pageNum, data) {
    //二個參數，傳入頁數及特定頁面顯示資料

    paginationData = data || paginationData //有新資料使用新資料，若無則使用data
    //首先將data丟入paginationData，若paginationData已有資料則使用paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE //取出點
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    //第一頁資料為0~12，offset初始值為0，pageData為取出0到12當做第一頁面資料
    displayDataList(pageData)//顯示特定選擇（切割後的data）的頁面
    console.log(type)
  }

})()




/*
 ・filter
 array.filter(element => 設定element的條件)
 輸出所設定在array符合所設定條件的element

・正規表達式 RegExp (Regular Expression):表達字串的模式
  RegExp是JS內建的正規表達式object
  1.所有用 a 開頭的字串，可以寫成 /^a/  大小寫無關，也可查出
  2.結尾是 a 的字串，寫成 /a$/
  3.包含數字的字串，寫成 /[0-9]/
  let title = 'Ant-Man and the Wasp'
  const regex = new RegExp('ant', 'i') new:物件實例 (instance) ('含有此輸入的字串','特殊要求'=>i:忽略大小寫)
  let result = title.match(regex) 功能:match
  console.log(result)
 */