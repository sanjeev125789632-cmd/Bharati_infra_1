/**
 * Bharat Infra Associates - Main JavaScript File
 * Features: Touch Drawer, Mobile Quick Bar, Web3Forms Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle & Backdrop
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      document.body.appendChild(backdrop);
    }

    let closeBtn = navMenu.querySelector('.mobile-close-btn');
    if (!closeBtn) {
      closeBtn = document.createElement('button');
      closeBtn.className = 'mobile-close-btn';
      closeBtn.setAttribute('aria-label', 'Close menu');
      closeBtn.innerHTML = '✕';
      navMenu.insertBefore(closeBtn, navMenu.firstChild);
    }

    const openMenu = () => {
      mobileToggle.setAttribute('aria-expanded', 'true');
      navMenu.classList.add('active');
      backdrop.classList.add('active');
      document.body.classList.add('menu-open');
    };

    const closeMenu = () => {
      mobileToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.classList.remove('menu-open');
    };

    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    closeBtn.addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // 2. Highlight Current Active Nav Link
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
      link.classList.add('active');
    }
  });

  // 3. Dynamic Mobile Quick Action Bar (Call Now & Get Quote)
  if (!document.querySelector('.mobile-quick-bar')) {
    const quickBar = document.createElement('div');
    quickBar.className = 'mobile-quick-bar';
    quickBar.innerHTML = `
      <div class="container">
        <a href="tel:+919818742322" class="btn btn-primary">📞 Call Now</a>
        <a href="/contact/" class="btn btn-cta">✉️ Get Quote</a>
      </div>
    `;
    document.body.appendChild(quickBar);
  }

  // 4. Stat Counter Animation
  const metricNumbers = document.querySelectorAll('.metric-number');
  if (metricNumbers.length > 0) {
    const observerOptions = { threshold: 0.3 };
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const targetVal = parseInt(target.getAttribute('data-target') || target.innerText, 10);
          if (!isNaN(targetVal)) {
            let count = 0;
            const speed = Math.ceil(targetVal / 25);
            const updateCount = () => {
              count += speed;
              if (count < targetVal) {
                target.innerText = count + '+';
                setTimeout(updateCount, 40);
              } else {
                target.innerText = targetVal + '+';
              }
            };
            updateCount();
          }
          obs.unobserve(target);
        }
      });
    }, observerOptions);

    metricNumbers.forEach(num => observer.observe(num));
  }

  // 5. Back to Top Button
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 6. Web3Forms Submission Handler (AJAX submission with feedback)
  const contactForms = document.querySelectorAll('form[action="https://api.web3forms.com/submit"]');
  contactForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const responseBox = form.querySelector('#formResponse');
      const originalText = submitBtn.innerText;

      submitBtn.innerText = 'Submitting Proposal...';
      submitBtn.disabled = true;

      if (responseBox) {
        responseBox.style.display = 'none';
      }

      const formData = new FormData(form);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          if (responseBox) {
            responseBox.style.display = 'block';
            responseBox.style.background = '#E6F4EA';
            responseBox.style.color = '#137333';
            responseBox.style.border = '1px solid #CEEAD6';
            responseBox.innerHTML = '✔ Thank you! Your project inquiry has been sent to our procurement team. We will respond within 24 hours.';
          } else {
            alert('Thank you! Your project inquiry has been sent successfully.');
          }
          form.reset();
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (error) {
        if (responseBox) {
          responseBox.style.display = 'block';
          responseBox.style.background = '#FCE8E6';
          responseBox.style.color = '#C5221F';
          responseBox.style.border = '1px solid #FAD2CF';
          responseBox.innerHTML = '✖ Unable to submit inquiry automatically. Please call us directly at +91-98187-42322.';
        } else {
          alert('Submission error. Please call +91-98187-42322.');
        }
      } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      }
    });
  });
});
