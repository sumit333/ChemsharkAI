function loco() {
  gsap.registerPlugin(ScrollTrigger);

  // Check if we're on mobile (optional but can help with performance)
  const isMobile = window.innerWidth <= 768;

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: !isMobile ? true : false, // Disable smooth scrolling on mobile for better performance
    smartphone: {
      smooth: false,
    },
    tablet: {
      smooth: true,
      breakpoint: 768,
    },
  });

  // Update ScrollTrigger when scroll happens
  locoScroll.on("scroll", ScrollTrigger.update);

  // Set up ScrollTrigger proxy for Locomotive Scroll
  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, { duration: 0, disableLerp: true })
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });

  // Handle resize events to keep everything in sync
  window.addEventListener("resize", () => {
    setTimeout(() => {
      locoScroll.update();
      ScrollTrigger.refresh();
    }, 300);
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();

  return locoScroll;
}
const locoScroll = loco();

function textColor() {
  let aboutText = document.querySelector("#about-text>p");

  if (!aboutText) return;

  // Store original text content to restore later if needed
  const originalText = aboutText.textContent;

  // Split text into words
  let words = aboutText.textContent.trim().split(" ");
  aboutText.innerHTML = words.map((word) => `<span>${word} </span>`).join("");

  //responsive animation based on viewport
  const spanElements = document.querySelectorAll("#about-text>p>span");

  if (spanElements.length === 0) return;

  gsap.set(spanElements, { opacity: 0.3, color: "#888" });

  gsap.fromTo(
    spanElements,
    { opacity: 0.3, color: "#888" },
    {
      opacity: 1,
      color: "#fff",
      scrollTrigger: {
        trigger: "#about-text>p",
        start: "top bottom",
        end: "top 25%",
        scroller: "#main",
        scrub: 1,
        //animation still works on resize
        invalidateOnRefresh: true,
      },
      stagger: {
        amount: 0.8,
        // Fewer items on mobile
        each: window.innerWidth <= 768 ? 0.1 : 0.2,
      },
    }
  );
}
textColor();

function BGColor() {
  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#home-text h1",
      scroller: "#main",
      start: "top -70%",
      end: "top -120",
      scrub: 3,
      invalidateOnRefresh: true, // Recalculate on resize
    },
  });

  tl.to("#main", {
    backgroundColor: "#fff",
    duration: 1,
  });
}
BGColor();

function AnimationRestart() {
  // Animations restart when clicking navbar links
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      let targetId = this.getAttribute("href").substring(1);
      let targetSection = document.getElementById(targetId);

      if (!targetSection) return;

      // Adapt scroll speed based on device
      const duration = window.innerWidth <= 768 ? 800 : 1000;

      // Smooth scroll to section
      locoScroll.scrollTo(targetSection, {
        duration: duration,
        easing: [0.25, 0.0, 0.35, 1.0],
        offset: -70, // Account for fixed navbar height
      });

      // Adjust timeout for mobile
      const refreshTimeout = window.innerWidth <= 768 ? 1000 : 1000;

      // Refresh animations after scroll completes
      setTimeout(() => {
        textColor();
        BGColor();
        ScrollTrigger.refresh();
      }, refreshTimeout);
    });
  });
}
AnimationRestart();

// View counter
let count = localStorage.getItem("page_view");
count = count ? Number(count) + 1 : 1;
localStorage.setItem("page_view", count);

// element exists before updating
const countElement = document.getElementById("count");
if (countElement) {
  countElement.textContent = count;
}

// resize handler to refresh animations on window resize
let resizeTimeout;
window.addEventListener("resize", () => {
  // Debounce the resize event
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Refresh all animations
    ScrollTrigger.refresh(true);
  }, 250);
});

// event listener for device orientation changes (mobile specific)
window.addEventListener("orientationchange", () => {
  // Wait for orientation change to complete
  setTimeout(() => {
    locoScroll.update();
    ScrollTrigger.refresh(true);
  }, 500);
});
