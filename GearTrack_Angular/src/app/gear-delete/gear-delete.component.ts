import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GearService } from '../service/gear.service';
import { GearItem } from '../models/gear.model';
@Component({selector:'app-gear-delete',standalone:false,templateUrl:'./gear-delete.component.html'})
export class GearDelete implements OnInit {
  item:GearItem|null=null;loading=true;deleting=false;error='';
  constructor(private service:GearService,private route:ActivatedRoute,private router:Router,private cdr:ChangeDetectorRef){}
  ngOnInit():void{
    const id=Number(this.route.snapshot.paramMap.get('id'));
    if(!Number.isInteger(id)||id<1){this.error='Invalid equipment ID.';this.loading=false;return;}
    this.service.getItem(id).subscribe({
      next:item=>{this.item=item;this.loading=false;this.cdr.markForCheck();},
      error:()=>{this.error='Equipment not found.';this.loading=false;this.cdr.markForCheck();}
    });
  }
  remove():void{
    if(!this.item||this.deleting)return;
    const id=this.item.id;this.deleting=true;this.error='';
    this.service.deleteItem(id).subscribe({
      next:()=>{this.deleting=false;this.cdr.markForCheck();void this.router.navigate(['/gear'],{queryParams:{deleted:id}});},
      error:err=>{this.deleting=false;this.error=err?.error?.message||'Could not delete equipment.';this.cdr.markForCheck();}
    });
  }
}
