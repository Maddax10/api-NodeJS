
const body = document.querySelector("body");
const formationsForm = document.querySelector("#formationsForm");
const personnelsForm = document.querySelector("#personnelsForm");
const listFormations = document.querySelector("#listFormations");
const listPersonnels = document.querySelector("#listPersonnels");

const apiUrl = "http://localhost:3000/api";

const tabFormations = document.querySelector("#tabFormations");
const tabPersonnels = document.querySelector("#tabPersonnels");

//===================================================================================================
//                                      Event clicks
//===================================================================================================
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
//===================================================================================================
//                                      FETCHs
//===================================================================================================

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
          `<tr>
            <td>${element.nom_formation}</td>
            <td>${element.date_formation}</td>
            <td>${element.local_formation}</td>
            <td>${element.id_formateur_formation}</td>
            <td>
              <span class="modifyItem" id="modifyItem">modifier</span>
              <span class="deleteItem" id="deleteItem">supprimer</span>
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
          <span class="modifyItem" id="modifyItem">modifier</span>
          <span class="deleteItem" id="deleteItem">supprimer</span>
        </td>
      </tr>`;

      });
    });
}

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

//Ajouter un membre du personnel
const deleteFormation = async () => {
  //Récupérer l'id
  const id = ev.target.closest('tr').dataset
  const formdata = new FormData(formationsForm);
  const datas = Object.fromEntries(formdata.entries())
  console.log("formdata en json", JSON.stringify(datas));
  formationsForm.reset();
  await fetch(`${apiUrl}/formations`, {
    method: "DELETE",
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
//---------------------------------------------------------------------------------------------------

//===================================================================================================
//                                      Event submits
//===================================================================================================
const handleSubmits = (ev) => {
  ev.preventDefault();

  if (ev.target.id === "formationsForm") addFormation();
  if (ev.target.id === "personnelsForm") addPersonnel();
}

const handleClicks = (ev) => {
  ev.preventDefault();

  if (ev.target.id === "formationsForm") deleteFormation();
}

body.addEventListener("submit", handleSubmits);
body.addEventListener("click", handleClicks);
//---------------------------------------------------------------------------------------------------



//Au démarrage de la page, je charge les informations des différents tableaux
reloadFormations();
reloadPersonnels();
