import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GearService } from '../service/gear.service';
import { GearItem } from '../models/gear.model';
@Component({selector:'app-gear-detail',standalone:false,templateUrl:'./gear-detail.component.html'})
export class GearDetail implements OnInit {
  item:GearItem|null=null;loading=true;error='';
  constructor(private route:ActivatedRoute,private service:GearService,private cdr:ChangeDetectorRef){}
  ngOnInit():void{
   const id=Number(this.route.snapshot.paramMap.get('id'));
   if(!Number.isInteger(id)||id<1){this.error='Invalid equipment ID.';this.loading=false;return;}
   this.service.getItem(id).subscribe({
    next:item=>{this.item=item;this.loading=false;this.cdr.markForCheck();},
    error:err=>{this.error=err?.status===404?'Equipment not found.':'Unable to load this item.';this.loading=false;this.cdr.markForCheck();}
   });
  }
}
