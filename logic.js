
document.querySelectorAll(".fh").forEach(cb=>{
  cb.addEventListener("change",()=>{
    const box = cb.parentElement.querySelector(".ageField");
    box.innerHTML = cb.checked ? '<input type="number" placeholder="Age at diagnosis">' : '';
  });
});

document.getElementById("screenForm").addEventListener("submit", e=>{
  e.preventDefault();
  const age = Number(document.getElementById("age").value);
  const sex = document.getElementById("sex").value;
  const smoke = document.getElementById("smoke").value;
  const fam = [...document.querySelectorAll(".fh:checked")].map(x=>x.value);

  let out = [];
  if(sex==="Female" && age>=40) out.push("Breast Cancer Screening");
  if(sex==="Female" && age>=21) out.push("Cervical Cancer Screening");
  if(sex==="Male" && age>=50) out.push("Prostate Cancer Screening");
  if(age>=45) out.push("Colon Cancer Screening");
  if(age>=50 && smoke==="Yes") out.push("Lung Cancer Screening");
  if(fam.some(f=>["breast","ovarian","pancreatic","prostate","male_breast"].includes(f)))
    if(!out.includes("Breast Cancer Screening")) out.push("Breast Cancer Screening");

  if(out.length===0) out=[
    "Breast Cancer Screening",
    "Cervical Cancer Screening",
    "Prostate Cancer Screening",
    "Colon Cancer Screening",
    "Lung Cancer Screening"
  ];

  document.getElementById("output").style.display="block";
  document.getElementById("output").innerHTML =
    "<h3>Based on your personal information, you should consider:</h3><ul>"+
    out.map(o=>"<li>"+o+"</li>").join("")+"</ul>";
});
