/**
 * Commands:
 *
 *
 */

class TextArea {
	constructor(_parent) {
		this.dom;
		this.parent = _parent;
		this.buffer = [];
		this.rawText = "";
		this.formatedText = "";
	}

	generate() {
		const DIV = createElement("div", this.parent);
	}

	clear() {
		this.rawText = "";
		this.formatedText = "";
	}

	add(text) {
		this.formatedText += text;

		// Clear the text from commands
		text = text.replace(/b\(\w+\)/g, "$3");

		this.rawText += text;
	}
}

function parseTextarea(val) {
	$("#output").innerHTML = val;
}
