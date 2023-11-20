import { Component ,OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { product } from '../../models/product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit{

  products :product[]=[];
  Categories: string[] =[];
  loading:boolean=false;
  base64:any ="";
  cartProducts: any[]=[];
  form!:FormGroup
  constructor(private service:ProductsService , private build:FormBuilder){

  }

  ngOnInit(){

    this.form = this.build.group({
      title: ['' , [Validators.required]],
      price: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: ['', [Validators.required]],
      category: ['', [Validators.required]]
    })

    this.getProducts()
    this.getCategories()
  }
  getProducts(){
    this.loading = true
    this.service.getAllProducts().subscribe((res:any) => {

      this.products = res 
      this.loading = false
      
    },error=>{
      this.loading = false
      alert('there`s error')
    })
  }


  getCategories(){
    this.loading = true
    this.service.getAllCategories().subscribe((res:any) => {

      this.Categories = res 
      this.loading = false
      
    },error=>{
      this.loading = false
      alert('there`s error')
    })
  }

  filterCategory(event:any){
    let value=event.target.value;
    (value == "all") ? this.getProducts() : this.getProductsCategory(value)
  }

  getProductsCategory(keyword:string){

    this.loading = true
    this.service.getProductsByCategory(keyword).subscribe((res:any)=>{
      this.loading = false
      this.products=res

    })

  }

  addToCart(event:any){

    if("cart" in localStorage){
    this.cartProducts = JSON.parse (localStorage.getItem('cart')!)
    let exist=this.cartProducts.find(item =>item.item.id == event.item.id)
    if(exist){
      alert("this product already in your cart ")
    }else{
      this.cartProducts.push(event)
      localStorage.setItem("cart", JSON.stringify(this.cartProducts))
    }
    }else{
      this.cartProducts.push(event)
      localStorage.setItem("cart", JSON.stringify(this.cartProducts))
    }
    
  }

  getImagePath(event:any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
       this.base64 = reader.result;
       this.form.get('image')?.setValue('hvhv')
       console.log(this.base64)
    };
  }

  addProduct() {
    const model = this.form.value
    this.service.createProduct(model).subscribe(res => {
      alert("Add Product Success")
    })
  }

  getSelectedCategory(event:any) {
    this.form.get('category')?.setValue(event.target.value)
    console.log(this.form)
  }

  update(item:any) {
    this.form.patchValue({
      title: item.title,
      price: item.price,
      description: item.description,
      image: item.image,
      category: item.category
    })
    this.base64 = item.image
  }
}
