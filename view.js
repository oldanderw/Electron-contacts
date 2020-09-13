const fs = require('fs')
const {ipcRenderer} = require('electron')
const filename = 'contacts.json'
let sno = 0
let contacts = []

document.querySelector("#add-to-list").addEventListener("click", (event) => {
  let email = document.querySelector("#Email").value
  var name = document.querySelector("#Name").value
  let contact = { Name: name, Email: email}
  contacts.push(contact)

  // fs.appendFile('contacts', name + ',' + email + '\n')
  //fs.appendFile('message.txt', name + ',' + email + '\n', (err) => {
  fs.writeFile('contacts.json', JSON.stringify(contacts), (err) => {
    if (err) throw err;
    console.log(`The ${name} and ${email} was appended to file!`);
  });

  addEntry(contact.Name, contact.Email)
});
 function Refesh(){
   let cons = document.querySelector('tbody');
   cons.innerHTML = `<tr><th>No.</th><th>Name</th><th>Email</th></tr>`;
   sno = 0
   fs.unlink(filename, (err) => {
      if (err) {
        console.error(err)
      }
    });
   fs.writeFile(filename, '', (err) => {
    if (err)
       console.log(err)
  })

 }
document.querySelector("#clear").addEventListener("click", (event) => {
  Refesh()
});
function addEntry(name, email) {
  if (name && email) {
    sno++
    let tr = document.createElement("tr");
    tr.innerHTML = `<td>${sno}</td><td>${name}</td><td>${email}</td>`
    document.querySelector('tbody').appendChild(tr)
    document.querySelector("#Email").value = ""
    document.querySelector("#Name").value = ""
  }
}

function loadAndDisplayContacts() {

  //Check if file exists
  if (fs.existsSync(filename)) {
    contacts = JSON.parse(fs.readFileSync(filename, 'utf8'))//.split('\n')


    contacts.forEach((contact, index) => {
      addEntry(contact.Name, contact.Email)
    })

  } else {
    console.log('File dont Exist. Creating new file.')
    NewFile()
  }
}
ipcRenderer.on('fileData', (event, data) => {
  Refresh()
  //going to add a way to add data and write it to the contacts.json file
})

loadAndDisplayContacts()
