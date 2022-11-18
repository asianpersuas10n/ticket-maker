//get with job regarding setting up a button for apartments
const notes = document.querySelector("#notes");
const confirm = document.querySelector("#confirm");
const reset = document.querySelector("#reset");
const radioStillDown = document.querySelector("#radioStillDown");
const outageMode = document.querySelector("#outageMode");
const inputs = document.getElementsByTagName("input");
const ubiquitiButton = document.querySelector("#ubiquiti");
const telradButton = document.querySelector("#telrad");
const mimosaButton = document.querySelector("#mimosa");
const cambiumButton = document.querySelector("#cambium");
const taranaButton = document.querySelector("#tarana");
const clipboardConfirm = document.getElementById("clipboardConfirm");
let currentRadio;

function findLable(e) {
  let idVal = e.id;
  labels = document.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor == idVal) return labels[i].innerHTML;
  }
}

function checklistCreator() {
  let troubleList = "Troubleshooting Checklist:\n\n";
  let currentInput;
  const checklist = document.getElementById("checklist");
  for (let j = 0; j < 19; j++) {
    currentInput = checklist.querySelectorAll("input")[j];
    if (currentInput.checked) {
      troubleList += `- ${findLable(currentInput)}\n`;
    }
  }
  return troubleList;
}

function createMessage() {
  let info = `Complaint: ${complaint.value}\n\n`;
  let currentLabel;
  let currentInput;
  let remoteSignal;
  let currentId;
  for (let m = 0; m < currentRadio.querySelectorAll("input").length; m++) {
    currentInput = currentRadio.querySelectorAll("input")[m];
    currentId = currentInput.id
    if (currentInput.value) {
      if(currentInput.id === "remoteSignal") {
        remoteSignal = currentInput.value;
        continue;
      } else if (currentId.includes("Chains")) {
        if(currentId.includes("remote")) {
        info += `Remote Signal: -${remoteSignal} Δ${currentInput.value}\n`
        continue;
        } else {
          info += ` Δ${currentInput.value}\n`
          continue;
        }
      }
      currentLabel = findLable(currentInput)
      info += `${currentLabel}${(currentId.includes("signal") ||
      currentId.includes("Signal") ||
      currentId.includes("Noise")) ? " -" : " " }${currentInput.value}`;
      switch(currentLabel) {
        case "Ping:":
          info += " ms"
          break;
        case "Bandwidth:":
          info += " mbps"
          break;
        case "Pathloss:":
          info += "dB"
          break;
        case "Radio Frequency:":
        case "Router Frequency:": 
          info += " MHz"
          break;
        default:
          break;
      }
	if(currentLabel === "Local Signal:") {
       continue;
      }
      info += "\n"
    }
  }
  info += "\n";
  const checklist = checklistCreator();
  const notesValue = "\nNotes:\n\n" + notes.value;
  if (radioStillDown.checked || outageMode.checked) {
    info = `Complaint: ${complaint.value}\n\n`;
  }
  let radioName = currentRadio.id;
  radioName = radioName.split("");
  radioName[0] = radioName[0].toUpperCase();
  radioName = radioName.join("");
  const completeMessage = `${radioName.replace("Radio", "")}\n\n` + info + checklist + notesValue;
  document.getElementById("clipboardConfirm").style.display = "flex";
  setTimeout(
    () => (document.getElementById("clipboardConfirm").style.display = "none"),
    5000
  );
  return navigator.clipboard.writeText(completeMessage);
}

const resetPage = () => {
  for (let k = 0; k < inputs.length; k++) {
    inputs[k].value = "";
    if (inputs[k].getAttribute("type") === "checkbox") {
      if (inputs[k].id === "outageMode") {
        continue;
      }
      inputs[k].checked = false;
    }
  }
  document.querySelector("textarea").value = "";
  disable();
};

function disable() {
  const disableBool = radioStillDown.checked || outageMode.checked;
  for (let l = 0; l < inputs.length; l++) {
    if (l === 0) {
      continue;
    }
    if (inputs[l].getAttribute("type") === "text") {
      inputs[l].disabled = disableBool;
    }
  }
}

function showInfoContainers(radio, e = {target: {id: "ubiquiti"}}) {
  const radios = document.querySelectorAll(".radioInfo");
  const radioButtons = document.querySelectorAll("button");
  let currentColor;
  for (let n = 0; n < radios.length; n++) {
    radios[n].style.display = "none";
  }
  currentRadio = document.getElementById(radio);
  currentRadio.style.display = "grid";
  switch(e.target.id) {
    case "ubiquiti":
      currentColor = "#2a81fa";
      break;
    case "telrad":
      currentColor = "#bbc3fa";
      break;
    case "mimosa":
      currentColor = "#fa8e1b";
      break;
    case "cambium":
      currentColor = "#4c28fc";
      break;
    case "tarana":
      currentColor = "#239664";
      break;
    default:
      currentColor = "#212121";
      break;
  }
  document.documentElement.style.setProperty("--color", currentColor)
  for (let b = 0; b < radioButtons.length; b++) {
    if (document.getElementById(radioButtons[b].id).classList.contains("selected")) {
      document.getElementById(radioButtons[b].id).classList.toggle("selected")
    }
    if(radioButtons[b].id === e.target.id) {
      document.getElementById(radioButtons[b].id).classList.toggle("selected");
      continue;
    }  
  }
}

clipboardConfirm.addEventListener("click", () => {
  clipboardConfirm.style.display = "none";
});
confirm.addEventListener("click", createMessage);
reset.addEventListener("click", resetPage);
radioStillDown.addEventListener("click", disable);
outageMode.addEventListener("click", disable);
ubiquitiButton.addEventListener("click", (e) =>
  showInfoContainers("ubiquitiRadio", e)
);
telradButton.addEventListener("click", (e) => showInfoContainers("telradRadio", e));
mimosaButton.addEventListener("click", (e) => showInfoContainers("mimosaRadio", e));
cambiumButton.addEventListener("click", (e) =>
  showInfoContainers("cambiumRadio", e)
);
taranaButton.addEventListener("click", (e) => showInfoContainers("taranaRadio", e));
showInfoContainers("ubiquitiRadio")