const $$ = require('jquery')
const fs = require('fs')
const filename = 'contacts'
let sno = 0
let $ = document.querySelector
let contacts = []

document.querySelector("#add-to-list").addEventListener("click", (event) => {
  let email = $$("#Email").val()
  var name = $$("#Name").val()

  let contact = { Name: name, Email: email}
  contacts.push(contact)

  // fs.appendFile('contacts', name + ',' + email + '\n')
  //fs.appendFile('message.txt', name + ',' + email + '\n', (err) => {
  fs.writeFile('contacts', JSON.stringify(contacts), (err) => {
    if (err) throw err;
    console.log(`The ${name} and ${email} was appended to file!`);
  });

  addEntry(contact.Name, contact.Email)
});

document.querySelector("#DisplayContacts").addEventListener("click", (event) => {
  let cons = document.querySelector('tbody');
  cons.innerHTML = `<tr><th>No.</th><th>Name</th><th>Email</th></tr>`;
  sno = 0
  loadAndDisplayContacts()

})

function addEntry(name, email) {
  if (name && email) {
    sno++
    let tr = document.createElement("tr");
    tr.innerHTML = `<td>${sno}</td><td>${name}</td><td>${email}</td>`
    document.querySelector('tbody').appendChild(tr)
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
    fs.writeFile(filename, '', (err) => {
      if (err)
         console.log(err)
    })
  }
}

loadAndDisplayContacts()
