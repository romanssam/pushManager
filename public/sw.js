self.addEventListener("push", async (event) => {
  const { title, body } = await event.data.json();
  console.log({ title, body });
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
    })
  );
});
