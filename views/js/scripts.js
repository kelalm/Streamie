function passEditId(id) {
  console.log("Passing edit Id: " + id);
  document.getElementsByName("applyChangesButton")[0].setAttribute("id", id);
}
