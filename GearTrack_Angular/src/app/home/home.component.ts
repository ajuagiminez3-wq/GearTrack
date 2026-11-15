import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GearService } from '../service/gear.service';
import { GearItem } from '../models/gear.model';
@Component({selector:'app-home',standalone:false,templateUrl:'./home.component.html'})
export class Home implements OnInit {
 loading=true; error=''; items: GearItem[]=[];
 constructor(private service:GearService,private cdr:ChangeDetectorRef){}
 ngOnInit():void{
   this.service.getItems().subscribe({
     next: data=>{this.items=data;this.loading=false;this.cdr.markForCheck();},
     error:()=>{this.error='Cannot reach the GearTrack API. Start MAMP and GearTrack_API on port 5051.';this.loading=false;this.cdr.markForCheck();}
   });
 }
 get availableCount():number{return this.items.filter(item=>item.isAvailable).length;}
 get inventoryValue():number{return this.items.reduce((sum,item)=>sum+Number(item.purchasePrice),0);}
}
