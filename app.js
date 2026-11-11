(function () {
  "use strict";

  var STORAGE_KEY = "inkopslista.varor";

  var form = document.getElementById("add-form");
  var input = document.getElementById("new-item");
  var list = document.getElementById("list");
  var empty = document.getElementById("empty");
  var counter = document.getElementById("counter");
  var clearBtn = document.getElementById("clear-done");

  var items = load();

  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // Lagringen är inte tillgänglig (t.ex. privat läge). Appen fungerar ändå.
    }
  }

  function newId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function render() {
    // Ej avbockade först, annars i den ordning de lades till.
    var sorted = items.slice().sort(function (a, b) {
      return (a.done === b.done) ? a.created - b.created : (a.done ? 1 : -1);
    });

    list.innerHTML = "";
    sorted.forEach(function (item) {
      var li = document.createElement("li");
      li.className = "item" + (item.done ? " done" : "");

      var check = document.createElement("input");
      check.type = "checkbox";
      check.className = "check";
      check.id = "vara-" + item.id;
      check.checked = item.done;
      check.addEventListener("change", function () {
        toggle(item.id);
      });

      var label = document.createElement("label");
      label.className = "name";
      label.htmlFor = check.id;
      label.textContent = item.name;

      var del = document.createElement("button");
      del.type = "button";
      del.className = "delete";
      del.textContent = "✕";
      del.setAttribute("aria-label", "Ta bort " + item.name);
      del.addEventListener("click", function () {
        remove(item.id);
      });

      li.append(check, label, del);
      list.appendChild(li);
    });

    var doneCount = items.filter(function (i) { return i.done; }).length;
    var left = items.length - doneCount;

    empty.hidden = items.length > 0;
    clearBtn.hidden = doneCount === 0;
    counter.textContent = items.length === 0
      ? "Inget att handla just nu"
      : left === 0
        ? "Allt är handlat! 🎉"
        : left + " kvar av " + items.length;
  }

  function update() {
    save();
    render();
  }

  function add(name) {
    items.push({ id: newId(), name: name, done: false, created: Date.now() });
    update();
  }

  function toggle(id) {
    items.forEach(function (item) {
      if (item.id === id) item.done = !item.done;
    });
    update();
  }

  function remove(id) {
    items = items.filter(function (item) { return item.id !== id; });
    update();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = input.value.trim();
    if (name) add(name);
    input.value = "";
    input.focus();
  });

  clearBtn.addEventListener("click", function () {
    items = items.filter(function (item) { return !item.done; });
    update();
  });

  render();
})();
