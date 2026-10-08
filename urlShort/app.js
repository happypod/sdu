"use strict";

const form = document.querySelector("#shorten-form");
const input = document.querySelector("#shorten-input");
const submitButton = document.querySelector("#shorten-button");
const output = document.querySelector("#shorten-output");
const copyButton = document.querySelector("#copy-button");
const errorMessage = document.querySelector("#shorten-error");
const statusMessage = document.querySelector("#shorten-status");
const cache = new Map();
let busy = false;
let cooldownUntil = 0;
let cooldownTimer;

function updateButton() {
  const cooldown = Date.now() < cooldownUntil;
  submitButton.disabled = busy || cooldown || input.value.trim() === "";
  submitButton.textContent = busy ? "단축 중…" : cooldown ? "잠시 대기" : "단축하기";
  input.readOnly = busy;
  form.setAttribute("aria-busy", String(busy));
}

function clearError() {
  errorMessage.hidden = true;
  errorMessage.textContent = "";
  input.removeAttribute("aria-invalid");
}

function showError(message, invalidInput = false) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  if (invalidInput) {
    input.setAttribute("aria-invalid", "true");
    input.focus();
  }
}

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error("단축할 URL을 입력해 주세요.");
  if (/\s|\\/.test(trimmed)) throw new Error("URL에 공백이나 역슬래시를 넣을 수 없습니다.");
  const isHostWithPort = /^(?:[a-z\d.-]+|\[[a-f\d:]+\]):\d+(?:[/?#]|$)/i.test(trimmed);
  if (/^[a-z][a-z\d+.-]*:/i.test(trimmed) && !/^https?:\/\//i.test(trimmed) && !isHostWithPort) {
    throw new Error("http:// 또는 https:// 웹 주소를 입력해 주세요.");
  }
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url;
  try { url = new URL(candidate); } catch { throw new Error("올바른 URL을 입력해 주세요. 예: https://example.com"); }
  if (!url.hostname || url.username || url.password || !url.hostname.includes(".")) {
    throw new Error("공개 웹사이트의 URL을 입력해 주세요. 예: https://example.com");
  }
  return url.href;
}

async function shortenUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch("https://da.gd/s", {
      method: "POST",
      body: new URLSearchParams({ url }),
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: controller.signal,
    });
    const data = (await response.text()).trim();
    if (response.status === 429) {
      cooldownUntil = Date.now() + 60000;
      clearTimeout(cooldownTimer);
      cooldownTimer = setTimeout(() => { cooldownUntil = 0; updateButton(); }, 60000);
      throw new Error("단축 요청이 많습니다. 1분 후 다시 시도해 주세요.");
    }
    if (response.status === 400 || response.status === 422) throw new Error("단축 서비스에서 URL을 처리하지 못했습니다. 주소를 확인해 주세요.");
    if (!response.ok) throw new Error("단축 서비스에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    let shortUrl;
    try { shortUrl = new URL(data); } catch { throw new Error("올바른 단축 URL을 받지 못했습니다. 다시 시도해 주세요."); }
    if (shortUrl.protocol !== "https:" || shortUrl.hostname !== "da.gd" || shortUrl.username || shortUrl.password || !/^\/[a-z\d_-]+$/i.test(shortUrl.pathname) || shortUrl.search || shortUrl.hash || shortUrl.port) {
      throw new Error("올바른 단축 URL을 받지 못했습니다. 다시 시도해 주세요.");
    }
    return shortUrl.href;
  } catch (error) {
    if (error.name === "AbortError") throw new Error("응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.");
    if (error instanceof TypeError) throw new Error("네트워크 연결을 확인한 뒤 다시 시도해 주세요.");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

input.addEventListener("input", () => {
  clearError();
  output.value = "";
  copyButton.disabled = true;
  statusMessage.textContent = "URL을 입력하고 단축하기를 눌러 주세요.";
  updateButton();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy || Date.now() < cooldownUntil) return;
  clearError();
  let url;
  try { url = normalizeUrl(input.value); }
  catch (error) { showError(error.message, true); return; }
  busy = true;
  output.value = "";
  copyButton.disabled = true;
  statusMessage.textContent = "URL을 단축하고 있습니다…";
  updateButton();
  try {
    const shortened = cache.get(url) || await shortenUrl(url);
    cache.set(url, shortened);
    input.value = url;
    output.value = shortened;
    copyButton.disabled = false;
    statusMessage.textContent = "단축 URL이 생성되었습니다. 복사해서 공유해 보세요.";
  } catch (error) {
    statusMessage.textContent = "단축 URL을 만들지 못했습니다.";
    showError(error.message);
  } finally {
    busy = false;
    updateButton();
  }
});

function legacyCopy(value) {
  output.focus();
  output.select();
  output.setSelectionRange(0, value.length);
  if (!document.execCommand("copy")) throw new Error("copy failed");
}

copyButton.addEventListener("click", async () => {
  const value = output.value;
  if (!value || copyButton.disabled) return;
  copyButton.disabled = true;
  clearError();
  try {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(value); }
      catch { legacyCopy(value); }
    } else { legacyCopy(value); }
    window.alert("복사하였습니다");
    copyButton.focus();
  } catch {
    showError("자동 복사를 사용할 수 없습니다. 출력 상자의 URL을 선택해 직접 복사해 주세요.");
  } finally {
    copyButton.disabled = !output.value;
  }
});

updateButton();
