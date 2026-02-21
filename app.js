const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

const toastContainer = $("#toast-container");

const showToast = (message) => {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2600);
};

const copyText = async (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    textarea.remove();
    return success;
};

const applyTheme = (theme) => {
    document.body.classList.toggle("theme-focus", theme === "focus");
    const button = $("#theme-toggle");
    if (button) {
        button.textContent = theme === "focus" ? "Modo normal" : "Modo enfoque";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const dateEl = $("[data-current-date]");
    if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    const storedTheme = localStorage.getItem("theme-mode") || "default";
    applyTheme(storedTheme);

    const themeToggle = $("#theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = document.body.classList.contains("theme-focus") ? "default" : "focus";
            localStorage.setItem("theme-mode", nextTheme);
            applyTheme(nextTheme);
            showToast("Tema actualizado");
        });
    }

    const revealElements = $$(".reveal");
    if (revealElements.length) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        revealElements.forEach((el) => revealObserver.observe(el));
    }

    const counters = $$('[data-counter]');
    if (counters.length) {
        let countersStarted = false;
        const runCounters = () => {
            counters.forEach((counter) => {
                const target = Number(counter.dataset.counter);
                let current = 0;
                const step = Math.max(1, Math.floor(target / 30));
                const tick = () => {
                    current += step;
                    if (current >= target) {
                        counter.textContent = target;
                    } else {
                        counter.textContent = current;
                        requestAnimationFrame(tick);
                    }
                };
                requestAnimationFrame(tick);
            });
        };

        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !countersStarted) {
                        countersStarted = true;
                        runCounters();
                        counterObserver.disconnect();
                    }
                });
            },
            { threshold: 0.3 }
        );

        counterObserver.observe(counters[0].closest("section") || counters[0]);
    }

    const tabButtons = $$(".tab-button");
    const tabPanels = $$(".tab-panel");
    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const target = button.dataset.tabTarget;
            tabButtons.forEach((btn) => btn.classList.toggle("is-active", btn === button));
            tabPanels.forEach((panel) => panel.classList.toggle("is-active", panel.id === target));
        });
    });

    const commandFilter = $("#command-filter");
    const commandItems = $$(".command-item");
    const commandCount = $("#command-count");
    const commandEmpty = $("#command-empty");

    const updateCommandList = () => {
        const query = commandFilter ? commandFilter.value.trim().toLowerCase() : "";
        let visible = 0;

        commandItems.forEach((item) => {
            const content = `${item.dataset.command} ${item.dataset.tags} ${item.textContent}`.toLowerCase();
            const matches = !query || content.includes(query);
            item.hidden = !matches;
            if (matches) visible += 1;
        });

        if (commandCount) commandCount.textContent = visible;
        if (commandEmpty) commandEmpty.hidden = visible !== 0;
    };

    if (commandFilter) {
        commandFilter.addEventListener("input", updateCommandList);
        updateCommandList();
    }

    $$("[data-copy]").forEach((button) => {
        button.addEventListener("click", async () => {
            const value = button.dataset.copy || "";
            if (!value) return;
            try {
                await copyText(value);
                showToast("Copiado al portapapeles");
            } catch (error) {
                showToast("No se pudo copiar");
            }
        });
    });

    const statusMap = {
        clean: {
            output: "On branch main\nnothing to commit, working tree clean",
            description: "Todo esta en orden. Buen momento para crear una nueva tarea.",
        },
        modified: {
            output: "On branch main\nChanges not staged for commit:\n  modified:   index.html\n  modified:   app.js",
            description: "Hay cambios locales. Puedes revisar con git diff.",
        },
        staged: {
            output: "On branch main\nChanges to be committed:\n  modified:   style.css\n  new file:   assets/diagram.md",
            description: "Cambios listos para commit. Revisa el mensaje.",
        },
        conflict: {
            output: "On branch main\nYou have unmerged paths.\n  both modified:   index.html",
            description: "Hay un conflicto. Resuelve manualmente y luego agrega los archivos.",
        },
    };

    const statusSelect = $("#status-state");
    const statusOutput = $("#status-output");
    const statusDescription = $("#status-description");

    const updateStatus = () => {
        if (!statusSelect || !statusOutput || !statusDescription) return;
        const state = statusMap[statusSelect.value];
        statusOutput.textContent = state.output;
        statusDescription.textContent = state.description;
    };

    if (statusSelect) {
        statusSelect.addEventListener("change", updateStatus);
        updateStatus();
    }

    const logAdd = $("#log-add");
    const logMessage = $("#log-message");
    const logList = $("#commit-log");

    if (logAdd && logMessage && logList) {
        logAdd.addEventListener("click", () => {
            const message = logMessage.value.trim();
            if (!message) {
                showToast("Escribe un mensaje para el commit");
                return;
            }

            const hash = Math.random().toString(16).slice(2, 9);
            const item = document.createElement("li");
            const hashEl = document.createElement("span");
            hashEl.className = "commit-hash";
            hashEl.textContent = hash;
            const messageEl = document.createElement("span");
            messageEl.className = "commit-message";
            messageEl.textContent = message;
            const timeEl = document.createElement("span");
            timeEl.className = "commit-time";
            timeEl.textContent = "justo ahora";
            item.append(hashEl, messageEl, timeEl);
            logList.prepend(item);
            logMessage.value = "";
        });
    }

    const progressInputs = $$('[data-progress]');
    const progressBar = $("#progress-bar");
    const progressValue = $("#progress-value");

    const storedProgress = new Set(JSON.parse(localStorage.getItem("git-progress") || "[]"));
    progressInputs.forEach((input) => {
        if (storedProgress.has(input.dataset.progress)) {
            input.checked = true;
        }
    });

    const updateProgress = () => {
        const total = progressInputs.length;
        const done = progressInputs.filter((input) => input.checked).length;
        const percentage = total ? Math.round((done / total) * 100) : 0;
        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressValue) progressValue.textContent = `${percentage}%`;
        const activeIds = progressInputs.filter((input) => input.checked).map((input) => input.dataset.progress);
        localStorage.setItem("git-progress", JSON.stringify(activeIds));
    };

    progressInputs.forEach((input) => input.addEventListener("change", updateProgress));
    updateProgress();

    const commitType = $("#commit-type");
    const commitScope = $("#commit-scope");
    const commitSummary = $("#commit-summary");
    const commitDetails = $("#commit-details");
    const commitBreaking = $("#commit-breaking");
    const commitBreakingDetail = $("#commit-breaking-detail");
    const commitIssue = $("#commit-issue");
    const commitPreview = $("#commit-preview");
    const commitCopy = $("#commit-copy");

    const updateCommitPreview = () => {
        if (!commitPreview) return;
        const type = commitType ? commitType.value : "";
        const scope = commitScope ? commitScope.value.trim() : "";
        const summary = commitSummary ? commitSummary.value.trim() : "";
        const details = commitDetails ? commitDetails.value.trim() : "";
        const isBreaking = commitBreaking ? commitBreaking.checked : false;
        const breakingText = commitBreakingDetail ? commitBreakingDetail.value.trim() : "";
        const issue = commitIssue ? commitIssue.value.trim() : "";

        if (!summary) {
            commitPreview.textContent = "Completa el formulario para generar el mensaje.";
            return;
        }

        const scopeText = scope ? `(${scope})` : "";
        const breakingMark = isBreaking ? "!" : "";
        const header = `${type}${scopeText}${breakingMark}: ${summary}`;

        const body = [];
        if (details) body.push(details);
        if (isBreaking && breakingText) body.push(`BREAKING CHANGE: ${breakingText}`);
        if (issue) body.push(`Refs: ${issue}`);

        const message = body.length ? `${header}\n\n${body.join("\n\n")}` : header;
        commitPreview.textContent = message;
    };

    [
        commitType,
        commitScope,
        commitSummary,
        commitDetails,
        commitBreaking,
        commitBreakingDetail,
        commitIssue,
    ].forEach((field) => {
        if (field) field.addEventListener("input", updateCommitPreview);
    });

    updateCommitPreview();

    if (commitCopy) {
        commitCopy.addEventListener("click", async () => {
            if (!commitPreview) return;
            const message = commitPreview.textContent.trim();
            if (!message || message.startsWith("Completa")) {
                showToast("Completa el mensaje primero");
                return;
            }
            try {
                await copyText(message);
                showToast("Mensaje copiado");
            } catch (error) {
                showToast("No se pudo copiar");
            }
        });
    }

    const accordionTriggers = $$(".accordion-trigger");
    accordionTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            const item = trigger.closest(".accordion-item");
            if (!item) return;
            const isOpen = item.classList.contains("is-open");
            item.classList.toggle("is-open", !isOpen);
            trigger.setAttribute("aria-expanded", String(!isOpen));
        });
    });

    const feedbackForm = $("#feedback-form");
    if (feedbackForm) {
        feedbackForm.addEventListener("submit", (event) => {
            event.preventDefault();
            feedbackForm.reset();
            showToast("Feedback enviado. Gracias!");
        });
    }

    const modal = $("#quick-guide");
    const openModal = () => {
        if (!modal) return;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
    };
    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
    };

    const modalOpenButton = $("[data-modal-open]");
    const modalCloseButtons = $$("[data-modal-close]");

    if (modalOpenButton) modalOpenButton.addEventListener("click", openModal);
    modalCloseButtons.forEach((button) => button.addEventListener("click", closeModal));

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeModal();
    });

    const backToTop = $("#back-to-top");
    const toggleBackToTop = () => {
        if (!backToTop) return;
        backToTop.classList.toggle("is-visible", window.scrollY > 500);
    };

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        toggleBackToTop();
        window.addEventListener("scroll", toggleBackToTop);
    }
});
