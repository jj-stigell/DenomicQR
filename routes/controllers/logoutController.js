/**　Process the user logout. Clear session　and redirect to main page.　*/
const processLogout = async ({ response, state }) => {
  await state.session.set("authenticated", null);
  await state.session.set("user", null);
  response.redirect("/");
};

export { processLogout };
