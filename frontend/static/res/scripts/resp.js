$(window).on("load", function() {
  const win = $(this);
  if (win.width() < 800) {
    const formContainer = $("#formContainer");
    const formContainerEl = formContainer.get()[0];

    if (formContainerEl.classList.contains("uk-position-center-right")) {
      formContainer.removeClass("uk-position-center-right");
      formContainer.addClass("uk-position-center");
    }
  } else {
    const formContainer = $("#formContainer");
    const formContainerEl = formContainer.get()[0];

    if (formContainerEl.classList.contains("uk-position-center")) {
      formContainer.removeClass("uk-position-center");
      formContainer.addClass("uk-position-center-right");
    }
  }
});

$(window).on("resize", function() {
  const win = $(this);
  if (win.width() < 800) {
    const formContainer = $("#formContainer");
    const formContainerEl = formContainer.get()[0];

    if (formContainerEl.classList.contains("uk-position-center-right")) {
      formContainer.removeClass("uk-position-center-right");
      formContainer.addClass("uk-position-center");
    }
  } else {
    const formContainer = $("#formContainer");
    const formContainerEl = formContainer.get()[0];

    if (formContainerEl.classList.contains("uk-position-center")) {
      formContainer.removeClass("uk-position-center");
      formContainer.addClass("uk-position-center-right");
    }
  }
});
