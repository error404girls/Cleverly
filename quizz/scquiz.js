let cards = [];
let currentCardIndex = 0;
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
    const button=document.querySelector(".dropdown-toggle");
    button.innerHTML=`${type.charAt(0).toUpperCase()+ type.slice(1)} <i class="fas fa-angle-down"></i>`;
  }
  
  function handleInputChange(selected) {
    document.getElementById("pdf-section").style.display="none";
    document.getElementById("text-section").style.display="none";
    document.getElementById("image-section").style.display="none";
    if(selected ==="pdf") {
      document.getElementById("pdf-section").style.display="flex";
    } else if (selected=== "image") {
      document.getElementById("image-section").style.display="flex";
    } else {
      document.getElementById("text-section").style.display="flex";}
  }




   API_KEY= process.env.GEMINI_API_KEY;

  async function generate(notes) {
  const loader = document.getElementById("loading");
  loader.style.display = "block";

  const systemPrompt = `Do not repeat the answer order. Do not put the correct answer in the middle everytime. Do not number the questions or use any bold formatting. 
I want you to generate interactive multiple-choice questions based on the input I provide.  
Always put the correct answers in different orders. Don't repeat the position of the correct answers. 
Make it strategic to train the brain. Don’t leave out any important information. 
Format each question like this: question | a. Answer 1 ! true/false, b. Answer 2 ! true/false, c. Answer 3 ! true/false. 
Only one answer should be marked as true. Make the questions engaging and clear. 
MAKE AS MANY AS YOU CAN. ANSWER IN THE LANGUAGE OF THE INPUT.`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBkazYWXa-gMEd8DU5n46xPGCnvt2nP_hY",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: systemPrompt }, { text: notes }]
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      alert("API request failed with status " + response.status);
      return;
    }

    const data = await response.json();
    console.log("Gemini response data:", data);

    const flashcardsText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No flashcards generated.";
    display(flashcardsText);

  } catch (error) {
    console.error("Error generating flashcards:", error);
    alert("Something went wrong while generating flashcards, sorry :(.");
  } finally {
    loader.style.display = "none";
  }
}




async function handlePDF()
   {
    const file= document.getElementById("pdf-upload").files[0];
    if(!file) 
    {
      alert("Please upload a PDF file :D");
      return;
    }
    let extractedText="";
    try{
      const arrayBuffer= await file.arrayBuffer();
      const pdf= await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      for (let i=1; i<=pdf.numPages; i++) 
      {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text=content.items.map(item => item.str).join(" ");
        extractedText += text+"\n\n";
      }
      generate(extractedText);
    } 
    catch(err) 
    {
      console.error("Error reading PDF:", err);
      alert("Failed to extract text from PDF.");
    }
  }
  
  async function handleImage() {
    const file= document.getElementById("image-upload").files[0];
    if(!file)
    {
      alert("Please upload an image");
      return;
    }
    try
     {
      const reader = new FileReader();
      reader.onload = async function (event) {
        const imageData = event.target.result;
        const { data:{ text } } = await Tesseract.recognize(
          imageData,
          'eng',
          {
            logger: m => console.log(m),
            tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ',
          }
        );
        console.log("Extracted Text from Image:", text);
        generate(text);
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
      alert("Enter some text");
      return;}
    generate(manualText);
  }
  
function display(text) {
  const container = document.getElementById("quiz-container");
  container.replaceChildren();
  cards=[];
  currentCardIndex=0;
  const lines = text.split("\n");
  lines.forEach((line) => {
    if(line.includes("|")) {
      const parts = line.split("|");
      if(parts.length>=2) {
        const question = parts[0].trim();
        const answers = parts[1].split(",").map((ans)=>ans.trim());
        const card=document.createElement("div");
        card.className = "card";
        const questionElement = document.createElement("div");
        questionElement.className = "quiz-question";
        questionElement.textContent = question;
        const answersElement = document.createElement("div");
        answersElement.className = "quiz-answers";
        answers.forEach((answer) => {
          const[answerText, truthValue] = answer.split("!").map(part=>part.trim());
          if(truthValue!==undefined) {
            const isCorrect = truthValue.toLowerCase() === "true";
            const option = document.createElement("div");
            option.className = "answer-option";
            option.textContent = answerText;
            option.dataset.correct = isCorrect;
            option.addEventListener("click", ()=>handleAnswerClick(option, isCorrect));
            answersElement.appendChild(option);
          }
        });
        card.appendChild(questionElement);
        card.appendChild(answersElement);
        cards.push(card);
      }
    }
  });
  if(cards.length) {
    container.appendChild(cards[currentCardIndex]);
    document.querySelector(".navigation-buttons").style.display = "flex";
    toggleNavigationButtons();
  } else {
    document.querySelector(".navigation-buttons").style.display = "none";
    container.innerHTML = "<p>No questions generated :( Try again.</p>";
  }
}



function handleAnswerClick(option, isCorrect) {
  if(isCorrect) {
    option.classList.add("correct");
  } else {
    option.classList.add("incorrect");
  }
  const allOptions = option.parentElement.querySelectorAll(".answer-option");
  allOptions.forEach(choice => {
    choice.style.pointerEvents = "none";
    if(choice.dataset.correct=== "true") {
      choice.classList.add("correct");
    }
  });
}




function showNextCard() {
  if(currentCardIndex < cards.length-1) {
    currentCardIndex++;
    updateDisplayedCard();
  }
}

function showPreviousCard() {
  if(currentCardIndex > 0) {
    currentCardIndex--;
    updateDisplayedCard();
  }
}

function updateDisplayedCard() {
  const container = document.getElementById("quiz-container");
  container.replaceChildren();
  container.appendChild(cards[currentCardIndex]);
  toggleNavigationButtons();
}

function toggleNavigationButtons() {
  const prev = document.getElementById("prev-button");
  const next = document.getElementById("next-button");
  prev.disabled = currentCardIndex === 0;
  next.disabled = currentCardIndex === cards.length - 1;
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
