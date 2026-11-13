(function () {
  var navbar = document.getElementById("navbar");
  var menu = document.getElementById("menu");
  var burger = document.getElementById("burger");
  var temaBtn = document.getElementById("tema");
  var root = document.documentElement;

  /* ---------- Navbar saat scroll ---------- */
  function cekScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", cekScroll, { passive: true });
  cekScroll();

  /* ---------- Menu HP ---------- */
  function tutupMenu() {
    menu.classList.remove("buka");
    navbar.classList.remove("buka-menu");
    burger.setAttribute("aria-expanded", "false");
  }
  burger.addEventListener("click", function () {
    var buka = menu.classList.toggle("buka");
    navbar.classList.toggle("buka-menu", buka);
    burger.setAttribute("aria-expanded", buka ? "true" : "false");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") tutupMenu();
  });

  /* ---------- Animasi muncul saat scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var obsReveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("tampil");
          obsReveal.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { obsReveal.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("tampil"); });
  }

  /* ---------- Penanda menu aktif ---------- */
  var links = menu.querySelectorAll("a");
  var sections = [];
  links.forEach(function (a) {
    var s = document.querySelector(a.getAttribute("href"));
    if (s) sections.push({ link: a, el: s });
  });
  function cekAktif() {
    var posisi = window.scrollY + 140;
    var aktif = null;
    sections.forEach(function (s) {
      if (s.el.offsetTop <= posisi) aktif = s.link;
    });
    links.forEach(function (a) { a.classList.toggle("aktif", a === aktif); });
  }
  window.addEventListener("scroll", cekAktif, { passive: true });
  cekAktif();

  /* ---------- Mode gelap ---------- */
  function labelTema() {
    temaBtn.textContent = root.getAttribute("data-tema") === "gelap" ? "Terang" : "Gelap";
  }
  temaBtn.addEventListener("click", function () {
    var gelap = root.getAttribute("data-tema") === "gelap";
    if (gelap) root.removeAttribute("data-tema");
    else root.setAttribute("data-tema", "gelap");
    try { localStorage.setItem("tema", gelap ? "terang" : "gelap"); } catch (e) {}
    labelTema();
  });
  labelTema();
})();