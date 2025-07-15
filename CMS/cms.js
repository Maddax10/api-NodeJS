//===========================================================================
// FINIR LA MODIFICATION POUR MODIFIER LES ITEMS DANS LE TABLEAU
//===========================================================================


















const switchTab = document.querySelector("#switchTab");
const formationsForm = document.querySelector("#formationsForm");
const personnelsForm = document.querySelector("#personnelsForm");
const listFormations = document.querySelector("#listFormations");
const listPersonnels = document.querySelector("#listPersonnels");

const btnAddFormation = document.querySelector("#addFormation");
const btnAddPersonnel = document.querySelector("#addPersonnel");

const apiUrl = "http://localhost:3000/api";

const tabFormations = document.querySelector("#tabFormations");
const tabPersonnels = document.querySelector("#tabPersonnels");


//===================================================================================================
//                                      FETCHs
//===================================================================================================
//--------------------------
// reload
//--------------------------
//Récupérer touses les formations
const reloadFormations = () => {
  const tbodyFormations = document.querySelector("#tbodyFormations");
  tbodyFormations.innerHTML = "";
  fetch(apiUrl + "/formations")
    .then(response => response.json())
    .then(data => {
      data.forEach(element => {
        //insérer les données dans le tableau formations
        tbodyFormations.innerHTML +=
          `<tr  data-id_formation="${element.id_formation}">
            <td>${element.nom_formation}</td>
            <td>${element.date_formation}</td>
            <td>${element.local_formation}</td>
            <td>${element.id_formateur_formation}</td>
            <td>
              <span class="modifyItem" id="modifyFormation">modifier</span>
              <span class="deleteItem" id="deleteFormation">supprimer</span>
            </td>
          </tr>`;

      });
    });
}

//Récupérer tous le Personnels
const reloadPersonnels = () => {
  const tbodyPersonnels = document.querySelector("#tbodyPersonnels");
  tbodyPersonnels.innerHTML = "";
  fetch(apiUrl + "/personnels")
    .then(response => response.json())
    .then(data => {
      data.forEach(element => {
        //insérer les données dans le tableau formations
        tbodyPersonnels.innerHTML +=
          `<tr data-id_personnels="${element.id_personnels}">
        <td>${element.fonction_personnels}</td>
        <td>${element.name_personnels}</td>
        <td>${element.firstname_personnels}</td>
        <td>${element.email_personnels}</td>
        <td>${element.local_personnels}</td>
        <td>${element.phone_personnels}</td>
        <td>
          <span class="modifyItem" id="modifyPersonnel">modifier</span>
          <span class="deleteItem" id="deletePersonnel">supprimer</span>
        </td>
      </tr>`;

      });
    });
}
//--------------------------
// add
//--------------------------

//Ajouter une formation
const addFormation = async (ev) => {
  //Récupérer les infos des champs
  const formdata = new FormData(formationsForm);
  const datas = Object.fromEntries(formdata.entries())
  console.log("formdata en json", JSON.stringify(datas));
  formationsForm.reset();
  await fetch(`${apiUrl}/formations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datas)
  })
    .then(response => response.json())
    .then(data => {
      console.log(JSON.stringify(data))
      //on reload la liste des formations
      reloadFormations();
    });
}

//Ajouter un membre du personnel
const addPersonnel = async (ev) => {
  //Récupérer les infos des champs
  const formdata = new FormData(personnelsForm);
  const datas = Object.fromEntries(formdata.entries())
  console.log("formdata en json", JSON.stringify(datas));
  personnelsForm.reset();
  await fetch(`${apiUrl}/personnels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datas)
  })
    .then(response => response.json())
    .then(data => {
      console.log(JSON.stringify(data))
      //on reload la liste des formations
      reloadPersonnels();
    });
}
//--------------------------
// delete
//--------------------------
//Supprimer une formation
const deleteFormation = async (ev) => {
  //Récupérer l'id
  const tr = ev.target.closest("tr");
  const id = tr.dataset.id_formation;

  await fetch(`${apiUrl}/formations/${id}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(data => {
      console.log(JSON.stringify(data))
      //on reload la liste des formations
      reloadFormations();
    });
}

//Supprimer un personnel
const deletePersonnel = async (ev) => {
  //Récupérer l'id
  const tr = ev.target.closest("tr");
  const id = tr.dataset.id_personnels;

  await fetch(`${apiUrl}/personnels/${id}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(data => {
      console.log(JSON.stringify(data))
      //on reload la liste des formations
      reloadPersonnels();
    });
}

//--------------------------
// modify
//--------------------------
const modifyPersonnel = async (ev) => {

  const tr = ev.target.closest("tr");
  const id = tr.dataset.id_personnels;

  console.log(id);
  // récupérer le personnel via un fetch
  const response = await fetch(apiUrl + "/personnels/" + id)
  const data = await response.json();
  console.log(data);

  //transformer les champs td en textbox et ajouter un bouton pour valider la modification
  tr.innerHTML =
    `
    <form id="modifyItemForm">
      <input class="inputModifyPersonel" type="textbox" value="${data[0].fonction_personnels}" placeholder="Fonction"/>
      <input class="inputModifyPersonel" type="textbox" value="${data[0].name_personnels}" placeholder="Nom"/>
      <input class="inputModifyPersonel" type="textbox" value="${data[0].firstname_personnels}" placeholder="Prenom"/>
      <input class="inputModifyPersonel" type="email" value="${data[0].email_personnels}" placeholder="Email"/>
      <input class="inputModifyPersonel" type="textbox" value="${data[0].phone_personnels}" placeholder="Telephone"/>
      <input class="inputModifyPersonel" type="textbox" value="${data[0].local_personnels}" placeholder="Local"/>
      <button>Valider</button>
    </form>
  `;
  const modifyItemForm = document.querySelector("#ModifyItemForm");

  modifyItemForm.addEventListener("submit", handleSubmits);
  //mettre les valeurs dans les input
}
const modifyFormation = (ev) => {
  const tr = ev.target.closest("tr");
  const id = tr.dataset.id_personnels;

  console.log(id);

}
//===================================================================================================
//                                      Event clicks
//===================================================================================================
// A finaliser, mettre les 2 event clics pour que mon handleClicks les gères
tabFormations.addEventListener("click", () => {
  formationsForm.classList.remove("hidden");
  listFormations.classList.remove("hidden");
  personnelsForm.classList.add("hidden");
  listPersonnels.classList.add("hidden");
});

tabPersonnels.addEventListener("click", () => {
  personnelsForm.classList.remove("hidden");
  listPersonnels.classList.remove("hidden");
  formationsForm.classList.add("hidden");
  listFormations.classList.add("hidden");
});

const handleClicks = (ev) => {
  ev.preventDefault();

  if (ev.target.id === "deleteFormation") deleteFormation(ev);
  if (ev.target.id === "deletePersonnel") deletePersonnel(ev);

  if (ev.target.id === "modifyFormation") modifyFormation(ev);
  if (ev.target.id === "modifyPersonnel") modifyPersonnel(ev);
}
//===================================================================================================
//                                      Events
//===================================================================================================
const handleSubmits = (ev) => {
  ev.preventDefault();

  if (ev.target.id === "formationsForm") addFormation();
  if (ev.target.id === "personnelsForm") addPersonnel();
  if (ev.target.id === "modifyItemForm") modif();
}

switchTab.addEventListener("click", handleClicks);
listFormations.addEventListener("click", handleClicks);
listPersonnels.addEventListener("click", handleClicks);

formationsForm.addEventListener("submit", handleSubmits);
personnelsForm.addEventListener("submit", handleSubmits);
//===================================================================================================
//Au démarrage de la page, je charge les informations des différents tableaux
//===================================================================================================
reloadFormations();
reloadPersonnels();
