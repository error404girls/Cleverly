function toggleDropdown() {
    const menu = document.getElementById("dropdown-menu");
    const icon = document.querySelector(".dropdown-toggle i");
    if(menu.style.display==="flex") 
    {
      menu.style.display="none";
      icon.style.transform="rotate(0deg)";
    } else 
    {
      menu.style.display="flex";
      icon.style.transform="rotate(180deg)";
    }
  }
  
  function select(type) {
    toggleDropdown(); 
    handleInputChange(type); 
    const button = document.querySelector(".dropdown-toggle");
    button.innerHTML = `${type.charAt(0).toUpperCase()+ type.slice(1)} <i class="fas fa-angle-down"></i>`;
  }
  
  function handleInputChange(selected) {
    document.getElementById("pdf-section").style.display = "none";
    document.getElementById("text-section").style.display = "none";
    document.getElementById("image-section").style.display = "none";
  
    if (selected === "pdf") {
      document.getElementById("pdf-section").style.display = "flex";
    } else if (selected === "image") {
      document.getElementById("image-section").style.display = "flex";
    } else {
      document.getElementById("text-section").style.display = "flex";}
  }
 async function generateFlashcards(notes) {
  const loader = document.getElementById("loading");
  loader.style.display = "block";
  
  try {
    const response = await fetch("http://localhost:3000/api/generate-flashcards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ notes })
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to generate flashcards");
    }
    displayFlashcards(data.flashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    alert("Something went wrong while generating flashcards, sorry :(");
  } finally {
    loader.style.display = "none";
  }
}
  
  async function handlePDF()
   {
    const file = document.getElementById("pdf-upload").files[0];
    if (!file) 
    {
      alert("Please upload a PDF file :D");
      return;
    }
    let extractedText = "";
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      for (let i = 1; i <= pdf.numPages; i++) 
      {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(" ");
        extractedText += text + "\n\n";
      }
      generateFlashcards(extractedText);
    } 
    catch (err) 
    {
      console.error("Error reading PDF:", err);
      alert("Failed to extract text from PDF.");
    }
  }
  
  async function handleImage() {
    const file = document.getElementById("image-upload").files[0];
    if(!file)
    {
      alert("Please upload an image...");
      return;
    }
    try
     {
      const reader = new FileReader();
      reader.onload = async function (event) {
        const imageData = event.target.result;
        const { data: { text } } = await Tesseract.recognize(
          imageData,
          'eng',
          {
            logger: m => console.log(m),
            tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ',
          }
        );
        console.log("Extracted Text from Image:", text);
        generateFlashcards(text);
      };
      reader.readAsDataURL(file);
    }
     catch (error)
     {
      console.error("Error processing image:", error);
      alert("Failed to extract text from image.");
    }
  }
  
  function handleManualText() {
    const manualText = document.getElementById("manual-text").value.trim();
    if(!manualText) 
      {
      alert("Enter some text..");
      return;
    }
    generateFlashcards(manualText);
  }
  
  let flashcards = [];
  let currentCardIndex = 0;
  function displayFlashcards(text) {
    const container = document.getElementById("flashcards-container");
    container.replaceChildren(); 
    const lines = text.split("\n");
    flashcards =[];
    currentCardIndex =0;
  
    lines.forEach((line, index) => {
      if (line.includes("|")) {
        const parts = line.split("|");
        if (parts.length >= 2) {
          const term = parts[0].trim();
          const def = parts.slice(1).join("|").trim();
          const card = document.createElement("div");
          card.className = "card";
          const termElement = document.createElement("div");
          termElement.className = "flashcard-term";
          termElement.textContent = term;
          const defElement = document.createElement("div");
          defElement.className = "flashcard-definition";
          defElement.textContent = def;
          defElement.style.display = "none";
  
  
  
  
  
  
  
  
  
  
  
          card.appendChild(termElement);
          card.appendChild(defElement);
          card.addEventListener("click", function () {
            toggleFlashcardDefinition(card);
          });
  
          flashcards.push(card);
        }
      }
    });
  
    console.log("All flashcards:", flashcards.length);
    console.log("Current card index:", currentCardIndex);
  
    if (flashcards.length > 0) {
      container.appendChild(flashcards[currentCardIndex]);
      document.querySelector(".navigation-buttons").style.display = "flex";
      toggleNavigationButtons();
    } 
    else {
      document.querySelector(".navigation-buttons").style.display = "none";
      container.innerHTML = "<p>No flashcards generated :( , try again.</p>";
    }
  }
  
  function toggleFlashcardDefinition(card) {
    const defElement = card.querySelector(".flashcard-definition");
    if(defElement) {
      if(defElement.style.display==="none") {
        defElement.style.display="block";
      } else {defElement.style.display="none";}
    }
  }
  function showNextCard() {
    if(currentCardIndex<flashcards.length-1) {
      currentCardIndex++;
      updateDisplayedCard();
    }
  }
  function showPreviousCard() {
    if(currentCardIndex>0) {
      currentCardIndex--,updateDisplayedCard();
    }
  }
  function updateDisplayedCard() {
    const container = document.getElementById("flashcards-container");
    container.innerHTML ="";
    container.appendChild(flashcards[currentCardIndex]);
    toggleNavigationButtons();
  }
  function toggleNavigationButtons() {
    const prev =document.getElementById("prev-button");
    const next = document.getElementById("next-button");
    if(currentCardIndex === 0) {
      prev.disabled = true;
    } else {
      prev.disabled = false;
    }
    if(currentCardIndex === flashcards.length - 1) {
      next.disabled = true;
    } else {
      next.disabled = false;
    }
  }
  
  
  
  
  
  
  
  function whattodo(){
    if(document.querySelector("#dd i").classList.contains("fa-bars"))
        open_menu();
    else
        close_menu();
  }
  
  function open_menu() {
    document.getElementById("menu").style.width = "250px";
    document.querySelector("#dd i").classList.remove("fa-bars");
    document.querySelector("#dd i").classList.add("fa-xmark");
  }
  
  function close_menu() {
    document.getElementById("menu").style.width = "0";
    document.querySelector("#dd i").classList.remove("fa-xmark");
    document.querySelector("#dd i").classList.add("fa-bars");
  }
  
  
