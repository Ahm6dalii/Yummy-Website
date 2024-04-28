//~Start Function For Nav
const menuWidth=$('#links').innerWidth();
$('#nav-menu').css({left:`-${menuWidth}px`})
let isOpen=false;

function closeNav(){    
    $('#nav-menu').animate({left:`-${menuWidth}px`},500)
    $('#icons').addClass('fa-bars').removeClass('fa-x')
    $('nav li').animate({top:300},500)
    isOpen=false;


}
function openNav(){    
    $('#nav-menu').animate({left:`${0}px`},500)
    $('#icons').removeClass('fa-bars').addClass('fa-x')
    for (let i = 0; i < 5; i++) {
        $("nav li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
    isOpen=true;

}
//~End Function For Nav

// ! loading animation
jQuery(() => {
        searchByNameDefault("").then(function(){
            $('#loader').fadeOut(500,()=>{ $('#loader').addClass("d-none")
            $('body').css('overflow','visible')
        }) 
            
        })
    }
)

// ^Functions
// Start Display Categories
async function getDataCatogery(){
    $('#dataContainer').html(`
    <div class=" col vh-100 d-flex align-items-center justify-content-center ">
    <span class="loader "></span>
   </div>
    `)
    let respose=await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let {categories}= await respose.json();
    displayCatogery(categories)
    $('#nav-menu').animate({left:`-${menuWidth}px`},500)
    $('#icons').addClass('fa-bars').removeClass('fa-x')

}

async function getMealsByCatogery(catogeryName){
    $('#dataContainer').html(`
    <div class=" col vh-100 d-flex align-items-center justify-content-center ">
    <span class="loader "></span>
   </div>
    `)
    let respose=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${catogeryName}`);
    let  {meals}= await respose.json();
    displayInnerData(meals)

}

function displayCatogery(categories){
let container=$('dataContainer');
let cartona='';
for(let i=0 ;i<categories.length;i++)
{
cartona+=`
<div class="col-md-6 col-lg-4" onclick="getMealsByCatogery('${categories[i].strCategory}')">
                   
<div class="inner position-relative border border-2 rounded-3">
    
        <img src="${categories[i].strCategoryThumb
            }" class="w-100 object-fit-cover" alt="">
   
    <div class=" w-100 d-flex justify-content-center align-items-center  fw-bold position-absolute" >
        ${categories[i].strCategory }
       </div>

</div>
</div>
`
}
$('#dataContainer').html(cartona);
}
// End Display Categories

function displayInnerData(mealsName){
    let cartona='';
    for(let i=0 ;i<mealsName.length;i++)
    {
    cartona+=`
    <div class="col-md-6 col-lg-4" onclick="dataById(${mealsName[i].idMeal})">                  
    <div class="inner position-relative border border-2 rounded-3">   
            <img src="${mealsName[i].strMealThumb
                }" class="w-100 object-fit-cover" alt="">
        <div class=" w-100 d-flex justify-content-center align-items-center  fw-bold position-absolute" >
            ${mealsName[i].strMeal.split(" ").slice(0,4).join(" ")}
           </div>
    </div>
    </div>
    `
    }
    $('#dataContainer').html(cartona);
}

function displaySearchBody(){
    let searchContainer=`
    <div class="col-md-6 search">
    <input type="search"  class="form-control" oninput="searchByName(this)" class="mb-3" placeholder="Search by name...">
</div>
<div class="col-md-6 search">
    <input type="search"  maxlength="1"   class="form-control" oninput="searchByFilter(this)" placeholder="Search by first letter...">
</div>

<div class="row row-gap-3" id="searchData">
</div>
    `
    $('#dataContainer').html(searchContainer);
    $('#nav-menu').animate({left:`-${menuWidth}px`},500)
    $('#icons').addClass('fa-bars').removeClass('fa-x')
}

//^ Start SearchByName Action
async function searchByName(element){
    $('#searchData').html(`
    <div class=" col vh-100 d-flex align-items-center justify-content-center ">
    <span class="loader "></span>
   </div>
    `)
    let respose=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${element.value ==''?'Corba':element.value}`);
    let  {meals}= await respose.json();
    if(meals!=null){
    displaySearchData(meals)}
}

async function searchByNameDefault(value){
    $('#searchData').html(`
    <div class=" col vh-100 d-flex align-items-center justify-content-center ">
    <span class="loader "></span>
   </div>
    `)
    let respose=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`);
    let  {meals}= await respose.json();
    displayInnerData(meals)
}
//^ End SearchByName Action

//&Start Meal Instructions
async function dataById(id){
    $('#dataContainer').html(`
    <div class=" col vh-100 d-flex align-items-center justify-content-center ">
    <span class="loader "></span>
   </div>
    `)
    let respose=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let  {meals}= await respose.json();
    displayDetials(meals);
}

function displayDetials(meals){
    let ingredients = ``
  let mealsMap= new Map(Object.entries(meals[0]))
  //ingrediant + measure
  for (let i = 1; i <= 20; i++) {
      if (meals[0][`strIngredient${i}`]) {
          ingredients += `<li class="d-inline-block px-1 fs-6 rounded-3 alert alert-info py-0 mb-1">${meals[0][`strMeasure${i}`]} ${meals[0][`strIngredient${i}`]}</li>`
      }
  }
 //tags
 let tagNum='';
 let Tags='';
  for(const [key,value] of mealsMap ){
    if(/^(strTags)/.test(key) & /^[a-zA-z0-9]/.test(value)&/^[^(null)]/.test(value)){
        tagNum=value.split(',');
        for(ele of tagNum){
        Tags+=`<li class="d-inline-block px-1 py-0 rounded-3 fs-6 alert alert-danger mb-1">${ele}</li>`
    }}
  }

   let cartona =`
    <div class="col-md-4">
    <img src="${meals[0].strMealThumb}" class="w-100 rounded-3" alt="" />
    <h2 class="mt-2 text-white">${meals[0].strMeal}</h2>
  </div>
  <div class="col-md-8 text-white">
    <h2 class="mb-2 text-white">Instructions</h2>
    <p class="lead text-white ">
    ${meals[0].strInstructions.split(" ").slice(0,25).join(" ")}
    </p>
    <p class="fs-2 mb-0"><span class="fw-bolder">Area :</span> ${meals[0].strArea}</p>
    <p class="fs-2 mb-0"><span class="fw-bolder">Category :</span> ${meals[0].strCategory}</p>
   
    <!-- Recipes : -->
    <div class="fs-2"><span class="d-inline-block fw-bolder mb-2">Recipes :</span>
        <ul class="list-unstyled d-flex flex-wrap gap-1 ms-3">
            ${ ingredients }
        </ul>
       
    </div>

    <!-- Tags: -->
    <div class="fs-2"><span class="d-inline-block fw-bolder mb-2">Tag :</span>
        <ul class="list-unstyled d-flex flex-wrap gap-1 ms-3">
        ${Tags}
        </ul>
    </div>

    <!-- Button -->
    <div class="d-flex justify-content-between column-gap-2  border-top border-opacity-50 py-3 w-50">
        <button class="btn btn-main rounded-5 flex-grow-1" ><a href="${meals[0].strSource}" class="nav-link" target="blank">Source</a></button>
        <button class="btn btn-outline-main rounded-5 flex-grow-1"><a href="${meals[0].strYoutube}" class="nav-link" target="blank">Youtube</a></button>
    </div>
    <button type='button' class="position-fixed mainPage-btn btn fw-bolder" onclick="location.reload()" >Home</button>
  </div>
    `
    $('#dataContainer').html(cartona);// Start Display Categories
}
//&End Meal Instructions

//!Start Get Area Or Ingradient Data
async function getListAreaOrIngeriant(list){ 
    $('#dataContainer').html(`
    <div class=" col vh-100 d-flex align-items-center justify-content-center ">
    <span class="loader "></span>
   </div>
    `)
    let respose=await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?${list}=list`);
    let {meals}= await respose.json();
    if(list=='a'){
        displayListArea(meals)
    }else if(list=='i'){
        displayListIngrediant(meals)
    }else{
        return;
    }
    $('#nav-menu').animate({left:`-${menuWidth}px`},500)
    $('#icons').addClass('fa-bars').removeClass('fa-x')
}
//!End Get Area Or Ingradient Data

//& Start Display Area
function displayListArea(meals){
    let cartona='';
    for(let i=0 ;i<meals.length;i++)
    {
    cartona+=`
    <div class="col-6 col-lg-4 col-xl-3">                   
    <div class="inner text-center border border-2 rounded-3 " onclick="getAreaData('${meals[i].strArea}')" >
    <svg class="svg-inline--fa fa-earth-americas w-25 h-25 mb-2 pt-2 " fill="#c4b294" viewBox="0 -8 72 72" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" stroke="#bdaf1f"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>world</title><path d="M59.25,12.42l-.83.27L54,13.08l-1.27,2-.91-.29L48.23,11.6l-.52-1.66L47,8.16l-2.23-2-2.63-.51-.06,1.2,2.58,2.52,1.26,1.48-1.42.75-1.15-.34-1.73-.73,0-1.39L39.42,8.2l-.75,3.29L36.38,12l.23,1.84,3,.57.52-2.93,2.46.37,1.14.67h1.84L46.8,15l3.34,3.38-.25,1.32-2.69-.34-4.64,2.34-3.34,4-.43,1.78H37.58l-2.23-1-2.17,1,.54,2.29.94-1.09,1.67,0-.12,2,1.38.4L39,32.67,41.2,32l2.57.4,3,.8,1.48.18,2.52,2.86,4.87,2.86-3.15,6-3.32,1.54-1.26,3.44-4.81,3.21-.51,1.85A28,28,0,0,0,59.25,12.42Z"></path><path d="M39.22,42.63l-2-3.78L39.05,35l-1.87-.56-2.1-2.11-4.66-1L28.88,28v1.92H28.2l-4-5.44V20l-2.94-4.78-4.67.83H13.43l-1.59-1,2-1.6-2,.46A28,28,0,0,0,36,56a29,29,0,0,0,3.51-.25l-.29-3.39s1.29-5,1.29-5.2S39.22,42.63,39.22,42.63Z"></path><path d="M18.41,9l5-.7,2.29-1.25,2.58.74,4.12-.23,1.42-2.22,2.05.34,5-.47,1.38-1.52,2-1.29,2.74.41,1-.15a27.91,27.91,0,0,0-33.51,7.49h0ZM37.18,2.78,40,1.21l1.84,1.06-2.66,2-2.54.26-1.14-.74ZM28.71,3,30,3.54,31.63,3l.9,1.56-3.82,1L26.88,4.5S28.67,3.35,28.71,3Z"></path></g></svg>
    <p class="text-center text-white fs-2">
            ${meals[i].strArea }
        </p>
    </div>
    </div> `
    }
    $('#dataContainer').html(cartona);
}
async function getAreaData(area){ 
    $('#dataContainer').html(`
    <div class=" col vh-100 d-flex align-items-center justify-content-center ">
    <span class="loader "></span>
   </div>
    `)
    let respose=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let {meals}= await respose.json();
    displayInnerData(meals)
}
//& End Display Area

//^ Start Ingredients
function displayListIngrediant(meals){
    let cartona='';
    for(let i=0 ;i<21;i++)
    {
    cartona+=`
    <div class="col-6 col-lg-4 col-xl-3">                   
    <div class="inner text-center border border-2 rounded-3 " onclick="getIngrediantData('${meals[i].strIngredient}')" >
    <svg class="svg-inline--fa fa-earth-americas w-50  mb-0  pt-2 "  fill="#c4b294" viewBox="0 -24.48 122.88 122.88" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="enable-background:new 0 0 122.88 73.91" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css">  .st0{fill-rule:evenodd;clip-rule:evenodd;}  </style> <g> <path class="st0" d="M97.31,36.95c0,9.92-3.49,18.39-10.48,25.38c-7,7-15.46,10.5-25.38,10.5c-9.88,0-18.34-3.49-25.35-10.5 c-7-6.99-10.52-15.46-10.52-25.38c0-9.89,3.51-18.32,10.52-25.34c7.03-7,15.48-10.52,25.35-10.52c9.92,0,18.38,3.51,25.38,10.52 C93.81,18.63,97.31,27.06,97.31,36.95L97.31,36.95L97.31,36.95L97.31,36.95z M16.37,30.34c3.15-2.15,4.73-4.96,4.46-11.39V2.42 c-0.03-2.31-4.22-2.59-4.43,0l-0.16,13.41c-0.01,2.51-3.78,2.59-3.77,0l0.16-13.87c-0.05-2.48-4.05-2.73-4.1,0 c0,3.85-0.16,10.02-0.16,13.87c0.2,2.43-3.3,2.75-3.21,0L5.32,2.05C5.23,0.18,3.17-0.49,1.77,0.39C0.28,1.34,0.58,3.25,0.52,4.86 L0,20.68c0.08,4.6,1.29,8.34,4.89,9.93c0.55,0.24,1.31,0.43,2.19,0.56L5.84,69.75c-0.07,2.29,1.8,4.16,3.99,4.16h0.5 c2.47,0,4.56-2.11,4.49-4.68l-1.09-38.07C14.88,30.98,15.83,30.71,16.37,30.34L16.37,30.34z M106.74,68.59l-0.06-34.65 c-12.15-7.02-8.28-34.07,3.88-33.92c14.78,0.17,16.53,30.48,3.82,33.81l0.94,34.9C115.5,75.33,106.75,75.94,106.74,68.59 L106.74,68.59z M82.33,36.92c0,5.78-2.03,10.71-6.12,14.8c-4.08,4.07-9.01,6.12-14.79,6.12c-5.74,0-10.67-2.05-14.75-6.12 c-4.08-4.09-6.12-9.02-6.12-14.8c0-5.74,2.04-10.67,6.12-14.74c4.09-4.07,9.01-6.12,14.75-6.12C73.03,16.07,82.33,25.3,82.33,36.92 L82.33,36.92L82.33,36.92z M87.22,36.92c0-7.1-2.5-13.17-7.53-18.2s-11.12-7.53-18.27-7.53c-7.13,0-13.2,2.5-18.2,7.53 c-5.03,5.03-7.56,11.1-7.56,18.2c0,7.12,2.53,13.19,7.56,18.24c5,5.04,11.07,7.57,18.2,7.57c7.14,0,13.23-2.53,18.27-7.57 C84.71,50.1,87.22,44.03,87.22,36.92L87.22,36.92L87.22,36.92L87.22,36.92z"></path> </g> </g></svg>
    <p class="text-center text-white fs-2">
            ${meals[i].strIngredient.split(" ").slice(0,2).join(" ")}
    </p>
    <p class="text-center text-white px-2 ">
    ${(`${meals[i].strDescription}`).split(" ").slice(0,10).join(" ")}
    </p>
    </div>
    </div> `
    }
    $('#dataContainer').html(cartona);
}
async function getIngrediantData(ingrediantName){ 
    $('#dataContainer').html(`
    <div class=" col vh-100 d-flex align-items-center justify-content-center ">
    <span class="loader "></span>
   </div>
    `)
    let respose=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediantName}`);
    let {meals}= await respose.json();
    displayInnerData(meals)
}
//^ End Ingredients

//! Start Seach
async function searchByFilter(element){
    $('#searchData').html(`
    <div class=" col vh-100 d-flex align-items-center justify-content-center ">
    <span class="loader "></span>
   </div>
    `)
    let response=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${element.value ==''?'a':element.value}`);
    let {meals}= await response.json();
    displaySearchData(meals)
}
function displaySearchData(data){
    let cartona='';
    for(let i=0 ;i<data.length;i++)
    {
    cartona+=`
    <div class="col-md-6 col-lg-4 col-xl-3" onclick="dataById(${data[i].idMeal})">                   
    <div class="inner position-relative border border-2 rounded-3" >
            <img src="${data[i].strMealThumb}" class="w-100 object-fit-cover" alt="">
        <div class="dataDetials p-3 w-100 d-flex justify-content-center align-items-center fw-bold position-absolute"  >
            ${data[i].strMeal }
           </div>
    </div>
    </div> `
    }
    $('#searchData').html(cartona);
}
//! End Seach

// ^----------------Start Form validation--------------
let nameStutes=false;
let emailStutes=false;
let phoneStutes=false;
let ageStutes=false;
let passStutes=false;
let rePassStutes=false;

function validateInput(element) {
    var regix = {
        fName:
        /^([a-zA-Z]{1,10})?(\s{1,})?([a-zA-Z]{1,10})?(\s{1,})?([a-z]{1,10})?$/,
        fEmail: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
        fPhone:/^(\+20)?0(15|10|11|12)[0-9]{8}$/,
        fAge:/^[1-9]{1}([0-9]{1})?$/,
        fPass: /^\w{6,10}$/,     
        fRePass: /^\w{6,10}$/,
    };
    if (regix[element.id].test(element.value) == true) {
      element.classList.add("is-valid");
      element.classList.remove("is-invalid");
      element.nextElementSibling.classList.replace("d-block", "d-none");
     
      return true;
    } else {
      element.classList.add("is-invalid");
      element.classList.remove("is-valid");
      element.nextElementSibling.classList.replace("d-none", "d-block");
  
      return false;
    }
    
}

function PassIsEqual(){
    const Pass=document.querySelector('#fPass')
    const RePass=document.querySelector('#fRePass')
    if(Pass.value==RePass.value)
    {
        $('#msgError').removeClass('d-block').addClass('d-none')
        return true;
    }else{
        $('#msgError').removeClass('d-none').addClass('d-block')
        return false;
    }
}

function CheckValidationAll(){
const Name=document.querySelector('#fName')
const Email=document.querySelector('#fEmail')
const Phone=document.querySelector('#fPhone')
const Age=document.querySelector('#fAge')
const Pass=document.querySelector('#fPass')
const RePass=document.querySelector('#fRePass')
    if(
        validateInput(Name)&&
        validateInput(Email)&&
        validateInput(Phone)&&
        validateInput(Age)&&
        validateInput(Pass)&&
        validateInput(RePass)&&
        PassIsEqual()
    ){ 
        $('#btnSubmit').removeAttr('disabled');  
        $('#btnSubmit').removeClass('btn-outline-danger').addClass('btn-outline-submit');  
    }else{
        $('#btnSubmit').attr('disabled','');
        $('#btnSubmit').addClass('btn-outline-danger').removeClass('btn-outline-submit');  

    }
}

function valid (e){
if(e.id=='fName')
{
    nameStutes=true;
}
if(e.id=='fEmail')
{
    emailStutes=true;
}
if(e.id=='fPhone')
{
    phoneStutes=true;
}
if(e.id=='fAge')
{
    ageStutes=true;
}
if(e.id=='fPass')
{
    passStutes=true;
}
if(e.id=='fRePass')
{
    rePassStutes=true;
}
if(nameStutes &&emailStutes&&phoneStutes&&ageStutes&&passStutes&&rePassStutes    
){
    CheckValidationAll();
}
}
 
function displayConctUsBody(){
    let searchContainer=`
    <div class=" d-flex align-items-center justify-content-center">
    <form  class=" d-flex flex-column justify-content-center row-gap-3 align-items-center " id="contactForm">
    <div class=" d-flex align-items-center">
        <i class="fa-solid fa-envelope fa-3x me-2 " style="color:#c4b294"></i>
        <h2 class="h1 text-white d-inline-block mb-0" >Contact Us</h2>             
    </div>
    <div>
        <div class="row row-gap-3 position-relative ">
            <div class="col-md-6">
                <input type="text" class="form-control fInput" placeholder="Enter Your Name..." onkeyup="valid(this) " oninput="validateInput(this) "  id="fName">
                <p class="alert alert-danger p-1 m-0 mt-1 d-none ">must contain character only</p>
            </div>
            <div class="col-md-6">
                <input type="email" class="form-control fInput" placeholder="Enter Your Email..."   onkeyup="valid(this) " oninput="validateInput(this)"  id="fEmail">
                <p class="alert alert-danger p-1 m-0 mt-1 d-none">must be like "example@mail.com"</p>
            </div>
            <div class="col-md-6">
                <input type="phone" class="form-control fInput" placeholder="Enter Your Phone"  onkeyup="valid(this) " oninput="validateInput(this)" id="fPhone">
                <p class="alert alert-danger p-1 m-0 mt-1 d-none">must be valid number(011-012-015-010)</p>
            </div>
            <div class="col-md-6">
                <input type="number" class="form-control fInput" placeholder="Enter Your Age"  onkeyup="valid(this) " oninput="validateInput(this)" id="fAge">
                <p class="alert alert-danger p-1 m-0 mt-1 d-none">must be valid age (1-99)</p>
            </div>
            <div class="col-md-6">
                <input type="password" class="form-control fInput" placeholder="Enter Your Password"  onkeyup="valid(this) " oninput="validateInput(this)" id="fPass">
                <p class="alert alert-danger p-1 m-0 mt-1 d-none">minimum length 6</p>
            </div>
            <div class="col-md-6">
                <input type="password" class="form-control fInput" placeholder="Enter Your rePassword"  onkeyup="valid(this) " oninput="validateInput(this)" id="fRePass">
                <p class="alert alert-danger p-1 m-0 mt-1 d-none">minimum length 6</p>
            </div>
            <p class="alert alert-danger p-1 m-0 mt-1 d-none" id="msgError">Password not equal</p>
            <button id="btnSubmit" type="submit" disabled class="btn btn-outline-danger fw-bolder w-25 m-auto">Submet</button>
        </div>
    </div>
        <button type='button' class="position-fixed mainPage-btn btn fw-bolder" onclick="location.reload()" >Home</button>

</form>
</div>
    `
    $('#dataContainer').html(searchContainer);
    $('#nav-menu').animate({left:`-${menuWidth}px`},500)
    $('#icons').addClass('fa-bars').removeClass('fa-x')
    $('#contactForm').on('click',function(e){
        e.preventDefault;
})}  
// ^-----------------End Form --------------

 

//   !Event In Nav
  $('#Search').on('click',function(){
    displaySearchBody()
    closeNav()

  })

  $('#categories').on('click',function(){
    getDataCatogery()
    closeNav()
  })
  
  $('#area').on('click',function(){
    getListAreaOrIngeriant('a')
    closeNav()
  })

  $('#ingrediant').on('click',function(){
    getListAreaOrIngeriant('i')
    closeNav()
  })

  $('#contactUs').on('click',function(){
    displayConctUsBody()
    closeNav()
  })

  $('#menu-icon').on('click',function(){
    if(isOpen){
        closeNav()
    }else{
        openNav()

    }
})

