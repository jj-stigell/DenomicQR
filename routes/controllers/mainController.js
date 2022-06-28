/** Load main page */
const showMain = async ({ render, user }) => {
  render("main.eta", { user: user});
};

/** Load faq page */
const showFaq = async ({ render, user }) => {
  render("faq.eta", { user: user});
};

export { showMain, showFaq };
