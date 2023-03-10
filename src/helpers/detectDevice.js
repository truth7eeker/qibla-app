// detect iOS
export const isIOS =
   navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
   navigator.userAgent.match(/AppleWebKit/);


// detect phone vs desktop
export const deviceDetector = (function () {
    var b = navigator.userAgent.toLowerCase(),
      a = function (a) {
        void 0 !== a && (b = a.toLowerCase());
        return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
          b
        )
          ? "tablet"
          : /(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(
              b
            )
          ? "phone"
          : "desktop";
      };
    return {
      device: a(),
      detect: a,
      isMobile: "desktop" !== a() ? !0 : !1,
      userAgent: b,
    };
  })();