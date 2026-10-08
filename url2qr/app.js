"use strict";

const form = document.querySelector("#url-form");
const input = document.querySelector("#url-input");
const errorMessage = document.querySelector("#form-error");
const workspace = document.querySelector("#workspace");
const result = document.querySelector("#qr-result");
const canvas = document.querySelector("#qr-canvas");
const downloadButton = document.querySelector("#qr-download");
const submitButton = document.querySelector("#submit-button");
const generationStatus = document.querySelector("#generation-status");
const toast = document.querySelector("#toast");
let generatedUrl = null;
let toastTimer;

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  input.setAttribute("aria-invalid", "true");
  input.focus();
}

function clearError() {
  errorMessage.hidden = true;
  errorMessage.textContent = "";
  input.removeAttribute("aria-invalid");
}

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error("QR코드로 만들 URL을 입력해 주세요.");
  if (/\s/.test(trimmed)) throw new Error("URL에 공백이 들어갈 수 없습니다.");
  const isHostWithPort = /^(?:[a-z\d.-]+|\[[a-f\d:]+\]):\d+(?:[/?#]|$)/i.test(trimmed);
  if (/^[a-z][a-z\d+.-]*:/i.test(trimmed) && !/^https?:\/\//i.test(trimmed) && !isHostWithPort) {
    throw new Error("http:// 또는 https://로 시작하는 웹 주소를 입력해 주세요.");
  }
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url;
  try { url = new URL(candidate); } catch { throw new Error("올바른 URL을 입력해 주세요. 예: https://example.com"); }
  if (!url.hostname || url.username || url.password || (!url.hostname.includes(".") && url.hostname !== "localhost" && !url.hostname.startsWith("["))) {
    throw new Error("올바른 웹 주소를 입력해 주세요. 예: https://example.com");
  }
  return url.href;
}

function createQrCanvas(url) {
  const qr = qrcodegen.QrCode.encodeText(url, qrcodegen.QrCode.Ecc.MEDIUM);
  const quietZone = 4;
  const moduleCount = qr.size + quietZone * 2;
  const moduleSize = Math.max(1, Math.floor(1024 / moduleCount));
  const nextCanvas = document.createElement("canvas");
  nextCanvas.width = nextCanvas.height = 1024;
  const context = nextCanvas.getContext("2d");
  if (!context) throw new Error("이 브라우저에서 QR 이미지를 만들 수 없습니다.");
  const offset = Math.floor((1024 - qr.size * moduleSize) / 2);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 1024, 1024);
  context.fillStyle = "#000000";
  for (let y = 0; y < qr.size; y++) {
    for (let x = 0; x < qr.size; x++) {
      if (qr.getModule(x, y)) context.fillRect(offset + x * moduleSize, offset + y * moduleSize, moduleSize, moduleSize);
    }
  }
  return nextCanvas;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearError();
  let url;
  try { url = normalizeUrl(input.value); } catch (error) { showError(error.message); return; }
  if (typeof qrcodegen === "undefined") {
    showError("QR 생성 파일을 불러오지 못했습니다. 페이지를 새로 열어 주세요.");
    return;
  }
  submitButton.disabled = true;
  try {
    const nextCanvas = createQrCanvas(url);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("이 브라우저에서 QR 이미지를 표시할 수 없습니다.");
    context.drawImage(nextCanvas, 0, 0);
    generatedUrl = url;
    input.value = url;
    canvas.setAttribute("aria-label", `${url}의 QR코드`);
    const isFirst = result.hidden;
    result.hidden = false;
    workspace.classList.add("has-result");
    if (isFirst) result.classList.add("is-revealing");
    generationStatus.textContent = "QR코드가 생성되었습니다. QR코드를 클릭하면 JPG 파일로 저장할 수 있습니다.";
  } catch (error) {
    showError(error instanceof RangeError ? "URL이 너무 깁니다. 더 짧은 주소를 입력해 주세요." : "QR코드를 만들지 못했습니다. URL을 확인해 주세요.");
  } finally { submitButton.disabled = false; }
});

input.addEventListener("input", clearError);
result.addEventListener("animationend", () => result.classList.remove("is-revealing"));

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("visible");
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3500);
}

downloadButton.addEventListener("click", () => {
  if (!generatedUrl || downloadButton.disabled) return;
  const urlAtClick = generatedUrl;
  downloadButton.disabled = true;
  canvas.toBlob((blob) => {
    downloadButton.disabled = false;
    if (!blob || blob.type !== "image/jpeg") {
      showToast("JPG를 만들지 못했습니다. 다른 브라우저에서 다시 시도해 주세요.");
      return;
    }
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const hostname = new URL(urlAtClick).hostname.replace(/[^a-z\d.-]/gi, "_");
    link.href = objectUrl;
    link.download = `url2qr-${hostname}.jpg`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    showToast("JPG 다운로드를 시작했습니다.");
  }, "image/jpeg", 1);
});
