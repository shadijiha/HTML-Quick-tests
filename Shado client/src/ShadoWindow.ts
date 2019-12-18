/***
*
*
* ShadoWindow object
*
*/

$ = $ || $(args) {
	return document.querySelector(args);
}

createElement = createElement || createElement(type, parent) {
	const BODY = $("body");
	const ele = document.createElement(type);

	if (parent) {
		parent.appendChild(ele);
	} else {
		BODY.appendChild(ele);
	}

	return ele;
}

class ShadoWindow {
	private id: string;
	private DOM: HTMLElement;
	private titleBar: HTMLElement;
	private body: HTMLElement;
	private x: number;
	private y: number;
	private w: number;
	private h: number;
	private title: string;
	private generated: boolean;
	private openned: boolean = false;
	constructor(
		x: number | string,
		y: number | string,
		width: number | string,
		height: number | string,
		title: string
	) {
		super("ShadoWindow");
		this.x = this.parseToWidth(x);
		this.y = this.parseToHeight(y);
		this.w = this.parseToWidth(width);
		this.h = this.parseToHeight(height);
		
		this.name = "ShadoWindow";
		this.id = this.name + "_" + Math.floor(Math.random() * 1e9);
		this.title = title;
		this.generated = false;

		this.DOM = createElement("div", $("body"));
		this.DOM.id = this.id;
		this.DOM.style.position = "absolute";
	}

	generate(): void {
		const COLOR = "rgb(50, 0, 190)";

		// Set correct width
		this.DOM.draggable = false;
		this.DOM.style.left = this.x.toString();
		this.DOM.style.top = this.y.toString();
		this.DOM.style.width = this.w + "px";
		this.DOM.style.height = this.h + "px";
		this.DOM.style.zIndex = "+3";
		this.DOM.style.backgroundColor = "white";
		this.DOM.style.border = "solid 2px " + COLOR;
		this.DOM.style.borderBottomRightRadius = "10px";
		this.DOM.style.borderBottomLeftRadius = "10px";
		this.DOM.style.overflow = "auto";

		// Generate Title bar
		const TITLEBAR_PADDING = 10;
		const TITLEBAR_HEIGHT = 35;
		this.titleBar = createElement("div", this.DOM);
		this.titleBar.id = this.id + "_titleBar";
		this.titleBar.draggable = false;
		this.titleBar.style.userSelect = "none"; // Don't allow selection On titleBar
		this.titleBar.style.width = `calc(100% - ${TITLEBAR_PADDING * 2}px)`;
		this.titleBar.style.height = TITLEBAR_HEIGHT + "px";
		this.titleBar.style.backgroundColor = COLOR;
		this.titleBar.style.color = "white";
		this.titleBar.style.padding = TITLEBAR_PADDING + "px";
		this.titleBar.style.fontWeight = "bold";
		this.titleBar.style.fontFamily = "'IBM Plex Serif', sans-serif";
		this.titleBar.style.fontSize = "16pt";
		this.titleBar.innerHTML = this.title;

		// Generate close Button
		const closeButton: HTMLElement = createElement("div", this.DOM);
		closeButton.id = this.id + "_closeButton";
		closeButton.style.position = "absolute";
		closeButton.style.userSelect = "none"; // Don't allow selection On closeButton
		closeButton.style.left = `calc(100% - ${TITLEBAR_HEIGHT +
			TITLEBAR_PADDING * 2}px)`;
		closeButton.style.top = "0px";
		closeButton.style.width = TITLEBAR_HEIGHT + TITLEBAR_PADDING * 2 + "px";
		closeButton.style.height = TITLEBAR_HEIGHT + TITLEBAR_PADDING * 2 + "px";
		closeButton.style.backgroundColor = "rgb(230, 50, 50)";
		closeButton.style.textAlign = "center";
		closeButton.style.verticalAlign = "middle";
		closeButton.style.color = "white";
		closeButton.style.fontFamily = "'IBM Plex Serif', sans-serif";
		closeButton.style.fontSize = "20pt";
		closeButton.style.cursor = "pointer";
		closeButton.innerHTML = "X";

		// Add close window event
		window.addEventListener("load", () => {
			$(`#${this.id}_closeButton`).addEventListener("click", () => {
				this.close();
			});

			$(`#${this.id}_titleBar`).addEventListener("mousemove", () => {
				if (mouse.isDown) {
					this.setX(mouse.x - this.w / 2);
					this.setY(mouse.y - TITLEBAR_HEIGHT / 2);
				}
			});
		});

		// Generate the Body dive
		const BODY_PADDING = 10;

		this.body = createElement("div", this.DOM);
		this.body.id = this.id + "_body";
		this.body.style.width = `calc(100% - ${BODY_PADDING * 2}px)`;
		this.body.style.padding = BODY_PADDING + "px";
		this.body.style.fontFamily = "'IBM Plex Serif', serif";
		this.body.style.overflow = "auto";

		this.body.innerHTML += "Placeholder...";
		this.generated = true;
	}

	CENTER_X(): void {
		let newPosX = window.innerWidth / 2 - this.w / 2;
		this.setX(newPosX);
	}

	CENTER_Y(): void {
		let newPosY = window.innerHeight / 2 - this.h / 2;
		this.setY(newPosY);
	}

	show(): void {
		if (!this.generated) {
			this.generate();
		}

		$(`#${this.id}`).style.display = "block";
		this.openned = true;
	}

	open(): void {
		this.show();
	}

	hide(): void {
		$(`#${this.id}`).style.display = "none";
		this.openned = false;
	}

	close(): void {
		this.hide();
	}

	move(): void {}

	// Getters
	getX(): number {
		return this.x;
	}

	getY(): number {
		return this.y;
	}

	getWidth(): number {
		return this.w;
	}

	getHeight(): number {
		return this.h;
	}

	getTitle(): string {
		return this.title;
	}

	getContent(): string {
		return this.body.innerHTML;
	}

	getID(): string {
		return this.id;
	}

	getBodyElement(): HTMLElement {
		return $(`#${this.id}_body`);
	}

	isOpen() {
		return this.openned;
	}

	// Setters
	setX(newX: number | string): void {
		this.x = this.parseToWidth(newX);
		$(`#${this.id}`).style.left = this.x.toString() + "px";
	}

	setY(newY: number | string): void {
		this.y = this.parseToHeight(newY);
		$(`#${this.id}`).style.top = this.y.toString() + "px";
	}

	setWidth(newWidth: number | string): void {
		this.w = this.parseToWidth(newWidth);
		$(`#${this.id}`).style.width = this.w + "px";
	}

	setHeight(newHeight: number | string): void {
		this.h = this.parseToHeight(newHeight);
		$(`#${this.id}`).style.height = this.h + "px";
	}

	setTitle(newTitle: string): void {
		$(`#${this.id}_titleBar`).innerHTML = newTitle;
	}

	setContent(newContent: string): void {
		$(`#${this.id}_body`).innerHTML = newContent;
	}

	addContent(content: string): void {
		$(`#${this.id}_body`).innerHTML += content;
	}
}