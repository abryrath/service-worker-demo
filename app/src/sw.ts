/** NOT USED FOR ANYTHING */
/// <reference lib="WebWorker" />

export type {};
declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', () => {
  console.log('install');
})

/**
 * dolby-example.json 
 * Contains an example data structure of
 * the parts used for the A/B testing.
 * 
 * There are two import things
 * - The id of the block so we know what to target within the API call response body
 * - The hlsVideoUrl & mpegDashVideoUrl
 * 
 * Basic structure is as follows
 * body.onOffDemoItemBlocks[targetIdOfBlockToTest].contentLink = {
 *  id: number,
 *  expanded: {
 *   dolbyOnPortraitAsset: {
 *     hlsVideoUrl: VideoUrl as string,
 *     mpegDashVideoUrl: VideoUrl as string
 *   },
 *   dolbyOnLandscapeAsset: {
 *     hlsVideoUrl: VideoUrl as string,
 *     mpegDashVideoUrl: VideoUrl as string
 *   },
 *   dolbyOffPortraitAsset: {
 *     hlsVideoUrl: VideoUrl as string,
 *     mpegDashVideoUrl: VideoUrl as string
 *   },
 *   dolbyOffLandscapeAsset: {
 *     hlsVideoUrl: VideoUrl as string,
 *     mpegDashVideoUrl: VideoUrl as string
 *   }
 *  }
 * }
 * 
 * In Dolby: 
 * - pageContent.onOffDemoItemBlocks[id].contentLink
*/
const urlBase = ''
const targetUrl = ''
const targetBlockId = 73417; // JLO
const replacementAssets = { // ED assets
  dolbyOffPortraitAsset: {
    hlsVideoUrl: "https://experience-media.dolby.com/Dolby.com/20231227/Love_More/Ed_Sheeran/SDRS/Portrait/unencrypted/hls/LM_ES-Destination_SDR-9x16_A-Binaural_vs_Stereo_SDRS_manifest-priority.m3u8",
    mpegDashVideoUrl: "https://experience-media.dolby.com/Dolby.com/20231227/Love_More/Ed_Sheeran/SDRS/Portrait/unencrypted/dash/LM_ES-Destination_SDR-9x16_A-Binaural_vs_Stereo_SDRS_manifest-priority.mpd"
  },
  dolbyOffLandscapeAsset: {
    hlsVideoUrl: "https://experience-media.dolby.com/Dolby.com/20231227/Love_More/Ed_Sheeran/SDRS/Landscape/unencrypted/hls/LM_ES-Destination_SDR_A-Binaural_vs_Stereo_SDRS_manifest-priority.m3u8",
    mpegDashVideoUrl: "https://experience-media.dolby.com/Dolby.com/20231227/Love_More/Ed_Sheeran/SDRS/Landscape/unencrypted/dash/LM_ES-Destination_SDR_A-Binaural_vs_Stereo_SDRS_manifest-priority.mpd"
  }
}

self.addEventListener('fetch', function(event) {
  const url = event.request.url;
  
  if (url === '/episerver/api/example') {
    event.respondWith(
      fetch(event.request)
        .then((resp) => {        
          if (resp.ok && resp.body) {
            const { onOffDemoItemBlocks } = resp.body;
            if (!onOffDemoItemBlocks) {
              return resp
            }

            // Access existing data for replacement target
            const targetIndex = onOffDemoItemBlocks.findIndex(b => b.id === targetBlockId)
            const targetBlock = onOffDemoItemBlocks[targetIndex];

            // Get asset default data
            const landscapeData = targetBlock.dolbyOffLandscapeAsset || targetBlock.dolbyOnLandscapeAsset;
            const portraitData = targetBlock.dolbyOffPortraitAsset || targetBlock.dolbyOnPortraitAsset;

            /**
             * Adding optimizely tokens here might be possible instead of manually
             * targeting new assets. 
             */
            const replacementData = {
                dolbyOffLandscapeAsset: {
                  ...landscapeData,
                  hlsVideoUrl: replacementAssets.dolbyOffLandscapeAsset.hlsVideoUrl,
                }, 
                dolbyOffPortraitAsset: {
                  ...portraitData,

                },
                dolbyOnLandscapeAsset: undefined, // Remove enhanced
                dolbyOnPortraitAsset: undefined
            }

            const newBlocksData = onOffDemoItemBlocks;
            newBlocksData[targetIndex] = {
              ...targetBlock,
              ...replacementData
            }

            return new Response(JSON.stringify({
              // Fill in defaults with response data
              ...resp.body,
              // Overwrite src's for return
              onOffDemoItemBlocks: onOffDemoItemBlocks
            }), { headers: { 'Content-Type': 'application/json'}})
          }
          
          return resp;
        })
    );
  }
})