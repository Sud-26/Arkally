import {
  ChangeDetectorRef,
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

/**
 * Mediaquery directive.
 * 
 * @author __
 */
@Directive({
  selector: '[mqIf]'
})
export class MqIfDirective implements OnDestroy {
  private prevCondition: boolean = null;
  i = 0;

  private mql: MediaQueryList;
  private mqlListener: (mql: MediaQueryListEvent) => void;   // reference kept for cleaning up in ngOnDestroy()
  constructor(private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<Object>,
    private ref: ChangeDetectorRef) {
  }

  /**
   * Called whenever the media query input value changes.
   */
  @Input()
  set mqIf(newMediaQuery: string) {
    if (!this.mql) {
      this.mql = window.matchMedia(newMediaQuery);

      /* Register for future events */
      this.mqlListener = (mq) => {
        this.onMediaMatchChange(mq.matches);
      };

      this.mql.addListener(this.mqlListener);
    }

    this.onMediaMatchChange(this.mql.matches);
  }

  ngOnDestroy() {
    this.mql.removeListener(this.mqlListener);
    this.mql = this.mqlListener = null;
  }

  private onMediaMatchChange(matches: boolean) {
    if (matches && !this.prevCondition) {
      this.prevCondition = true;
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (!matches && this.prevCondition) {
      this.prevCondition = false;
      this.viewContainer.clear();
    }

    /**
     * Infinitive loop when we fire detectChanges during initialization
     * (first run on that func)
     */
    if (this.i > 0) {
      this.ref.detectChanges();
    }
    else
      this.i++;
  }
}