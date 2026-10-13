/**
 * Olusegun Immanuel Adeleye — Portfolio Application Logic
 * Digital Atelier × Modular Bento Grid × AI-Native Interaction
 * Vanilla JavaScript (ES6+), Zero external dependencies, LocalStorage persistence
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Constants & Default Knowledge State
     ========================================================================== */
  const STORAGE_KEYS = {
    AVAILABILITY: 'oa_portfolio_availability_status',
    MESSAGES: 'oa_portfolio_contact_messages',
    ASSISTANT_CHAT: 'oa_portfolio_assistant_chat_history',
    THEME: 'oa_portfolio_theme'
  };

  const DEFAULT_AVAILABILITY = 'Available for select projects';

  const PORTFOLIO_KNOWLEDGE = {
    practitioner: 'Olusegun Immanuel Adeleye',
    role: 'Product Designer & Agentic App Developer',
    statement: 'Designing thoughtful digital experiences and building intelligent applications that turn ideas into useful products.',
    disciplines: [
      'Product & UI/UX Design',
      'UX Research & Mental Models',
      'Interactive Prototyping',
      'HTML5, Modern CSS, Vanilla JavaScript',
      'Agentic Workflows & Multi-Agent Orchestration'
    ],
    approach: [
      'Discover: Uncover latent friction and user mental models.',
      'Define: Map technical boundaries and AI human-in-the-loop checkpoints.',
      'Design: High-fidelity spatial design systems and ergonomic UI.',
      'Build: Zero-bloat browser prototypes with modern web standards.',
      'Refine: Usability auditing and real-world performance tuning.'
    ],
    projects: [
      {
        id: 'scribble',
        title: 'Scribble — Digital Sticky Notes App',
        status: 'Working Concept',
        type: 'Spatial Canvas Note-Taking',
        summary: 'A spatial freeform canvas allowing drag-and-drop ideation, Markdown formatting, and local clustering of brainstorming notes.',
        tech: ['HTML5 Canvas', 'CSS Spatial Grid', 'Vanilla JavaScript', 'LocalStorage API']
      },
      {
        id: 'agentdesk',
        title: 'AgentDesk — AI Agent Workflow Dashboard',
        status: 'Active Prototype',
        type: 'Agentic AI Orchestration Cockpit',
        summary: 'A multi-agent telemetry cockpit with real-time execution pipelines, token consumption metrics, and human-in-the-loop approval gates.',
        tech: ['Agentic Architecture', 'State Machine', 'CSS Grid', 'Telemetry Parsing']
      },
      {
        id: 'pixelkit',
        title: 'PixelKit — Interactive Design System Builder',
        status: 'System Concept',
        type: 'Design Token Engine',
        summary: 'An interactive design token calculator and component sandbox featuring automated WCAG 2.1 color contrast compliance checks and vanilla CSS custom property export.',
        tech: ['Design Systems', 'CSS Custom Properties', 'Color Math', 'Component Sandbox']
      }
    ],
    tools: {
      design: ['Figma', 'FigJam', 'Pen & Paper Wireframing'],
      development: ['HTML5', 'Modern CSS', 'Vanilla JavaScript (ES6+)', 'Git'],
      agentic: ['LLM APIs', 'LangChain Concepts', 'Prompt Engineering', 'Cursor']
    },
    contact: {
      email: 'olusegun.adeleye.design@example.com',
      location: 'London / Remote Worldwide'
    }
  };

  /* ==========================================================================
     2. Safe Storage Wrapper
     ========================================================================== */
  const Storage = {
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (err) {
        console.warn('LocalStorage read error:', err);
        return defaultValue;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (err) {
        console.warn('LocalStorage write error:', err);
        return false;
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (err) {
        console.warn('LocalStorage remove error:', err);
        return false;
      }
    },
    clearAllPortfolioData() {
      try {
        localStorage.removeItem(STORAGE_KEYS.AVAILABILITY);
        localStorage.removeItem(STORAGE_KEYS.MESSAGES);
        localStorage.removeItem(STORAGE_KEYS.ASSISTANT_CHAT);
        localStorage.removeItem(STORAGE_KEYS.THEME);
        return true;
      } catch (err) {
        console.warn('LocalStorage clear error:', err);
        return false;
      }
    }
  };

  /* ==========================================================================
     3. Toast Notifications
     ========================================================================== */
  function showToast(message, duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<span>✦</span><span>${escapeHTML(message)}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 250);
    }, duration);
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ==========================================================================
     4. Availability Status System
     ========================================================================== */
  function initAvailabilitySystem() {
    const savedStatus = Storage.get(STORAGE_KEYS.AVAILABILITY, DEFAULT_AVAILABILITY);
    updateAvailabilityDisplay(savedStatus);

    const pillBtn = document.getElementById('availability-pill');
    const modal = document.getElementById('availability-modal');
    const input = document.getElementById('status-input-field');
    const saveBtn = document.getElementById('save-status-btn');
    const presetBtns = document.querySelectorAll('.preset-btn');

    if (pillBtn && modal && input) {
      pillBtn.addEventListener('click', () => {
        const current = Storage.get(STORAGE_KEYS.AVAILABILITY, DEFAULT_AVAILABILITY);
        input.value = current;
        openModal('availability-modal');
      });

      presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const presetVal = btn.getAttribute('data-preset');
          if (presetVal) input.value = presetVal;
        });
      });

      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          const newStatus = input.value.trim() || DEFAULT_AVAILABILITY;
          Storage.set(STORAGE_KEYS.AVAILABILITY, newStatus);
          updateAvailabilityDisplay(newStatus);
          closeModal('availability-modal');
          showToast(`Availability updated: "${newStatus}"`);
        });
      }
    }
  }

  function updateAvailabilityDisplay(statusText) {
    const aboutDisplay = document.getElementById('about-status-text');

    if (aboutDisplay) aboutDisplay.textContent = statusText;
  }

  /* ==========================================================================
     5. Bento Grid 3D Flip System
     ========================================================================== */
  function initBentoFlip() {
    const cards = document.querySelectorAll('.bento-card');
    const flipAllBtn = document.getElementById('flip-all-btn');
    let allFlippedState = false;

    cards.forEach(card => {
      // Click on card to flip
      card.addEventListener('click', (e) => {
        // Prevent flip if clicking an interactive element (button, link, input)
        const target = e.target;
        if (target.closest('a') || target.closest('button.btn-micro') || target.closest('.card-pill-btn')) {
          return;
        }

        toggleCardFlip(card);
      });

      // Keyboard accessible flip (Enter or Space)
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (document.activeElement === card) {
            e.preventDefault();
            toggleCardFlip(card);
          }
        }
      });

      // Individual trigger buttons
      const flipTriggers = card.querySelectorAll('.flip-trigger-btn');
      flipTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleCardFlip(card);
        });
      });
    });

    // Flip All Cards Button
    if (flipAllBtn) {
      flipAllBtn.addEventListener('click', () => {
        allFlippedState = !allFlippedState;
        cards.forEach(card => {
          if (allFlippedState) {
            card.classList.add('flipped');
          } else {
            card.classList.remove('flipped');
          }
        });
        flipAllBtn.innerHTML = allFlippedState 
          ? '<span class="icon-refresh">↺</span> Flip to Front' 
          : '<span class="icon-refresh">↻</span> Flip All Tiles';
      });
    }

    // Copy Email Micro Button inside Tile 8
    const copyTileBtn = document.getElementById('copy-email-tile-btn');
    if (copyTileBtn) {
      copyTileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(PORTFOLIO_KNOWLEDGE.contact.email).then(() => {
          showToast('Email address copied to clipboard');
        }).catch(() => {
          showToast(`Direct Email: ${PORTFOLIO_KNOWLEDGE.contact.email}`);
        });
      });
    }
  }

  function toggleCardFlip(card) {
    card.classList.toggle('flipped');
    const isFlipped = card.classList.contains('flipped');
    card.setAttribute('aria-expanded', isFlipped ? 'true' : 'false');
  }

  /* ==========================================================================
     6. Hero Generative Interactive Canvas Visual
     ========================================================================== */
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-interactive-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement.clientWidth || 500);
    let height = (canvas.height = 380);

    // Responsive Canvas Resize
    window.addEventListener('resize', () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth || 500;
        height = canvas.height = 380;
      }
    });

    const nodes = [
      { label: 'Human Intent', x: width * 0.2, y: height * 0.28, vx: 0.2, vy: 0.15, radius: 7, color: '#7C3AED' },
      { label: 'Spatial UI', x: width * 0.75, y: height * 0.22, vx: -0.15, vy: 0.2, radius: 6, color: '#0284C7' },
      { label: 'Agent Loop', x: width * 0.5, y: height * 0.52, vx: 0.1, vy: -0.18, radius: 9, color: '#171717' },
      { label: 'Design Tokens', x: width * 0.25, y: height * 0.75, vx: -0.2, vy: -0.1, radius: 6, color: '#2E7D32' },
      { label: 'Experience', x: width * 0.8, y: height * 0.72, vx: 0.18, vy: 0.12, radius: 8, color: '#BE185D' },
      { label: 'Telemetry', x: width * 0.38, y: height * 0.35, vx: -0.12, vy: 0.14, radius: 5, color: '#B45309' },
      { label: 'Browser API', x: width * 0.65, y: height * 0.42, vx: 0.15, vy: -0.12, radius: 5, color: '#4F46E5' }
    ];

    let mouse = { x: -1000, y: -1000, active: false };

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);

      const isDark = currentCanvasTheme();
      const lineRGB = isDark ? '244, 243, 238' : '23, 23, 23';
      const glowColor = isDark ? 'rgba(29, 29, 25, 0.85)' : 'rgba(255, 255, 255, 0.8)';
      const labelColor = isDark ? '#B9B8B0' : '#404040';

      // Draw subtle background grid dots
      const gridSpacing = 28;
      ctx.fillStyle = isDark ? '#33332C' : '#E8E8E2';
      for (let x = 14; x < width; x += gridSpacing) {
        for (let y = 14; y < height; y += gridSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Update positions
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce on borders
        if (node.x < 30 || node.x > width - 30) node.vx *= -1;
        if (node.y < 30 || node.y > height - 30) node.vy *= -1;

        // Mouse attraction / gentle repel
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 1) {
            node.x += (dx / dist) * 0.6;
            node.y += (dy / dist) * 0.6;
          }
        }
      });

      // Draw connecting lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 190) {
            const alpha = 1 - dist / 190;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${lineRGB}, ${alpha * 0.18})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw Nodes & Labels
      nodes.forEach(node => {
        // Node outer glow ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 3, 0, Math.PI * 2);
        ctx.fillStyle = glowColor;
        ctx.fill();

        // Node center
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = (isDark && node.color === '#171717') ? '#F4F3EE' : node.color;
        ctx.fill();

        // Label
        ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = labelColor;
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.radius + 14);
      });

      requestAnimationFrame(draw);
    }

    draw();
  }

  /* ==========================================================================
     6b. Hero Name Per-Letter Jitter
     ========================================================================== */
  function initNameJitter() {
    const title = document.querySelector('.hero-title');
    if (!title) return;

    // Preserve the full, readable name for assistive technology.
    title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());

    const randomBetween = (min, max) => min + Math.random() * (max - min);

    const wrapLetters = (node) => {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent;
          if (!text) return;

          const frag = document.createDocumentFragment();
          for (const char of text) {
            if (/\s/.test(char)) {
              frag.appendChild(document.createTextNode(char));
              continue;
            }
            const span = document.createElement('span');
            span.className = 'jitter-letter';
            span.textContent = char;
            span.style.setProperty('--jx', randomBetween(-3, 3).toFixed(2) + 'px');
            span.style.setProperty('--jy', randomBetween(-3, 3).toFixed(2) + 'px');
            span.style.setProperty('--jr', randomBetween(-6, 6).toFixed(2) + 'deg');
            span.style.setProperty('--jit-dur', Math.round(randomBetween(160, 360)) + 'ms');
            span.style.setProperty('--jit-delay', Math.round(randomBetween(0, 180)) + 'ms');
            frag.appendChild(span);
          }
          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
          wrapLetters(child);
        }
      });
    };

    wrapLetters(title);
  }

  /* ==========================================================================
     7. Project Showcase Filters & Interactive Modals
     ========================================================================== */
  function initProjectShowcase() {
    // Category Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const categories = card.getAttribute('data-category') || '';
          if (filter === 'all' || categories.includes(filter)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Case Study Detail Modals
    const detailTriggers = document.querySelectorAll('.preview-modal-trigger');
    detailTriggers.forEach(btn => {
      btn.addEventListener('click', () => {
        const projId = btn.getAttribute('data-project');
        renderProjectDetailModal(projId);
        openModal('project-detail-modal');
      });
    });

    // Interactive Demo Modals
    const demoTriggers = document.querySelectorAll('.interactive-demo-trigger');
    demoTriggers.forEach(btn => {
      btn.addEventListener('click', () => {
        const demoId = btn.getAttribute('data-demo');
        renderProjectDemoModal(demoId);
        openModal('project-detail-modal');
      });
    });
  }

  function renderProjectDetailModal(projectId) {
    const titleEl = document.getElementById('modal-project-title');
    const tagEl = document.getElementById('modal-project-tag');
    const bodyEl = document.getElementById('modal-project-body');

    const data = {
      scribble: {
        tag: 'Working Concept Prototype',
        title: 'Scribble — Digital Sticky Notes App',
        content: `
          <div class="modal-detail-content">
            <h4>Concept Overview</h4>
            <p>
              Scribble was conceived to eliminate the boundary between physical sticky note thinking and digital organisation. Built with zero-overhead browser technologies, it provides a spatial canvas for spatial brainstorming.
            </p>
            <h4>Architecture &amp; Agentic Touchpoint</h4>
            <p>
              Rather than overwhelming users with complex menus, Scribble features heuristic note clustering and an agentic summarizer that groups disparate ideas into actionable sprint themes.
            </p>
            <div class="spec-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:16px 0; font-size:13px; background:#F8F8F5; padding:12px; border-radius:8px;">
              <div><strong>Front-End:</strong> Vanilla JS / CSS Grid</div>
              <div><strong>Storage:</strong> LocalStorage API</div>
              <div><strong>Status:</strong> Active Interactive Prototype</div>
              <div><strong>Licence:</strong> Open Atelier Concept</div>
            </div>
            <h4>Core Innovations</h4>
            <ul style="padding-left:18px; font-size:13px; line-height:1.6; color:#555;">
              <li>Frictionless spatial drag & drop with mouse, touch, and trackpad.</li>
              <li>Markdown formatting and color-coded mood categories.</li>
              <li>Complete local data privacy with instantaneous restore.</li>
            </ul>
          </div>
        `
      },
      agentdesk: {
        tag: 'Active Prototype Cockpit',
        title: 'AgentDesk — AI Agent Workflow Dashboard',
        content: `
          <div class="modal-detail-content">
            <h4>Concept Overview</h4>
            <p>
              Autonomous software agents frequently operate as opaque black boxes. AgentDesk introduces an executive control cockpit providing deterministic human-in-the-loop checkpoints before critical mutations are executed.
            </p>
            <h4>Key Innovations</h4>
            <p>
              The cockpit visualizes agent state machines, step-by-step reasoning tokens, and execution cost telemetry in a unified editorial interface.
            </p>
            <div class="spec-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:16px 0; font-size:13px; background:#F8F8F5; padding:12px; border-radius:8px;">
              <div><strong>State System:</strong> Finite State Machine (FSM)</div>
              <div><strong>Governance:</strong> Explicit Human Approval Gates</div>
              <div><strong>Telemetry:</strong> Live Step Execution Logs</div>
              <div><strong>Target Users:</strong> Product Teams &amp; AI Engineers</div>
            </div>
            <h4>Human Safeguards</h4>
            <p style="font-size:13px; color:#555;">
              Gated authorization prompts prevent unintended database operations or API expenditures, reinforcing user agency over automated logic.
            </p>
          </div>
        `
      },
      pixelkit: {
        tag: 'System Architecture',
        title: 'PixelKit — Interactive Design System Builder',
        content: `
          <div class="modal-detail-content">
            <h4>Concept Overview</h4>
            <p>
              PixelKit connects design intent directly to code tokens. It generates cohesive typographic scales and color ramps while evaluating WCAG 2.1 accessibility compliance in real time.
            </p>
            <h4>Live Token Playground</h4>
            <p>
              Changes made in PixelKit generate production-ready CSS Custom Properties that can be copied directly into any front-end project without runtime overhead.
            </p>
            <div class="spec-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:16px 0; font-size:13px; background:#F8F8F5; padding:12px; border-radius:8px;">
              <div><strong>Compliance:</strong> WCAG 2.1 AA &amp; AAA</div>
              <div><strong>Export:</strong> CSS Custom Properties (:root)</div>
              <div><strong>Performance:</strong> Zero runtime bundle</div>
              <div><strong>Platform:</strong> Browser Native</div>
            </div>
          </div>
        `
      }
    };

    const project = data[projectId] || data.scribble;
    if (tagEl) tagEl.textContent = project.tag;
    if (titleEl) titleEl.textContent = project.title;
    if (bodyEl) bodyEl.innerHTML = project.content;
  }

  function renderProjectDemoModal(demoId) {
    const titleEl = document.getElementById('modal-project-title');
    const tagEl = document.getElementById('modal-project-tag');
    const bodyEl = document.getElementById('modal-project-body');

    if (tagEl) tagEl.textContent = 'Interactive Playground';

    if (demoId === 'scribble') {
      if (titleEl) titleEl.textContent = 'Scribble — Live Interactive Mini Sandbox';
      if (bodyEl) {
        bodyEl.innerHTML = `
          <div class="mini-demo-sandbox">
            <p style="font-size:13px; color:#666; margin-bottom:12px;">
              Add a quick note to this live interactive canvas to experience the Scribble model:
            </p>
            <div style="display:flex; gap:8px; margin-bottom:14px;">
              <input type="text" id="demo-note-input" placeholder="Type a concept or note..." style="flex:1; padding:8px 12px; border:1px solid #D5D5CE; border-radius:6px; font-size:13px;">
              <button type="button" id="demo-add-note-btn" class="btn btn-primary" style="padding:8px 16px; font-size:13px;">Add Note</button>
            </div>
            <div id="demo-notes-canvas" style="min-height:180px; background:#FAF9F6; border:1px solid #E7E7E2; border-radius:8px; padding:12px; display:flex; flex-wrap:wrap; gap:10px; align-content:flex-start;">
              <div class="demo-stick-note" style="background:#FEF9C3; border:1px solid #FDE047; padding:8px 12px; border-radius:6px; font-size:12px; max-width:180px; box-shadow:0 2px 6px rgba(0,0,0,0.05);">
                <strong>✦ UX Discovery:</strong> Interview 8 designers on agentic friction.
              </div>
              <div class="demo-stick-note" style="background:#FCE7F3; border:1px solid #FBCFE8; padding:8px 12px; border-radius:6px; font-size:12px; max-width:180px; box-shadow:0 2px 6px rgba(0,0,0,0.05);">
                <strong>✦ Design System:</strong> Standardize pastel bento tokens.
              </div>
            </div>
          </div>
        `;

        setTimeout(() => {
          const addBtn = document.getElementById('demo-add-note-btn');
          const noteInput = document.getElementById('demo-note-input');
          const canvasEl = document.getElementById('demo-notes-canvas');

          if (addBtn && noteInput && canvasEl) {
            addBtn.addEventListener('click', () => {
              const val = noteInput.value.trim();
              if (!val) return;
              const noteDiv = document.createElement('div');
              const colors = ['#FEF9C3', '#EDE9FE', '#DCFCE7', '#E0F2FE', '#FCE7F3'];
              const chosen = colors[Math.floor(Math.random() * colors.length)];
              noteDiv.style.cssText = `background:${chosen}; border:1px solid rgba(0,0,0,0.1); padding:8px 12px; border-radius:6px; font-size:12px; max-width:180px; box-shadow:0 2px 6px rgba(0,0,0,0.05);`;
              noteDiv.innerHTML = `<strong>✦ Note:</strong> ${escapeHTML(val)}`;
              canvasEl.appendChild(noteDiv);
              noteInput.value = '';
              showToast('Note added to canvas simulation');
            });
          }
        }, 50);
      }
    } else if (demoId === 'agentdesk') {
      if (titleEl) titleEl.textContent = 'AgentDesk — Simulated Agent Approval Cockpit';
      if (bodyEl) {
        bodyEl.innerHTML = `
          <div class="mini-demo-sandbox" style="font-family:var(--font-mono); font-size:12px;">
            <div style="background:#1C1C1E; color:#E5E7EB; padding:16px; border-radius:8px; line-height:1.6;">
              <div style="color:#10B981; margin-bottom:8px;">[ORCHESTRATOR ONLINE] Multi-Agent Pipeline Ready</div>
              <div>> Agent Alpha (Planner): Decomposing objective into 3 sub-actions...</div>
              <div>> Agent Beta (Executor): Awaiting human verification gate for action #2</div>
              <div id="agent-gate-box" style="margin:14px 0; padding:12px; background:#2A2A2D; border:1px solid #F59E0B; border-radius:6px; color:#FCD34D;">
                <strong>HUMAN-IN-THE-LOOP CHECKPOINT:</strong><br>
                Action: Deploy updated token palette to staging server.<br>
                Risk: Low (Dry run verified)
                <div style="margin-top:10px; display:flex; gap:8px;">
                  <button type="button" id="agent-approve-btn" style="background:#10B981; color:#fff; border:none; padding:6px 12px; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer;">Approve Action</button>
                  <button type="button" id="agent-reject-btn" style="background:#EF4444; color:#fff; border:none; padding:6px 12px; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer;">Reject &amp; Rollback</button>
                </div>
              </div>
              <div id="agent-status-log" style="color:#9CA3AF;">Status: Blocked until approval gate satisfied.</div>
            </div>
          </div>
        `;

        setTimeout(() => {
          const approveBtn = document.getElementById('agent-approve-btn');
          const rejectBtn = document.getElementById('agent-reject-btn');
          const gateBox = document.getElementById('agent-gate-box');
          const logEl = document.getElementById('agent-status-log');

          if (approveBtn && gateBox && logEl) {
            approveBtn.addEventListener('click', () => {
              gateBox.style.display = 'none';
              logEl.style.color = '#10B981';
              logEl.innerHTML = '> Action APPROVED by Human. Pipeline executed successfully in 142ms. Cost: $0.0014.';
              showToast('Agent action approved');
            });
          }

          if (rejectBtn && gateBox && logEl) {
            rejectBtn.addEventListener('click', () => {
              gateBox.style.display = 'none';
              logEl.style.color = '#EF4444';
              logEl.innerHTML = '> Action REJECTED by Human. Reverting to checkpoint. Safe state restored.';
              showToast('Agent action rejected & safely aborted');
            });
          }
        }, 50);
      }
    } else {
      if (titleEl) titleEl.textContent = 'PixelKit — Live Contrast & CSS Token Test';
      if (bodyEl) {
        bodyEl.innerHTML = `
          <div class="mini-demo-sandbox">
            <p style="font-size:13px; color:#666; margin-bottom:12px;">
              Live WCAG contrast calculation for selected atelier pastel tokens:
            </p>
            <div style="display:flex; flex-direction:column; gap:8px; font-size:13px;">
              <div style="display:flex; justify-content:space-between; align-items:center; background:#EDE9FE; color:#171717; padding:10px 14px; border-radius:6px;">
                <span><strong>Lavender Surface</strong> (#EDE9FE on #171717)</span>
                <span style="background:#171717; color:#fff; font-size:11px; padding:2px 8px; border-radius:4px;">13.4:1 (AAA Pass)</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; background:#DCFCE7; color:#171717; padding:10px 14px; border-radius:6px;">
                <span><strong>Sage Surface</strong> (#DCFCE7 on #171717)</span>
                <span style="background:#171717; color:#fff; font-size:11px; padding:2px 8px; border-radius:4px;">14.2:1 (AAA Pass)</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; background:#FEF3C7; color:#171717; padding:10px 14px; border-radius:6px;">
                <span><strong>Butter Yellow Surface</strong> (#FEF3C7 on #171717)</span>
                <span style="background:#171717; color:#fff; font-size:11px; padding:2px 8px; border-radius:4px;">15.1:1 (AAA Pass)</span>
              </div>
            </div>
            <div style="margin-top:16px;">
              <button type="button" id="copy-tokens-btn" class="btn btn-outline" style="font-size:12px; padding:6px 12px;">
                Copy CSS Custom Properties
              </button>
            </div>
          </div>
        `;

        setTimeout(() => {
          const copyBtn = document.getElementById('copy-tokens-btn');
          if (copyBtn) {
            copyBtn.addEventListener('click', () => {
              const tokensSnippet = `:root {\n  --color-lavender: #EDE9FE;\n  --color-sage: #DCFCE7;\n  --color-yellow: #FEF3C7;\n  --color-text: #171717;\n}`;
              navigator.clipboard.writeText(tokensSnippet).then(() => {
                showToast('CSS Variables copied to clipboard');
              }).catch(() => {
                showToast('Snippet ready in console');
              });
            });
          }
        }, 50);
      }
    }
  }

  /* ==========================================================================
     8. AI-Native Interaction: Portfolio Assistant
     ========================================================================== */
  function initPortfolioAssistant() {
    const chatArea = document.getElementById('chat-messages-area');
    const inputField = document.getElementById('assistant-user-query');
    const form = document.getElementById('assistant-input-form');
    const promptChips = document.querySelectorAll('.prompt-chip');
    const clearBtn = document.getElementById('clear-chat-btn');
    const quickTrigger = document.getElementById('quick-assistant-btn');
    const headerTrigger = document.getElementById('assistant-trigger-btn');
    const mobileTrigger = document.getElementById('mobile-assistant-trigger');

    // Smooth scroll to assistant on triggers
    [quickTrigger, headerTrigger, mobileTrigger].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          const assistantSec = document.getElementById('assistant-section');
          if (assistantSec) {
            assistantSec.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
              if (inputField) inputField.focus();
            }, 600);
          }
        });
      }
    });

    // Prompt Chips Click
    promptChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const question = chip.getAttribute('data-question');
        if (question) {
          handleUserQuery(question);
        }
      });
    });

    // Form Submission
    if (form && inputField) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = inputField.value.trim();
        if (query) {
          handleUserQuery(query);
          inputField.value = '';
        }
      });
    }

    // Clear Chat
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (chatArea) {
          chatArea.innerHTML = `
            <div class="chat-message message-assistant">
              <div class="avatar-assistant">OA✦</div>
              <div class="message-bubble">
                <p class="message-text">Chat cleared. Ask me anything about Olusegun’s design craft, agentic prototypes, or process.</p>
                <p class="message-meta">Grounded in local atelier records</p>
              </div>
            </div>
          `;
          showToast('Assistant chat history cleared');
        }
      });
    }

    function handleUserQuery(queryText) {
      appendChatMessage('user', queryText);

      // Scroll to bottom of chat
      if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;

      // Simulated local intelligence thinking delay
      setTimeout(() => {
        const responseText = generateAssistantResponse(queryText);
        appendChatMessage('assistant', responseText);
        if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
      }, 350);
    }

    function appendChatMessage(sender, text) {
      if (!chatArea) return;
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-message message-${sender}`;

      if (sender === 'user') {
        msgDiv.innerHTML = `
          <div class="avatar-user">You</div>
          <div class="message-bubble">
            <p class="message-text">${escapeHTML(text)}</p>
            <p class="message-meta">Sent inquiry</p>
          </div>
        `;
      } else {
        msgDiv.innerHTML = `
          <div class="avatar-assistant">OA✦</div>
          <div class="message-bubble">
            <p class="message-text">${text}</p>
            <p class="message-meta">Local deterministic answer • Verified data</p>
          </div>
        `;
      }

      chatArea.appendChild(msgDiv);
    }

    function generateAssistantResponse(query) {
      const q = query.toLowerCase();

      // Rule-based deterministic portfolio ontology
      if (q.includes('what does olusegun do') || q.includes('who is') || q.includes('role') || q.includes('about')) {
        return `
          <strong>Olusegun Immanuel Adeleye</strong> is a Product Designer and Agentic App Developer. 
          He conceives human-centred interfaces and architects intelligent applications using modern web standards (HTML5, CSS3, vanilla JS) and multi-agent workflows. 
          His core philosophy is <em>“Designing thoughtful digital experiences and building intelligent applications that turn ideas into useful products.”</em>
        `;
      }

      if (q.includes('project') || q.includes('work') || q.includes('scribble') || q.includes('agentdesk') || q.includes('pixelkit')) {
        return `
          Olusegun has developed three primary featured concepts:
          <br>1. <strong>Scribble:</strong> A spatial digital sticky notes app for freeform ideation and AI note clustering.
          <br>2. <strong>AgentDesk:</strong> An AI agent workflow dashboard featuring human-in-the-loop governance gates and live telemetry.
          <br>3. <strong>PixelKit:</strong> An interactive design token builder with real-time WCAG 2.1 accessibility auditing.
          <br><a href="#work-section" class="btn-text-link" style="margin-top:6px; display:inline-block;">View projects gallery →</a>
        `;
      }

      if (q.includes('tech') || q.includes('tool') || q.includes('stack') || q.includes('code') || q.includes('language')) {
        return `
          Olusegun’s tooling workbench is divided by purpose:
          <br>• <strong>Design:</strong> Figma, FigJam, interactive wireframing, component token architecture.
          <br>• <strong>Development:</strong> Semantic HTML5, Modern CSS (Grid/Flexbox/Tokens), Vanilla JavaScript (ES6+), Web APIs.
          <br>• <strong>AI &amp; Agentic:</strong> Multi-agent orchestration, human-in-the-loop checkpoints, prompt engineering, and LLM APIs.
          <br>He champions lean, zero-bloat browser prototypes.
        `;
      }

      if (q.includes('approach') || q.includes('process') || q.includes('methodology') || q.includes('how does he work')) {
        return `
          Olusegun follows a structured 5-stage framework:
          <br><strong>1. Discover:</strong> Uncover latent friction and user mental models.
          <br><strong>2. Define:</strong> Map technical boundaries and agentic checkpoints.
          <br><strong>3. Design:</strong> High-fidelity spatial interface systems and typography.
          <br><strong>4. Build:</strong> Zero-bloat browser prototypes with modern web standards.
          <br><strong>5. Refine:</strong> Usability auditing and real-world performance tuning.
        `;
      }

      if (q.includes('available') || q.includes('hire') || q.includes('freelance') || q.includes('contact') || q.includes('email') || q.includes('collaborate')) {
        const currentAvail = Storage.get(STORAGE_KEYS.AVAILABILITY, DEFAULT_AVAILABILITY);
        return `
          Olusegun’s current availability status is: <strong>“${escapeHTML(currentAvail)}”</strong>.
          <br>You can initiate correspondence directly via email at <a href="mailto:${PORTFOLIO_KNOWLEDGE.contact.email}" class="btn-text-link">${PORTFOLIO_KNOWLEDGE.contact.email}</a> or complete the validated contact form below.
        `;
      }

      if (q.includes('education') || q.includes('degree') || q.includes('certification') || q.includes('course')) {
        return `
          Olusegun maintains an active, self-directed curriculum in <strong>Autonomous Agent Architecture</strong>, modern front-end browser specifications, and <strong>Human-Computer Interaction (HCI)</strong>.
          Formal transcripts and verified credential verification are available upon direct professional request.
        `;
      }

      if (q.includes('bento') || q.includes('hub') || q.includes('stack') || q.includes('tile') || q.includes('flip')) {
        return `
          The <strong>Practice Hub &amp; Stack</strong> above contains eight interactive modular pastel tiles. You can tap or click any card to flip it and explore Olusegun’s background, work, skills, education, approach, tooling, R&amp;D radar, and direct contacts!
        `;
      }

      // Fallback response with helpful hints
      return `
        I have logged your query regarding <em>“${escapeHTML(query)}”</em>.
        <br>As a deterministic local portfolio assistant, I can best assist with questions regarding:
        <br>• <strong>Olusegun's background &amp; philosophy</strong>
        <br>• <strong>Prototypes (Scribble, AgentDesk, PixelKit)</strong>
        <br>• <strong>Tools &amp; technologies</strong>
        <br>• <strong>The 5-stage design &amp; build approach</strong>
        <br>• <strong>Availability &amp; direct inquiries</strong>
      `;
    }
  }

  /* ==========================================================================
     9. Contact Form & Local Persistence
     ========================================================================== */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const savedCountEl = document.getElementById('saved-messages-count');
    const viewLogBtn = document.getElementById('view-local-messages-btn');
    const clearLogBtn = document.getElementById('clear-local-messages-btn');

    updateSavedMessageCount();

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform comprehensive client validation
        const isValid = validateContactForm();
        if (!isValid) return;

        const newSubmission = {
          id: 'msg_' + Date.now(),
          timestamp: new Date().toISOString(),
          formattedDate: new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          subject: subjectInput.value.trim(),
          message: messageInput.value.trim()
        };

        const existingMessages = Storage.get(STORAGE_KEYS.MESSAGES, []);
        existingMessages.push(newSubmission);
        Storage.set(STORAGE_KEYS.MESSAGES, existingMessages);

        // Feedback to user
        showToast('Message validated & logged to browser storage (Demo Mode)');
        form.reset();
        clearValidationErrors();
        updateSavedMessageCount();
      });

      // Real-time error clearance on input
      [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
        if (field) {
          field.addEventListener('input', () => {
            clearFieldError(field.id);
          });
        }
      });
    }

    // View Local Storage Message Log Modal
    if (viewLogBtn) {
      viewLogBtn.addEventListener('click', () => {
        renderLocalMessagesModal();
        openModal('messages-modal');
      });
    }

    if (clearLogBtn) {
      clearLogBtn.addEventListener('click', () => {
        Storage.set(STORAGE_KEYS.MESSAGES, []);
        renderLocalMessagesModal();
        updateSavedMessageCount();
        showToast('Local demo message log cleared');
      });
    }
  }

  function validateContactForm() {
    let isValid = true;

    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const subject = document.getElementById('contact-subject');
    const message = document.getElementById('contact-message');

    clearValidationErrors();

    // Name validation
    if (!name.value.trim()) {
      setFieldError('contact-name', 'Please provide your name.');
      isValid = false;
    } else if (name.value.trim().length < 2) {
      setFieldError('contact-name', 'Name must be at least 2 characters.');
      isValid = false;
    }

    // Email validation
    const emailVal = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      setFieldError('contact-email', 'Please provide your email address.');
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      setFieldError('contact-email', 'Please enter a valid email address (e.g., name@domain.com).');
      isValid = false;
    }

    // Subject validation
    if (!subject.value.trim()) {
      setFieldError('contact-subject', 'Please specify a subject for your inquiry.');
      isValid = false;
    }

    // Message validation
    if (!message.value.trim()) {
      setFieldError('contact-message', 'Please enter your message.');
      isValid = false;
    } else if (message.value.trim().length < 10) {
      setFieldError('contact-message', 'Message should be at least 10 characters.');
      isValid = false;
    }

    return isValid;
  }

  function setFieldError(fieldId, errorMsg) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const group = field.closest('.form-group');
    if (group) group.classList.add('has-error');

    const errSpan = document.getElementById(`error-${fieldId.replace('contact-', '')}`);
    if (errSpan) errSpan.textContent = errorMsg;
  }

  function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const group = field.closest('.form-group');
    if (group) group.classList.remove('has-error');

    const errSpan = document.getElementById(`error-${fieldId.replace('contact-', '')}`);
    if (errSpan) errSpan.textContent = '';
  }

  function clearValidationErrors() {
    ['name', 'email', 'subject', 'message'].forEach(key => {
      clearFieldError(`contact-${key}`);
    });
  }

  function updateSavedMessageCount() {
    const countEl = document.getElementById('saved-messages-count');
    if (!countEl) return;
    const messages = Storage.get(STORAGE_KEYS.MESSAGES, []);
    const count = messages.length;
    countEl.textContent = `${count} message${count === 1 ? '' : 's'} saved locally`;
  }

  function renderLocalMessagesModal() {
    const listContainer = document.getElementById('local-messages-list');
    if (!listContainer) return;

    const messages = Storage.get(STORAGE_KEYS.MESSAGES, []);

    if (messages.length === 0) {
      listContainer.innerHTML = `
        <div style="padding:20px; text-align:center; color:#737373; font-size:13px;">
          No local messages recorded yet. Submit the contact form to inspect entries here.
        </div>
      `;
      return;
    }

    listContainer.innerHTML = messages.map(msg => `
      <div class="local-msg-item">
        <div class="msg-header-row">
          <span class="msg-sender">${escapeHTML(msg.name)} (${escapeHTML(msg.email)})</span>
          <span>${escapeHTML(msg.formattedDate)}</span>
        </div>
        <div style="font-weight:600; font-size:12px; margin-top:2px;">Subject: ${escapeHTML(msg.subject)}</div>
        <div class="msg-body-preview">${escapeHTML(msg.message)}</div>
      </div>
    `).join('');
  }

  /* ==========================================================================
     10. Reset to Default Portfolio State
     ========================================================================== */
  function initResetHandlers() {
    const bentoResetBtn = document.getElementById('reset-storage-btn');
    const footerResetBtn = document.getElementById('footer-reset-btn');
    const confirmResetBtn = document.getElementById('confirm-reset-btn');

    [bentoResetBtn, footerResetBtn].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          openModal('reset-confirm-modal');
        });
      }
    });

    if (confirmResetBtn) {
      confirmResetBtn.addEventListener('click', () => {
        Storage.clearAllPortfolioData();
        updateAvailabilityDisplay(DEFAULT_AVAILABILITY);
        updateSavedMessageCount();
        applyTheme(getPreferredTheme());

        // Also flip all cards back to front
        document.querySelectorAll('.bento-card').forEach(card => card.classList.remove('flipped'));

        closeModal('reset-confirm-modal');
        showToast('Portfolio preferences reset to clean defaults');
      });
    }
  }

  /* ==========================================================================
     11. Modal Window Management
     ========================================================================== */
  function initModals() {
    // Close modal triggers
    const closeTriggers = document.querySelectorAll('[data-close-modal]');
    closeTriggers.forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close-modal');
        closeModal(modalId);
      });
    });

    // Close on overlay background click
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
          overlay.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
          activeModal.classList.remove('active');
          activeModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }
    });
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ==========================================================================
     12. Theme (Light / Dark Mode)
     ========================================================================== */
  function getPreferredTheme() {
    const saved = Storage.get(STORAGE_KEYS.THEME, null);
    if (saved === 'dark' || saved === 'light') return saved;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      const isDark = theme === 'dark';
      toggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    const themeNote = document.querySelector('.footer-theme-note');
    if (themeNote) {
      themeNote.textContent = theme === 'dark' ? 'Dark Theme Atelier' : 'Light Theme Atelier';
    }
  }

  function setTheme(theme, persist = true) {
    applyTheme(theme);
    if (persist) {
      Storage.set(STORAGE_KEYS.THEME, theme);
    }
  }

  function initTheme() {
    // Theme may already be applied by the inline head script; sync UI state.
    const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    applyTheme(current);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(next);
        showToast(next === 'dark' ? 'Dark mode enabled' : 'Light mode enabled');
      });
    }

    // Follow system changes until the visitor makes an explicit choice.
    if (window.matchMedia) {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const onSystemChange = (e) => {
        if (Storage.get(STORAGE_KEYS.THEME, null) === null) {
          setTheme(e.matches ? 'dark' : 'light', false);
        }
      };
      if (media.addEventListener) {
        media.addEventListener('change', onSystemChange);
      } else if (media.addListener) {
        media.addListener(onSystemChange);
      }
    }
  }

  function currentCanvasTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  /* ==========================================================================
     13. Navigation & Mobile Drawer
     ========================================================================== */
  function initNavigation() {
    const mobileBtn = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.contains('open');
        if (isOpen) {
          mobileDrawer.classList.remove('open');
          mobileBtn.classList.remove('open');
          mobileBtn.setAttribute('aria-expanded', 'false');
          mobileDrawer.setAttribute('aria-hidden', 'true');
        } else {
          mobileDrawer.classList.add('open');
          mobileBtn.classList.add('open');
          mobileBtn.setAttribute('aria-expanded', 'true');
          mobileDrawer.setAttribute('aria-hidden', 'false');
        }
      });

      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('open');
          mobileBtn.classList.remove('open');
          mobileBtn.setAttribute('aria-expanded', 'false');
          mobileDrawer.setAttribute('aria-hidden', 'true');
        });
      });
    }

    // ScrollSpy for Active Nav Link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-desktop .nav-link');

    window.addEventListener('scroll', () => {
      let currentSectionId = '';
      const scrollY = window.pageYOffset;

      sections.forEach(sec => {
        const secTop = sec.offsetTop - 120;
        const secHeight = sec.offsetHeight;
        if (scrollY >= secTop && scrollY < secTop + secHeight) {
          currentSectionId = sec.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

  /* ==========================================================================
     14. Lifecycle Initialization
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initAvailabilitySystem();
    initBentoFlip();
    initNameJitter();
    initHeroCanvas();
    initProjectShowcase();
    initPortfolioAssistant();
    initContactForm();
    initResetHandlers();
    initModals();
    initNavigation();

    console.info('Atelier Portfolio Engine initialized successfully: Olusegun Immanuel Adeleye');
  });

})();
