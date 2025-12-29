
document.getElementById("screenForm").addEventListener("submit", e => {
  e.preventDefault();
  const age = Number(document.getElementById("age").value);
  const sex = document.getElementById("sex").value;
  const smoke = document.getElementById("smoke").value;
  let results = [];
  if (sex === "Female" && age >= 40) results.push("Breast Cancer Screening");
  if (sex === "Female" && age >= 21) results.push("Cervical Cancer Screening");
  if (sex === "Male" && age >= 50) results.push("Prostate Cancer Screening");
  if (age >= 45) results.push("Colon Cancer Screening");
  if (age >= 50 && smoke === "Yes") results.push("Lung Cancer Screening");
  if (results.length === 0) {
    results = [
      "Breast Cancer Screening",
      "Cervical Cancer Screening",
      "Prostate Cancer Screening",
      "Colon Cancer Screening",
      "Lung Cancer Screening"
    ];
  }
  document.getElementById("output").style.display = "block";
  document.getElementById("output").innerHTML = `
    <h3>Based on your personal information, you should consider:</h3>
    <ul>${results.map(r => `<li>${r}</li>`).join("")}</ul>
    <p>(Logic is preliminary and for awareness only.)</p>
  `;
});
