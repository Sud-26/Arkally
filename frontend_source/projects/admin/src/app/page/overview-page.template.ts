import { Inject, LOCALE_ID, ViewChild, OnDestroy, Input, Output } from '@angular/core';
import { Page, PageRequest, ServiceFilter } from 'projects/nvl-shared/src/public-api';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { AuthenticationService } from '../security/service/authentication/authentication.service';
import { DialogService } from 'dialog-service';
import { NgForm } from '@angular/forms';
import { NotifyService } from '../service/notify/notify.service';
import { RestClientService } from '../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { Subject, timer, Subscription, interval } from 'rxjs';
import { map, take } from "rxjs/operators";
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';
import * as moment from 'moment';
import 'moment-timezone';

// TODO move to nvl shared
export abstract class OverviewPageTemplate<T, F extends ServiceFilter> implements OnDestroy {

    private subscription: Subscription;

    getRentTime: any;
    obj:any;

    getSpentTime;
    timer: any = [];

    public dateNow = new Date();
    public dDay = new Date();
    milliSecondsInASecond = 1000;
    hoursInADay = 24;
    minutesInAnHour = 60;
    SecondsInAMinute = 60;

    public timeDifference;
    public secondsToDday;
    public minutesToDday;
    public hoursToDday;
    public daysToDday;

    nMinutes: any;
    nSeconds: any;


    activeState: boolean;
    parseDateStatus: boolean = true;


    private getTimeDifference() {
        // this.timeDifference = (this.dDay.getTime() + new Date().getTime())   - (this.dateNow.getTime() + new Date().getTime());
        this.timeDifference = this.dDay.getTime() - new Date().getTime();
        // this.timeDifference = this.dDay   - this.dateNow;
        // console.log(this.timeDifference)
        this.allocateTimeUnits(this.timeDifference);
        // console.log(this.timeDifference, this.timeDifference)
    }

    private allocateTimeUnits(timeDifference) {
        this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
        this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
        this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
        this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
    }

    public timerSub: Subscription;
    public value: number;

    @ViewChild('filterForm', { static: true }) filterForm: NgForm;

    page: Page<T>;
    serviceFilter: F;
    pageRequest: PageRequest = new PageRequest(1, 10);
    rows = [];
    loader = false;

    createPermission = false;
    editPermission = false;
    deletePermission = false;
    defaultViewPermission = false;
    activeTimer = false;
    // itemsData: any = [];
    columns:any;


    protected $ngDestroyed = new Subject();

    translate = (tag: string) => this.translateService.instant(tag);

    constructor(
        private path: string,
        private scope: string,
        protected restClientService: RestClientService,
        private filterType: new () => F,
        protected router: Router,
        protected notifyService: NotifyService,
        protected dialogService: DialogService,
        protected translateService: TranslateService,
        public authenticationService: AuthenticationService,
        protected initFirstPage: boolean = true
    ) {
        this.initFilter(filterType);
        this.setFirstPage(initFirstPage);
        this.checkPermissions();
    }

    private initFilter(filterType) {
        if (filterType !== null) {
            this.serviceFilter = new this.filterType();
        }
    }

    ngOnDestroy() {
        this.$ngDestroyed.next();
        this.$ngDestroyed.complete();
        // this.subscription.unsubscribe();
        // if (this.timerSub) {
        //     this.timerSub.unsubscribe();
        // }
    }

    checkPermissions() {
        this.createPermission = this.authenticationService.checkPermission(this.scope, 'create');
        this.editPermission = this.authenticationService.checkPermission(this.scope, 'update');
        this.deletePermission = this.authenticationService.checkPermission(this.scope, 'delete');
        this.defaultViewPermission = this.authenticationService.checkPermission(this.scope, 'default_view');
    }

    changePageSize(size) {
        this.pageRequest = new PageRequest(1, size);
        this.setFirstPage();
    }

    setFirstPage(initFirstPage = true) {
        if (initFirstPage) {
            this.setPage(1);
        }
    }

    setPage(pageNumber: number) {
        // console.log(pageNumber, 'pageNumber')
        this.pageRequest.page = pageNumber;
        this.fetch();
    }
    ngOnInit() {
        this.subscription = interval(1000)
            .subscribe(x => { this.getTimeDifference(); });
    }

    fetch() {
        this.loader = true;
        this.restClientService.get(this.path, `?page=${this.pageRequest.page}&size=${this.pageRequest.size}&${this.serviceFilter.toHttpParams().toString()}`).subscribe(
            response => {
                this.page = response.data;
                this.rows = response.data.content;

                if (this.router.url !== '/rent-stats') {
                    if (this.rows === undefined) { this.rows = []; }
                    this.rows.forEach(row => {
                        // row.slots != null  ? row.slots = JSON.parse(row.slots) : row.slots;
                        if (row.slots != null) {
                            let slotLength = Object.keys(JSON.parse(row.slots)).length;
                            if (slotLength) {
                                row.slots = JSON.parse(row.slots)
                            } else {
                                row.slots = null
                            }
                        }

                        // debugger
                        if (row.alarm_state) {
                            // debugger
                            let todayDate = new Date(),
                                pauseTime = row.alarm_pause_time != null ? new Date(row.alarm_pause_time) : 0,
                                // pauseTime =  new Date(row.alarm_pause_time) ,
                                getTimeDiff = (typeof (pauseTime) == "object" ? todayDate.getTime() - pauseTime.getTime() : todayDate.getTime()),
                                rowPauseDuration = Math.floor(getTimeDiff / 1000);

                            // console.log(rowPauseDuration, 'rowSecond')

                            let d1 = new Date(row.alarm_on_tme),
                                d1Seconds = d1.getSeconds(),
                                pauseDuration = rowPauseDuration;
                            d1.setSeconds(d1Seconds + pauseDuration + row.alarm_pause_duration);
                            // console.log(new Date(d1), rowPauseDuration, pauseTime, getTimeDiff)

                            if (!row.alarm_pause_status) {
                                clearInterval(this.timer[row.id]);

                                let d2 = new Date(row.alarm_on_tme),
                                    d2Seconds = d2.getSeconds();
                                d2.setSeconds(d2Seconds + 0 + row.alarm_pause_duration);

                                this.timer[row.id] = setInterval(() => {
                                    let time = this.timeDiff(d2);
                                    // console.log(time, 'time')
                                    row.remainTime = ""
                                    row.remainTime = time;
                                }, 1000);
                            } else {

                                let time = this.timeDiff(new Date(d1));
                                row.remainTime = time;
                                // this.completeRuningTimer(rentTimeDuration);
                            }

                        } else {

                            clearInterval(this.timer[row.id]);
                            row.remainTime = '';

                        }
                    });

                } else {
                    this.rentStats(response);
                }

                this.loader = false;

            }
        );

    }
    // rent Stats Component //
    rentStats(response) {
        this.rows = [];
        this.columns = [
            {
                name: 'name',
                prop: 'name',
                nonResponsive: true,
                minWidth: 200,
                maxWidth: 200
            },
            {
                name: 'user Id',
                prop: 'trraceable_object_id',
                nonResponsive: true,
                minWidth: 200,
                maxWidth: 200
            }];
        let content = response.data.content;
        if (content != undefined && content.length) {
            content.map((data, key) => {
                this.rows = [
                    {
                        "name": data.name,
                        "trraceable_object_id": data.trraceable_object_id,
                    }];
                data.rentminits.map((item, i) => {
                    let key = Object.keys(item)[0];
                    this.obj = {
                        'name': `${key}`,
                        'prop': `cnt_${key}`,
                        'maxWidth': 150
                    };
                    this.columns.push(this.obj);
                    this.rows[0][`cnt_${key}`] = data.cnt[i]

                });
            })
        }
    }


    subscribeToFilterChange() {
        if (this.filterForm) {
            this.filterForm.valueChanges.pipe(takeUntil(this.$ngDestroyed), debounceTime(400), distinctUntilChanged((a, b) => {
                return JSON.stringify(a) === JSON.stringify(b);
            })).subscribe(() => {
                // only start a new search if form has changed to avoid going to first page after loading filters from store
                // after filters change, start from first page and filter results
                if (this.filterForm.dirty) {
                    this.setFirstPage();
                }
            });
        }
    }

    aClicked(data) {
        this.getResponse(data);
    }

    getResponse(data) {
        // console.log(data)
        const model = new AlarmStartTimeModel();
        model.alarm_start = Number(data.msg);
        model.alarm_state = true;
        this.restClientService
            .put(environment.api.path.alarm_list + '/' + data.id, model)
            .subscribe((response) => {
                if (response.success) {

                    let responeData = response.data,
                        d1 = new Date(responeData.alarm_on_tme);

                    this.getRentTime = d1.getHours() + ":" + d1.getMinutes() + ':' + + d1.getSeconds();
                    this.getSpentTime = data.msg;

                    this.rows.forEach((row, i) => {
                        if (row.id == data.id) {
                            // clearInterval(this.timer[data.id]);
                            this.timer.length ? clearInterval(this.timer[data.id]) : null
                            const startValue = data.msg;


                            row.alarm_on_tme = responeData.alarm_on_tme;
                            row.alarm_pause_status = false;
                            row.alarm_state = responeData.alarm_state;
                            row.alarm_start = responeData.alarm_start;
                            let countDownDate = new Date();
                            // getMinute = countDownDate.getMinutes();
                            // countDownDate.setMinutes(Number(getMinute) + Number(startValue));  

                            this.timer[data.id] = setInterval(() => {
                                // save the time difference into a var for reference
                                let time = this.timeDiff(countDownDate);
                                // set the spans text to the timer text.                                                    
                                row.remainTime = time;
                            

                            }, 1000);



                        }

                    })
                }
            });

    }
    timeDiff(time) {
        let diff = new Date().getTime() - time.getTime();
        let msec = diff;
        let hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        let mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;
        let ss = Math.floor(msec / 1000);
        msec -= ss * 1000;
        // if (hh > 0) {
        //   let uom = (hh == 1) ? "hour" : "hours";
        //   return hh + " " + uom;
        // }
        if (hh < 1 && mm > 0) {
            this.nMinutes = mm;
        }
        // if (hh < 1 && mm < 1) {
        //   let uom = (ss == 1) ? "second" : "seconds";
        this.nSeconds = ss;
        return mm + ' : ' + ss;
        // }

    }


    clearTimer(data) {
        // console.log(data)

        // play pause
        if (data.state != "clear" && data.state != "complete") {
            // console.log(data.state)
            const model = new AlarmPauseStateModel();
            model.alarm_pause_status = data.state;
            this.restClientService
                .put(environment.api.path.alarm_pause_status + '/' + data.id, model)
                .subscribe((response) => {
                    if (response.success) {
                        let responseData = response.data;
                        // console.log(responseData)
                        this.rows.forEach((row, i) => {
                            // console.log(row.id ==  data.id)
                            if (row.id == responseData.id) {
                                // console.log(row.alarm_state)
                                row.alarm_pause_status = data.state;

                                if (responseData.alarm_pause_status) {
                                    // console.log(responseData)
                                    clearInterval(this.timer[data.id]);

                                } else {

                                    let d1 = new Date(responseData.alarm_on_tme),
                                        d1Seconds = d1.getSeconds();
                                    d1.setSeconds(d1Seconds + responseData.alarm_pause_duration);

                                    clearInterval(this.timer[responseData.id]);
                                    this.timer[responseData.id] = setInterval(() => {
                                        let time = this.timeDiff(new Date(d1));
                                        row.remainTime = time;
                                        // call to function after 30 seconds to stop timer
                                        // if (((Number(this.nMinutes) * 60) + Number(this.nSeconds)) == responseData.alarm_start) {
                                        //     clearInterval(this.timer[responseData.id]);
                                        // }

                                    }, 1000);

                                }

                            }
                        })
                    }
                });

        } else if (data.state == 'complete') {
            //Complete
            this.completeTimer(data.id);
            
        } else if (data.state == 'clear') {
            //Reset Timer //
            //this.completeTimer(data.id);
            this.restClientService
            .get(environment.api.path.rentReset + '/' + data.id)
            .subscribe((response) => {
                if (response.success) {
                    // this.timer = '';
                    // this.timerData = ""
                    // clearInterval(this.interval)	

                    this.rows.forEach((row, i) => {
                        if (row.id == data.id) {
                            row.remainTime = '';
                            row.alarm_state = false;
                            clearInterval(this.timer[data.id])
                        }
                    })
                }
            });
            // const model = new AlarmStartTimeModel();
            // model.alarm_start = Number(data.time);
            // model.alarm_state = false;
            // this.restClientService
            //     .put(environment.api.path.alarm_list + '/' + data.id, model)
            //     .subscribe((response) => {
            //       if (response.success) {

            //         let responeData = response.data,
            //             d1 = new Date(responeData.alarm_on_tme);

            //         // this.getRentTime = d1.getHours() + ":" + d1.getMinutes() + ':' + + d1.getSeconds() ;
            //         // this.getSpentTime = data.msg;   

            //         this.rows.forEach((row, i)=>{
            //             if(row.id == data.id){
            //                 // clearInterval(this.timer[data.id]);
            //                 clearInterval(this.timer[data.id]);
            //                 row.remainTime = '';
            //                     // countDownDate.setMinutes(Number(getMinute) + Number(startValue));  
            //             }

            //         })
            //       } 
            // });

        }


    }

    completeTimer(id) {
        this.restClientService
            .get(environment.api.path.rentCompleted + '/' + id)
            .subscribe((response) => {
                if (response.success) {
                    this.rows.forEach((row, i) => {
                        if (row.id == id) {
                            row.remainTime = '';
                            row.alarm_state = false;
                            clearInterval(this.timer[id])
                        }
                    })
                }
            });
    }

    stopTimer(data) {
        clearInterval(this.timer[data.id]);
    }



    stateClicked(data) {
      
        data.event.target.classList.add('spinner');
        this.restClientService
            .get(environment.api.path.soundBuzzerToggle + '/' + data.id)
            .subscribe((response) => {
                data.event.target.classList.remove('spinner');
                if (response.success) {
                    let responeData = response.data;
                    responeData.alarm_state = this.activeState;
                    data.event.target.classList.remove('spinner');
                    // this.activeState = true;
                    this.rows.forEach((row, i) => {
                        if (row.id == responeData.id) {
                            row.buzzer_on = responeData.buzzer_on;
                        }
                    })
                }
            });

    }

    resetFilters() {
        this.filterForm.reset();
        this.fetch();
    }

    add() {
        this.router.navigate([`${this.router.url}/add`]);
    }

    edit(event) {
        this.router.navigate([`${this.router.url}/edit/${event.id}`]);
    }

    delete(event) {
        this.dialogService.withConfirm(`${this.translate('delete-confirm')}[${event.id}]`).pipe().subscribe(
            (confirm) => {
                if (confirm) {
                    this.doDelete(event.id);
                }
            }
        );
    }

    private doDelete(id) {
        this.restClientService.delete(this.path, id).subscribe(
            response => {
                if (response.success) {
                    this.notifyService.successDelete();
                    this.serviceFilter = new this.filterType();
                    this.setFirstPage();
                } else {
                    this.notifyService.error(response.message);
                }
            }
        );
    }
}


export class AlarmStartTimeModel {
    alarm_start: number;
    alarm_state: boolean;

}
export class AlarmPauseStateModel {
    alarm_pause_status: boolean;
}


