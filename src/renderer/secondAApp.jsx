const header=`
<nav  class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div id="logoheader">
            <img src="./src/assets/logo.png" alt="a building" width="40" class="m-1" />
            <p class="navbar-brand m-auto">L9itLouage</p>
            </div>
        </nav>`;

const footer=`
<br />
      <footer>
      <p class="text-center fs-4 text-dark border-top">L9itLouage © ${currentYear()}, Inc</p>
    </footer>`;

const root=document.getElementById("root")
root.innerHTML=`${header}
<section ">
  <div id="entree" >
    <img src="./src/assets/qrIcon.png" style="width:80px" alt="Image 1">
    <p>entree</p>
  </div>
  <div id="sortie" >
    <img src="./src/assets/qrIcon.png" style="width:80px" alt="Image 2">
    <p>sortie</p>
  </div>
</section>${footer}
`

const entree=document.getElementById("entree")
const sortie=document.getElementById("sortie")

const load=(e_s)=>{return`
<div class="container">
		<h1>${e_s}</h1>
		<div class="section">
			<div id="my-qr-reader">
			</div>
		</div>
	</div>
`;}

entree.addEventListener("click",()=>{

  root.innerHTML=header+load(`دخول`)+footer
  scanQrcode('scan-entree')
  console.log('entree is clicked')
})

sortie.addEventListener("click",()=>{
  root.innerHTML=header+load(`خروج`)+footer
  scanQrcode('scan-sortie')
  console.log("sortie is clicked")
})
console.log("working")

function currentYear(){
  return new Date().getFullYear();
}
const scanQrcode=(route)=>{
  // Make sure that Axios is included in your project

function domReady(fn) {
  if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
  ) {
      setTimeout(fn, 1000);
  } else {
      document.addEventListener("DOMContentLoaded", fn);
  }
}

domReady(function () {

  // If found your QR code
  function onScanSuccess(decodeText, decodeResult) {
      alert("Your QR code is: " + decodeText);
      
      // Send the QR code value to main process electron
      window.electron.ipcRenderer.send(route,decodeText)
      
  }

  let htmlscanner = new Html5QrcodeScanner(
      "my-qr-reader",
      { fps: 10, qrbos: 250 }
  );
  htmlscanner.render(onScanSuccess);
});

}
