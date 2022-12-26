const row = document.querySelector(".produits .row"),
      spcart = document.querySelector(".chariot"),
      cart = document.querySelector(".cart");

spcart.onclick = function (e){
    e.stopPropagation();
    cart.classList.toggle("open");
}
cart.onclick = function(e){
    // Stop clicking cart
    e.stopPropagation();
}
document.addEventListener("click", (e)=>{
    if (e.target !== spcart || e.target !== cart || e.target !== btn){
        if(cart.classList.contains("open")){
            cart.classList.remove("open");
        }
    }
});
fetch('https://dummyjson.com/products')
.then((response) => response.json())
.then(result =>{
    let products = result.products;
    products.forEach(el => {
        row.innerHTML += ` 
        <div class="col-lg-4 col-md-6 col-sm-6 mb-3">
                    <div class="card product id="${el.id}" data-name="${el.title}">
                        <img src="${el.thumbnail}" class="card-img-top" alt="...">
                        <div class="card-body">
                          <h5 class="card-title">${el.title}</h5>
                          <p class="card-text">${el.description}</p>
                          <div class="price d-flex gap-2 text-success mb-2">
                            <h5>$<span>${el.price}</span></h5>
                            <span class="text-decoration-line-through">${el.discountPercentage}</span>
                          </div>
                          <div class="d-flex justify-content-between align-items-center flex-md-column flex-sm-column flex-lg-row gap-2">
                                <input type="number" class="quant text-center fw-bold" min="1" max="30" value="1"/>
                                <button class="btn add btn-info pe-auto fw-bold ml-3"><i class="fa-solid fa-cart-plus me-2"></i>Add To Cart</button>
                          </div>
                        </div>
                    </div>
                </div>
        `; 
    });
    searchProduct();
    document.querySelectorAll(".add").forEach((b)=>{
            b.addEventListener('click',(e)=>{
                e.stopPropagation();
                let name = e.target.parentElement.parentElement.querySelector(".card-title").innerHTML,
                    price = e.target.parentElement.parentElement.querySelector(".price h5 span").innerHTML,
                    qte = e.target.parentElement.querySelector(".quant").value;
                    AddProduct (name,price,qte);
            });
        });
}
);
function AddProduct(n,p,qte) {
    let totalproduct = (p * qte).toFixed(3);
    cart.querySelector("p").style.display = "none";
    
    let li = document.createElement("li"),
    sp1 = document.createElement("span"),
    sp2 = document.createElement("span"),
    button = document.createElement("button");
    
    li.className = "d-flex justify-content-between align-content-center mb-3 ps-3 pe-3";
    li.appendChild(document.createTextNode(`${n}`));
    li.setAttribute('data-name',`${n}`);
    sp1.setAttribute('data-TotalProduct',totalproduct);
    sp1.appendChild(document.createTextNode(`${totalproduct} `));
    sp2.appendChild(document.createTextNode(`dt`));
    button.appendChild(document.createTextNode("delete"));
    sp1.appendChild(sp2);
    li.appendChild(sp1);
    li.appendChild(button);
    let ar = Array.from(cart.querySelectorAll("li")),
    res = ar.find( i => i.dataset.name === n );
    
    if(res === undefined){
        cart.insertBefore(li,document.querySelector(".card-footer"));
        SomProduit();
        cart.classList.add("open");
    }else {
        return;
    }
    // remove product
    document.querySelectorAll("li button").forEach((btn) =>{
        btn.addEventListener('click', (e)=>{
            e.target.parentElement.remove();
            SomProduit();
         });
    });
 }

function SomProduit(){
    let som = 0;
    document.querySelectorAll("li>span").forEach((li)=>{
        som += +li.dataset.totalproduct;
    });
    // ToFixe 2 number after vergule.
    document.querySelector(".price>span").innerHTML = som.toFixed(3);
    if (document.querySelectorAll("li").length === 0){
        cart.querySelector("p").style.display = "block";
    }
};
function searchProduct(){
    let  name = document.querySelector(".search"),
         buttser = document.querySelector(".btn-search"),
         prod = Array.from(document.querySelectorAll(".product"));
    buttser.onclick = function () {
        // Search products start with value
        let res = prod.filter((item) => item.dataset.name.toLowerCase().startsWith(name.value.toLowerCase()));
    if (res.length > 0){
        row.innerHTML = '';
        res.forEach((i)=>{
           row.innerHTML += `
           <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
           ${i.innerHTML}
           </div>
           `;
        });
      }else {
        row.innerHTML ='';
        row.innerHTML = '<p>There are no Products with this name.<p>';
      }
    }
 };