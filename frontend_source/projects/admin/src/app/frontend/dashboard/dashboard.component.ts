import { Component, HostListener, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PageScrollService } from 'ngx-page-scroll-core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  collapse: boolean = false;
  width: number = 0;
  @ViewChild('download', { static: true }) Download: ElementRef;
  @ViewChild('step1', { static: true }) step1: ElementRef;
  @ViewChild('step2', { static: true }) step2: ElementRef;
  @ViewChild('choose', { static: true }) choose: ElementRef;
  @ViewChild('process', { static: true }) process: ElementRef;
  @ViewChild('feature', { static: true }) feature: ElementRef;
  @ViewChild('app', { static: true }) app: ElementRef;
  @ViewChild('safty', { static: true }) safty: ElementRef;
  @ViewChild('database', { static: true }) database: ElementRef;
  @ViewChild('idc', { static: true }) idc: ElementRef;
  @ViewChild('command', { static: true }) command: ElementRef;
  @ViewChild('price', { static: true }) price: ElementRef;
  @ViewChild('subscription', { static: true }) subscription: ElementRef;
  mobileView: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private pageScrollService: PageScrollService,
    @Inject(DOCUMENT) private document: any) {
  }

  @HostListener('window:mousewheel', ['$event']) getScrollHeight(event) {
    if (event.target.closest('section') != null) {
      this.onMouseScroll(event);
    }
  }

  ngOnInit() {

  }

  onMouseScroll(event) {

    let lists = document.querySelectorAll('.navbar-collapse .nav-link');
    this.removeActiveLink(lists);
    // console.log(event.target.closest('section'))
    // let $ele = event.deltaY > 0 ? event.target.closest('section'):
    //     event.target.closest('section'),
    //   id = $ele != null ? $ele.id : 'id';

    // let $ele = event.deltaY > 0 ? event.target.closest('section').nextElementSibling :
    //     event.target.closest('section').previousElementSibling,
    //   id = $ele != null ? $ele.id : 'id';

    // this.pageScrollService.scroll({
    //   document: this.document,
    //   scrollOffset: 70,
    //   // _interval: 100,
    //   // duration: 100,
    //   interruptible: false,
    //   // scrollTarget:  `#${event.target.closest('section').id}`,
    //   // scrollViews: $ele,
    //   scrollTarget: `#${id}`
    // });

  
    // // setTimeout(() => {
    // if (id === 'choose' || id === "process" || id === 'download') {
    //   document.querySelector(`.about-link`).classList.add('active');
    // } else {
    //   if (document.querySelector(`[data-target="${id}"]`) != null) {
    //     document.querySelector(`[data-target="${id}"]`).classList.add('active');
    //   }
    // }
    // }, 500)
  }


  onHeaderScrollView($event) {
    let id = $event.id;
    this.collapse = false;
    // let $element = document.getElementById(id);

    this.pageScrollService.scroll({
      document: this.document,
      scrollOffset: 70,
      _interval: 200,
      scrollTarget: `#${id}`,
    });



    if (id == 'choose' || id == "process" || id == "download") {
      let lists = document.querySelectorAll('.navbar-collapse .nav-link');
      this.removeActiveLink(lists);
      document.querySelector('.about-link').classList.add('active');

    } else {

      let $achorSelector = document.querySelector(`[data-target=${id}]`),
        lists = $achorSelector.closest('.navbar-nav').children;

      this.removeActiveLink(lists);
      $achorSelector.classList.add('active');


    }
  }

  removeActiveLink(lists) {
    for (var i = 0; i < lists.length; i++) {
      lists[i].classList.remove('active');
      if (lists[i].classList[0] == 'nav-item') {
        lists[i].children[0].classList.remove('active');
      }
    }
  }

}
