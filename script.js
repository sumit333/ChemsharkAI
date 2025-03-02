function loco() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });

  locoScroll.on("scroll", ScrollTrigger.update);

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

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();

  return locoScroll;
}
const locoScroll = loco();

function textColor() {
  let aboutText = document.querySelector("#about-text>p");

  if (!aboutText) return;

  let words = aboutText.textContent.trim().split(" ");
  aboutText.innerHTML = words.map((word) => `<span>${word} </span>`).join("");

  gsap.fromTo(
    "#about-text>p>span",
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
      },
      stagger: 0.2,
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
    },
  });

  tl.to("#main", {
    backgroundColor: "#fff",
    duration: 1,
  });
}

BGColor();

function AnimationRestart() {
  //animations restart when clicking navbar links
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      let targetId = this.getAttribute("href").substring(1);
      let targetSection = document.getElementById(targetId);

      if (!targetSection) return;

      // Smooth scroll to section
      locoScroll.scrollTo(targetSection, {
        duration: 1000,
        easing: [0.25, 0.0, 0.35, 1.0],
      });

      setTimeout(() => {
        textColor();
        BGColor();
        ScrollTrigger.refresh();
      }, 10000);
    });
  });
}
AnimationRestart();
