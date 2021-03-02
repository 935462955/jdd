<template>
	<el-aside :width="asideWidth">
	<div class="toggle-button" @click="toggleCollapse">|||</div>
	<el-menu background-color="#333744" text-color="#fff" active-text-color="#409fff" :unique-opened="true" 
	:collapse="collapse"  :default-active="activePath" :collapse-transition="false" :router="true"><!--默认使用index进行路由-->
	      <!-- 一级菜单-->
		  <el-submenu :index="String(item.id)" v-for="item in menulist" :key="item.id">
			  <!-- 一级菜单模板区 -->
	        <template slot="title">
	          <i class="el-icon-location"></i>
	          <span>{{item.authName}}</span>
			  <!-- 二级菜单 -->
			</template>
			  <el-menu-item :index="'/'+child.path" v-for="child in item.children" :key="child.id"
			  @click="saveNavState('/'+child.path)">
				  <i class="el-icon-menu"></i>
				  <span>{{child.authName}}</span>
			  </el-menu-item>
	        
	        
	      </el-submenu>
	      
	    </el-menu>
		</el-aside>
</template>

<script>
	export default{
		name:'Aside',
		props:['menulist'],
		created(){
			this.activePath = window.sessionStorage.getItem('activePath')
		},
		data(){
			return {
				collapse:false,
				activePath:""
			}
		},
		methods:{
			toggleCollapse(){
				this.collapse = !this.collapse
			},
			saveNavState(activePath){
				window.sessionStorage.setItem('activePath',activePath)
				this.activePath = window.sessionStorage.getItem('activePath')
			}
		},
		computed:{
			asideWidth:function(){
				return this.collapse ? "64px" : "200px"
			},
		}
	}
</script>

<style lang="less" scoped>
	.el-menu{
		border-right:none;
	}
	.toggle-button{
		background-color: #4A5064;
		text-align: center;
		color:white;
		font-size:10px;
		letter-spacing: 0.2em;
		cursor:pointer
	}
</style>
