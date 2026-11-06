(() => {
  const MAX_BOOK_BYTES = 20 * 1024 * 1024;
  const MAX_ARCHIVE_EXPANDED_BYTES = 100 * 1024 * 1024;
  const MAX_COVER_INPUT_BYTES = 12 * 1024 * 1024;
  const MAX_COVER_OUTPUT_BYTES = 4 * 1024 * 1024;

  function fileExtension(file) {
    return file.name.split(".").pop().toLowerCase();
  }

  function requireLibrary(library, name) {
    if (!library) throw new Error(`O conversor ${name} não carregou. Atualize a página e tente novamente.`);
  }

  function zipLibrary() {
    requireLibrary(window.JSZip, "de arquivos");
    return new window.JSZip();
  }

  function validateArchiveSize(archive, format) {
    const entries = Object.values(archive.files);
    if (entries.length > 10000) throw new Error(`O ${format} contém arquivos demais para ser processado.`);
    let expandedBytes = 0;
    for (const entry of entries) {
      if (entry.dir) continue;
      const size = entry._data?.uncompressedSize;
      if (!Number.isFinite(size)) throw new Error(`Não foi possível validar o tamanho interno do ${format}.`);
      expandedBytes += size;
      if (expandedBytes > MAX_ARCHIVE_EXPANDED_BYTES) {
        throw new Error(`O ${format} descompactado ultrapassa o limite seguro de 100 MB.`);
      }
    }
  }

  function xmlEscape(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;"
    })[character]);
  }

  function textToXhtml(text) {
    const blocks = [];
    let paragraph = [];
    const flush = () => {
      if (paragraph.length) {
        blocks.push(`<p>${paragraph.map(escapeXhtml).join("<br/>")}</p>`);
        paragraph = [];
      }
    };

    for (const line of text.replace(/\r\n?/g, "\n").split("\n")) {
      const heading = /^(#{1,6})\s+(.+)$/.exec(line);
      if (heading) {
        flush();
        const level = Math.min(heading[1].length + 1, 6);
        blocks.push(`<h${level}>${escapeXhtml(heading[2])}</h${level}>`);
      } else if (line.trim()) {
        paragraph.push(line);
      } else {
        flush();
      }
    }
    flush();
    return blocks.join("\n");
  }

  function escapeXhtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;"
    })[character]);
  }

  function imageDataUri(source) {
    const match = /^data:(image\/(?:png|jpeg|gif|svg\+xml));base64,([a-z0-9+/=\r\n]+)$/i.exec(source);
    if (!match) throw new Error("O DOCX contém uma imagem em formato não compatível com EPUB.");
    const extension = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/gif": "gif",
      "image/svg+xml": "svg"
    }[match[1].toLowerCase()];
    const binary = atob(match[2].replace(/\s/g, ""));
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return { extension, mediaType: match[1].toLowerCase(), bytes };
  }

  function cleanDocxHtml(html, imageItems) {
    const parsed = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
    let imageIndex = 0;
    for (const image of parsed.body.querySelectorAll("img")) {
      const imageData = imageDataUri(image.getAttribute("src") || "");
      const path = `images/image-${imageIndex}.${imageData.extension}`;
      imageItems.push({
        id: `image-${imageIndex}`,
        href: path,
        mediaType: imageData.mediaType,
        bytes: imageData.bytes
      });
      image.setAttribute("src", path);
      imageIndex += 1;
    }

    const allowedTags = new Set([
      "a", "blockquote", "br", "caption", "div", "em", "h1", "h2", "h3",
      "h4", "h5", "h6", "hr", "img", "li", "ol", "p", "strong", "sub",
      "sup", "table", "tbody", "td", "th", "thead", "tr", "ul"
    ]);
    for (const element of [...parsed.body.querySelectorAll("*")]) {
      if (!element.isConnected) continue;
      if (!allowedTags.has(element.tagName.toLowerCase())) {
        element.replaceWith(...element.childNodes);
        continue;
      }
      for (const attribute of [...element.attributes]) {
        if (element.tagName === "A" && attribute.name === "href") {
          if (!/^(https?:|mailto:|#)/i.test(attribute.value)) element.removeAttribute(attribute.name);
        } else if (element.tagName === "IMG" && ["src", "alt", "title"].includes(attribute.name)) {
          if (attribute.name === "src" && !/^images\/image-\d+\.(?:png|jpg|gif|svg)$/.test(attribute.value)) {
            element.removeAttribute(attribute.name);
          }
        } else if (attribute.name !== "alt" && attribute.name !== "title") {
          element.removeAttribute(attribute.name);
        }
      }
    }
    function serialize(node) {
      if (node.nodeType === 3) return xmlEscape(node.nodeValue);
      if (node.nodeType !== 1) return "";
      const tag = node.tagName.toLowerCase();
      if (!allowedTags.has(tag)) return [...node.childNodes].map(serialize).join("");
      const attributes = [...node.attributes].filter(attribute => {
        if (tag === "a") return ["href", "title"].includes(attribute.name);
        if (tag === "img") return ["src", "alt", "title"].includes(attribute.name);
        return false;
      }).map(attribute => ` ${attribute.name}="${xmlEscape(attribute.value)}"`).join("");
      if (["br", "hr", "img"].includes(tag)) return `<${tag}${attributes}/>`;
      return `<${tag}${attributes}>${[...node.childNodes].map(serialize).join("")}</${tag}>`;
    }
    return [...parsed.body.childNodes].map(serialize).join("");
  }

  async function makeEpub({ title, author, bodyHtml, images = [] }) {
    const zip = zipLibrary();
    const imageItems = [...images];
    zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
    for (const image of imageItems) zip.file(`OEBPS/${image.href}`, image.bytes);
    zip.file("META-INF/container.xml", `<?xml version="1.0" encoding="UTF-8"?>
<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`);
    zip.file("OEBPS/content.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR">
<head><title>${xmlEscape(title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body><h1>${xmlEscape(title)}</h1><p class="author">${xmlEscape(author)}</p>${bodyHtml}</body>
</html>`);
    zip.file("OEBPS/style.css", "body{font-family:serif;line-height:1.6;margin:5%;}h1{text-align:center;}p{margin:0 0 1em;}img{max-width:100%;height:auto;}table{border-collapse:collapse;max-width:100%;}td,th{border:1px solid #888;padding:.3em;}");
    zip.file("OEBPS/nav.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR">
<head><title>Sumário</title></head><body><nav epub:type="toc" id="toc"><h1>Sumário</h1>
<ol><li><a href="content.xhtml">${xmlEscape(title)}</a></li></ol></nav></body></html>`);

    const manifest = [
      '<item id="content" href="content.xhtml" media-type="application/xhtml+xml"/>',
      '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
      '<item id="style" href="style.css" media-type="text/css"/>',
      ...imageItems.map(image =>
        `<item id="${xmlEscape(image.id)}" href="${xmlEscape(image.href)}" media-type="${xmlEscape(image.mediaType)}"/>`
      )
    ].join("");
    const now = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    const identifier = `urn:uuid:${crypto.randomUUID()}`;
    zip.file("OEBPS/content.opf", `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id" xml:lang="pt-BR">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:identifier id="pub-id">${identifier}</dc:identifier><dc:title>${xmlEscape(title)}</dc:title>
  <dc:creator>${xmlEscape(author)}</dc:creator><dc:language>pt-BR</dc:language>
  <meta property="dcterms:modified">${now}</meta>
</metadata><manifest>${manifest}</manifest><spine><itemref idref="content"/></spine></package>`);
    const blob = await zip.generateAsync({
      type: "blob",
      mimeType: "application/epub+zip",
      compression: "DEFLATE",
      compressionOptions: { level: 9 }
    });
    if (blob.size > MAX_BOOK_BYTES) throw new Error("O EPUB convertido ultrapassou o limite de 20 MB.");
    return blob;
  }

  async function convertTextToEpub(file, title, author) {
    let text;
    try {
      text = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer());
    } catch {
      throw new Error("O arquivo TXT/MD precisa estar codificado em UTF-8.");
    }
    if (!text.trim()) throw new Error("O arquivo de texto está vazio.");
    return makeEpub({ title, author, bodyHtml: textToXhtml(text) });
  }

  async function convertDocxToEpub(file, title, author) {
    requireLibrary(window.mammoth, "DOCX");
    const source = await file.arrayBuffer();
    const archive = await zipLibrary().loadAsync(source);
    validateArchiveSize(archive, "DOCX");
    if (!archive.file("word/document.xml")) throw new Error("O arquivo DOCX não contém um documento válido.");
    const result = await window.mammoth.convertToHtml({ arrayBuffer: source });
    const images = [];
    const bodyHtml = cleanDocxHtml(result.value, images);
    if (!bodyHtml.trim()) throw new Error("Não foi possível extrair texto do arquivo DOCX.");
    const blob = await makeEpub({ title, author, bodyHtml, images });
    const warnings = result.messages.length
      ? ["O DOCX foi convertido, mas alguns elementos de formatação podem ter sido simplificados."]
      : [];
    return { blob, warnings };
  }

  async function checkEpub(archive) {
    validateArchiveSize(archive, "EPUB");
    const mimetype = archive.file("mimetype");
    const container = archive.file("META-INF/container.xml");
    if (!mimetype || !container || (await mimetype.async("string")).trim() !== "application/epub+zip") {
      throw new Error("O EPUB está inválido ou incompleto.");
    }
    const xml = new DOMParser().parseFromString(await container.async("string"), "application/xml");
    if (xml.querySelector("parsererror")) throw new Error("O EPUB possui um índice inválido.");
    const rootfile = xml.querySelector("rootfile")?.getAttribute("full-path");
    if (!rootfile || rootfile.startsWith("/") || rootfile.split("/").includes("..") || !archive.file(rootfile)) {
      throw new Error("O EPUB não contém um livro legível.");
    }
  }

  async function optimizeEpub(file) {
    const zip = zipLibrary();
    const source = await zip.loadAsync(await file.arrayBuffer());
    await checkEpub(source);
    const optimized = zipLibrary();
    optimized.file("mimetype", "application/epub+zip", { compression: "STORE" });
    for (const entry of Object.values(source.files)) {
      if (entry.dir || entry.name === "mimetype") continue;
      const bytes = await entry.async("uint8array");
      const extension = fileExtension({ name: entry.name });
      const alreadyCompressed = ["jpg", "jpeg", "png", "gif", "webp", "mp3", "mp4", "woff", "woff2"].includes(extension);
      optimized.file(entry.name, bytes, {
        binary: true,
        date: entry.date,
        compression: alreadyCompressed ? "STORE" : "DEFLATE"
      });
    }
    const blob = await optimized.generateAsync({
      type: "blob",
      mimeType: "application/epub+zip",
      compression: "DEFLATE",
      compressionOptions: { level: 9 }
    });
    return blob.size < file.size
      ? { blob, warnings: [] }
      : { blob: file, warnings: ["O EPUB original foi mantido porque já era menor que a versão otimizada."] };
  }

  async function optimizePdf(file) {
    requireLibrary(window.PDFLib, "PDF");
    const source = await file.arrayBuffer();
    const bytesToText = (buffer, start, length) =>
      new TextDecoder().decode(new Uint8Array(buffer, start, length));
    const header = bytesToText(source, 0, Math.min(source.byteLength, 1024));
    const tailStart = Math.max(0, source.byteLength - 2048);
    const tail = bytesToText(source, tailStart, source.byteLength - tailStart);
    if (!header.includes("%PDF-") || !tail.includes("%%EOF")) {
      throw new Error("O arquivo não contém um PDF válido.");
    }
    try {
      const document = await window.PDFLib.PDFDocument.load(source, { updateMetadata: false });
      const optimizedBytes = await document.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
        updateFieldAppearances: false
      });
      const optimizedDocument = await window.PDFLib.PDFDocument.load(optimizedBytes, { updateMetadata: false });
      if (optimizedDocument.getPageCount() !== document.getPageCount()) {
        throw new Error("A regravação alterou a quantidade de páginas.");
      }
      const blob = new Blob([optimizedBytes], { type: "application/pdf" });
      return blob.size < file.size
        ? { blob, warnings: [] }
        : { blob: file, warnings: ["O PDF original foi mantido porque já era menor que a versão otimizada."] };
    } catch (error) {
      throw new Error(`Não foi possível validar ou otimizar o PDF. Ele pode estar corrompido, protegido por senha ou usar recursos incompatíveis. ${error.message || ""}`.trim());
    }
  }

  async function prepareBookFile(file, { title, author }) {
    if (!file || file.size === 0) throw new Error("Selecione um arquivo de livro válido.");
    if (file.size > MAX_BOOK_BYTES) throw new Error("O arquivo do livro ultrapassa o limite de 20 MB.");
    const extension = fileExtension(file);
    if (extension === "pdf") {
      const optimized = await optimizePdf(file);
      if (optimized.blob.size > MAX_BOOK_BYTES) throw new Error("O PDF otimizado ultrapassou o limite de 20 MB.");
      return { blob: optimized.blob, format: "pdf", extension: "pdf", contentType: "application/pdf", warnings: optimized.warnings };
    }
    if (extension === "epub") {
      const optimized = await optimizeEpub(file);
      if (optimized.blob.size > MAX_BOOK_BYTES) throw new Error("O EPUB otimizado ultrapassou o limite de 20 MB.");
      return { blob: optimized.blob, format: "epub", extension: "epub", contentType: "application/epub+zip", warnings: optimized.warnings };
    }
    if (extension === "txt" || extension === "md") {
      const blob = await convertTextToEpub(file, title, author);
      return { blob, format: "epub", extension: "epub", contentType: "application/epub+zip", warnings: [] };
    }
    if (extension === "docx") {
      const converted = await convertDocxToEpub(file, title, author);
      return { blob: converted.blob, format: "epub", extension: "epub", contentType: "application/epub+zip", warnings: converted.warnings };
    }
    throw new Error("Formato de livro não suportado. Envie PDF, EPUB, TXT, MD ou DOCX.");
  }

  function encodeWebp(canvas, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error("Não foi possível converter a capa para WebP."));
          return;
        }
        if (blob.type !== "image/webp") {
          reject(new Error("Este navegador não oferece conversão de imagens para WebP."));
          return;
        }
        resolve(blob);
      }, "image/webp", quality);
    });
  }

  async function prepareCoverFile(file) {
    if (!file || file.size === 0) throw new Error("Selecione uma imagem de capa válida.");
    if (file.size > MAX_COVER_INPUT_BYTES) throw new Error("A imagem da capa ultrapassa o limite de 12 MB.");
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type.toLowerCase())) {
      throw new Error("A capa precisa ser uma imagem PNG, JPG ou WebP.");
    }
    if (!window.createImageBitmap) throw new Error("Este navegador não oferece suporte à conversão de capas.");

    const image = await createImageBitmap(file);
    try {
      if (image.width * image.height > 50_000_000) throw new Error("A resolução da capa é grande demais.");
      const scale = Math.min(1, 1600 / image.width, 2400 / image.height);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Não foi possível preparar a imagem da capa.");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      let smallestWebp = null;
      for (const quality of [0.82, 0.72, 0.62, 0.52, 0.42]) {
        const candidate = await encodeWebp(canvas, quality);
        if (!smallestWebp || candidate.size < smallestWebp.size) smallestWebp = candidate;
        if (candidate.size <= MAX_COVER_OUTPUT_BYTES) break;
      }
      if (!smallestWebp || smallestWebp.size > MAX_COVER_OUTPUT_BYTES) {
        throw new Error("A capa continua maior que 4 MB após a otimização.");
      }
      if (smallestWebp.size < file.size) {
        return {
          blob: smallestWebp,
          extension: "webp",
          contentType: "image/webp",
          warnings: []
        };
      }
      const originalExtension = fileExtension(file);
      const contentType = file.type.toLowerCase();
      return {
        blob: file,
        extension: originalExtension === "jpeg" ? "jpg" : originalExtension,
        contentType,
        warnings: ["A capa original foi mantida porque já ocupava menos espaço que a versão WebP."]
      };
    } finally {
      image.close();
    }
  }

  window.LelivrosUploads = { prepareBookFile, prepareCoverFile };
})();
