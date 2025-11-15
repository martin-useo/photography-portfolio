const PortfolioLayout = {
  BASE_WIDTH: 1200,
  GAP: 8,
  
  createPortraitWith2Landscapes(portrait, landscape1, landscape2) {
    const portraitWidth = (this.BASE_WIDTH - 2 * this.GAP) / 3;
    const landscapeWidth = (this.BASE_WIDTH - 2 * this.GAP) * 2 / 3;
    
    const portraitNaturalHeight = portraitWidth / portrait.aspectRatio;
    const landscape1NaturalHeight = landscapeWidth / landscape1.aspectRatio;
    const landscape2NaturalHeight = landscape2 ? landscapeWidth / landscape2.aspectRatio : landscape1NaturalHeight;
    
    const totalLandscapeNaturalHeight = landscape1NaturalHeight + landscape2NaturalHeight + this.GAP;
    const targetHeight = (portraitNaturalHeight * 0.6 + totalLandscapeNaturalHeight * 0.4);
    
    const portraitHeight = targetHeight;
    const availableLandscapeHeight = targetHeight - this.GAP;
    const landscape1Ratio = landscape1NaturalHeight / totalLandscapeNaturalHeight;
    const landscape2Ratio = landscape2NaturalHeight / totalLandscapeNaturalHeight;
    
    const landscape1Height = availableLandscapeHeight * landscape1Ratio;
    const landscape2Height = availableLandscapeHeight * landscape2Ratio;
    
    const portraitAdjustedRatio = portraitWidth / portraitHeight;
    const landscape1AdjustedRatio = landscapeWidth / landscape1Height;
    const landscape2AdjustedRatio = landscape2 ? landscapeWidth / landscape2Height : landscape1AdjustedRatio;
    
    return {
      portraitWidth,
      portraitHeight,
      portraitAdjustedRatio,
      landscape1Height,
      landscape1AdjustedRatio,
      landscape2Height,
      landscape2AdjustedRatio,
      landscapeWidth,
      totalHeight: targetHeight
    };
  },

  create2LandscapesWithPortrait(landscape1, landscape2, portrait) {
    const totalWidth = this.BASE_WIDTH - 2 * this.GAP;
    const landscapeWidth = totalWidth * 0.65;
    
    const landscape1NaturalHeight = landscapeWidth / landscape1.aspectRatio;
    const landscape2NaturalHeight = landscape2 ? landscapeWidth / landscape2.aspectRatio : landscape1NaturalHeight;
    const portraitHeight = landscape1NaturalHeight + landscape2NaturalHeight + this.GAP;
    const portraitWidth = portraitHeight * portrait.aspectRatio;
    const portraitWidthPercent = (portraitWidth / totalWidth) * 100;
    const landscapeWidthPercent = 100 - portraitWidthPercent;
    
    return {
      portraitHeight,
      landscape1Height: landscape1NaturalHeight,
      landscape2Height: landscape2NaturalHeight,
      portraitWidthPercent,
      landscapeWidthPercent
    };
  },

  create2Landscapes(landscape1, landscape2) {
    const itemWidth = (this.BASE_WIDTH - 3 * this.GAP) / 2;
    const height1 = itemWidth / landscape1.aspectRatio;
    const height2 = landscape2 ? itemWidth / landscape2.aspectRatio : height1;
    const targetHeight = (height1 + height2) / 2;
    
    return {
      targetHeight,
      landscape1AdjustedRatio: itemWidth / targetHeight,
      landscape2AdjustedRatio: landscape2 ? itemWidth / targetHeight : itemWidth / targetHeight
    };
  },

  create3Portraits(portraits) {
    const itemWidth = (this.BASE_WIDTH - 4 * this.GAP) / 3;
    const heights = portraits.map(p => itemWidth / p.aspectRatio);
    const targetHeight = heights.reduce((a, b) => a + b, 0) / heights.length;
    
    return {
      targetHeight,
      adjustedRatios: portraits.map(p => itemWidth / targetHeight)
    };
  },

  createLandscapeWithPortrait(landscape, portrait) {
    const landscapeWidth = (this.BASE_WIDTH - 2 * this.GAP) * 2 / 3;
    const portraitWidth = (this.BASE_WIDTH - 2 * this.GAP) / 3;
    
    const landscapeNaturalHeight = landscapeWidth / landscape.aspectRatio;
    const portraitNaturalHeight = portraitWidth / portrait.aspectRatio;
    const targetHeight = (landscapeNaturalHeight * 0.7 + portraitNaturalHeight * 0.3);
    
    return {
      targetHeight,
      landscapeAdjustedRatio: landscapeWidth / targetHeight,
      portraitAdjustedRatio: portraitWidth / targetHeight
    };
  },

  renderPortraitWith2LandscapesHTML(portrait, landscape1, landscape2) {
    const dims = this.createPortraitWith2Landscapes(portrait, landscape1, landscape2);
    
    const row = document.createElement('div');
    row.className = 'w-full flex flex-wrap md:flex-nowrap gap-2 mb-2';
    
    const portraitDiv = document.createElement('div');
    portraitDiv.className = 'w-full md:w-1/3';
    portraitDiv.innerHTML = `
      <div class="overflow-hidden w-full rounded-sm" style="aspect-ratio: ${dims.portraitAdjustedRatio};">
        <a href="${portrait.src}" data-fancybox="gallery" class="block h-full w-full">
          <img alt="${portrait.alt}" class="w-full h-full object-cover transition duration-500 transform hover:scale-105" src="${portrait.src}" onload="this.style.opacity='1'" style="opacity: 0" />
        </a>
      </div>
    `;
    row.appendChild(portraitDiv);
    
    const landscapeColumn = document.createElement('div');
    landscapeColumn.className = 'w-full md:w-2/3 flex flex-col gap-2';
    
    const landscape1Div = document.createElement('div');
    landscape1Div.className = 'w-full';
    landscape1Div.innerHTML = `
      <div class="overflow-hidden w-full rounded-sm" style="aspect-ratio: ${dims.landscape1AdjustedRatio};">
        <a href="${landscape1.src}" data-fancybox="gallery" class="block h-full w-full">
          <img alt="${landscape1.alt}" class="w-full h-full object-cover transition duration-500 transform hover:scale-105" src="${landscape1.src}" onload="this.style.opacity='1'" style="opacity: 0" />
        </a>
      </div>
    `;
    landscapeColumn.appendChild(landscape1Div);
    
    if (landscape2) {
      const landscape2Div = document.createElement('div');
      landscape2Div.className = 'w-full';
      landscape2Div.innerHTML = `
        <div class="overflow-hidden w-full rounded-sm" style="aspect-ratio: ${dims.landscape2AdjustedRatio};">
          <a href="${landscape2.src}" data-fancybox="gallery" class="block h-full w-full">
            <img alt="${landscape2.alt}" class="w-full h-full object-cover transition duration-500 transform hover:scale-105" src="${landscape2.src}" onload="this.style.opacity='1'" style="opacity: 0" />
          </a>
        </div>
      `;
      landscapeColumn.appendChild(landscape2Div);
    }
    
    row.appendChild(landscapeColumn);
    return row;
  },

  renderLandscapeWithPortraitHTML(landscape, portrait) {
    const dims = this.createLandscapeWithPortrait(landscape, portrait);
    
    const row = document.createElement('div');
    row.className = 'w-full flex flex-wrap md:flex-nowrap gap-2 mb-2';
    
    const landscapeDiv = document.createElement('div');
    landscapeDiv.className = 'w-full md:w-2/3';
    landscapeDiv.innerHTML = `
      <div class="overflow-hidden w-full rounded-sm" style="aspect-ratio: ${dims.landscapeAdjustedRatio};">
        <a href="${landscape.src}" data-fancybox="gallery" class="block h-full w-full">
          <img alt="${landscape.alt}" class="w-full h-full object-cover transition duration-500 transform hover:scale-105" src="${landscape.src}" onload="this.style.opacity='1'" style="opacity: 0" />
        </a>
      </div>
    `;
    row.appendChild(landscapeDiv);
    
    const portraitDiv = document.createElement('div');
    portraitDiv.className = 'w-full md:w-1/3';
    portraitDiv.innerHTML = `
      <div class="overflow-hidden w-full rounded-sm" style="aspect-ratio: ${dims.portraitAdjustedRatio};">
        <a href="${portrait.src}" data-fancybox="gallery" class="block h-full w-full">
          <img alt="${portrait.alt}" class="w-full h-full object-cover transition duration-500 transform hover:scale-105" src="${portrait.src}" onload="this.style.opacity='1'" style="opacity: 0" />
        </a>
      </div>
    `;
    row.appendChild(portraitDiv);
    
    return row;
  },

  render2LandscapesWithPortraitHTML(landscape1, landscape2, portrait) {
    const dims = this.create2LandscapesWithPortrait(landscape1, landscape2, portrait);
    
    const row = document.createElement('div');
    row.className = 'w-full flex flex-wrap md:flex-nowrap gap-2 mb-2';
    
    const landscapeColumn = document.createElement('div');
    landscapeColumn.className = 'w-full md:flex-none flex flex-col gap-2';
    landscapeColumn.style.width = `${dims.landscapeWidthPercent}%`;
    landscapeColumn.style.height = `${dims.portraitHeight}px`;
    
    const landscape1Div = document.createElement('div');
    landscape1Div.className = 'w-full';
    landscape1Div.style.height = `${dims.landscape1Height}px`;
    landscape1Div.innerHTML = `
      <div class="overflow-hidden w-full h-full rounded-sm">
        <a href="${landscape1.src}" data-fancybox="gallery" class="block h-full w-full">
          <img alt="${landscape1.alt}" class="w-full h-full object-contain transition duration-500 transform hover:scale-105" src="${landscape1.src}" onload="this.style.opacity='1'" style="opacity: 0" />
        </a>
      </div>
    `;
    landscapeColumn.appendChild(landscape1Div);
    
    if (landscape2) {
      const landscape2Div = document.createElement('div');
      landscape2Div.className = 'w-full';
      landscape2Div.style.height = `${dims.landscape2Height}px`;
      landscape2Div.innerHTML = `
        <div class="overflow-hidden w-full h-full rounded-sm">
          <a href="${landscape2.src}" data-fancybox="gallery" class="block h-full w-full">
            <img alt="${landscape2.alt}" class="w-full h-full object-contain transition duration-500 transform hover:scale-105" src="${landscape2.src}" onload="this.style.opacity='1'" style="opacity: 0" />
          </a>
        </div>
      `;
      landscapeColumn.appendChild(landscape2Div);
    }
    
    row.appendChild(landscapeColumn);
    
    const portraitDiv = document.createElement('div');
    portraitDiv.className = 'w-full md:flex-none';
    portraitDiv.style.width = `${dims.portraitWidthPercent}%`;
    portraitDiv.style.height = `${dims.portraitHeight}px`;
    portraitDiv.innerHTML = `
      <div class="overflow-hidden w-full h-full rounded-sm">
        <a href="${portrait.src}" data-fancybox="gallery" class="block h-full w-full">
          <img alt="${portrait.alt}" class="w-full h-full object-contain transition duration-500 transform hover:scale-105" src="${portrait.src}" onload="this.style.opacity='1'" style="opacity: 0" />
        </a>
      </div>
    `;
    row.appendChild(portraitDiv);
    
    return row;
  },

  render2LandscapesHTML(landscape1, landscape2) {
    const dims = this.create2Landscapes(landscape1, landscape2);
    
    const row = document.createElement('div');
    row.className = 'w-full flex flex-wrap md:flex-nowrap gap-2 mb-2';
    
    const item1 = document.createElement('div');
    item1.className = 'w-full md:w-1/2';
    item1.innerHTML = `
      <div class="overflow-hidden w-full rounded-sm" style="aspect-ratio: ${dims.landscape1AdjustedRatio};">
        <a href="${landscape1.src}" data-fancybox="gallery" class="block h-full w-full">
          <img alt="${landscape1.alt}" class="w-full h-full object-cover transition duration-500 transform hover:scale-105" src="${landscape1.src}" onload="this.style.opacity='1'" style="opacity: 0" />
        </a>
      </div>
    `;
    row.appendChild(item1);
    
    if (landscape2) {
      const item2 = document.createElement('div');
      item2.className = 'w-full md:w-1/2';
      item2.innerHTML = `
        <div class="overflow-hidden w-full rounded-sm" style="aspect-ratio: ${dims.landscape2AdjustedRatio};">
          <a href="${landscape2.src}" data-fancybox="gallery" class="block h-full w-full">
            <img alt="${landscape2.alt}" class="w-full h-full object-cover transition duration-500 transform hover:scale-105" src="${landscape2.src}" onload="this.style.opacity='1'" style="opacity: 0" />
          </a>
        </div>
      `;
      row.appendChild(item2);
    }
    
    return row;
  },

  render3PortraitsHTML(portraits) {
    const dims = this.create3Portraits(portraits);
    
    const row = document.createElement('div');
    row.className = 'w-full flex flex-wrap md:flex-nowrap gap-2 mb-2';
    
    portraits.forEach((portrait, index) => {
      const item = document.createElement('div');
      item.className = 'w-full md:w-1/3';
      item.innerHTML = `
        <div class="overflow-hidden w-full rounded-sm" style="aspect-ratio: ${dims.adjustedRatios[index]};">
          <a href="${portrait.src}" data-fancybox="gallery" class="block h-full w-full">
            <img alt="${portrait.alt}" class="w-full h-full object-cover transition duration-500 transform hover:scale-105" src="${portrait.src}" onload="this.style.opacity='1'" style="opacity: 0" />
          </a>
        </div>
      `;
      row.appendChild(item);
    });
    
    return row;
  },

  renderSingleImageHTML(img, className = 'w-full') {
    const item = document.createElement('div');
    item.className = `${className} mb-2`;
    item.innerHTML = `
      <div class="overflow-hidden w-full rounded-sm" style="aspect-ratio: ${img.aspectRatio};">
        <a href="${img.src}" data-fancybox="gallery" class="block h-full w-full">
          <img alt="${img.alt}" class="w-full h-full object-cover transition duration-500 transform hover:scale-105" src="${img.src}" onload="this.style.opacity='1'" style="opacity: 0" />
        </a>
      </div>
    `;
    return item;
  },

  async generatePortfolio(images, gridElement) {
    const enrichedImages = await IMAGES_CONFIG.enrichImagesWithFormat(images);
    
    const portraitImages = enrichedImages.filter(img => img.actualFormat === 'portrait');
    const landscapeImages = enrichedImages.filter(img => img.actualFormat === 'landscape');
    
    let landscapeIndex = 0;
    let portraitIndex = 0;
    
    const patterns = ['portrait-2landscapes', '2landscapes-portrait', '2landscapes', '3portraits'];
    let patternIndex = 0;
    let iterationCount = 0;
    const maxIterations = 50;
    let lastAppliedPattern = null;
    
    while ((landscapeIndex < landscapeImages.length || portraitIndex < portraitImages.length) && iterationCount < maxIterations) {
      iterationCount++;
      
      const remainingLandscapes = landscapeImages.length - landscapeIndex;
      const remainingPortraits = portraitImages.length - portraitIndex;
      
      if (remainingPortraits === 1 && remainingLandscapes === 1) {
        const portrait = portraitImages[portraitIndex++];
        const landscape = landscapeImages[landscapeIndex++];
        const row = this.renderLandscapeWithPortraitHTML(landscape, portrait);
        gridElement.appendChild(row);
        continue;
      }
      
      let pattern;
      let attempts = 0;
      do {
        pattern = patterns[patternIndex % patterns.length];
        patternIndex++;
        attempts++;
      } while (pattern === lastAppliedPattern && attempts < patterns.length);
      
      let patternApplied = false;
      
      if (pattern === 'portrait-2landscapes' && portraitIndex < portraitImages.length && remainingLandscapes >= 1) {
        const portrait = portraitImages[portraitIndex++];
        const landscape1 = landscapeImages[landscapeIndex++];
        const landscape2 = landscapeIndex < landscapeImages.length ? landscapeImages[landscapeIndex++] : null;
        gridElement.appendChild(this.renderPortraitWith2LandscapesHTML(portrait, landscape1, landscape2));
        patternApplied = true;
        lastAppliedPattern = pattern;
        
      } else if (pattern === '2landscapes-portrait' && portraitIndex < portraitImages.length && remainingLandscapes >= 1) {
        const landscape1 = landscapeImages[landscapeIndex++];
        const landscape2 = landscapeIndex < landscapeImages.length ? landscapeImages[landscapeIndex++] : null;
        const portrait = portraitImages[portraitIndex++];
        gridElement.appendChild(this.render2LandscapesWithPortraitHTML(landscape1, landscape2, portrait));
        patternApplied = true;
        lastAppliedPattern = pattern;
        
      } else if (pattern === '2landscapes' && remainingLandscapes >= 1) {
        const landscape1 = landscapeImages[landscapeIndex++];
        const landscape2 = landscapeIndex < landscapeImages.length ? landscapeImages[landscapeIndex++] : null;
        gridElement.appendChild(this.render2LandscapesHTML(landscape1, landscape2));
        patternApplied = true;
        lastAppliedPattern = pattern;
        
      } else if (pattern === '3portraits' && remainingPortraits >= 1) {
        const portraits = [];
        for (let i = 0; i < 3 && portraitIndex < portraitImages.length; i++) {
          portraits.push(portraitImages[portraitIndex++]);
        }
        gridElement.appendChild(this.render3PortraitsHTML(portraits));
        patternApplied = true;
        lastAppliedPattern = pattern;
      }
      
      if (!patternApplied) {
        if (remainingPortraits >= 1 && remainingLandscapes >= 1) {
          const portrait = portraitImages[portraitIndex++];
          const landscape = landscapeImages[landscapeIndex++];
          gridElement.appendChild(this.renderLandscapeWithPortraitHTML(landscape, portrait));
          patternApplied = true;
          lastAppliedPattern = 'landscape-portrait';
        } else if (landscapeIndex < landscapeImages.length) {
          gridElement.appendChild(this.renderSingleImageHTML(landscapeImages[landscapeIndex++], 'w-full'));
          patternApplied = true;
          lastAppliedPattern = 'single';
        } else if (portraitIndex < portraitImages.length) {
          gridElement.appendChild(this.renderSingleImageHTML(portraitImages[portraitIndex++], 'w-full md:w-1/2 mx-auto'));
          patternApplied = true;
          lastAppliedPattern = 'single';
        }
      }
      
      if (!patternApplied) break;
    }
    
    if (typeof Fancybox !== 'undefined') {
      Fancybox.bind("[data-fancybox]", {});
    }
  }
};
