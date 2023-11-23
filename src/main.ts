import ByteBuffer from 'bytebuffer';
import { baseReader } from './readerimpl';
import './style.css'

const goBtn = document.getElementById("goBtn") as HTMLButtonElement;
const jsonCrackFrame = document.getElementById("jsoncrackEmbed") as HTMLIFrameElement;
const dropOverlay = document.getElementById("dropOverlay")!;

document.body.ondrop = (e) => {

    e.preventDefault();

    const file = e.dataTransfer?.files?.item(0);
    if(!file) {
        return;
    }

    const fReader = new FileReader();
    fReader.readAsArrayBuffer(file);

    fReader.onload = async () => {
        try {
            dropOverlay.style.display = "none"
            const buf = ByteBuffer.wrap(fReader.result!, "binary", false);
            let data = baseReader(buf);
            goBtn.style.display = "block";

            jsonCrackFrame.contentWindow?.postMessage({
                json: JSON.stringify(data),
            }, "*");

            goBtn.onclick = () => {
                open(`https://jsonhero.io/new?j=${btoa(JSON.stringify(data))}`)
            }            
        } catch(e) {
            console.log(e);
            dropOverlay.style.display = "grid";
            dropOverlay.innerText = "Failed to read file: " + e;
        }
    }

};


document.body.ondragover = (e) => {
    e.preventDefault();
}