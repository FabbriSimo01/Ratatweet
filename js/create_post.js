let currentSelection = "None";
let imgSelected = false;
let btns = document.querySelectorAll("#recipe-btn>button");
/* 0: usa_ricetta, 1: crea_ricetta */

//Controllo al caricamento pagina che non ci sia un ricetta già selezionata
document.onload = checkAlreadySelectedRecipe();

function checkAlreadySelectedRecipe(){
    if(typeof IDrecipe !== 'undefined') {
        currentSelection="Usa ricetta";
        let element = document.querySelector("#ricette_salvate");
        let hidden = element.getAttribute("hidden");
        if (hidden) element.removeAttribute("hidden");
        element = document.getElementById("Recipe"+IDrecipe);
        element.checked = true;
    }
}
// check if fields are complete
function checkInputs() {
    return document.querySelector("#titolo").value != '' && document.querySelector("#descrizione").value != '' && document.querySelector("input[name='pic']").value != '';
}

//Invio form
document.querySelector("main form").addEventListener("submit", function (event) {
    event.preventDefault();
    if (!checkInputs()) {
        document.querySelector("form > p").innerText = "Complete all fields!";
        return;
    }
    const titolo = document.querySelector("#titolo").value;
    const descrizione = document.querySelector("#descrizione").value;
    const pic = document.querySelector("input[name='pic']").files[0];
    if(currentSelection=="Crea ricetta") {
        //Formattare ingrediente e quantita
        const procedimento = document.querySelector("#procedimento").value;
        
        const ingredients = document.querySelectorAll("#ingredients_list>li>input[name=ingrediente]");
        const quantities = document.querySelectorAll("#ingredients_list>li>input[name=quantita]");

        let ingr = {};
        for (let i = 0; i<ingredients.length; i++) {
            if (ingredients[i].value == '' || quantities[i].value == '') {
                console.log("Formato ingredienti non valido");
                document.querySelector("form > p").innerText = "Cannot create recipe with empty fields!";
                return;
            }
            //add ingredients
            ingr[ingredients[i].value] = quantities[i].value;
        }
        console.log("INGREDIENTS = " +JSON.stringify(ingr));
        new_recipe_new_post(titolo, descrizione, pic, JSON.stringify(ingr), procedimento);
    }
    else if(currentSelection=="Usa ricetta") {
        const idRicetta = document.querySelector('input[name="recipe"]:checked').value;   //Uso la ricetta selezionata tra quelle salvate
        new_post(titolo, descrizione, pic, idRicetta);
    }
});
function select(i) {
    let other = (i+1)%2;
    btns[i].classList.remove("btn-outline-secondary");
    btns[i].classList.add("btn-info");
    btns[i].classList.add("text-white");
    btns[other].classList.add("btn-outline-secondary");
    btns[other].classList.remove("btn-info");
    btns[other].classList.remove("text-white");
}
//Switch tra "usa ricetta" e "crea ricetta"
btns[1].addEventListener("click", function (event) {
    console.log("Premuto crea ricetta");
    currentSelection = "Crea ricetta";

    select(1);
});
//switch tra "crea ricetta" e "usa ricetta"
btns[0].addEventListener("click", function (event) {
    console.log("Premuto usa ricetta");
    currentSelection = "Usa ricetta";

    select(0);
});
//Funzione di creazione di una nuova ricetta
function new_recipe_new_post(titolo, descrizione, pic, ingredienti, procedimento) {
    const formData = new FormData();
    formData.append('q', "new_recipe");
    formData.append('ingredients', ingredienti);
    formData.append('method', procedimento);
    axios.post('utils/api.php', formData).then(response => {
        console.log(response.data);
        if (response.data["esito"]==true) { //Abbiamo creato la ricetta, possiamo creare il post ad essa associato
            id_recipe = response.data["IDrecipe"];
            new_post(titolo, descrizione, pic, id_recipe);
            //save recipe
            const formData2 = new FormData();
            formData.append('q', "saveRecipe");
            formData.append('id', id_recipe);
            axios.post('utils/api.php', formData2);
        } else {
            console.log(response.data["esito"]);
            console.log("NACK");
            document.querySelector("form > p").innerText = response.data["errore"];
        }
    });
}
//Funzione di creazione di un nuovo post 
function new_post(titolo, descrizione, pic, idRicetta) {
    const formData = new FormData();
    formData.append('q', "new_post");
    formData.append('titolo', titolo);
    formData.append('descrizione', descrizione);
    formData.append('IDricetta', idRicetta);
    console.log(idRicetta);
    var reader = new FileReader();
    reader.onload = () => {
        formData.append('pic', btoa(reader.result));
        axios.post('utils/api.php', formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            }
            }).then(response => {
            console.log(response.data);
            if (response.data["esito"]==true) {
                console.log("ACK");
                id_post = response.data["IDpost"];
                location.href="post.php?id="+id_post;
            } else {
                console.log(response.data["esito"]);
                console.log("NACK");
                document.querySelector("form > p").innerText = response.data["errore"];
            }
            }).catch(function (error) {
                if (error.response) { // get response with a status code not in range 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                } else if (error.request) { // no response
                console.log(error.request);
                // instance of XMLHttpRequest in the browser
                // instance ofhttp.ClientRequest in node.js
                } else { // Something wrong in setting up the request
                console.log('Error', error.message);
                }
                console.log(error.config);
            });
    }
    reader.readAsBinaryString(pic);
}

function addIngredient() {
    const list = document.getElementById("ingredients_list");
    const li = list.firstElementChild.cloneNode(true);
    li.childNodes.forEach(inp => inp.value = null);
    list.insertBefore(li, list.lastElementChild);
}