const nav = document.getElementById("nav");
const menu = document.getElementById("menu");
const links = document.getElementById("links");

menu.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
});

links.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    links.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

const navLinks = [...document.querySelectorAll('.links a[href^="#"]')];
const sections = [...document.querySelectorAll("main section[id]")];

const syncNav = () => {
  const marker = window.scrollY + 180;
  let current = "top";
  sections.forEach((section) => {
    if (section.offsetTop <= marker) current = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
};

window.addEventListener("scroll", syncNav);
syncNav();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const tabs = [...document.querySelectorAll(".tab")];
const panels = [...document.querySelectorAll(".code")];
const copyButton = document.getElementById("copyCode");

const activePanel = () => panels.find((panel) => panel.classList.contains("active"));

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.toggle("active", item === tab));
    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === tab.dataset.tab);
    });
    copyButton.textContent = "نسخ الكود";
  });
});

copyButton.addEventListener("click", async () => {
  const panel = activePanel();
  if (!panel) return;
  try {
    await navigator.clipboard.writeText(panel.textContent.trim());
    copyButton.textContent = "تم النسخ";
  } catch (error) {
    const area = document.createElement("textarea");
    area.value = panel.textContent.trim();
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    copyButton.textContent = "تم النسخ";
  }
  setTimeout(() => {
    copyButton.textContent = "نسخ الكود";
  }, 1600);
});

const fakeSearch = document.getElementById("fakeSearch");
const fakeList = document.getElementById("fakeList");
const fakeRefresh = document.getElementById("fakeRefresh");
const fakeInject = document.getElementById("fakeInject");
const fakeLog = document.getElementById("fakeLog");

const addLog = (message, kind = "") => {
  const line = document.createElement("div");
  const stamp = new Date().toLocaleTimeString("en-GB", { hour12: false });
  const time = document.createElement("em");
  time.textContent = "[" + stamp + "] ";
  line.appendChild(time);
  line.appendChild(document.createTextNode(message));
  if (kind) line.classList.add(kind);
  fakeLog.appendChild(line);
  fakeLog.scrollTop = fakeLog.scrollHeight;
};

fakeSearch.addEventListener("input", () => {
  const query = fakeSearch.value.trim().toLowerCase();
  [...fakeList.children].forEach((row) => {
    row.style.display = row.textContent.toLowerCase().includes(query) ? "flex" : "none";
  });
});

fakeList.addEventListener("click", (event) => {
  const row = event.target.closest(".proc");
  if (!row) return;
  [...fakeList.children].forEach((item) => item.classList.remove("selected"));
  row.classList.add("selected");
});

fakeRefresh.addEventListener("click", () => {
  addLog("process list refreshed (" + fakeList.children.length + " entries)");
});

fakeInject.addEventListener("click", () => {
  const selected = fakeList.querySelector(".proc.selected");
  if (!selected) {
    addLog("select a process first", "bad");
    return;
  }

  const name = selected.querySelector("span").textContent;
  fakeInject.disabled = true;
  addLog("injection started — " + name);
  addLog("2 seconds before injection");

  setTimeout(() => {
    addLog("Injection successful! — base 0x7FFA31C40000", "ok");
    fakeInject.disabled = false;
  }, 1600);
});

document.querySelectorAll(".faq details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".faq details").forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});
