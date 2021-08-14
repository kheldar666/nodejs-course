const deleteProduct = (btn) => {
    const productid = btn.parentNode.querySelector("[name=productId]").value;
    const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
    const productElement = btn.closest('article');

    fetch("/admin/product/"+productid, {
        method:"DELETE",
        headers:{
            'csrf-token':csrf
        }
    })
    .then(result => {
        return result.json();
    })
    .then(data => {
        console.log(data)
        productElement.remove()
    })
    .catch(err =>{
        console.error(err)
    });

}