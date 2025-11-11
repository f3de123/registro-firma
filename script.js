// ===== Genera token + QR =====
function generaToken() {
  const rand = Math.random().toString(36).substring(2, 10);
  const ts = Date.now().toString(36);
  return `${rand}-${ts}`;
}

function generaQr(url) {
  const qrContainer = document.getElementById("qrContainer");
  qrContainer.innerHTML = "";
  const canvas = document.createElement("canvas");
  QRCode.toCanvas(canvas, url, { width: 220, margin: 2 });
  qrContainer.appendChild(canvas);

  document.getElementById("istruzioni").classList.remove("nascosto");
  document.getElementById("linkRegistrazione").innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
}

document.getElementById("generaQR").addEventListener("click", () => {
  const email = document.getElementById("emailInput").value.trim().toLowerCase();
  if (!email.endsWith("@ittsrimini.edu.it")) {
    alert("L'email deve terminare con @ittsrimini.edu.it");
    return;
  }
  const token = generaToken();
  const base = window.location.pathname.replace(/index\.html$/, '');
  const url = `${window.location.origin}${base}registra.html?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
  generaQr(url);
});

// ===== Esportazioni =====
function getArchivio() {
  return JSON.parse(localStorage.getItem("registroFirme") || "[]");
}

// CSV
document.getElementById("exportCsv").addEventListener("click", () => {
  const data = getArchivio();
  if (!data.length) {
    document.getElementById("exportMessage").textContent = "Registro vuoto.";
    return;
  }
  const rows = [["nome", "cognome", "email", "data"]];
  data.forEach(r => rows.push([r.nome, r.cognome, r.email, r.data]));
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "registro_firme.csv";
  a.click();
  document.getElementById("exportMessage").textContent = "CSV scaricato.";
});

// PDF
document.getElementById("exportPdf").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const data = getArchivio();
  if (!data.length) {
    document.getElementById("exportMessage").textContent = "Registro vuoto.";
    return;
  }
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = 40;
  data.forEach(r => {
    doc.text(`Nome: ${r.nome}   Cognome: ${r.cognome}`, 40, y);
    y += 20;
    doc.text(`Email: ${r.email}   Data: ${r.data}`, 40, y);
    y += 40;
  });
  doc.save("registro_firme.pdf");
  document.getElementById("exportMessage").textContent = "PDF generato.";
});
