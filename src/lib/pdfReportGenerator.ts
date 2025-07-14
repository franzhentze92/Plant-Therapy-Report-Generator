import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { PDFName, PDFArray, PDFString } from 'pdf-lib';

// Sample product info mapping (expand as needed)
const PRODUCT_INFO = {
  'Cal-Tech™': {
    url: 'https://www.nutritech.com.au/products/cal-tech/',
    description: 'Supplies N (11.7%), Ca (13.4%), and B (0.43%) for improved fruit set and quality.'
  },
  'Calcium Fulvate™': {
    url: 'https://www.nutritech.com.au/products/calcium-fulvate/',
    description: 'Contains N (6.8%), Ca (8.9%), S (0.54%), and trace elements for enhanced calcium uptake.'
  },
  'SeaChange Liquid Kelp™': {
    url: 'https://www.nutritech.com.au/products/seachange-liquid-kelp/',
    description: 'A premium liquid kelp extract for improved plant health and stress resistance.'
  },
  'Nutri-Carb-N™': {
    url: 'https://www.nutritech.com.au/products/nutri-carb-n/',
    description: 'A carbon-based nitrogen source for improved nutrient uptake.'
  },
  'Cloak Spray Oil™': {
    url: 'https://www.nutritech.com.au/products/cloak-spray-oil/',
    description: 'A high-quality spray oil for improved foliar coverage and efficacy.'
  },
  'SeaChange KFF™': {
    url: 'https://www.nutritech.com.au/products/seachange-kff/',
    description: 'A kelp and fish fertilizer blend for enhanced plant growth.'
  },
  'Tri-Kelp™': {
    url: 'https://www.nutritech.com.au/products/tri-kelp/',
    description: 'A blend of three kelp species for maximum plant benefit.'
  },
  'Nutri-Key Boron Shuttle™': {
    url: 'https://www.nutritech.com.au/products/nutri-key-boron-shuttle/',
    description: 'A boron supplement with shuttle technology for improved uptake.'
  },
  'Boron Essentials™': {
    url: 'https://www.nutritech.com.au/products/boron-essentials/',
    description: 'A boron supplement for correcting and preventing boron deficiency in crops.'
  },
  // Fallback for any missing product info
  '[No Name]': {
    url: '',
    description: 'No product information available.'
  }
};
// Section intro mapping
const SECTION_INTRO = {
  'Biological Fertigation Program': 'Delivers beneficial biology and nutrients through fertigation to boost soil health and plant growth.',
  'Pre-Flowering Foliar Spray': 'Applied before flowering to supply key nutrients for strong flowering and fruit set.',
  'Nutritional Foliar Spray': 'Provides essential nutrients during growth to quickly correct deficiencies and support plant health.'
};

function drawPageNumber(page, pageIndex, totalPages, font) {
  const text = `Page ${pageIndex + 1} of ${totalPages}`;
  page.drawText(text, {
    x: 500,
    y: 20,
    size: 10,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });
}

// BRUTE-FORCE SANITIZER: Guarantee readable summary
function sanitizeSummary(raw) {
  let text = String(raw || '');
  // Add space after punctuation if not present
  text = text.replace(/([.,;:!?])(?![ \n])/g, '$1 ');
  // Add space between lowercase/number and uppercase (e.g., optimal.Excess -> optimal. Excess)
  text = text.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  // Replace all HTML tags with a space
  text = text.replace(/<[^>]+>/g, ' ');
  // Replace all runs of whitespace (including newlines, tabs) with a single space
  text = text.replace(/\s+/g, ' ');
  // Collapse multiple spaces
  text = text.replace(/ +/g, ' ');
  // Trim
  text = text.trim();
  // Break into lines of max 90 chars for PDF readability
  const lines = [];
  while (text.length > 0) {
    if (text.length <= 90) {
      lines.push(text);
      break;
    }
    let idx = text.lastIndexOf(' ', 90);
    if (idx === -1) idx = 90;
    lines.push(text.slice(0, idx));
    text = text.slice(idx).trim();
  }
  return lines;
}

// Improved: Render summary as real paragraphs with word wrapping and spacing
function wrapTextToWidth(text, font, fontSize, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const testLine = line ? line + ' ' + words[i] : words[i];
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testWidth > maxWidth && line) {
      lines.push(line);
      line = words[i];
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Remove drawJustifiedLine and bold logic, restore simple paragraph rendering
function drawJustifiedLine(page, line, y, font, fontBold, fontSize, color, x, maxWidth, isLastLine) {
  // Split line into segments for bold (**...**)
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  // Count spaces for justification
  const plainLine = line.replace(/\*\*([^*]+)\*\*/g, '$1');
  const words = plainLine.split(' ');
  const numSpaces = words.length - 1;
  const lineWidth = font.widthOfTextAtSize(plainLine, fontSize);
  let extraSpace = (!isLastLine && numSpaces > 0) ? (maxWidth - lineWidth) / numSpaces : 0;
  let drawX = x;
  let wordIdx = 0;
  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**')) {
      const text = part.slice(2, -2);
      page.drawText(text, { x: drawX, y, size: fontSize, font: fontBold, color });
      drawX += fontBold.widthOfTextAtSize(text, fontSize);
    } else {
      const partWords = part.split(' ');
      for (let i = 0; i < partWords.length; i++) {
        if (partWords[i]) {
          page.drawText(partWords[i], { x: drawX, y, size: fontSize, font, color });
          drawX += font.widthOfTextAtSize(partWords[i], fontSize);
          // Add extra space for justification (except after last word)
          if (!isLastLine && wordIdx < numSpaces) {
            drawX += extraSpace;
          } else if (i < partWords.length - 1) {
            drawX += font.widthOfTextAtSize(' ', fontSize);
          }
          wordIdx++;
        }
      }
    }
  }
}

function drawLineWithBold(page, line, y, font, fontBold, fontSize, color, x) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  let drawX = x;
  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**')) {
      const text = part.slice(2, -2);
      page.drawText(text, { x: drawX, y, size: fontSize, font: fontBold, color });
      drawX += fontBold.widthOfTextAtSize(text, fontSize);
    } else {
      page.drawText(part, { x: drawX, y, size: fontSize, font, color });
      drawX += font.widthOfTextAtSize(part, fontSize);
    }
  }
}

function drawJustifiedLineWithBold(page, line, y, font, fontBold, fontSize, color, x, maxWidth, isLastLine) {
  // Split line into segments for bold (**...**)
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  // Count spaces for justification
  const plainLine = line.replace(/\*\*([^*]+)\*\*/g, '$1');
  const words = plainLine.split(' ');
  const numSpaces = words.length - 1;
  const lineWidth = font.widthOfTextAtSize(plainLine, fontSize);
  let extraSpace = (!isLastLine && numSpaces > 0) ? (maxWidth - lineWidth) / numSpaces : 0;
  let drawX = x;
  let wordIdx = 0;
  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**')) {
      const text = part.slice(2, -2);
      const textWords = text.split(' ');
      for (let i = 0; i < textWords.length; i++) {
        if (textWords[i]) {
          page.drawText(textWords[i], { x: drawX, y, size: fontSize, font: fontBold, color });
          drawX += fontBold.widthOfTextAtSize(textWords[i], fontSize);
          if (!isLastLine && wordIdx < numSpaces) {
            drawX += extraSpace;
          } else if (i < textWords.length - 1) {
            drawX += fontBold.widthOfTextAtSize(' ', fontSize);
          }
          wordIdx++;
        }
      }
    } else {
      const partWords = part.split(' ');
      for (let i = 0; i < partWords.length; i++) {
        if (partWords[i]) {
          page.drawText(partWords[i], { x: drawX, y, size: fontSize, font, color });
          drawX += font.widthOfTextAtSize(partWords[i], fontSize);
          if (!isLastLine && wordIdx < numSpaces) {
            drawX += extraSpace;
          } else if (i < partWords.length - 1) {
            drawX += font.widthOfTextAtSize(' ', fontSize);
          }
          wordIdx++;
        }
      }
    }
  }
}

// Parse a paragraph into segments: [{text, bold}]
function parseBoldSegments(paragraph) {
  const regex = /(\*\*[^*]+\*\*)/g;
  const parts = paragraph.split(regex);
  return parts.map(part => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return { text: part.slice(2, -2), bold: true };
    } else {
      return { text: part, bold: false };
    }
  }).filter(seg => seg.text.length > 0);
}

// Word-wrap segments together, never splitting a segment
function wrapSegmentsToWidth(segments, font, fontBold, fontSize, maxWidth) {
  const lines = [];
  let currentLine = [];
  let currentWidth = 0;
  for (const seg of segments) {
    const segFont = seg.bold ? fontBold : font;
    const segWords = seg.text.split(' ');
    for (let i = 0; i < segWords.length; i++) {
      let word = segWords[i];
      if (word === '') continue;
      const wordWidth = segFont.widthOfTextAtSize(word, fontSize);
      const spaceWidth = currentLine.length > 0 ? font.widthOfTextAtSize(' ', fontSize) : 0;
      if (currentWidth + wordWidth + spaceWidth > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = [];
        currentWidth = 0;
      }
      if (currentLine.length > 0) {
        currentLine.push({ text: ' ', bold: false });
        currentWidth += spaceWidth;
      }
      currentLine.push({ text: word, bold: seg.bold });
      currentWidth += wordWidth;
    }
  }
  if (currentLine.length > 0) lines.push(currentLine);
  return lines;
}

function drawJustifiedSegmentLine(page, lineSegs, y, font, fontBold, fontSize, color, x, maxWidth, isLastLine) {
  // Count spaces for justification
  const numSpaces = lineSegs.filter(seg => seg.text === ' ').length;
  const lineWidth = lineSegs.reduce((w, seg) => w + (seg.bold ? fontBold.widthOfTextAtSize(seg.text, fontSize) : font.widthOfTextAtSize(seg.text, fontSize)), 0);
  let extraSpace = (!isLastLine && numSpaces > 0) ? (maxWidth - lineWidth) / numSpaces : 0;
  let drawX = x;
  let spaceCount = 0;
  for (const seg of lineSegs) {
    const segFont = seg.bold ? fontBold : font;
    if (seg.text === ' ') {
      if (!isLastLine && spaceCount < numSpaces) {
        drawX += segFont.widthOfTextAtSize(' ', fontSize) + extraSpace;
        spaceCount++;
      } else {
        drawX += segFont.widthOfTextAtSize(' ', fontSize);
      }
    } else {
      page.drawText(seg.text, { x: drawX, y, size: fontSize, font: segFont, color });
      drawX += segFont.widthOfTextAtSize(seg.text, fontSize);
    }
  }
}

// Helper: word-wrap plain text to a given width
function wrapTextToWidthPlain(text, font, fontSize, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    if (line) {
      const testLine = line + ' ' + word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    } else {
      line = word;
    }
    // If a single word is too long, break it with a hyphen
    while (font.widthOfTextAtSize(line, fontSize) > maxWidth) {
      // Only break if the line is a single word (no spaces)
      if (!line.includes(' ')) {
        let cut = line.length - 1;
        while (cut > 1 && font.widthOfTextAtSize(line.slice(0, cut) + '-', fontSize) > maxWidth) cut--;
        if (cut <= 1) break;
        lines.push(line.slice(0, cut) + '-');
        line = line.slice(cut);
      } else {
        break;
      }
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function generateCustomPDF(reportData: any, attachments?: { frontAttachments?: string[]; backAttachments?: string[]; uploadedFile?: File }) {
  // Support both single paddock object and array of paddocks
  const paddocks = Array.isArray(reportData) ? reportData : [reportData];
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const green = rgb(0.55, 0.71, 0.23); // #8cb43a
  const gray = rgb(0.5, 0.5, 0.5);
  const black = rgb(0, 0, 0);

  // --- Insert front attachments as pages ---
  if (attachments && attachments.frontAttachments && attachments.frontAttachments.length > 0) {
    for (const att of attachments.frontAttachments) {
      let url = '';
      if (att === 'plant-therapy-cover') url = '/attachments/plant-therapy-cover.pdf';
      // Add more mappings as needed
      if (url) {
        const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
        const existingPdf = await PDFDocument.load(existingPdfBytes);
        const copiedPages = await pdfDoc.copyPages(existingPdf, existingPdf.getPageIndices());
        copiedPages.forEach(page => pdfDoc.addPage(page));
      }
    }
  }

  // --- Insert uploaded plant analysis after front attachments ---
  if (attachments && attachments.uploadedFile) {
    const file = attachments.uploadedFile;
    const fileBytes = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
    const uploadedPdf = await PDFDocument.load(fileBytes);
    const copiedPages = await pdfDoc.copyPages(uploadedPdf, uploadedPdf.getPageIndices());
    copiedPages.forEach(page => pdfDoc.addPage(page));
  }

  for (let p = 0; p < paddocks.length; p++) {
    const data = paddocks[p];
    // --- Cover/Title & Summary Page ---
    const page1 = pdfDoc.addPage([595.28, 841.89]); // A4
    // Title
    page1.drawText('Plant Therapy™ Report', {
      x: 120,
      y: 750,
      size: 28,
      font: fontBold,
      color: green,
    });
    // Add a larger spacer between the main title and paddock name
    let y = 750 - 60; // 60pt gap below the title
    const paddockName = data.paddockName || '';
    if (paddockName) {
      page1.drawText(paddockName, { x: 40, y, size: 18, font: fontBold, color: black });
      y -= 20;
    }
    // Now render the summary content directly below, without repeating the paddock name
    // Summary box
    // Continue with summary rendering at y
    let sy = y - 20;
    // Improved: Render summary as real paragraphs with word wrapping and spacing
    let rawSummary = String(data.summary || data.somCecText || '');
    rawSummary = rawSummary.replace(/<br\s*\/?>(?=\s|$)/gi, '\n').replace(/<p>/gi, '\n').replace(/<[^>]+>/g, '');
    let summaryParagraphs = rawSummary.split(/\n\s*\n|\r\n\s*\r\n/).map(p => p.trim()).filter(Boolean);
    if (summaryParagraphs.length) {
      let inAntagonism = false;
      let antagonismBuffer = '';
      for (let i = 0; i < summaryParagraphs.length; i++) {
        let para = summaryParagraphs[i].replace(/\n/g, ' ');
        if (para.trim().startsWith('Your nutrient antagonism is summarized as following:')) {
          inAntagonism = true;
          antagonismBuffer = '';
          const introSegments = parseBoldSegments(para);
          const introLines = wrapSegmentsToWidth(introSegments, font, fontBold, 10, 495);
          for (let j = 0; j < introLines.length; j++) {
            const isLastLine = j === introLines.length - 1;
            drawJustifiedSegmentLine(page1, introLines[j], sy, font, fontBold, 10, black, 50, 495, isLastLine);
            sy -= 15;
          }
          sy -= 12; // Add extra space after this paragraph
          continue;
        }
        if (inAntagonism) {
          if (/can shut down/i.test(para)) {
            antagonismBuffer += (antagonismBuffer ? ' ' : '') + para;
            if (i < summaryParagraphs.length - 1) continue;
          }
          const bulletPoints = [];
          const regex = /([^.]+?can shut down[^.]+)(?:\.|$)/gi;
          let match;
          while ((match = regex.exec(antagonismBuffer)) !== null) {
            bulletPoints.push(match[1].trim());
          }
          for (const bullet of bulletPoints) {
            const bulletSegments = parseBoldSegments(bullet);
            const bulletLines = wrapSegmentsToWidth(bulletSegments, font, fontBold, 10, 470);
            for (let j = 0; j < bulletLines.length; j++) {
              let bulletX = 65;
              if (j === 0) {
                page1.drawText('•', { x: 50, y: sy, size: 12, font: fontBold, color: black });
              }
              drawJustifiedSegmentLine(page1, bulletLines[j], sy, font, fontBold, 10, black, bulletX, 470, true);
              sy -= 15;
            }
            sy -= 4;
          }
          inAntagonism = false;
          antagonismBuffer = '';
          sy -= 12; // Add extra space after bullet list
          continue;
        }
        const segments = parseBoldSegments(para);
        const lines = wrapSegmentsToWidth(segments, font, fontBold, 10, 495);
        for (let j = 0; j < lines.length; j++) {
          const isLastLine = j === lines.length - 1;
          drawJustifiedSegmentLine(page1, lines[j], sy, font, fontBold, 10, black, 50, 495, isLastLine);
          sy -= 15;
        }
        sy -= 12; // Add extra space after each paragraph
      }
      sy -= 12;
    } else {
      page1.drawText('No summary available.', { x: 50, y: sy, size: 10, font, color: gray });
      sy -= 20;
    }
    // --- Recommendations/Product Boxes Section ---
    sy -= 10;
    const recTitle = 'Recommendations';
    const recTitleWidth = fontBold.widthOfTextAtSize(recTitle, 14);
    page1.drawText(recTitle, { x: 40 + (515 - recTitleWidth) / 2, y: sy, size: 14, font: fontBold, color: green });
    sy -= 23;
    function drawProductBox(title, products, boxY) {
      const numProducts = Array.isArray(products) ? products.length : 0;
      if (numProducts === 0) return 0;
      const boxHeight = Math.max(45, numProducts * 18 + 14);
      page1.drawRectangle({ x: 40, y: boxY - boxHeight, width: 515, height: boxHeight, color: rgb(1, 1, 1) });
      page1.drawText(title, { x: 50, y: boxY - 18, size: 9, font, color: gray, });
      let py = boxY - 32;
      for (const p of products) {
        const productName = typeof p === 'string' ? p : (p.name || p.product || '[No Name]');
        page1.drawText(`• ${productName}`, { x: 60, y: py, size: 10, font: fontBold, color: black });
        if (typeof p === 'object' && (p.rate || p.unit)) {
          const nameWidth = fontBold.widthOfTextAtSize(`• ${productName}`, 10);
          page1.drawText(`at ${p.rate || ''} ${p.unit || ''}`.trim(), { x: 60 + nameWidth + 10, y: py, size: 9, font, color: gray });
        }
        py -= 17;
      }
      return boxHeight;
    }
    let boxY = sy;
    boxY -= 10;
    const fertigationProducts = (Array.isArray(data.fertigationProducts) && data.fertigationProducts.length > 0)
      ? data.fertigationProducts
      : (Array.isArray(data.soilDrenchProducts) ? data.soilDrenchProducts : []);
    if (fertigationProducts.length > 0) boxY -= drawProductBox('In a single biological fertigation program (drip irrigation) apply the following:', fertigationProducts, boxY) + 15;
    if (Array.isArray(data.preFloweringFoliarProducts) && data.preFloweringFoliarProducts.length > 0) boxY -= drawProductBox('In a single pre-flowering foliar spray apply the following:', data.preFloweringFoliarProducts, boxY) + 15;
    if (Array.isArray(data.nutritionalFoliarProducts) && data.nutritionalFoliarProducts.length > 0) boxY -= drawProductBox('In a single nutritional foliar spray apply the following:', data.nutritionalFoliarProducts, boxY) + 15;
    // --- Recommendations & Table Page ---
    const page2 = pdfDoc.addPage([595.28, 841.89]);
    page2.drawText('The following recommendations have been included', {
      x: 60,
      y: 800,
      size: 13,
      font: fontBold,
      color: green,
    });
    let recY = 780;
    recY -= 18;
    let recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];
    if (!recommendations.length) {
      const addProducts = (products, label) => {
        if (Array.isArray(products) && products.length > 0) {
          for (const p of products) {
            let groupLabel = label;
            if (label === 'Fertigation') groupLabel = 'Biological Fertigation Program';
            if (label === 'Pre-Flowering Foliar') groupLabel = 'Pre-Flowering Foliar Spray';
            if (label === 'Nutritional Foliar') groupLabel = 'Nutritional Foliar Spray';
            recommendations.push({
              name: (typeof p === 'string' ? p : (p.name || p.product || '[No Name]')),
              group: groupLabel,
              rate: p.rate || '',
              unit: p.unit || '',
            });
          }
        }
      };
      addProducts(data.fertigationProducts || data.soilDrenchProducts, 'Fertigation');
      addProducts(data.preFloweringFoliarProducts, 'Pre-Flowering Foliar');
      addProducts(data.nutritionalFoliarProducts, 'Nutritional Foliar');
    }
    if (recommendations.length > 0) {
      let lastGroup = '';
      for (const rec of recommendations) {
        if (rec.group && rec.group !== lastGroup) {
          // Section header
          page2.drawText(rec.group + ':', { x: 60, y: recY, size: 12, font: fontBold, color: black }); // smaller font
          recY -= 12;
          // Section intro (word-wrapped)
          const intro = SECTION_INTRO[rec.group];
          if (intro) {
            const introLines = wrapTextToWidthPlain(intro, font, 8, 410); // smaller font
            for (let k = 0; k < introLines.length; k++) {
              page2.drawText(introLines[k], { x: 75, y: recY, size: 8, font, color: gray });
              recY -= 9;
            }
            recY -= 1; // Extra space after intro
          }
          lastGroup = rec.group;
        }
        // Draw bullet
        page2.drawText('•', { x: 70, y: recY, size: 9, font: fontBold, color: black }); // smaller font
        const info = PRODUCT_INFO[rec.name] || {};
        // Draw product name as blue, underlined, bold (simulate hyperlink)
        const nameWidth = fontBold.widthOfTextAtSize(rec.name, 9);
        page2.drawText(rec.name, { x: 85, y: recY, size: 9, font: fontBold, color: rgb(0.1, 0.3, 0.8) });
        page2.drawLine({ start: { x: 85, y: recY - 1 }, end: { x: 85 + nameWidth, y: recY - 1 }, thickness: 0.7, color: rgb(0.1, 0.3, 0.8) });
        // Draw description (word-wrapped, indented)
        if (info.description) {
          const descX = 85 + nameWidth + 5;
          const descWidth = 390 - nameWidth; // slightly reduced for margin
          const descLines = wrapTextToWidthPlain(info.description, font, 8, descWidth);
          for (let k = 0; k < descLines.length; k++) {
            page2.drawText((k === 0 ? ': ' : '    ') + descLines[k], { x: descX, y: recY, size: 8, font, color: rgb(0.2, 0.2, 0.2) });
            recY -= 9;
          }
          recY += 9; // Remove last extra line space
          recY -= 12; // Extra space after each product
        } else {
          recY -= 12;
        }
        // Add clickable hyperlink if URL is available
        if (info.url) {
          // PDF coordinates: y=0 is bottom, so we need to convert y to bottom-left origin
          // Page height is 841.89 (A4)
          const linkY = 841.89 - recY - 9; // 9 is the font size
          const linkAnnotation = pdfDoc.context.obj({
            Type: PDFName.of('Annot'),
            Subtype: PDFName.of('Link'),
            Rect: [85, linkY, 85 + nameWidth, linkY + 11],
            Border: [0, 0, 0],
            A: pdfDoc.context.obj({
              Type: PDFName.of('Action'),
              S: PDFName.of('URI'),
              URI: PDFString.of(info.url),
            }),
          });
          const linkRef = pdfDoc.context.register(linkAnnotation);
          let annotsArray = page2.node.Annots();
          if (annotsArray) {
            annotsArray.push(linkRef);
          } else {
            const arr = PDFArray.withContext(pdfDoc.context);
            arr.push(linkRef);
            page2.node.set(PDFName.of('Annots'), arr);
          }
        }
        if (recY < 120) break;
      }
    } else {
      page2.drawText('No recommendations available.', { x: 60, y: recY, size: 9, font, color: gray });
      recY -= 12;
    }
    // Tank Mixing Table
    let tableY = recY - 50;
    // Add section title above the table
    const tankMixingTitle = 'Tank Mixing Sequence';
    const tankMixingTitleFontSize = 11;
    const tableWidth = 475;
    const titleWidth = fontBold.widthOfTextAtSize(tankMixingTitle, tankMixingTitleFontSize);
    page2.drawText(tankMixingTitle, {
      x: 60 + (tableWidth - titleWidth) / 2,
      y: tableY + 22, // some space above the table header
      size: tankMixingTitleFontSize,
      font: fontBold,
      color: green,
    });
    // Add explanation below the title, centered
    const tankMixingExplanation = 'Follow this sequence for optimal mixing and application.';
    const explanationFontSize = 8;
    const explanationWidth = font.widthOfTextAtSize(tankMixingExplanation, explanationFontSize);
    page2.drawText(tankMixingExplanation, {
      x: 60 + (tableWidth - explanationWidth) / 2,
      y: tableY + 10,
      size: explanationFontSize,
      font: font,
      color: gray,
    });
    // Table header
    const headerHeight = 26;
    page2.drawRectangle({ x: 60, y: tableY - headerHeight, width: 475, height: headerHeight, color: green });
    const headers = ['SEQUENCE', 'PRODUCT DESCRIPTION', 'PRODUCTS', 'NOTES'];
    // Adjusted column x-positions for better alignment
    let colX = [62, 120, 260, 355];
    let colWidths = [50, 140, 95, 170];
    const headerFontSize = 8;
    const cellFontSize = 8;
    const cellPaddingX = 8;
    const cellPaddingY = 3;
    const minRowHeight = 16;
    // Draw header text centered vertically
    headers.forEach((h, i) => {
      const textWidth = fontBold.widthOfTextAtSize(h, headerFontSize);
      const colCenter = colX[i] + colWidths[i] / 2;
      page2.drawText(h, {
        x: colCenter - textWidth / 2,
        y: tableY - headerHeight / 2 - headerFontSize / 2 + 4,
        size: headerFontSize,
        font: fontBold,
        color: rgb(1, 1, 1),
      });
    });
    // Table rows
    let rowY = tableY - headerHeight;
    if (Array.isArray(data.tankMixing) && data.tankMixing.length > 0) {
      let rowIndex = 0;
      for (const row of data.tankMixing) {
        const seqText = String(row.sequence || '');
        const descLines = wrapTextToWidthPlain(row.description || '', font, cellFontSize, colWidths[1] - 2 * cellPaddingX);
        const prodLines = wrapTextToWidthPlain(row.products || '', font, cellFontSize, colWidths[2] - 2 * cellPaddingX);
        const notesLines = wrapTextToWidthPlain(row.notes || '', font, cellFontSize, colWidths[3] - 2 * cellPaddingX);
        const maxLines = Math.max(descLines.length, prodLines.length, notesLines.length, 1);
        const rowHeight = Math.max(minRowHeight, maxLines * (cellFontSize + 4) + 2 * cellPaddingY);
        // Alternate row background
        if (rowIndex % 2 === 0) {
          page2.drawRectangle({ x: 60, y: rowY - rowHeight, width: 475, height: rowHeight, color: rgb(0.97, 0.98, 0.95) });
        }
        // Calculate vertical centering offsets for each cell
        const lineHeight = cellFontSize + 4;
        // Use font metrics for perfect vertical centering
        // Sequence (always single line)
        const seqBlockHeight = lineHeight;
        const seqStartY = rowY - cellPaddingY - ((rowHeight - 2 * cellPaddingY - seqBlockHeight) / 2) - font.heightAtSize(cellFontSize) * 0.7;
        // Description
        const descBlockHeight = descLines.length * lineHeight;
        const descStartY = rowY - cellPaddingY - ((rowHeight - 2 * cellPaddingY - descBlockHeight) / 2) - font.heightAtSize(cellFontSize) * 0.7;
        // Products
        const prodBlockHeight = prodLines.length * lineHeight;
        const prodStartY = rowY - cellPaddingY - ((rowHeight - 2 * cellPaddingY - prodBlockHeight) / 2) - font.heightAtSize(cellFontSize) * 0.7;
        // Notes
        const notesBlockHeight = notesLines.length * lineHeight;
        const notesStartY = rowY - cellPaddingY - ((rowHeight - 2 * cellPaddingY - notesBlockHeight) / 2) - font.heightAtSize(cellFontSize) * 0.7;
        // Draw Sequence (always single line, vertically centered)
        page2.drawText(seqText, {
          x: colX[0] + cellPaddingX,
          y: seqStartY,
          size: cellFontSize,
          font,
          color: black
        });
        // Draw Description
        for (let i = 0; i < descLines.length; i++) {
          const y = descStartY - i * lineHeight;
          page2.drawText(descLines[i], { x: colX[1] + cellPaddingX, y, size: cellFontSize, font, color: black });
        }
        // Draw Products
        for (let i = 0; i < prodLines.length; i++) {
          const y = prodStartY - i * lineHeight;
          page2.drawText(prodLines[i], { x: colX[2] + cellPaddingX, y, size: cellFontSize, font, color: black });
        }
        // Draw Notes
        for (let i = 0; i < notesLines.length; i++) {
          const y = notesStartY - i * lineHeight;
          page2.drawText(notesLines[i], { x: colX[3] + cellPaddingX, y, size: cellFontSize, font, color: black });
        }
        // Draw cell borders (vertical and horizontal, lighter color)
        let cellT = rowY;
        let cellB = rowY - rowHeight;
        for (let c = 0; c < colX.length; c++) {
          page2.drawLine({ start: { x: colX[c] - 2, y: cellT }, end: { x: colX[c] - 2, y: cellB }, thickness: 0.4, color: rgb(0.85, 0.9, 0.8) });
        }
        // Fix rightmost border to match others
        page2.drawLine({ start: { x: 60 + 475, y: cellT }, end: { x: 60 + 475, y: cellB }, thickness: 0.4, color: rgb(0.85, 0.9, 0.8) });
        page2.drawLine({ start: { x: 60, y: cellT }, end: { x: 60 + 475, y: cellT }, thickness: 0.4, color: rgb(0.85, 0.9, 0.8) });
        page2.drawLine({ start: { x: 60, y: cellB }, end: { x: 60 + 475, y: cellB }, thickness: 0.4, color: rgb(0.85, 0.9, 0.8) });
        rowY -= rowHeight;
        rowIndex++;
        if (rowY < 120) break;
      }
    } else {
      page2.drawText('No tank mixing data.', { x: colX[0], y: rowY, size: 10, font, color: gray });
    }
    // --- Improved fixed bottom layout for score, signature, and disclaimer ---
    // Use full page width for centering
    const disclaimerBaseY = 40;
    const signatureBaseY = disclaimerBaseY + 38;
    const lineY = signatureBaseY + 30;
    const scoreY = signatureBaseY + 60;
    const starY = signatureBaseY + 90;

    // Variables for score and stars
    const scoreValue = typeof data.plantHealthScore === 'number' ? data.plantHealthScore : 0;
    let stars = 1;
    if (scoreValue >= 80) stars = 5;
    else if (scoreValue >= 60) stars = 4;
    else if (scoreValue >= 40) stars = 3;
    else if (scoreValue >= 20) stars = 2;
    const filledStarUrl = '/NTS G.R.O.W Star Full.png';
    const emptyStarUrl = '/NTS G.R.O.W Star Empty.png';
    const filledStarBytes = await fetch(filledStarUrl).then(res => res.arrayBuffer());
    const emptyStarBytes = await fetch(emptyStarUrl).then(res => res.arrayBuffer());
    const filledStarImg = await pdfDoc.embedPng(filledStarBytes);
    const emptyStarImg = await pdfDoc.embedPng(emptyStarBytes);
    const starWidth = 26;
    const starHeight = 26;
    const starGap = 4;

    // Disclaimer/footer (centered, bottom, small gray font)
    if (data.reportFooterText) {
      const disclaimerFontSize = 7;
      const disclaimerMaxWidth = 475;
      const disclaimerLines = wrapTextToWidthPlain(data.reportFooterText, font, disclaimerFontSize, disclaimerMaxWidth);
      let disclaimerY = disclaimerBaseY;
      for (let i = 0; i < disclaimerLines.length; i++) {
        page2.drawText(disclaimerLines[i], {
          x: (595.28 - disclaimerMaxWidth) / 2, // Use page width for centering
          y: disclaimerY,
          size: disclaimerFontSize,
          font: font,
          color: gray,
        });
        disclaimerY -= disclaimerFontSize + 1;
      }
    }
    // Signature block (centered, above disclaimer)
    if (data.agronomist && (data.agronomist.name || data.agronomist.role || data.agronomist.email)) {
      const name = data.agronomist.name || '';
      const nameFontSize = 9;
      const nameWidth = fontBold.widthOfTextAtSize(name, nameFontSize);
      page2.drawText(name, {
        x: (595.28 - nameWidth) / 2, // Use page width for centering
        y: signatureBaseY + 20,
        size: nameFontSize,
        font: fontBold,
        color: black,
      });
      let roleY = signatureBaseY + 8;
      if (data.agronomist.role) {
        const role = data.agronomist.role;
        const roleFontSize = 8;
        const roleWidth = font.widthOfTextAtSize(role, roleFontSize);
        page2.drawText(role, {
          x: (595.28 - roleWidth) / 2, // Use page width for centering
          y: roleY,
          size: roleFontSize,
          font: font,
          color: rgb(0.54, 0.54, 0.54),
        });
        roleY -= 12;
      }
      if (data.agronomist.email) {
        const email = data.agronomist.email;
        const emailFontSize = 8;
        const emailWidth = font.widthOfTextAtSize(email, emailFontSize);
        page2.drawText(email, {
          x: (595.28 - emailWidth) / 2, // Use page width for centering
          y: roleY,
          size: emailFontSize,
          font: font,
          color: rgb(0.54, 0.54, 0.54),
        });
      }
    } else {
      const placeholder = 'Signature: ___________________';
      const phFontSize = 9;
      const phWidth = fontBold.widthOfTextAtSize(placeholder, phFontSize);
      page2.drawText(placeholder, {
        x: (595.28 - phWidth) / 2, // Use page width for centering
        y: signatureBaseY + 20,
        size: phFontSize,
        font: fontBold,
        color: rgb(0.7, 0.7, 0.7),
      });
    }
    // Horizontal line above signature
    page2.drawLine({
      start: { x: 60, y: lineY },
      end: { x: 595.28 - 60, y: lineY }, // Use page width for line
      thickness: 1.5,
      color: rgb(0.88, 0.88, 0.88),
    });
    // Plant health score and stars (above signature)
    const scoreLabelFontSize = 17;
    const scoreValueFontSize = 17;
    const scoreLabel = 'Overall Plant Health Score:';
    const scoreValueText = ` ${scoreValue.toFixed(1)} / 100`;
    const scoreLabelWidth = fontBold.widthOfTextAtSize(scoreLabel, scoreLabelFontSize);
    const scoreValueWidth = fontBold.widthOfTextAtSize(scoreValueText, scoreValueFontSize);
    page2.drawText(scoreLabel, {
      x: (595.28 - (scoreLabelWidth + scoreValueWidth)) / 2, // Use page width for centering
      y: scoreY,
      size: scoreLabelFontSize,
      font: fontBold,
      color: green,
    });
    page2.drawText(scoreValueText, {
      x: (595.28 - (scoreLabelWidth + scoreValueWidth)) / 2 + scoreLabelWidth, // Use page width for centering
      y: scoreY,
      size: scoreValueFontSize,
      font: fontBold,
      color: green,
    });
    // Draw 5 PNG stars, centered, with compact spacing, above the score
    const totalStarsWidth = 5 * starWidth + 4 * starGap;
    for (let i = 0; i < 5; i++) {
      const img = i < stars ? filledStarImg : emptyStarImg;
      page2.drawImage(img, {
        x: (595.28 - totalStarsWidth) / 2 + i * (starWidth + starGap), // Use page width for centering
        y: starY,
        width: starWidth,
        height: starHeight,
      });
    }
    // Page number
    // drawPageNumber(page2, 1, 2, font);
  }
  // --- Insert back attachments as pages at the end ---
  if (attachments && attachments.backAttachments && attachments.backAttachments.length > 0) {
    for (const att of attachments.backAttachments) {
      let url = '';
      if (att === 'humic') url = '/attachments/Humic Acid Recipe.pdf';
      if (att === 'cover-crop') url = '/attachments/Cover Crop Mix Table.pdf';
      if (att === 'fulvic') url = '/attachments/Fulvic Acid Recipe.pdf';
      if (att === 'bam') url = '/attachments/BAM Recipe.pdf';
      // Add more mappings as needed
      if (url) {
        const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
        const existingPdf = await PDFDocument.load(existingPdfBytes);
        const copiedPages = await pdfDoc.copyPages(existingPdf, existingPdf.getPageIndices());
        copiedPages.forEach(page => pdfDoc.addPage(page));
      }
    }
  }

  // Download the PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${reportData.client || 'Plant_Report'}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
} 