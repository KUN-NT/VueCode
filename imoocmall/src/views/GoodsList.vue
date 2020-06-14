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
          <a href="javascript:void(0)" class="price">
            Price
            <svg class="icon icon-arrow-short">
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
                <a href="javascript:void(0)" :class="{'cur':priceCheck=='all'}" @click="priceCheck='all'">All</a>
              </dd>
              <dd v-for="(price,index) in priceFilter" :key="index">
                <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceCheck==index}">{{price.startPrice}} - {{price.endPrice}}</a>
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
                      <img v-lazy="'/static/'+item.productImage" alt>
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{'￥'+item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- list end-->
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <NavFooter></NavFooter>
  </div>
</template>
<script>
import NavHeader from "@/components/NavHeader";
import NavFooter from "@/components/NavFooter";
import NavBread from "@/components/NavBread";
import axios from 'axios';
export default {
  data() {
    return {
        goodsList:[],
        priceCheck:'all',
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
        overLayFlag:false
    };
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread
  },
  mounted(){
      this.getGoodsList();
  },
  methods:{
      getGoodsList(){
          // axios.get('/api/goods').then(res=>{
          //     let goods=res.data
          //     this.goodsList=goods.result;
          //     console.log(this.goodsList)
          // })
          axios.get('/goods').then(res=>{
              let goods=res.data
              this.goodsList=goods.result.list;
              console.log(this.goodsList)
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
      setPriceFilter(index){
        this.priceCheck=index;
        closePop();
      }
  }
};
</script>
