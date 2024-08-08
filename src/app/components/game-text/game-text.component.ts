import { Component, ElementRef, Input, Renderer2, inject } from '@angular/core';

@Component({
  selector: 'game-text',
  standalone: true,
  imports: [],
  templateUrl: './game-text.component.html',
  styleUrl: './game-text.component.scss'
})
export class GameTextComponent {

  @Input() text!: string;
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private listeners: any[] = [];

  ngAfterViewInit() {
    this.createInteractiveText(this.text);
  }

  ngOnDestroy() {
    this.listeners.forEach((listener) => {
      if (listener) {
        listener();
      }
    })
  }

  private createInteractiveText(textToAdd: string) {
    const regexp = /[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/g;

    let text = `${textToAdd}`;

    const foundIds: RegExpExecArray[] = [...text.matchAll(regexp)];
    foundIds.forEach((id) => {
      const idxStart = text.indexOf(id[0]);
      const idxEnd = idxStart + id[0].length
      const chunkText = text.slice(0, idxStart);
      this.addText(chunkText);
      const refText = text.slice(idxStart, idxEnd);
      this.addRef(refText);
      text = text.slice(idxEnd);
    });
    this.addText(text);
  }

  private addText(textChunk: string) {
    const chunk = this.renderer.createText(textChunk);
    this.renderer.appendChild(this.el.nativeElement, chunk);
  }
  private addRef(refId: string) {
    const refText = this.renderer.createText(refId);
    const ref = this.renderer.createElement('span');
    this.renderer.addClass(ref, 'ref');
    this.renderer.appendChild(ref, refText);
    this.renderer.appendChild(this.el.nativeElement, ref);
    const listener = this.renderer.listen(ref, 'click', (evt) => {
      console.log(`LOL: Event ${evt} for ID: ${refId}`);
    });
    this.listeners.push(listener);
  }
}
