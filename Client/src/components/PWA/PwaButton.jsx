import {useEffect, useState} from 'react'

const PwaButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      event.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDownloadClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('Usuario aceptó la instalación');
      } else {
        console.log('Usuario canceló la instalación');
      }

      setDeferredPrompt(null);
    } else {
      console.log('La instalación no está disponible');
    }
  };
  return (
    <button onClick={handleDownloadClick}>Descargar PWA</button>
  )
}

export default PwaButton