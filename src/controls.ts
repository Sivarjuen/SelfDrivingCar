export enum ControlType {
    DUMMY,
    KEYS,
    AI,
}

export default class Controls {
    forward = false;
    left = false;
    right = false;
    reverse = false;
    control: ControlType;

    constructor(controlType: ControlType) {
        this.control = controlType;
        switch (controlType) {
            case ControlType.KEYS:
                this.#addKeyboardListeners();
                break;
            case ControlType.DUMMY:
                this.forward = true;
                break;
        }
    }

    #addKeyboardListeners() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
        };

        document.onkeyup = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
        };
    }
}
