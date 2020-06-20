<template>
  <div>
    <NavHeader></NavHeader>
    <NavBread>
        <span>Goods</span>
        <!-- <span slot="bread">Goods</span> -->
    </NavBread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <!--order by start-->
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">
            Price
            <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':!sortFlag}">
              <use xlink:href="#icon-arrow-short" />
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <!--order by end-->
        <div class="accessory-result">
          <!-- filter start-->
          <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a href="javascript:void(0)" :class="{'cur':priceLevel=='all'}" @click="setAll">All</a>
              </dd>
              <dd v-for="(price,index) in priceFilter" :key="index">
                <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceLevel==index}">{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>
          <!-- filter end-->

          <!-- list start-->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList" :key="index">
                  <div class="pic">
                    <a href="#">
                      <!-- 图片懒加载 -->
                      <img v-lazy="'/static/'+item.productImage" alt>
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{'￥'+item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <!-- loadMore滚动事件 busy是否启用滚动事件 10间隔多大触发滚动事件 -->
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                <img src="./../assets/loading-spinning-bubbles.svg" v-show='loading'/>
              </div>
            </div>
          </div>
          <!-- list end-->
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <!-- 绑定属性传递给子组件  声明事件供子组件调用 -->
    <modal v-bind:mdShow="mdShow" @close="closeModal">
      <p slot="message">
        请先登录否则无法加入购物车
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShow=false">关闭</a>
      </div>
    </modal>
    <modal v-bind:mdShow="mdShowCart" @close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok" />
        </svg>
        <span>加入购物车成功！</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart=false">继续购物</a>
        <router-link class="btn btn--m" href="javascript:;" to="/cart">前往购物车</router-link>
      </div>
    </modal>
    <NavFooter></NavFooter>
  </div>
</template>
<script>
import NavHeader from "@/components/NavHeader";
import NavFooter from "@/components/NavFooter";
import NavBread from "@/components/NavBread";
import Modal from "@/components/Modal";
import axios from 'axios';
export default {
  data() {
    return {
        goodsList:[],
        priceLevel:'all',
        //价格区间
        priceFilter:[
          {
            startPrice:0,
            endPrice:500
          },
          {
            startPrice:500,
            endPrice:1000
          },
          {
            startPrice:1000,
            endPrice:2000
          }
        ],
        filterBy:false,
        overLayFlag:false,
        sortFlag:true,
        pageIndex:1,
        pageSize:8,
        busy:false,
        loading:false,
        mdShow:false,
        mdShowCart:false
    };
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  },
  mounted(){
      this.getGoodsList();
  },
  methods:{
      //获取商品列表
      getGoodsList(flag){
          // axios.get('/api/goods').then(res=>{
          //     let goods=res.data
          //     this.goodsList=goods.result;
          //     console.log(this.goodsList)
          // })
          let params={
            pageIndex:this.pageIndex,
            pageSize:this.pageSize,
            sort:this.sortFlag?1:-1,
            priceLevel:this.priceLevel
          }
          this.loading=true;
          axios.get('/goods/list',{params:params}).then(res=>{
              this.loading=false;
              let goods=res.data
              if(goods.status=="0"){
                if(flag){
                  this.goodsList=this.goodsList.concat(goods.result.list);
                  if(goods.result.count<this.pageSize){
                    this.busy=true;
                  }else{
                    this.busy=false;
                  }
                }else{
                  this.goodsList=goods.result.list;
                  this.busy=false;
                }
              }else{
                this.goodsList=[];
              }
          })
      },
      showFilterPop(){
        this.filterBy=true;
        this.overLayFlag=true;
      },
      closePop(){
        this.filterBy=false;
        this.overLayFlag=false;
      },
      setAll(){
        this.priceLevel='all'
        this.setPriceFilter('all')
      },
      setPriceFilter(index){
        this.priceLevel=index;
        this.pageIndex=1;
        this.getGoodsList();
        this.closePop();
      },
      sortGoods(){
        this.sortFlag=!this.sortFlag;
        this.pageIndex=1;
        this.getGoodsList();
      },
      loadMore(){
        this.busy=true;
        setTimeout(()=>{
          this.pageIndex++;
          this.getGoodsList(true);
        },500)
      },
      addCart(productId){
        axios.post('/goods/addCart',{productId:productId}).then(
          (res)=>{
            if(res.data.status==0){
              this.mdShowCart=true
            }else{
              this.mdShow=true
            }
          }
        )
      },
      closeModal(){
        this.mdShow=false;
        this.mdShowCart=false;
      }
  }
};
</script>

<style>
  .sort-up{
    /* 翻转180° */
    transform: rotate(180deg);
    /* 翻转动画 淡出 */
    transition: all .3s ease-out;
  }
  .icon-arrow-short{
    transition: all .3s ease-out;
  }
  .btn:hover{
    background-color: #ffe5e6;
    transition: all .3s ease-out;
  }
</style>