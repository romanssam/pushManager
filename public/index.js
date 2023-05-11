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
  const register = await navigator.serviceWorker.register('/sw.js', {
    scope: "/"
  })

  console.log(register)

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

    await fetch("https://splendid-dog-baseball-cap.cyclic.app/save-subscription", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error("Ошибка при выполнении запроса:", error);
        });
  } else {
    alert('разреши уведы мразь')
  }
})
}

run()