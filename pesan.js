(function () {
  // Nomor WhatsApp tujuan pesanan (format 62..., tanpa tanda + dan spasi)
  var NOMOR_WA = "628898326";

  // Folder tempat foto menu
  var FOLDER_FOTO = "Image/menu/";

  var MENU = [
    { nama: "Butterscoth", kategori: "kopi", foto: "butterscoth.jpg", deskripsi: "Kopi susu dengan sirup butterscotch yang manis dan gurih.",
      varian: [{ label: "S", harga: 18000 }, { label: "M", harga: 25000 }, { label: "L", harga: 35000 }] },
    { nama: "Espresso", kategori: "kopi", foto: "espresso.jpg", deskripsi: "Satu shot kopi pekat tanpa campuran.",
      varian: [{ label: "Single", harga: 15000 }] },
    { nama: "Americano", kategori: "kopi", foto: "americano.jpg", deskripsi: "Espresso dengan air, ringan dan segar.",
      varian: [{ label: "Panas", harga: 18000 }, { label: "Dingin", harga: 20000 }] },
    { nama: "Kopi Susu Gula Aren", kategori: "kopi", foto: "kopi-susu-gula-aren.jpg", deskripsi: "Espresso, susu, dan gula aren, favorit banyak orang.",
      varian: [{ label: "Dingin", harga: 20000 }] },
    { nama: "Cafe Latte", kategori: "kopi", foto: "cafe-latte.jpg", deskripsi: "Espresso dengan susu yang lembut.",
      varian: [{ label: "Panas", harga: 25000 }, { label: "Dingin", harga: 27000 }] },
    { nama: "Cappuccino", kategori: "kopi", foto: "cappuccino.jpg", deskripsi: "Espresso, susu, dan busa susu tebal.",
      varian: [{ label: "Panas", harga: 25000 }, { label: "Dingin", harga: 27000 }] },
    { nama: "Caramel Macchiato", kategori: "kopi", foto: "caramel-macchiato.jpg", deskripsi: "Espresso, susu, dan saus karamel.",
      varian: [{ label: "Panas", harga: 28000 }, { label: "Dingin", harga: 30000 }] },
    { nama: "Mochaccino", kategori: "kopi", foto: "mochaccino.jpg", deskripsi: "Perpaduan espresso, coklat, dan susu.",
      varian: [{ label: "Panas", harga: 28000 }, { label: "Dingin", harga: 30000 }] },

    { nama: "Matcha Latte", kategori: "nonkopi", foto: "matcha-latte.jpg", deskripsi: "Matcha dengan susu, tanpa kopi.",
      varian: [{ label: "Panas", harga: 26000 }, { label: "Dingin", harga: 28000 }] },
    { nama: "Coklat", kategori: "nonkopi", foto: "coklat.jpg", deskripsi: "Minuman coklat pekat dan creamy.",
      varian: [{ label: "Panas", harga: 22000 }, { label: "Dingin", harga: 24000 }] },
    { nama: "Lemon Tea", kategori: "nonkopi", foto: "lemon-tea.jpg", deskripsi: "Teh dengan perasan lemon, segar.",
      varian: [{ label: "Dingin", harga: 15000 }] },

    { nama: "Croissant", kategori: "makanan", foto: "croissant.jpg", deskripsi: "Roti berlapis yang renyah, teman minum kopi.",
      varian: [{ label: "Satuan", harga: 18000 }] },
    { nama: "Roti Bakar Coklat Keju", kategori: "makanan", foto: "roti-bakar-coklat-keju.jpg", deskripsi: "Roti bakar dengan isian coklat dan keju.",
      varian: [{ label: "Satuan", harga: 17000 }] },
    { nama: "Kentang Goreng", kategori: "makanan", foto: "kentang-goreng.jpg", deskripsi: "Kentang goreng renyah untuk dimakan bersama teman.",
      varian: [{ label: "Porsi", harga: 15000 }] }
  ];

  var daftar = document.getElementById("daftar-menu");
  var filter = document.getElementById("filter-menu");
  var isiKeranjang = document.getElementById("isi-keranjang");
  var totalEl = document.getElementById("total");
  var badge = document.getElementById("badge");
  var fab = document.getElementById("fab");
  var formPesan = document.getElementById("form-pesan");
  var kotakAlamat = document.getElementById("kotak-alamat");
  var galat = document.getElementById("galat");
  var formKontak = document.getElementById("form-kontak");

  var keranjang = []; // { id, nama, label, harga, jumlah }

  function rp(n) {
    return "Rp" + n.toLocaleString("id-ID");
  }

  /* ---------- MENU ---------- */
  function renderMenu(kat) {
    var html = "";
    MENU.forEach(function (m) {
      if (kat !== "semua" && m.kategori !== kat) return;
      html += '<article class="menu-kartu">';
      if (m.foto) {
        html += '<img class="menu-foto" src="' + FOLDER_FOTO + m.foto + '" alt="' + m.nama + '" loading="lazy" ' +
          'style="width:100%;height:190px;object-fit:cover;border-radius:12px;display:block;margin-bottom:12px" ' +
          'onerror="this.style.display=\'none\'">';
      }
      html += '<h3>' + m.nama + '</h3><p class="desk">' + m.deskripsi + "</p>";
      m.varian.forEach(function (v) {
        html += '<div class="varian"><span>' + v.label + ' &middot; <span class="harga">' + rp(v.harga) + "</span></span>" +
          '<button type="button" class="btn-tambah" data-nama="' + m.nama + '" data-label="' + v.label +
          '" data-harga="' + v.harga + '">Tambah</button></div>';
      });
      html += "</article>";
    });
    daftar.innerHTML = html;
  }

  filter.addEventListener("click", function (e) {
    var btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filter.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("aktif"); });
    btn.classList.add("aktif");
    renderMenu(btn.getAttribute("data-kat"));
  });

  daftar.addEventListener("click", function (e) {
    var btn = e.target.closest(".btn-tambah");
    if (!btn) return;
    tambah(btn.dataset.nama, btn.dataset.label, parseInt(btn.dataset.harga, 10));
    btn.textContent = "Ditambahkan";
    btn.classList.add("ok");
    setTimeout(function () {
      btn.textContent = "Tambah";
      btn.classList.remove("ok");
    }, 800);
  });

  /* ---------- KERANJANG ---------- */
  function tambah(nama, label, harga) {
    var id = nama + "|" + label;
    var ada = keranjang.find(function (i) { return i.id === id; });
    if (ada) ada.jumlah += 1;
    else keranjang.push({ id: id, nama: nama, label: label, harga: harga, jumlah: 1 });
    renderKeranjang();
  }

  function renderKeranjang() {
    var total = 0;
    var banyak = 0;
    if (keranjang.length === 0) {
      isiKeranjang.innerHTML = '<li class="kosong">Keranjang masih kosong. Pilih menu terlebih dahulu.</li>';
    } else {
      var html = "";
      keranjang.forEach(function (i) {
        total += i.harga * i.jumlah;
        banyak += i.jumlah;
        html += '<li><div class="nama">' + i.nama + "<small>" + i.label + " &middot; " + rp(i.harga) + "</small></div>" +
          '<div class="jumlah"><button type="button" data-aksi="kurang" data-id="' + i.id + '">-</button>' +
          "<span>" + i.jumlah + "</span>" +
          '<button type="button" data-aksi="tambah" data-id="' + i.id + '">+</button></div>' +
          "<strong>" + rp(i.harga * i.jumlah) + "</strong></li>";
      });
      isiKeranjang.innerHTML = html;
    }
    totalEl.textContent = rp(total);
    badge.textContent = banyak;
    fab.classList.toggle("sembunyi", banyak === 0);
  }

  isiKeranjang.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-aksi]");
    if (!btn) return;
    var id = btn.getAttribute("data-id");
    var item = keranjang.find(function (i) { return i.id === id; });
    if (!item) return;
    if (btn.getAttribute("data-aksi") === "tambah") item.jumlah += 1;
    else item.jumlah -= 1;
    keranjang = keranjang.filter(function (i) { return i.jumlah > 0; });
    renderKeranjang();
  });

  /* ---------- FORM PESAN ---------- */
  function metodeDipilih() {
    return formPesan.querySelector('input[name="metode"]:checked').value;
  }

  formPesan.addEventListener("change", function () {
    kotakAlamat.classList.toggle("sembunyi", metodeDipilih() !== "Diantar");
  });

  formPesan.addEventListener("submit", function (e) {
    e.preventDefault();
    galat.textContent = "";

    var nama = document.getElementById("p-nama").value.trim();
    var wa = document.getElementById("p-wa").value.trim();
    var alamat = document.getElementById("p-alamat").value.trim();
    var catatan = document.getElementById("p-catatan").value.trim();
    var metode = metodeDipilih();

    if (keranjang.length === 0) { galat.textContent = "Keranjang masih kosong. Tambahkan menu dahulu."; return; }
    if (!nama) { galat.textContent = "Nama wajib diisi."; return; }
    if (!wa) { galat.textContent = "Nomor WhatsApp wajib diisi."; return; }
    if (metode === "Diantar" && !alamat) { galat.textContent = "Alamat pengantaran wajib diisi."; return; }

    var total = 0;
    var baris = ["Halo Intan Coffe, saya mau pesan:", ""];
    keranjang.forEach(function (i, n) {
      total += i.harga * i.jumlah;
      baris.push((n + 1) + ". " + i.nama + " (" + i.label + ") x" + i.jumlah + " = " + rp(i.harga * i.jumlah));
    });
    baris.push("");
    baris.push("Total: " + rp(total));
    baris.push("");
    baris.push("Nama: " + nama);
    baris.push("Nomor WhatsApp: " + wa);
    baris.push("Cara menerima: " + metode);
    if (metode === "Diantar") baris.push("Alamat: " + alamat);
    if (catatan) baris.push("Catatan: " + catatan);

    var url = "https://wa.me/" + NOMOR_WA + "?text=" + encodeURIComponent(baris.join("\n"));
    window.open(url, "_blank", "noopener");
  });

  /* ---------- FORM KONTAK ---------- */
  formKontak.addEventListener("submit", function (e) {
    e.preventDefault();
    var nama = document.getElementById("nama").value.trim();
    var wa = document.getElementById("wa").value.trim();
    var pesan = document.getElementById("pesan-kontak").value.trim();
    var teks = "Halo Intan Coffe,\n" + (pesan ? pesan + "\n\n" : "\n") + "Nama: " + nama + "\nNomor WhatsApp: " + wa;
    window.open("https://wa.me/" + NOMOR_WA + "?text=" + encodeURIComponent(teks), "_blank", "noopener");
  });

  /* ---------- MULAI ---------- */
  renderMenu("semua");
  renderKeranjang();
})();