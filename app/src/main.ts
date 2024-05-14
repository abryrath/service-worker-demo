import './style.css'

const testBtn = document.querySelector('[data-test]');
if (testBtn) {
  testBtn.addEventListener('click', async () => {
    const resp = await window.fetch('http://localhost:3000/')
    console.log(await resp.json());
  })
}


var originalFetch = window.fetch;

const switchVideo = (body) => {
  const { onOffDemoItemBlocks } = body;
  if (!onOffDemoItemBlocks) return body;

  // const targetBlockId = 73417; // JLO
  const targetBlockId = 126624; // Anyma
  const replacementAssets = { // ED assets
    dolbyOffPortraitAsset: {
      hlsVideoUrl: "https://experience-media.dolby.com/Dolby.com/20231227/Love_More/Ed_Sheeran/SDRS/Portrait/unencrypted/hls/LM_ES-Destination_SDR-9x16_A-Binaural_vs_Stereo_SDRS_manifest-priority.m3u8",
      mpegDashVideoUrl: "https://experience-media.dolby.com/Dolby.com/20231227/Love_More/Ed_Sheeran/SDRS/Portrait/unencrypted/dash/LM_ES-Destination_SDR-9x16_A-Binaural_vs_Stereo_SDRS_manifest-priority.mpd"
    },
    dolbyOffLandscapeAsset: {
      hlsVideoUrl: "https://experience-media.dolby.com/Dolby.com/20231227/Love_More/Ed_Sheeran/SDRS/Landscape/unencrypted/hls/LM_ES-Destination_SDR_A-Binaural_vs_Stereo_SDRS_manifest-priority.m3u8",
      mpegDashVideoUrl: "https://experience-media.dolby.com/Dolby.com/20231227/Love_More/Ed_Sheeran/SDRS/Landscape/unencrypted/dash/LM_ES-Destination_SDR_A-Binaural_vs_Stereo_SDRS_manifest-priority.mpd"
    }
  };

  // Access existing data for replacement target
  console.log(onOffDemoItemBlocks);
  const targetIndex = onOffDemoItemBlocks.findIndex(b => b.contentLink.id === targetBlockId);
  console.log('targetIndex: ', targetIndex);

  const newBlocksData = onOffDemoItemBlocks;
  
  // Setup off as default
  newBlocksData[targetIndex].contentLink.expanded.dolbyOffLandscapeAsset = newBlocksData[targetIndex].contentLink.expanded.dolbyOffLandscapeAsset || newBlocksData[targetIndex].contentLink.expanded.dolbyOnLandscapeAsset;
  newBlocksData[targetIndex].contentLink.expanded.dolbyOffPortraitAsset = newBlocksData[targetIndex].contentLink.expanded.dolbyOffPortraitAsset || newBlocksData[targetIndex].contentLink.expanded.dolbyOnPortraitAsset;

  newBlocksData[targetIndex].contentLink.expanded.dolbyOffLandscapeAsset.hlsVideoUrl = replacementAssets.dolbyOffLandscapeAsset.hlsVideoUrl;
  newBlocksData[targetIndex].contentLink.expanded.dolbyOffLandscapeAsset.mpegDashVideoUrl = replacementAssets.dolbyOffLandscapeAsset.mpegDashVideoUrl;

  newBlocksData[targetIndex].contentLink.expanded.dolbyOffPortraitAsset.mpegDashVideoUrl = replacementAssets.dolbyOffLandscapeAsset.mpegDashVideoUrl;

  newBlocksData[targetIndex].contentLink.expanded.dolbyOnLandscapeAsset = undefined;
  newBlocksData[targetIndex].contentLink.expanded.dolbyOnPortraitAsset = undefined;
  // newBlocksData[targetIndex].contentLink.expanded.dolbyOnLandscapeAsset.hlsVideoUrl = undefined;
  // newBlocksData[targetIndex].contentLink.expanded.dolbyOnPortraitAsset.hlsVideoUrl = undefined;

  newBlocksData[targetIndex].contentLink.expanded.ctaLink.text = 'something different';
  body.onOffDemoItemBlocks = newBlocksData;

  return body;
};

window.fetch = function(url, options) {
    // Do something with the URL and options
    console.log('Fetch request intercepted:', url, options);

    if (typeof url === 'string' && url.includes('/lovemore/?&api=true')) {
      console.log('Fetch matched data request');

      return originalFetch(url, options)
        .then(response => {
          if (response.ok) {
            return response.text().then(body => {
              const modifiedBody = JSON.parse(body);

              return new Response(JSON.stringify(switchVideo(modifiedBody)), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
              });
            });
          }

          
          return response;
        })
        .catch(error => {
          console.error('Error fetching: ', error);
          throw error;
        });
    }
    
    // Call the original method
    return originalFetch.apply(this, [url, options]);
};
