declare module "page-flip" {
  export type FlipEvent = { data: unknown; object: PageFlip };

  export class PageFlip {
    constructor(element: HTMLElement, settings: Record<string, unknown>);
    on(event: string, callback: (e: FlipEvent) => void): void;
    loadFromImages(images: string[]): void;
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    flip(page: number, corner?: "top" | "bottom"): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    getOrientation(): "portrait" | "landscape";
    startUserTouch(pos: { x: number; y: number }): void;
    userMove(pos: { x: number; y: number }, isTouch?: boolean): void;
    userStop(pos: { x: number; y: number }, isSwipe?: boolean): void;
    update(): void;
    destroy(): void;
  }
}
