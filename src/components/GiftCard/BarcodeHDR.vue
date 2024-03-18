<template>
  <div class="row">
    <video ref="video" 
      muted
      autoplay
      playsinline
      class="col-12 bg-grey-4">
  
    </video>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { FFmpeg, FFmpegConfigurationGPLExtended } from '@diffusion-studio/ffmpeg-js';
import BwipJs from 'bwip-js';

const video = ref<HTMLVideoElement | null>(null)

const message = ref('unstarted')

const createBarcode = async () => {
  let canvas = document.createElement('canvas');
  var ctx = canvas.getContext("2d");
  if (ctx == null) return
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await BwipJs.toCanvas(canvas, {
    bcid: 'code128',
    text: '123456789',
    scale: 3,
    height: 10,
    includetext: true,
    textxalign: 'center',
    backgroundcolor: '#FFFFFF',
    padding: 5
  })
  const canvasURL = canvas.toDataURL('image/jpeg')
  message.value = 'loading ffmpeg'


  const ffmpeg = new FFmpeg<FFmpegConfigurationGPLExtended>({
    config: 'gpl-extended',
  });
  ffmpeg.whenReady(async () => {
    message.value = 'ready'
    await ffmpeg.writeFile('input.jpg', canvasURL)
    message.value = 'wrote'

    await ffmpeg.exec([
      '-framerate', '1',
      '-loop', '1',
      '-i', 'input.jpg',
      '-t', '5',
      '-c:v', 'libx264',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-pix_fmt', 'yuv420p',
      '-color_primaries', 'bt2020',
      '-color_trc', 'smpte2084',
      '-colorspace', 'bt2020nc',
      '-metadata:s:v:0', 'master-display="G(8500,39850)B(6550,2300)R(35400,14600)WP(15635,16450)L(50000000,10)"',
      // '-x265-params', 'hdr-opt=1', // HDR options for x265 codec
      'output.mp4'
    ]);

    message.value = 'ran'

    const result: Uint8Array = ffmpeg.readFile('output.mp4')
    const videoURL = URL.createObjectURL(new Blob([result.buffer], { type: 'video/mp4' }))
    ffmpeg.deleteFile('input.jpg');
    ffmpeg.deleteFile('output.mp4');
    if (video.value == null) return
    video.value.src = videoURL;
  });
}

onMounted(() => {
  createBarcode();
})
</script>