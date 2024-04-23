const allFilter = document.getElementById("all");
const displayFilter = document.getElementById("display");
const modernFilter = document.getElementById("modern");

// Layout change event handlers
const fourCol = document.getElementById("four-col");
const threeCol = document.getElementById("three-col");
const twoCol = document.getElementById("two-col");

allFilter.addEventListener("click", () => {
	allFilter.classList.add("active");
	if (allFilter.classList.contains("active")) {
		displayFilter.classList.remove("active");
		modernFilter.classList.remove("active");
	}
});

modernFilter.addEventListener("click", () => {
	modernFilter.classList.add("active");
	if (modernFilter.classList.contains("active")) {
		displayFilter.classList.remove("active");
		allFilter.classList.remove("active");
	}
});

displayFilter.addEventListener("click", () => {
	displayFilter.classList.add("active");
	if (displayFilter.classList.contains("active")) {
		allFilter.classList.remove("active");
		modernFilter.classList.remove("active");
	}
});

const layoutOption = document.querySelectorAll(".leyout-option");
const fileList = document.getElementById("fileList");

fourCol.addEventListener("click", () => {
	fileList.classList.add("four-col");
	if (fileList.classList.contains("three-col")) {
		fileList.classList.remove("three-col");
	} else if (fileList.classList.contains("two-col")) {
		fileList.classList.remove("two-col");
	}

	fourCol.classList.add("active");
	if (fourCol.classList.contains("active")) {
		threeCol.classList.remove("active");
		twoCol.classList.remove("active");
	}
});

threeCol.addEventListener("click", () => {
	fileList.classList.add("three-col");
	if (fileList.classList.contains("four-col")) {
		fileList.classList.remove("four-col");
	} else if (fileList.classList.contains("two-col")) {
		fileList.classList.remove("two-col");
	}

	threeCol.classList.add("active");
	if (threeCol.classList.contains("active")) {
		fourCol.classList.remove("active");
		twoCol.classList.remove("active");
	}
});

twoCol.addEventListener("click", () => {
	fileList.classList.add("two-col");
	if (fileList.classList.contains("three-col")) {
		fileList.classList.remove("three-col");
	} else if (fileList.classList.contains("four-col")) {
		fileList.classList.remove("four-col");
	}

	twoCol.classList.add("active");
	if (twoCol.classList.contains("active")) {
		threeCol.classList.remove("active");
		fourCol.classList.remove("active");
	}
});

// FILTERING SETUP
let cards = document.querySelectorAll(".card"); // Ensure this selector matches your card elements

document
	.getElementById("getFontsButton")
	.addEventListener("click", async function () {
		try {
			const fontsDirHandle = await window.showDirectoryPicker();
			const fileList = document.getElementById("fileList");
			fileList.innerHTML = ""; // Clear previous entries

			for await (const entry of fontsDirHandle.values()) {
				if (entry instanceof FileSystemFileHandle) {
					const li = document.createElement("li");
					li.classList.add("card"); // class for styling

					// Extract and format font name
					const rawFontName = entry.name.split(".")[0]; // Remove extension
					const formattedFontName =
						rawFontName.charAt(0).toUpperCase() + rawFontName.slice(1); // Capitalize first letter

					// File name
					const fontName = document.createElement("div");
					fontName.classList.add("font-name");
					const font = document.createElement("p");
					font.textContent = formattedFontName;
					fontName.appendChild(font);
					li.appendChild(fontName);

					// Font display
					const fontDisplay = document.createElement("div");
					fontDisplay.classList.add("font-display");
					const display = document.createElement("p");
					fontDisplay.appendChild(display);
					li.appendChild(fontDisplay);

					//Card Function
					const cardFunction = document.createElement("div");
					cardFunction.classList.add("card-selector");

					const tagSelector = document.createElement("div");
					tagSelector.classList.add("tag-selector");

					const displayTag = document.createElement("div");
					displayTag.classList.add("font-tag");
					const displayt = document.createElement("p");
					displayt.textContent = "Display";
					displayTag.appendChild(displayt);

					tagSelector.appendChild(displayTag);

					const modernTag = document.createElement("div");
					modernTag.classList.add("font-tag");
					const modern = document.createElement("p");
					modern.textContent = "Modern";
					modernTag.appendChild(modern);

					tagSelector.appendChild(modernTag);

					cardFunction.appendChild(tagSelector);

					const weightSelector = document.createElement("div");
					weightSelector.classList.add("weight-selector");
					cardFunction.appendChild(weightSelector);
					li.appendChild(cardFunction);

					fileList.appendChild(li);

					updateCards();

					loadFont(entry, fontDisplay); // Load font and display sample text

					//select a tag
					modernTag.addEventListener("click", () => {
						if (modernTag.classList.contains("active")) {
							modernTag.classList.remove("active");
						} else {
							modernTag.classList.add("active");
						}

						if (li.classList.contains("modern")) {
							li.classList.remove("modern");
						} else {
							li.classList.add("modern");
						}

						if (displayTag.classList.contains("active")) {
							displayTag.classList.remove("active");
						}

						if (li.classList.contains("display")) {
							li.classList.remove("display");
						}
					});

					displayTag.addEventListener("click", () => {
						if (displayTag.classList.contains("active")) {
							displayTag.classList.remove("active");
						} else {
							displayTag.classList.add("active");
						}

						if (li.classList.contains("display")) {
							li.classList.remove("display");
						} else {
							li.classList.add("display");
						}

						if (modernTag.classList.contains("active")) {
							modernTag.classList.remove("active");
						}

						if (li.classList.contains("modern")) {
							li.classList.remove("modern");
						}
					});

					// Selecting the increase and decrease buttons
					const increase = document.getElementById("increase");
					const decrease = document.getElementById("decrease");

					let increment = 0; // Tracks the total change in font size relative to the initial size

					// Hardcoded initial font sizes for each layout
					const initialFontSizes = {
						"two-col": 80,
						"three-col": 60,
						"four-col": 40,
					};

					let initialFontSize = initialFontSizes["four-col"]; // Default to four-col layout initially

					// Event listener for increasing font size
					increase.addEventListener("click", () => {
						adjustFontSize(5); // Attempt to increase font size by 5px
					});

					// Event listener for decreasing font size
					decrease.addEventListener("click", () => {
						adjustFontSize(-5); // Attempt to decrease font size by 5px
					});

					function adjustFontSize(change) {
						const currentFontSize =
							parseInt(fontDisplay.style.fontSize, 10) || initialFontSize;
						const newIncrement = increment + change;

						if (newIncrement >= 15 || newIncrement <= -15) {
							increment = change > 0 ? 15 : -15; // Set increment to boundary value
							fontDisplay.style.fontSize = initialFontSize + increment + "px"; // Apply the boundary font size
							disableButtons(change > 0); // Disable the appropriate button
						} else {
							increment = newIncrement;
							resetButtonStyles();
							fontDisplay.style.fontSize = currentFontSize + change + "px"; // Apply the new font size
							console.log(
								`Font size adjusted to: ${
									currentFontSize + change
								}px (Total Change: ${increment}px)`
							);
						}
					}

					function resetButtonStyles() {
						increase.style.borderColor = "var(--main-colour)";
						increase.style.color = "var(--main-colour)";
						decrease.style.borderColor = "var(--main-colour)";
						decrease.style.color = "var(--main-colour)";
						increase.disabled = false;
						decrease.disabled = false;
					}

					function disableButtons(isIncreasing) {
						if (isIncreasing) {
							increase.style.borderColor = "var(--disabled)";
							increase.style.color = "var(--disabled)";
							increase.disabled = true;
						} else {
							decrease.style.borderColor = "var(--disabled)";
							decrease.style.color = "var(--disabled)";
							decrease.disabled = true;
						}
					}

					function resetFontSize(layoutType) {
						initialFontSize = initialFontSizes[layoutType]; // Set the font size based on layout type
						resetButtonStyles();
						increment = 0;
						fontDisplay.style.fontSize = initialFontSize + "px";
						console.log(
							`Font size reset to ${initialFontSize}px for ${layoutType} layout.`
						);
					}

					const preloadedText = document.getElementById("preloaded");
					preloadedText.style.display = "none";

					let query = window.matchMedia("(max-width: 1024px)");
					const cardContainer = document.getElementById("card-container");
					if (query.matches) {
						cardContainer.style.display = "none";
					} else {
						cardContainer.style.display = "block";
					}

					// Attach layout change listeners and apply corresponding font size reset
					const colButtons = document.querySelectorAll(".layout-option");
					colButtons.forEach((button) => {
						button.addEventListener("click", () => {
							const layoutType = button.id; // 'two-col', 'three-col', or 'four-col'
							resetFontSize(layoutType); // Reset font size according to the layout
						});
					});
				}
			}
		} catch (err) {
			console.error("Error accessing fonts directory:", err);
		}
	});

// Updates the list of all cards in the filter context
function updateCards() {
	cards = document.querySelectorAll(".card"); // Re-query all cards after new additions
}

// Filtering functionality to be re-checked
function applyFilter(filterClass) {
	cards.forEach((card) => {
		if (filterClass === "all" || card.classList.contains(filterClass)) {
			card.style.display = ""; // Show card
		} else {
			card.style.display = "none"; // Hide card
		}
	});
}

// Set filter click handlers after defining `applyFilter`
allFilter.addEventListener("click", () => {
	allFilter.classList.add("active");
	displayFilter.classList.remove("active");
	modernFilter.classList.remove("active");
	applyFilter("all");
});

modernFilter.addEventListener("click", () => {
	modernFilter.classList.add("active");
	displayFilter.classList.remove("active");
	allFilter.classList.remove("active");
	applyFilter("modern");
});

displayFilter.addEventListener("click", () => {
	displayFilter.classList.add("active");
	allFilter.classList.remove("active");
	modernFilter.classList.remove("active");
	applyFilter("display");
});

async function loadFont(fileHandle, sampleTextElement) {
	const file = await fileHandle.getFile();
	const blob = new Blob([file], { type: "font/ttf" });
	const fontUrl = URL.createObjectURL(blob);
	const fontName = fileHandle.name.split(".")[0]; // Extract font name from file name

	// Set @font-face rule dynamically
	const style = document.createElement("style");
	style.textContent = `
        @font-face {
          font-family: '${fontName}';
          src: url('${fontUrl}');
        }
      `;
	document.head.appendChild(style);

	// Apply loaded font to sample text
	sampleTextElement.style.fontFamily = fontName;
	sampleTextElement.textContent =
		document.getElementById("sampleTextInput").value;
}

// Update sample text for all font items when user types in the input box
const inputField = document.getElementById("sampleTextInput");
inputField.value = "Sample";
inputField.addEventListener("click", () => {
	inputField.value = "";
	inputField.style.caretColor = "var(--main-colour)";
	inputField.addEventListener("input", function () {
		const sampleText = this.value;

		const sampleTextElements = document.querySelectorAll(".font-display");
		sampleTextElements.forEach(function (sampleTextElement) {
			sampleTextElement.textContent = sampleText;
		});
    });
    
	inputField.addEventListener("focusout", () => {
		if (inputField.value == "") {
			inputField.value = "Sample";

			const sampleText = inputField.value;
			const sampleTextElements = document.querySelectorAll(".font-display");
			sampleTextElements.forEach(function (sampleTextElement) {
				sampleTextElement.textContent = sampleText;
			});
		}
	});
});

//Update Colours for Dark mode
document.getElementById("dark").addEventListener("click", () => {
	document.documentElement.style.setProperty("--main-colour", "#ffffff");
	document.documentElement.style.setProperty("--secondary-colour", "#1414ff");
	document.documentElement.style.setProperty("--disabled", "#BEBEBE");
});

//Update Colours for Light mode
document.getElementById("light").addEventListener("click", () => {
	document.documentElement.style.setProperty("--main-colour", "#1414ff");
	document.documentElement.style.setProperty("--secondary-colour", "#ffffff");
	document.documentElement.style.setProperty("--disabled", "dimgrey");
});
