let cl = console.log;

const formPost = document.getElementById('formPost')
const titleControler = document.getElementById('title')
const contentControler = document.getElementById('content')
const userIdControler = document.getElementById('userId')
const addPost = document.getElementById('addPost')
const updatePost = document.getElementById('updatePost')
const postContainer = document.getElementById('postContainer')
const loader = document.getElementById('loader')

let BASE_URL = `https://crud-35fc1-default-rtdb.asia-southeast1.firebasedatabase.app`;
let POST_URL = `${BASE_URL}/posts.json`

const objtoArr = (obj) => {
    let arr = []
    for (const key in obj) {
        obj[key].id = key
        arr.unshift(obj[key])
    }
    return arr
}

const snackBar = (msg, icon) =>{
    Swal.fire({
        title : msg,
        icon : icon,
        timer : 2000
    })
}

const postTemplating = (arr) => {
    let result = ``
    arr.forEach(obj => {
        result += `<div class="col-md-4 my-4">
                <div class="card" id="${obj.id}">
                    <div class="card-header">
                        <h4 title="${obj.title}">${obj.title}</h4>
                    </div>
                    <div class="card-body">
                        <p>${obj.content}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <i onclick = "onEdit(this)" type="button" class="fa-solid fa-pen-to-square fa-2x text-success"></i>
                        <i onclick = "onRemove(this)" type="button" class="fa-solid fa-trash fa-2x text-danger"></i>
                    </div>
                </div>
            </div>`
    })
    postContainer.innerHTML = result;
}

const onEdit = async (ele) =>{
    let Edit_Id = ele.closest('.card').id;
    localStorage.setItem('Edit_Id', Edit_Id)
    let Edit_URL = `${BASE_URL}/posts/${Edit_Id}.json`

 let res = await  makeApiCall('GET', Edit_URL, null)
 titleControler.value = res.title
 contentControler.value = res.content
userIdControler.value = res.userId

addPost.classList.add('d-none')
updatePost.classList.remove('d-none')
 snackBar('The data is patch successfully!!!', 'success')
        formPost.scrollIntoView({ behavior: "smooth", block: "center" });
    titleControler.focus()

}

const onRemove = async(ele) =>{
  let result = await  Swal.fire({
  title: "Do you want to remove the posts?",
  showCancelButton: true,
  denyButtonText: `Yes`
})
  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {
    let Remove_Id = ele.closest('.card').id;
    let Remove_URL = `${BASE_URL}/posts/${Remove_Id}.json`

    let res = await makeApiCall('DELETE', Remove_URL, null)
    snackBar('The post is deleted successfully!!!', 'success')
    let card = document.getElementById(Remove_Id).parentElement
    card.remove()

        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}




const makeApiCall = async (methodName, api_url, msgBody) => {
    msgBody = msgBody ? JSON.stringify(msgBody) : null;
    loader.classList.remove('d-none')
    let CONFI_OBJ = {
        method: methodName,
        body: msgBody,
        headers: {
            "auth": "JWT token from LS",
            "content-type": "aplication/json"
        }
    }
    try {
        let res = await fetch(api_url, CONFI_OBJ)
        if (!res.ok) {
            throw new error('Network Error')
        }
        return res.json()
    } catch (err) {
        cl(err)
    }finally{
    loader.classList.add('d-none')

    }
}

const fetchAllPosts = async () => {
    let data = await makeApiCall('GET', POST_URL, null)
    let postsArr = objtoArr(data)
    postTemplating(postsArr)
}
fetchAllPosts()

const onSubmitObj = async (eve)=>{
    eve.preventDefault()
    let obj = {
        title : titleControler.value,
        content : contentControler.value,
        userId : userIdControler.value
    }
    cl(obj)
    let res = await makeApiCall("POST", POST_URL, obj)
 snackBar('The data is added successfully!!!', 'success')
    formPost.reset()
    let newId = res.id;
    obj.id = res.id
    let card = document.createElement('div')
    card.className = "col-md-4 my-4"
    card.innerHTML = `<div class="card" id="${obj.id}">
                    <div class="card-header">
                        <h4 title="${obj.title}">${obj.title}</h4>
                    </div>
                    <div class="card-body">
                        <p>${obj.content}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <i onclick = "onEdit(this)" type="button" class="fa-solid fa-pen-to-square fa-2x text-success"></i>
                        <i onclick = "onRemove(this)" type="button" class="fa-solid fa-trash fa-2x text-danger"></i>
                    </div>
                </div>`
        postContainer.prepend(card)
        card.scrollIntoView({ behavior: "smooth", block: "center" });

}

const onUpdatePost =async (eve) =>{
    let Update_Id = localStorage.getItem('Edit_Id')
    let Update_URL = `${BASE_URL}/posts/${Update_Id}.json`
    let Update_Obj = {
        title : titleControler.value,
        content : contentControler.value,
        userId : userIdControler.value,
        id : Update_Id
    }
    cl(Update_Obj)
    let res = await makeApiCall('PATCH', Update_URL, Update_Obj)
 snackBar('The data is updated successfully!!!', 'success')
    formPost.reset()
     let card = document.getElementById(Update_Id);
     cl(card)
     card.querySelector('h4').innerHTML = res.title;
     card.querySelector('p').innerHTML = res.content;

     addPost.classList.remove('d-none')
     updatePost.classList.add('d-none')

        card.scrollIntoView({ behavior: "smooth", block: "center" });

}

formPost.addEventListener('submit', onSubmitObj)

updatePost.addEventListener('click', onUpdatePost)