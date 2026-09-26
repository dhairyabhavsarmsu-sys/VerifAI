import { BoundingBox } from '../types';

/**
 * Generates an authentic Error Level Analysis (ELA) forensic heatmap using HTML5 Canvas.
 * Compares the original image against a 75% quality JPEG re-compression,
 * computes absolute difference per pixel, amplifies the error rate,
 * and applies a high-contrast forensic neon/thermal colormap.
 */
export async function generateElaHeatmap(
  imageSource: string | HTMLImageElement,
  tamperedBoxes: BoundingBox[] = [],
  highlightTampering: boolean = false
): Promise<{ heatmapUrl: string; baseCanvas: HTMLCanvasElement }> {
  return new Promise((resolve, reject) => {
    const img = typeof imageSource === 'string' ? new Image() : imageSource;
    img.crossOrigin = 'anonymous';

    const onImageLoaded = () => {
      try {
        const width = Math.min(img.width || 800, 1024);
        const height = Math.min(img.height || 600, Math.round((width / (img.width || 800)) * (img.height || 600)));

        // Canvas 1: Original image
        const origCanvas = document.createElement('canvas');
        origCanvas.width = width;
        origCanvas.height = height;
        const origCtx = origCanvas.getContext('2d', { willReadFrequently: true });
        if (!origCtx) throw new Error('Could not create canvas 2D context');

        origCtx.drawImage(img, 0, 0, width, height);
        const origData = origCtx.getImageData(0, 0, width, height);

        // Re-compress as JPEG at 75% quality
        const jpegUrl = origCanvas.toDataURL('image/jpeg', 0.75);
        const compressedImg = new Image();

        compressedImg.onload = () => {
          const compCanvas = document.createElement('canvas');
          compCanvas.width = width;
          compCanvas.height = height;
          const compCtx = compCanvas.getContext('2d', { willReadFrequently: true });
          if (!compCtx) throw new Error('Could not create canvas 2D context for compression');

          compCtx.drawImage(compressedImg, 0, 0, width, height);
          const compData = compCtx.getImageData(0, 0, width, height);

          // Output Canvas: Forensic ELA Heatmap
          const outCanvas = document.createElement('canvas');
          outCanvas.width = width;
          outCanvas.height = height;
          const outCtx = outCanvas.getContext('2d');
          if (!outCtx) throw new Error('Could not create output canvas 2D context');

          const outData = outCtx.createImageData(width, height);
          const origPixels = origData.data;
          const compPixels = compData.data;
          const outPixels = outData.data;

          const scale = 18; // ELA amplification factor

          for (let i = 0; i < origPixels.length; i += 4) {
            const diffR = Math.abs(origPixels[i] - compPixels[i]);
            const diffG = Math.abs(origPixels[i + 1] - compPixels[i + 1]);
            const diffB = Math.abs(origPixels[i + 2] - compPixels[i + 2]);

            // Normalized error intensity
            const intensity = Math.min(255, Math.round(((diffR + diffG + diffB) / 3) * scale));

            // Thermal / Forensic Neon Colormap:
            // 0 -> Deep Navy/Obsidian (#080c18)
            // 60 -> Cyber Cyan / Blue (#06b6d4)
            // 140 -> Amber Gold (#f59e0b)
            // 200+ -> Crimson / Neon White (#ef4444 / #ffffff)
            if (intensity < 40) {
              outPixels[i] = Math.round(intensity * 0.3); // R
              outPixels[i + 1] = Math.round(intensity * 0.5); // G
              outPixels[i + 2] = Math.round(intensity * 1.8 + 20); // B
            } else if (intensity < 110) {
              const t = (intensity - 40) / 70;
              outPixels[i] = Math.round(6 + t * 40);
              outPixels[i + 1] = Math.round(182 * (0.6 + t * 0.4));
              outPixels[i + 2] = Math.round(212);
            } else if (intensity < 180) {
              const t = (intensity - 110) / 70;
              outPixels[i] = Math.round(245);
              outPixels[i + 1] = Math.round(158 * (1 - t * 0.3));
              outPixels[i + 2] = Math.round(11 * (1 - t));
            } else {
              const t = (intensity - 180) / 75;
              outPixels[i] = Math.round(239 + t * 16);
              outPixels[i + 1] = Math.round(68 * (1 - t));
              outPixels[i + 2] = Math.round(68 * (1 - t));
            }
            outPixels[i + 3] = 255; // Alpha
          }

          outCtx.putImageData(outData, 0, 0);

          // Draw Glowing Forensic Bounding Boxes and Reticles if tampering is present
          if (highlightTampering && tamperedBoxes.length > 0) {
            tamperedBoxes.forEach((box) => {
              const bx = (box.x / 100) * width;
              const by = (box.y / 100) * height;
              const bw = (box.width / 100) * width;
              const bh = (box.height / 100) * height;

              // Glowing outer stroke
              outCtx.save();
              outCtx.shadowColor = '#EF4444';
              outCtx.shadowBlur = 12;
              outCtx.strokeStyle = '#EF4444';
              outCtx.lineWidth = 2.5;
              outCtx.strokeRect(bx, by, bw, bh);

              // Corner tactical reticles
              const cornerLen = Math.min(12, bw * 0.25, bh * 0.25);
              outCtx.strokeStyle = '#FFFFFF';
              outCtx.lineWidth = 3;

              // Top-left
              outCtx.beginPath();
              outCtx.moveTo(bx, by + cornerLen);
              outCtx.lineTo(bx, by);
              outCtx.lineTo(bx + cornerLen, by);
              outCtx.stroke();

              // Top-right
              outCtx.beginPath();
              outCtx.moveTo(bx + bw - cornerLen, by);
              outCtx.lineTo(bx + bw, by);
              outCtx.lineTo(bx + bw, by + cornerLen);
              outCtx.stroke();

              // Bottom-left
              outCtx.beginPath();
              outCtx.moveTo(bx, by + bh - cornerLen);
              outCtx.lineTo(bx, by + bh);
              outCtx.lineTo(bx + cornerLen, by + bh);
              outCtx.stroke();

              // Bottom-right
              outCtx.beginPath();
              outCtx.moveTo(bx + bw - cornerLen, by + bh);
              outCtx.lineTo(bx + bw, by + bh);
              outCtx.lineTo(bx + bw, by + bh - cornerLen);
              outCtx.stroke();

              // Tag badge
              outCtx.fillStyle = 'rgba(239, 68, 68, 0.9)';
              outCtx.fillRect(bx, by - 22 > 0 ? by - 22 : by, Math.max(120, bw * 0.7), 20);
              outCtx.fillStyle = '#FFFFFF';
              outCtx.font = 'bold 11px monospace';
              outCtx.fillText(
                `⚠ ${box.label} (${box.confidence}%)`,
                bx + 4,
                by - 22 > 0 ? by - 7 : by + 15
              );
              outCtx.restore();
            });
          }

          resolve({
            heatmapUrl: outCanvas.toDataURL('image/png'),
            baseCanvas: outCanvas,
          });
        };

        compressedImg.onerror = (e) => reject(e);
        compressedImg.src = jpegUrl;
      } catch (err) {
        reject(err);
      }
    };

    if (img.complete && img.naturalWidth !== 0) {
      onImageLoaded();
    } else {
      img.onload = onImageLoaded;
      img.onerror = (e) => reject(e);
      if (typeof imageSource === 'string') {
        img.src = imageSource;
      }
    }
  });
}
