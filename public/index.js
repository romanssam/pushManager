const publicVapidKey = 'BP0ej38L7jzXErWZfSCQCLRkBhREoh3-dn91lELLwXqmmEZZxcDIRFr3vdxHe97Kmp6HRfc20gpriKof1_OxUQ4'

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function run (){
  const register = await navigator.serviceWorker.register('/pushManager/public/sw.js', {
    scope: "/pushManager/public/"
  })

const button = document.getElementById('subscribe');

button.addEventListener('click', async () => {
  const premission = await window.Notification.requestPermission()

  if(premission === 'granted') {
    console.log('granted')

    const subscription = await register.pushManager.subscribe({
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      userVisibleOnly: true,
    });

    console.log(subscription)

    await fetch("/save-subscription", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });
  }
})

  console.log(register)
}

run()