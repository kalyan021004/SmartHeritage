let currentUtterance = null;

function getVoice(language) {
  const voices = speechSynthesis.getVoices();

  console.log("Available voices:", voices);

  if (!voices.length) return null;

  if (language === "te") {
    return voices.find(v =>
      v.lang.toLowerCase().includes("te")
    );
  }

  if (language === "hi") {
    return voices.find(v =>
      v.lang.toLowerCase().includes("hi")
    );
  }

  return (
    voices.find(v => v.lang === "en-US") ||
    voices.find(v =>
      v.lang.startsWith("en")
    )
  );
}

export function speakText(text, language = "en") {
  console.log("🎙 speakText called");
  console.log("Language:", language);

  if (!("speechSynthesis" in window)) {
    console.log("Speech not supported");
    return;
  }

  speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  let voice = getVoice(language);

  // If voices not ready, wait and retry
  if (!voice) {
    console.log("Waiting for voices...");

    speechSynthesis.onvoiceschanged =
      () => {
        voice = getVoice(language);

        if (voice) {
          utterance.voice = voice;
        }

        speechSynthesis.speak(utterance);
      };

    return;
  }

  utterance.voice = voice;

  currentUtterance = utterance;

  speechSynthesis.speak(utterance);

  console.log("Speech started");
}

export function stopSpeech() {
  speechSynthesis.cancel();
}