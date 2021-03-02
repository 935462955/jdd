<template>
	
	<el-container class="home-container">
	  <el-header>
	  <div>
		  <img src="../assets/logo.png">
		  <span>电商后台管理系统</span>
	  </div>
	  <el-button type="info" @click="logout">退出</el-button>
	  </el-header>
	  <el-container>
	    <Aside :menulist="menulist"></Aside>
	    <el-main>
			<router-view></router-view>
		</el-main>
	  </el-container>
	</el-container>

</template>

<script>
	import Aside from './Home_Aside.vue'
	export default{
		name:'Home',
		data(){
			return{
			menulist :[],
			}
		},
		created(){
			this.getMenuList()
		},
		methods:{
			logout(){
				window.sessionStorage.removeItem('token')
				this.$router.push('/login')
			},
			async getMenuList(){
				const {data} = await this.$axios.get('menus')
				if(data.meta.status != 200)
				return this.$el_message.error(data.meta.message)
				console.log(data)
				this.menulist = data.data
			}
		},
		components:{
			Aside
		}
	}
</script>

<style lang="less" scoped>
	.el-header{
		background-color: #373d41;
		display:flex;
		justify-content:space-between ;
		padding-left:0;
		align-items: center;
		color:#fff;
		font-size: 20px;
		div{
			display:flex;
			align-items: center;
			height:100%;
			padding-bottom: 10px;
			
			
			img{
			height:100%;
		}
			span{
			margin-left: 15px;
		}
		}
	}
	.el-aside{
		background-color: #333744;
	}
	.el-main{
		background-color: #eee;
	}
	.home-container{
		height:100vh;
	}
</style>
