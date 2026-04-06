export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export class MarioControls {
  private state: InputState = { left: false, right: false, jump: false };
  private keydownHandler: (e: KeyboardEvent) => void;
  private keyupHandler: (e: KeyboardEvent) => void;

  constructor() {
    this.keydownHandler = (e: KeyboardEvent) => this.onKeyDown(e);
    this.keyupHandler = (e: KeyboardEvent) => this.onKeyUp(e);
  }

  bind(): void {
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
  }

  unbind(): void {
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
    this.reset();
  }

  reset(): void {
    this.state = { left: false, right: false, jump: false };
  }

  getState(): InputState {
    return { ...this.state };
  }

  setTouchLeft(active: boolean): void { this.state.left = active; }
  setTouchRight(active: boolean): void { this.state.right = active; }
  setTouchJump(active: boolean): void { this.state.jump = active; }

  private onKeyDown(e: KeyboardEvent): void {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.state.left = true;
        e.preventDefault();
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.state.right = true;
        e.preventDefault();
        break;
      case 'ArrowUp':
      case 'KeyW':
      case 'Space':
        this.state.jump = true;
        e.preventDefault();
        break;
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.state.left = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.state.right = false;
        break;
      case 'ArrowUp':
      case 'KeyW':
      case 'Space':
        this.state.jump = false;
        break;
    }
  }
}
