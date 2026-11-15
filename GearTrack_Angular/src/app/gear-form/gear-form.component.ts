import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GearCategory, GearItemInput } from '../models/gear.model';
import { GearService } from '../service/gear.service';
@Component({selector:'app-gear-form',standalone:false,templateUrl:'./gear-form.component.html'})
export class GearForm implements OnInit {
  categories:GearCategory[]=[];editId:number|null=null;loading=true;saving=false;error='';
  form:GearItemInput={name:'',brand:'',categoryId:0,purchasePrice:0,purchaseDate:null,isAvailable:true,notes:null};
  // Browser date and textarea fields are strings; null is sent to the API when blank.
  dateText='';notesText='';
  constructor(private service:GearService,private route:ActivatedRoute,private router:Router,private cdr:ChangeDetectorRef){}
  get editing():boolean{return this.editId!==null;}
  ngOnInit():void{
    const idText=this.route.snapshot.paramMap.get('id');
    if(idText!==null){
       const id=Number(idText);
       if(!Number.isInteger(id)||id<1){this.error='Invalid equipment ID.';this.loading=false;return;}
       this.editId=id;
    }
    this.service.getCategories().subscribe({
      next:cats=>{
        this.categories=cats;
        if(!this.editing){this.form.categoryId=cats[0]?.id??0;this.loading=false;this.cdr.markForCheck();}
        else{this.loadExisting();}
      },
      error:()=>{this.error='Cannot load categories. Check the GearTrack API on port 5051.';this.loading=false;this.cdr.markForCheck();}
    });
  }
  loadExisting():void{
    if(this.editId===null)return;
    this.service.getItem(this.editId).subscribe({
      next:item=>{
        this.form={name:item.name,brand:item.brand,categoryId:item.categoryId,purchasePrice:item.purchasePrice,purchaseDate:item.purchaseDate,isAvailable:item.isAvailable,notes:item.notes};
        this.dateText=item.purchaseDate??'';this.notesText=item.notes??'';this.loading=false;this.cdr.markForCheck();
      },
      error:()=>{this.error='Cannot load this equipment item.';this.loading=false;this.cdr.markForCheck();}
    });
  }
  save():void{
    if(this.saving)return;
    this.error='';
    if(!this.form.name.trim()||!this.form.brand.trim()||this.form.categoryId<1||!Number.isFinite(Number(this.form.purchasePrice))||Number(this.form.purchasePrice)<0){this.error='Please fill in the required fields.';return;}
    const payload:GearItemInput={
      name:this.form.name.trim(),brand:this.form.brand.trim(),categoryId:Number(this.form.categoryId),purchasePrice:Number(this.form.purchasePrice),
      purchaseDate:this.dateText||null,isAvailable:Boolean(this.form.isAvailable),notes:this.notesText.trim()||null
    };
    this.saving=true;
    const request=this.editId===null?this.service.createItem(payload):this.service.updateItem(this.editId,payload);
    request.subscribe({
      next:item=>{this.saving=false;this.cdr.markForCheck();void this.router.navigate(['/gear'],{queryParams:this.editing?{updated:item.id}:{added:item.id}});},
      error:err=>{this.saving=false;this.error=err?.error?.message||'Could not save equipment. Check that the API is running.';this.cdr.markForCheck();}
    });
  }
}
