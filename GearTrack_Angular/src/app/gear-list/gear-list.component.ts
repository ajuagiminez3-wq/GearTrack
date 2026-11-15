import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GearService } from '../service/gear.service';
import { GearCategory, GearItem, GearFilters } from '../models/gear.model';
@Component({selector:'app-gear-list',standalone:false,templateUrl:'./gear-list.component.html'})
export class GearList implements OnInit {
  items:GearItem[]=[];categories:GearCategory[]=[];
  search='';categoryId=0;availableFilter='all';loading=true;error='';notice='';
  constructor(private service:GearService,private route:ActivatedRoute,private cdr:ChangeDetectorRef){}
  ngOnInit():void{
    this.route.queryParamMap.subscribe(params=>{
      this.notice=params.get('added')?'Equipment created successfully.':params.get('updated')?'Equipment updated successfully.':params.get('deleted')?'Equipment deleted successfully.':'';
      this.cdr.markForCheck();
    });
    this.service.getCategories().subscribe({next: cats=>{this.categories=cats;this.cdr.markForCheck();},error:err=>console.error('Categories error',err)});
    this.loadItems();
  }
  loadItems():void{
    this.loading=true;this.error='';
    const filters:GearFilters={};
    if(this.search.trim())filters.search=this.search;
    if(this.categoryId>0)filters.categoryId=this.categoryId;
    if(this.availableFilter!=='all')filters.available=this.availableFilter==='true';
    this.service.getItems(filters).subscribe({
      next:data=>{this.items=data;this.loading=false;this.cdr.markForCheck();},
      error:err=>{this.error=err?.error?.message||'Could not load equipment. Is the GearTrack API running?';this.loading=false;this.cdr.markForCheck();}
    });
  }
  clearFilters():void{this.search='';this.categoryId=0;this.availableFilter='all';this.loadItems();}
  categoryIcon(name:string):string{
    const n=name.toLowerCase();return n.includes('camera')?'📷':n.includes('lens')?'◉':n.includes('light')?'☀':n.includes('audio')?'♫':n.includes('drone')?'✈':'⌘';
  }
}
