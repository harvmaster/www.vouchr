import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import BwipJs from 'bwip-js';
import { createBlob, video } from './BarcodeHDR.vue';

export const createBarcode = async () => {
let canvas = document.createElement('canvas');
await BwipJs.toCanvas(canvas, {
bcid: 'code128',
text: '123456789',
scale: 3,
height: 10,
includetext: true,
textxalign: 'center'
});
const canvasURL = canvas.toDataURL('image/png');
const img = createBlob(canvasURL);

const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.5/dist/esm';
const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/esm";
const ffmpeg = new FFmpeg();

ffmpeg.on('log', ({ message }: { message: string; }) => {
console.log(message);
});

const ffmpegURLS = {
coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
// workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
};
console.log(ffmpegURLS);
// toBlobURL is used to bypass CORS issue, urls with the same
// domain can be used directly.
await ffmpeg.load({
// coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
// wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
// workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
coreURL: ffmpegURLS.coreURL,
wasmURL: ffmpegURLS.wasmURL,
classWorkerURL: ffmpegURLS.workerURL
});

console.log('loaded');
// await ffmpeg.load({
//   coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
//   wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
//   // workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
// })
// Read the image file as a binary blob
const imageBlob = img; // get this from file input or other sources


// Write the image to ffmpeg FS (filesystem)
ffmpeg.FS('writeFile', 'input.jpg', await fetchFile(imageBlob));
console.log('wrote');


// Run ffmpeg command to convert the image to video
await ffmpeg.run('-loop', '1', '-i', 'input.jpg', '-t', '5', '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-color_primaries', 'bt2020', '-color_trc', 'smpte2084', '-colorspace', 'bt2020nc', '-metadata:s:v:0', 'master-display="G(8500,39850)B(6550,2300)R(35400,14600)WP(15635,16450)L(50000000,10)"', 'output.webm');
console.log('ran');

// Read the output video
const output = ffmpeg.FS('readFile', 'output.webm');
console.log('read');

// Convert the output to a Blob
const videoBlob = new Blob([output.buffer], { type: 'video/webm' });

// Create URL for the video
const videoURL = URL.createObjectURL(videoBlob);
console.log('created');
// Use this URL as the source for a video tag
// <video src={videoURL} controls></video>
video.value!.src = videoURL;
};
